// EnterpriseApp.jsx — Main Application Shell for KisanDirect Enterprise Buyer Module
import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { EnterpriseProvider } from './EnterpriseContext';
import EnterpriseSidebar from './EnterpriseSidebar';
import EnterpriseDashboard from './EnterpriseDashboard';
import CreateRequirement from './CreateRequirement';
import BulkRequirements from './BulkRequirements';
import RequirementDetailsBids from './RequirementDetailsBids';
import EnterpriseOrders from './EnterpriseOrders';
import OrderTracking from './OrderTracking';
import EnterpriseProfile from './EnterpriseProfile';
import RolesButton from '../components/RolesButton';
import './enterprise.css';

function RequirementDetailsBidsWrapper({ onNavigate, setSelectedOrderId }) {
  const { reqId } = useParams();
  return <RequirementDetailsBids reqId={reqId || 'REQ-701'} onNavigate={onNavigate} setSelectedOrderId={setSelectedOrderId} />;
}

function OrderTrackingWrapper({ onNavigate }) {
  const { orderId } = useParams();
  return <OrderTracking orderId={orderId || 'ORD-ENT-501'} onNavigate={onNavigate} />;
}

function EnterpriseMainContent({ onBack }) {
  const navigate = useNavigate();
  const [selectedReqId, setSelectedReqIdState] = useState('REQ-701');
  const [selectedOrderId, setSelectedOrderIdState] = useState('ORD-ENT-501');

  const handleNavigate = useCallback((tab, payload) => {
    switch (tab) {
      case 'dashboard':
        navigate('/enterprise/dashboard');
        break;
      case 'requirements':
        navigate('/enterprise/requirements');
        break;
      case 'create_requirement':
        navigate('/enterprise/requirements/create');
        break;
      case 'bids':
      case 'requirement_details':
        const targetReqId = payload || selectedReqId || 'REQ-701';
        navigate(`/enterprise/requirements/${targetReqId}`);
        break;
      case 'orders':
        navigate('/enterprise/orders');
        break;
      case 'order_tracking':
        const targetOrderId = payload || selectedOrderId || 'ORD-ENT-501';
        navigate(`/enterprise/order-tracking/${targetOrderId}`);
        break;
      case 'profile':
        navigate('/enterprise/profile');
        break;
      default:
        navigate('/enterprise/dashboard');
        break;
    }
  }, [navigate, selectedReqId, selectedOrderId]);

  const handleSetSelectedReqId = useCallback((id) => {
    setSelectedReqIdState(id);
  }, []);

  const handleSetSelectedOrderId = useCallback((id) => {
    setSelectedOrderIdState(id);
  }, []);

  return (
    <div className="e-portal">
      {/* Sidebar */}
      <EnterpriseSidebar
        activeTab={null}
        setActiveTab={handleNavigate}
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
            {onBack && <RolesButton onClick={onBack} />}
          </div>
        </header>

        {/* Content Views */}
        <div style={{ flex: 1, paddingBottom: 40 }}>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={
              <EnterpriseDashboard
                onNavigate={handleNavigate}
                setSelectedReqId={handleSetSelectedReqId}
                setSelectedOrderId={handleSetSelectedOrderId}
              />
            } />
            <Route path="requirements" element={
              <BulkRequirements
                onNavigate={handleNavigate}
                setSelectedReqId={handleSetSelectedReqId}
              />
            } />
            <Route path="requirements/create" element={
              <CreateRequirement
                onNavigate={handleNavigate}
                setSelectedReqId={handleSetSelectedReqId}
              />
            } />
            <Route path="requirements/:reqId" element={
              <RequirementDetailsBidsWrapper
                onNavigate={handleNavigate}
                setSelectedOrderId={handleSetSelectedOrderId}
              />
            } />
            <Route path="orders" element={
              <EnterpriseOrders
                onNavigate={handleNavigate}
                setSelectedOrderId={handleSetSelectedOrderId}
              />
            } />
            <Route path="order-tracking/:orderId" element={
              <OrderTrackingWrapper
                onNavigate={handleNavigate}
              />
            } />
            <Route path="profile" element={
              <EnterpriseProfile onLogout={onBack} />
            } />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
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
