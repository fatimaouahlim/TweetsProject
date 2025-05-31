'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/layoutv2'
import Popup from '../components/Popup'

export default function Home() {
  const [activeTab, setActiveTab] = useState('Topics')
  const [searchText, setSearchText] = useState('')
  const [searchMade, setSearchMade] = useState(false)
  const [showLimitPopup, setShowLimitPopup] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    console.log('Search page useEffect triggered');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Token found:', token);
    console.log('User found:', user);
    
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
    } else {
      console.log('Token exists, user can stay on search page');
      
      // Optional: Verify token format
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (payload.exp && payload.exp < currentTime) {
            console.log('Token is expired, redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          } else {
            console.log('Token is valid');
          }
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    }
  }, [router])

  const getPlaceholder = () => {
    switch(activeTab) {
      case 'Topics': return '#violence against women'
      case 'Users': return '@johnSmith'
      case 'Trends': return 'Ferrari'
      default: return ''
    }
  }

  const handleSearch = () => {
    if (!searchText.trim()) return;
    
    const searchCount = parseInt(sessionStorage.getItem('searchCount') || '0', 10)

  if (searchCount >= 1) { //1
    setShowLimitPopup(true)
    return
  }

    // Format the query based on active tab
    let formattedQuery = searchText;
    if (activeTab === 'Topics' && !searchText.startsWith('#')) {
      formattedQuery = `#${searchText}`;
    } else if (activeTab === 'Users' && !searchText.startsWith('@')) {
      formattedQuery = `from:${searchText}`;
    }
    
     sessionStorage.setItem('searchCount', (searchCount + 1).toString())

    
    // Redirect to summary page with query parameters
    router.push(`/summary?query=${encodeURIComponent(formattedQuery)}&type=${activeTab}`);
  }

  return (
    <Layout>
      <div className={styles.container}>
        {/* Center Content */}
        <div className={styles.centerContent}>
          {/* Logo Image */}
          <div className={styles.logoContainer}>
            <Image 
              src="/tw.png" 
              alt="Twanalyze Logo" 
              width={450} 
              height={67}
              priority
              style={{
                objectFit: 'contain',
                maxWidth: '100%'
              }}
            />
          </div>

          {/* Tabs Container */}
          <div className={styles.tabsContainer}>
            <div className={styles.pillTabs}>
              <button 
                className={activeTab === 'Topics' ? styles.activeTab : styles.inactiveTab}
                onClick={() => setActiveTab('Topics')}
              >
                Topics
              </button>
              <button 
                className={activeTab === 'Users' ? styles.activeTab : styles.inactiveTab}
                onClick={() => setActiveTab('Users')}
              >
                Users
              </button>
              <button 
                className={activeTab === 'Trends' ? styles.activeTab : styles.inactiveTab}
                onClick={() => setActiveTab('Trends')}
              >
                Trends
              </button>
            </div>
          </div>

          {/* Search Area */}
          <div className={styles.searchArea}>
            <div className={styles.searchContainer}>
              <input 
                type="text" 
                placeholder={getPlaceholder()}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button 
                className={styles.searchButton}
                onClick={handleSearch}
              >
                <Image 
                  src="/search.png" 
                  alt="Search" 
                  width={300} 
                  height={300}
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Left Logo */}
        <div className={styles.leftLogo}>
          <Image 
            src="/logosansback.png" 
            alt="Twitter analysis logo" 
            width={450} 
            height={250}
            style={{
              objectFit: 'contain',
              maxWidth: '100%'
            }}
          />
        </div>

        {showLimitPopup && (
        <Popup 
          message="You can only make one search per session. Subscribe for unlimited access."
          onClose={() => setShowLimitPopup(false)} 
          onSubscribe={() => {
            setShowLimitPopup(false)
            router.push('/subscribe') // or redirect to your payment page
          }}
        />
      )}
      
      </div>
    </Layout>
  )
}