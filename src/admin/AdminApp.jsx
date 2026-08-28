// AdminApp.jsx — Root shell for KisanDirect Admin Portal
import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminApprovals from './AdminApprovals';
import AdminOrders from './AdminOrders';
import AdminAIInsights from './AdminAIInsights';
import './admin.css';

function AdminContent({ onBack }) {
  const navigate = useNavigate();
  const [showNotifModal, setShowNotifModal] = useState(false);

  const { notifications, markNotifRead } = useAdmin();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavigate = useCallback((tab) => {
    switch (tab) {
      case 'overview':
        navigate('/admin/overview');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'approvals':
        navigate('/admin/approvals');
        break;
      case 'orders':
        navigate('/admin/orders');
        break;
      case 'ai':
      case 'ai-insights':
        navigate('/admin/ai-insights');
        break;
      default:
        navigate('/admin/overview');
        break;
    }
  }, [navigate]);

  function handleNotifClick(target) {
    if (target) handleNavigate(target);
    setShowNotifModal(false);
    markNotifRead();
  }

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={null}
        onTabChange={handleNavigate}
        onBack={onBack}
        unreadCount={unreadCount}
        onOpenNotifs={() => { setShowNotifModal(true); markNotifRead(); }}
      />

      {/* Main Content Viewport */}
      <main style={{ flex: 1, overflowY: 'auto', background: '#061520', minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview onNavigate={handleNavigate} />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="ai-insights" element={<AdminAIInsights />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </main>

      {/* Notifications Modal */}
      {showNotifModal && (
        <div className="a-modal-overlay">
          <div className="a-modal" style={{ maxWidth: 480 }}>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: '#edc22b' }}>notifications</span>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>Admin Notifications</h3>
                </div>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setShowNotifModal(false)}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360, overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n.target)}
                    style={{
                      padding: '12px',
                      background: '#0e1d28',
                      borderRadius: 8,
                      border: '1px solid #3f4a3d',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#84e684'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#3f4a3d'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#d5e4f4' }}>{n.title}</div>
                      <div style={{ fontSize: 10, color: '#becab9' }}>{n.time}</div>
                    </div>
                    <div style={{ fontSize: 12, color: '#becab9', lineHeight: 1.4 }}>{n.message}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 12, borderTop: '1px solid #3f4a3d' }}>
                <button className="a-btn-ghost" onClick={() => setShowNotifModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminApp({ onBack }) {
  return (
    <AdminProvider>
      <AdminContent onBack={onBack} />
    </AdminProvider>
  );
}
