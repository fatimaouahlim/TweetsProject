'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Popup = ({ message, onClose }) => {
  const router = useRouter();

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    popup: {
      position: 'relative',
      background: '#fff',
      padding: '30px',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      color: '#000',
      maxWidth: '400px',
      width: '100%',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#888',
    },
    subscribeButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
  };

  const handleSubscribeClick = () => {
    router.push('/subscribe');
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <p>{message}</p>
        <button style={styles.subscribeButton} onClick={handleSubscribeClick}>
          Subscribe now
        </button>
      </div>
    </div>
  );
};

export default Popup;
