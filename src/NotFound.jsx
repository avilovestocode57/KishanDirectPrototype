import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0E1117',
      color: '#E8F3E8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌾</div>
      <h1 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '32px', color: '#84e684', marginBottom: '8px' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: '#8FA99A', maxWidth: '460px', margin: '0 0 32px 0', lineHeight: '1.6' }}>
        The agricultural destination or resource you requested could not be found or may have moved.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#84e684',
            color: '#061520',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '14px',
            letterSpacing: '0.5px'
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
