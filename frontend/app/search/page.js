'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/layoutv2';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Topics');
  const [searchText, setSearchText] = useState('');
  console.log('Active Tab:', activeTab);

  // Get placeholder based on active tab
  const getPlaceholder = () => {
    switch(activeTab) {
      case 'Topics': return '#iphone';
      case 'Users': return 'John Smith';
      case 'Trends': return 'Ferrari';
      default: return '';
    }
  };

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
              height={67} // Maintaining aspect ratio
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

          {/* Search Area - Preserving original search styling */}
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

        {/* Left Logo - Using the positioning from your CSS */}
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
  );
}