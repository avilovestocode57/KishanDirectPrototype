// EnterpriseSidebar.jsx — Clean Sidebar Navigation for KisanDirect Enterprise Portal
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEnterprise } from './EnterpriseContext';

export default function EnterpriseSidebar({ activeTab, setActiveTab, onLogout }) {
  const { profile } = useEnterprise();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard', path: '/enterprise/dashboard' },
    { id: 'requirements', label: 'Bulk Requirements', icon: 'inventory_2', path: '/enterprise/requirements' },
    { id: 'create_requirement', label: 'Create Requirement', icon: 'add_box', path: '/enterprise/requirements/create' },
    { id: 'orders', label: 'Orders & Tracking', icon: 'local_shipping', path: '/enterprise/orders' },
    { id: 'profile', label: 'Enterprise Profile', icon: 'business', path: '/enterprise/profile' },
  ];

  const isItemActive = (item) => {
    if (item.id === 'create_requirement') {
      return location.pathname === '/enterprise/requirements/create';
    }
    if (item.id === 'requirements') {
      return location.pathname.startsWith('/enterprise/requirements') && location.pathname !== '/enterprise/requirements/create';
    }
    if (item.id === 'orders') {
      return location.pathname.startsWith('/enterprise/orders') || location.pathname.startsWith('/enterprise/order-tracking');
    }
    return location.pathname === item.path;
  };

  return (
    <aside style={{
      width: 260,
      minWidth: 260,
      background: 'rgba(14, 29, 40, 0.95)',
      borderRight: '1px solid #3f4a3d',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 20,
    }}>
      {/* Brand Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #3f4a3d', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #102F31 0%, #1a4d46 100%)',
          border: '1px solid #84e684',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(132,230,132,0.2)',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#84e684', fontSize: 24 }}>storefront</span>
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.3px' }}>
            KisanDirect
          </h2>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#84e684', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Enterprise (WB)
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#becab9', padding: '8px 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Procurement Portal
        </div>

        {navItems.map(item => {
          const isActive = isItemActive(item);

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: 8,
                background: isActive ? 'rgba(132, 230, 132, 0.12)' : 'transparent',
                color: isActive ? '#84e684' : '#becab9',
                border: isActive ? '1px solid rgba(132, 230, 132, 0.3)' : '1px solid transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: isActive ? '#84e684' : '#becab9' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Role Switcher */}
      <div style={{ padding: 16, borderTop: '1px solid #3f4a3d', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, background: 'rgba(16,47,49,0.5)' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', background: '#84e684', color: '#061520',
            fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13
          }}>
            {profile.contactName ? profile.contactName.charAt(0) : 'E'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#d5e4f4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.businessName}
            </div>
            <div style={{ fontSize: 10, color: '#becab9' }}>
              {profile.contactName}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="e-btn-ghost"
          style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync_alt</span>
          Switch Role / Logout
        </button>
      </div>
    </aside>
  );
}
