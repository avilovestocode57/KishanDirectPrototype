// AdminSidebar.jsx — Main Navigation Sidebar for KisanDirect Admin
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from './AdminContext';

export default function AdminSidebar({ activeTab, onTabChange, onBack, unreadCount, onOpenNotifs }) {
  const location = useLocation();

  const navItems = [
    { id: 'overview',   label: 'Overview',               icon: 'dashboard', path: '/admin/overview' },
    { id: 'users',      label: 'Users & Roles',          icon: 'group', path: '/admin/users' },
    { id: 'approvals',  label: 'Product Approvals',      icon: 'fact_check', badgeKey: 'pendingProducts', path: '/admin/approvals' },
    { id: 'orders',     label: 'Orders & Operations',    icon: 'local_shipping', badgeKey: 'pendingOrders', path: '/admin/orders' },
    { id: 'ai-insights',label: 'AI & Regional Insights', icon: 'psychology', path: '/admin/ai-insights' },
  ];

  const adminCtx = useAdmin();

  return (
    <aside style={{
      width: 260,
      background: '#0e1d28',
      borderRight: '1px solid rgba(63,74,61,0.5)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0,
    }}>
      {/* Brand Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(63,74,61,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#84e684', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00390c', fontWeight: 800, fontSize: 18 }}>
          🌾
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#d5e4f4', letterSpacing: '-0.3px' }}>KisanDirect</div>
          <div style={{ fontSize: 10, color: '#84e684', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Portal (WB)</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <div style={{ fontSize: 10, color: '#becab9', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '8px 12px 4px' }}>
          Management
        </div>

        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          const count = item.badgeKey ? adminCtx[item.badgeKey] : 0;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? 'rgba(132, 230, 132, 0.15)' : 'transparent',
                color: isActive ? '#84e684' : '#becab9',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                width: '100%',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#d5e4f4'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#becab9'; }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: isActive ? '#84e684' : '#becab9' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {count > 0 && (
                <span className="a-badge a-badge-amber" style={{ fontSize: 10, padding: '2px 7px' }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Actions & Admin Profile */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(63,74,61,0.4)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Notifications Bar */}
        <button
          onClick={onOpenNotifs}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 8,
            background: 'rgba(19, 33, 44, 0.8)',
            border: '1px solid #3f4a3d',
            color: '#d5e4f4',
            fontSize: 12,
            cursor: 'pointer',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#edc22b' }}>notifications</span>
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="a-badge a-badge-green" style={{ fontSize: 10, padding: '1px 6px' }}>{unreadCount} new</span>
          )}
        </button>

        {/* Profile Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 4px' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #13212c, #1d2b37)', border: '1px solid #84e684', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#84e684' }}>admin_panel_settings</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#d5e4f4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Bikash Chatterjee</div>
            <div style={{ fontSize: 11, color: '#becab9' }}>Super Admin</div>
          </div>
        </div>

        {/* Logout / Switch Role */}
        <button
          onClick={onBack}
          className="a-btn-ghost"
          style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>swap_horiz</span>
          Switch Role / Logout
        </button>
      </div>
    </aside>
  );
}
