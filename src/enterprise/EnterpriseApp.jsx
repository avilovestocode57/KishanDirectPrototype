// EnterpriseApp.jsx — Main Application Shell for KisanDirect Enterprise Buyer Module
import React, { useState } from 'react';
import { EnterpriseProvider } from './EnterpriseContext';
import EnterpriseSidebar from './EnterpriseSidebar';
import EnterpriseDashboard from './EnterpriseDashboard';
import CreateRequirement from './CreateRequirement';
import BulkRequirements from './BulkRequirements';
import RequirementDetailsBids from './RequirementDetailsBids';
import EnterpriseOrders from './EnterpriseOrders';
import OrderTracking from './OrderTracking';
import EnterpriseProfile from './EnterpriseProfile';
import './enterprise.css';

function EnterpriseMainContent({ onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'requirements' | 'create_requirement' | 'bids' | 'requirement_details' | 'orders' | 'order_tracking' | 'profile'
  const [selectedReqId, setSelectedReqId] = useState('REQ-701');
  const [selectedOrderId, setSelectedOrderId] = useState('ORD-ENT-501');

  return (
    <div className="e-portal">
      {/* Sidebar */}
      <EnterpriseSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onBack}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header Bar */}
        <header style={{
          height: 64,
          padding: '0 32px',
          background: 'rgba(14, 29, 40, 0.75)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #3f4a3d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#84e684', fontSize: 20 }}>
              domain
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#d5e4f4', letterSpacing: '0.02em' }}>
              West Bengal Enterprise B2B Procurement Hub
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="e-badge e-badge-green">
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>verified</span> WB Region
            </div>
            <button
              onClick={onBack}
              className="e-btn-ghost"
              style={{ fontSize: 12, padding: '6px 12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              Role Selector
            </button>
          </div>
        </header>

        {/* Content Views */}
        <div style={{ flex: 1, paddingBottom: 40 }}>
          {activeTab === 'dashboard' && (
            <EnterpriseDashboard
              onNavigate={setActiveTab}
              setSelectedReqId={setSelectedReqId}
              setSelectedOrderId={setSelectedOrderId}
            />
          )}

          {activeTab === 'requirements' && (
            <BulkRequirements
              onNavigate={setActiveTab}
              setSelectedReqId={setSelectedReqId}
            />
          )}

          {activeTab === 'create_requirement' && (
            <CreateRequirement
              onNavigate={setActiveTab}
              setSelectedReqId={setSelectedReqId}
            />
          )}

          {(activeTab === 'bids' || activeTab === 'requirement_details') && (
            <RequirementDetailsBids
              reqId={selectedReqId}
              onNavigate={setActiveTab}
              setSelectedOrderId={setSelectedOrderId}
            />
          )}

          {activeTab === 'orders' && (
            <EnterpriseOrders
              onNavigate={setActiveTab}
              setSelectedOrderId={setSelectedOrderId}
            />
          )}

          {activeTab === 'order_tracking' && (
            <OrderTracking
              orderId={selectedOrderId}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <EnterpriseProfile onLogout={onBack} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function EnterpriseApp({ onBack }) {
  return (
    <EnterpriseProvider>
      <EnterpriseMainContent onBack={onBack} />
    </EnterpriseProvider>
  );
}
