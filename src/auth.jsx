import React from 'react';
import './auth.css';
import mainBg from './assets/main-bg.png';
import farmerBg from './assets/farmer-card.png';
import consumerBg from './assets/consumer-card.png';
import enterpriseBg from './assets/enterprise-card.png';
import adminBg from './assets/admin-card.png';

export default function Auth({ onSelectRole }) {
  const roles = [
    {
      id: 'farmer',
      num: '01',
      title: 'FARMER',
      desc: 'Grow. List. Connect. Bring your produce directly to the KisanDirect marketplace.',
      bg: farmerBg,
      roleKey: 'farmer',
    },
    {
      id: 'user',
      num: '02',
      title: 'CONSUMER',
      desc: 'Discover. Choose. Buy. Find fresh agricultural products directly through the KisanDirect ecosystem.',
      bg: consumerBg,
      roleKey: 'user',
    },
    {
      id: 'enterprise',
      num: '03',
      title: 'ENTERPRISE',
      desc: 'Source. Plan. Scale. Plan agricultural procurement with better supply and demand visibility.',
      bg: enterpriseBg,
      roleKey: 'enterprise',
    },
    {
      id: 'admin',
      num: '04',
      title: 'ADMIN',
      desc: 'Monitor. Manage. Understand. Manage the KisanDirect ecosystem and monitor platform activity.',
      bg: adminBg,
      roleKey: 'admin',
    },
  ];

  return (
    <div className="stitch-auth-page">
      {/* TopNavBar */}
      <nav className="stitch-nav">
        <div className="stitch-nav-left">
          <div className="stitch-brand-logo">
            <span>🌾</span>
            <span>KisanDirect</span>
          </div>
          <span className="stitch-brand-tag">AI-POWERED AGRO MARKETPLACE</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="stitch-hero-section">
        {/* Background Image with Gradient Overlay */}
        <div className="stitch-bg-image-container">
          <img
            alt="Agricultural background"
            className="stitch-bg-image"
            src={mainBg}
          />
          <div className="stitch-bg-overlay"></div>
        </div>

        <div className="stitch-hero-container">
          {/* Hero Content */}
          <div className="stitch-hero-header">
            <h1 className="stitch-hero-headline">
              Where farmers, buyers and intelligence meet.
            </h1>
            <p className="stitch-hero-description">
              KisanDirect connects farmers, consumers and enterprises through a smarter agricultural marketplace powered by data and AI.
            </p>
          </div>

          {/* Role Selection Grid */}
          <div className="stitch-role-grid">
            {roles.map((role) => (
              <div
                key={role.id}
                className="stitch-card"
                onClick={() => onSelectRole && onSelectRole(role.roleKey)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectRole && onSelectRole(role.roleKey);
                  }
                }}
              >
                <img
                  alt={role.title}
                  className="stitch-card-img"
                  src={role.bg}
                />
                <div className="stitch-card-overlay"></div>

                <div className="stitch-card-content">
                  <div className="stitch-card-top">
                    <span className="stitch-card-num">{role.num}</span>
                    <span className="stitch-card-arrow">→</span>
                  </div>
                  <h2 className="stitch-card-title">{role.title}</h2>
                  <p className="stitch-card-desc">{role.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="stitch-footer">
        <div className="stitch-footer-brand">KisanDirect</div>
        <div className="stitch-footer-links">
          <a className="stitch-footer-link" href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a className="stitch-footer-link" href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          <a className="stitch-footer-link" href="#support" onClick={(e) => e.preventDefault()}>Contact Support</a>
          <a className="stitch-footer-link" href="#network" onClick={(e) => e.preventDefault()}>Global Network</a>
        </div>
        <div className="stitch-footer-copy">
          © 2026 KisanDirect AI. All rights reserved. Precision Agriculture Powered by Intelligence.
        </div>
      </footer>
    </div>
  );
}
