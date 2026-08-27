// EnterpriseDashboard.jsx — Screen 6: Enterprise Overview Dashboard
import React from 'react';
import { useEnterprise } from './EnterpriseContext';

export default function EnterpriseDashboard({ onNavigate, setSelectedReqId, setSelectedOrderId }) {
  const {
    profile,
    requirements,
    bids,
    orders,
    activeRequirementsCount,
    partiallyFulfilledCount,
    pendingBidsCount,
    activeOrdersCount,
  } = useEnterprise();

  const activeReqs = requirements.filter(r => r.fulfillmentStatus === 'OPEN' || r.fulfillmentStatus === 'PARTIALLY_FULFILLED');
  const recentOrders = orders.slice(0, 5);

  const handleSelectReq = (reqId) => {
    setSelectedReqId(reqId);
    onNavigate('requirement_details');
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    onNavigate('order_tracking');
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Banner / Welcome Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="e-badge e-badge-green">KisanDirect Enterprise B2B</span>
            <span style={{ fontSize: 12, color: '#becab9' }}>West Bengal Procurement Network</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
            Welcome back, {profile.contactName}
          </h1>
          <div style={{ fontSize: 13, color: '#becab9', marginTop: 2 }}>
            {profile.businessName} • GSTIN: {profile.gstin}
          </div>
        </div>

        <button
          onClick={() => onNavigate('create_requirement')}
          className="e-btn-primary">
          <span className="material-symbols-outlined">add_box</span>
          Create Requirement
        </button>
      </div>

      {/* KPI Cards Grid (Section 16) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {/* Card 1: Active Requirements */}
        <div className="e-glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, borderLeft: '4px solid #84e684' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#becab9', fontWeight: 600 }}>Active Requirements</span>
            <span className="material-symbols-outlined" style={{ color: '#84e684', fontSize: 22 }}>inventory_2</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#84e684' }}>
            {activeRequirementsCount}
          </div>
          <div style={{ fontSize: 11, color: '#becab9' }}>
            Open & accepting farmer bids
          </div>
        </div>

        {/* Card 2: Partially Fulfilled */}
        <div className="e-glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, borderLeft: '4px solid #edc22b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#becab9', fontWeight: 600 }}>Partially Fulfilled</span>
            <span className="material-symbols-outlined" style={{ color: '#edc22b', fontSize: 22 }}>pie_chart</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#edc22b' }}>
            {partiallyFulfilledCount}
          </div>
          <div style={{ fontSize: 11, color: '#becab9' }}>
            Partial quantity allocated
          </div>
        </div>

        {/* Card 3: Pending Bids */}
        <div className="e-glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#becab9', fontWeight: 600 }}>Pending Bids</span>
            <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: 22 }}>gavel</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#38bdf8' }}>
            {pendingBidsCount}
          </div>
          <div style={{ fontSize: 11, color: '#becab9' }}>
            Awaiting Enterprise review
          </div>
        </div>

        {/* Card 4: Active Orders */}
        <div className="e-glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8, borderLeft: '4px solid #84e684' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#becab9', fontWeight: 600 }}>Active Orders</span>
            <span className="material-symbols-outlined" style={{ color: '#84e684', fontSize: 22 }}>local_shipping</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#d5e4f4' }}>
            {activeOrdersCount}
          </div>
          <div style={{ fontSize: 11, color: '#becab9' }}>
            Confirmed & in-transit shipments
          </div>
        </div>
      </div>

      {/* Main Section: Active Requirements + Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 28 }}>
        
        {/* Active Requirements Overview */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
              Active Procurement Pipelines
            </h2>
            <button onClick={() => onNavigate('requirements')} className="e-btn-ghost" style={{ fontSize: 12 }}>
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeReqs.map(req => {
              const reqQty = req.requiredQuantity || req.quantity || 0;
              const allocQty = req.allocatedQuantity || 0;
              const remQty = req.remainingQuantity !== undefined ? req.remainingQuantity : (reqQty - allocQty);
              const pct = Math.min(100, Math.round((allocQty / (reqQty || 1)) * 100));

              return (
                <div key={req.id} style={{
                  background: 'rgba(16,47,49,0.5)',
                  border: '1px solid #3f4a3d',
                  borderRadius: 8,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#d5e4f4' }}>{req.product}</div>
                    <span className="e-badge e-badge-green">{req.id}</span>
                  </div>

                  <div style={{ fontSize: 12, color: '#becab9', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Target: ₹{req.targetPrice}/{req.unit}</span>
                    <span>Dest: {req.deliveryAddress?.district || 'West Bengal'}</span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: 6, background: '#102F31', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#84e684', borderRadius: 99 }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                    <span style={{ color: '#84e684', fontWeight: 600 }}>{allocQty} / {reqQty} {req.unit} allocated</span>
                    <button
                      onClick={() => handleSelectReq(req.id)}
                      className="e-btn-primary"
                      style={{ padding: '4px 10px', fontSize: 11 }}>
                      View Bids
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Orders & Deliveries Overview */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
              Live Order Fulfillment
            </h2>
            <button onClick={() => onNavigate('orders')} className="e-btn-ghost" style={{ fontSize: 12 }}>
              View All Orders
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentOrders.map(order => (
              <div key={order.id} style={{
                background: 'rgba(16,47,49,0.5)',
                border: '1px solid #3f4a3d',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#d5e4f4' }}>{order.product}</div>
                  <div style={{ fontSize: 11, color: '#becab9', marginTop: 2 }}>
                    Farmer: {order.farmerName} • {order.quantity} {order.unit}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={`e-badge ${order.status === 'Delivered' ? 'e-badge-green' : order.status === 'Shipped' ? 'e-badge-blue' : 'e-badge-gold'}`} style={{ fontSize: 10 }}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => handleSelectOrder(order.id)}
                    className="e-btn-secondary"
                    style={{ padding: '3px 8px', fontSize: 10 }}>
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
