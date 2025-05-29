from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Literal
import tweepy
from transformers import pipeline

# Initialize FastAPI app
app = FastAPI(title="Tweet Search, Summarization & Sentiment Analysis API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Twitter API credentials
bearer_token = "AAAAAAAAAAAAAAAAAAAAACoz2AEAAAAA%2F5Ngbmk20KUR00w5%2FlJ5Yk%2FE7PQ%3DbQQyWZ07j2CWZj6VgsNgYUZXyAbD4hVvZO38IkpIRRwF96sOlW"
consumer_key = "22KkXsdtQFJ42BwOayxmHcFPn"
consumer_secret = "RqmW8SQ7pAhOHStl8X0AUM8iBVXKABv1h3sv0DiDFo9IKDAU3t"
access_token = "1927365735325573120-jmjH9ieXqzjrmXxNFs8y3mxI108goj"
access_token_secret = "G67K48MLXMuXZXDwtyQC6RBCMLGoOOuY5541eJW5hD720"

client = tweepy.Client(
    bearer_token=bearer_token,
    consumer_key=consumer_key,
    consumer_secret=consumer_secret,
    access_token=access_token,
    access_token_secret=access_token_secret
)

# Initialize models
print("Loading models...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
sentiment_analyzer = pipeline(
    "text-classification",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest",
    return_all_scores=True
)
print("Models loaded successfully!")

# Pydantic models
class SearchQuery(BaseModel):
    query: str
    max_results: int = 10
    search_type: Literal["user", "trend"] = "trend"

class SummaryRequest(BaseModel):
    text: str
    max_length: int = 230
    min_length: int = 30

class TextRequest(BaseModel):
    text: str

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Tweet Search, Summarization & Sentiment Analysis API",
        "endpoints": {
            "search_tweets": "/search-tweets",
            "summarize": "/summarize",
            "sentiment_analysis": "/api/sentiment",
            "test_sentiment": "/api/sentiment/test"
        }
    }

# Tweet Search Endpoint
@app.post("/search-tweets")
def search_tweets(search_query: SearchQuery):
    try:
        if search_query.search_type == "user":
            # Search for tweets BY a specific user
            try:
                # First, get the user by username (remove @ if present)
                username = search_query.query.replace("@", "")
                user_resp = client.get_user(username=username)
                
                if user_resp.data is None:
                    return {"tweets": [], "message": f"User '{username}' not found."}
                
                user_id = user_resp.data.id
                
                # Get recent tweets BY this user
                tweets = client.get_users_tweets(
                    id=user_id,
                    max_results=min(search_query.max_results, 100),  # Twitter API limit
                    tweet_fields=["created_at", "public_metrics"],
                    #exclude=["retweets", "replies"]  # Get only original tweets
                )
                
                if not tweets.data:
                    return {"tweets": [], "message": f"No recent tweets found for user '@{username}'."}
                
                tweet_list = []
                for tweet in tweets.data:
                    tweet_list.append({
                        "id": str(tweet.id),
                        "text": tweet.text,
                        "created_at": tweet.created_at.isoformat() if tweet.created_at else None,
                        "user": f"@{username}"
                    })
                
                return {
                    "tweets": tweet_list,
                    "message": f"Found {len(tweet_list)} tweets by @{username}",
                    "search_type": "user"
                }
                
            except tweepy.NotFound:
                return {"tweets": [], "message": f"User '{search_query.query}' not found."}
            except tweepy.Unauthorized:
                return {"tweets": [], "message": f"User '{search_query.query}' account is private or suspended."}

        elif search_query.search_type == "trend":
            # Search for tweets ABOUT a trend/topic
            try:
                # Clean up the query and add language filter if not present
                query = search_query.query.strip()
                if "lang:" not in query:
                    query = f"{query} lang:en"
                
                # Remove retweets and replies for cleaner results
                if "-is:retweet" not in query:
                    query = f"{query} -is:retweet"
                
                tweets = client.search_recent_tweets(
                    query=query,
                    max_results=min(search_query.max_results, 100),  # Twitter API limit
                    tweet_fields=["created_at", "author_id", "public_metrics"],
                    expansions=["author_id"],
                    user_fields=["username"]
                )
                
                if not tweets.data:
                    return {"tweets": [], "message": f"No recent tweets found for trend '{search_query.query}'."}
                
                # Create a mapping of user IDs to usernames
                users_dict = {}
                if tweets.includes and 'users' in tweets.includes:
                    for user in tweets.includes['users']:
                        users_dict[user.id] = user.username
                
                tweet_list = []
                for tweet in tweets.data:
                    username = users_dict.get(tweet.author_id, "unknown")
                    tweet_list.append({
                        "id": str(tweet.id),
                        "text": tweet.text,
                        "created_at": tweet.created_at.isoformat() if tweet.created_at else None,
                        "user": f"@{username}" if username != "unknown" else "unknown"
                    })
                
                return {
                    "tweets": tweet_list,
                    "message": f"Found {len(tweet_list)} tweets about '{search_query.query}'",
                    "search_type": "trend"
                }
                
            except Exception as e:
                return {"tweets": [], "message": f"Error searching for trend: {str(e)}"}

        else:
            raise HTTPException(status_code=400, detail="Invalid search_type. Must be 'user' or 'trend'.")

    except tweepy.TooManyRequests:
        raise HTTPException(status_code=429, detail="Rate limit reached. Try again later.")
    except tweepy.Unauthorized:
        raise HTTPException(status_code=401, detail="Twitter API authentication failed. Check your bearer token.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# Summarization Endpoint
@app.post("/summarize")
def summarize_text(summary_request: SummaryRequest):
    try:
        # Check if text is long enough to summarize
        if len(summary_request.text.split()) < 10:
            return {"summary": summary_request.text, "message": "Text too short to summarize"}
        
        summary_result = summarizer(
            summary_request.text,
            max_length=summary_request.max_length,
            min_length=summary_request.min_length,
            do_sample=False
        )
        
        summary_text = summary_result[0]['summary_text']
        return {"summary": summary_text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

# Sentiment Analysis Endpoint
@app.post("/api/sentiment")
def analyze_sentiment(request: TextRequest):
    try:
        text = request.text.strip()
        
        if not text:
            return JSONResponse(
                status_code=400,
                content={"error": "Text cannot be empty"}
            )

        sentiment_results = sentiment_analyzer(text)[0]

        percentages = {}
        for result in sentiment_results:
            label = result["label"].lower()
            if "pos" in label or label == "label_2":
                percentages["positive"] = round(result["score"] * 100, 2)
            elif "neg" in label or label == "label_0":
                percentages["negative"] = round(result["score"] * 100, 2)
            elif "neu" in label or label == "label_1":
                percentages["neutral"] = round(result["score"] * 100, 2)

        dominant = max(sentiment_results, key=lambda x: x['score'])
        percentages["dominant_sentiment"] = dominant["label"]
        percentages["confidence"] = round(dominant["score"] * 100, 2)

        return JSONResponse(content=percentages)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Analysis failed: {str(e)}"}
        )

# Test Endpoint
@app.get("/api/sentiment/test")
def test_sentiment():
    text = """
    Climate change is an urgent global crisis. If we don't take immediate action, future generations will suffer.
    However, new green technologies offer hope and innovation.
    """

    try:
        sentiment_results = sentiment_analyzer(text)[0]

        percentages = {}
        for result in sentiment_results:
            label = result["label"].lower()
            if "pos" in label or label == "label_2":
                percentages["positive"] = round(result["score"] * 100, 2)
            elif "neg" in label or label == "label_0":
                percentages["negative"] = round(result["score"] * 100, 2)
            elif "neu" in label or label == "label_1":
                percentages["neutral"] = round(result["score"] * 100, 2)

        dominant = max(sentiment_results, key=lambda x: x['score'])
        percentages["dominant_sentiment"] = dominant["label"]
        percentages["confidence"] = round(dominant["score"] * 100, 2)
        percentages["test_text"] = text

        return JSONResponse(content=percentages)
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Test analysis failed: {str(e)}"}
        )

# Health Check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models": {
            "summarizer": "facebook/bart-large-cnn" if summarizer else "not loaded",
            "sentiment_analyzer": "cardiffnlp/twitter-roberta-base-sentiment-latest" if sentiment_analyzer else "not loaded"
        },
        "twitter_api": "configured" if client else "not configured"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)