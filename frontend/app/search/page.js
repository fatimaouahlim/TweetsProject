// app/page.js
'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/layoutv2'
import { useEffect } from 'react'; 
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Topics')
  const [searchText, setSearchText] = useState('')
   const router = useRouter()
   useEffect(() => {
     
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
      }
    }, [router])
  const getPlaceholder = () => {
    switch(activeTab) {
      case 'Topics': return '#iphone'
      case 'Users': return 'John Smith'
      case 'Trends': return 'Ferrari'
      default: return ''
    }
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
                />
                <Link href='/summary'>
                  <button className={styles.searchButton}>
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
                </Link>
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
        </div>
      </Layout>

  )
}