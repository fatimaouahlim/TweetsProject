from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
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
bearer_token = "AAAAAAAAAAAAAAAAAAAAAHWD1wEAAAAABWeAlx%2FTzyrEmrB7W5Gbrw9TjTI%3DyyXgphkkrcfpznXEXPYwQpkKQXHKUY0MzUaY4QrIYW6UkbzpzG"
client = tweepy.Client(bearer_token=bearer_token)

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
        query = f"{search_query.query} lang:en" if "lang:" not in search_query.query else search_query.query
            
        tweets = client.search_recent_tweets(
            query=query, 
            max_results=search_query.max_results
        )
        
        if not tweets.data:
            return {"tweets": [], "message": "No tweets found for this query."}
            
        tweet_list = [{"id": str(tweet.id), "text": tweet.text} for tweet in tweets.data]
        return {"tweets": tweet_list}
        
    except tweepy.TooManyRequests:
        raise HTTPException(status_code=429, detail="Rate limit reached. Try again later.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Summarization Endpoint
@app.post("/summarize")
def summarize_text(summary_request: SummaryRequest):
    try:
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