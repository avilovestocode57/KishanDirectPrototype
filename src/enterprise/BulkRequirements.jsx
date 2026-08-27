// BulkRequirements.jsx — Screen 5: Enterprise Bulk Requirements Management & Fulfillment Flow
import React, { useState } from 'react';
import { useEnterprise } from './EnterpriseContext';

export default function BulkRequirements({ onNavigate, setSelectedReqId }) {
  const { requirements, closeRequirement, resetDemoData } = useEnterprise();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'drafts' | 'completed'
  const [confirmCloseReq, setConfirmCloseReq] = useState(null);

  const activeReqs = requirements.filter(r => r.fulfillmentStatus === 'OPEN' || r.fulfillmentStatus === 'PARTIALLY_FULFILLED' || r.fulfillmentStatus === 'FULLY_ALLOCATED');
  const draftReqs  = requirements.filter(r => r.fulfillmentStatus === 'DRAFT');
  const completedReqs = requirements.filter(r => r.fulfillmentStatus === 'FULFILLED' || r.fulfillmentStatus === 'CLOSED');

  const displayedReqs = activeTab === 'active'
    ? activeReqs
    : activeTab === 'drafts'
    ? draftReqs
    : completedReqs;

  const handleViewDetails = (reqId) => {
    setSelectedReqId(reqId);
    onNavigate('requirement_details');
  };

  const handleConfirmClose = () => {
    if (confirmCloseReq) {
      closeRequirement(confirmCloseReq.id);
      setConfirmCloseReq(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="e-badge e-badge-green">Open for Bids</span>;
      case 'PARTIALLY_FULFILLED':
        return <span className="e-badge e-badge-gold">Partially Fulfilled</span>;
      case 'FULLY_ALLOCATED':
        return <span className="e-badge e-badge-blue">Fully Allocated</span>;
      case 'FULFILLED':
        return <span className="e-badge e-badge-green">Fulfilled & Completed</span>;
      case 'CLOSED':
        return <span className="e-badge" style={{ background: 'rgba(190,202,185,0.15)', color: '#becab9' }}>Closed</span>;
      case 'DRAFT':
        return <span className="e-badge" style={{ background: 'rgba(190,202,185,0.15)', color: '#becab9' }}>Draft</span>;
      default:
        return <span className="e-badge e-badge-green">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="e-badge e-badge-green">West Bengal Scope</span>
            <span style={{ fontSize: 12, color: '#becab9' }}>B2B Procurement Portfolio</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
            Bulk Requirements & Procurement Pipelines
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {/* Reset Demo Data Button (Section 7) */}
          <button
            onClick={resetDemoData}
            className="e-btn-ghost"
            title="Reset 12,000 quintal Swarna Paddy Rice test requirement and seed bids">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
            Reset Demo Data
          </button>

          <button
            onClick={() => onNavigate('create_requirement')}
            className="e-btn-primary">
            <span className="material-symbols-outlined">add</span>
            Create Requirement
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'active' ? 'rgba(132,230,132,0.15)' : 'transparent',
            color: activeTab === 'active' ? '#84e684' : '#becab9',
            border: activeTab === 'active' ? '1px solid #84e684' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>Active Requirements</span>
          <span style={{ background: '#84e684', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {activeReqs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('drafts')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'drafts' ? 'rgba(190,202,185,0.15)' : 'transparent',
            color: activeTab === 'drafts' ? '#d5e4f4' : '#becab9',
            border: activeTab === 'drafts' ? '1px solid #becab9' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>Drafts</span>
          <span style={{ background: '#becab9', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {draftReqs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'completed' ? 'rgba(56,189,248,0.15)' : 'transparent',
            color: activeTab === 'completed' ? '#38bdf8' : '#becab9',
            border: activeTab === 'completed' ? '1px solid #38bdf8' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>Completed Requirements</span>
          <span style={{ background: '#38bdf8', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {completedReqs.length}
          </span>
        </button>
      </div>

      {/* Grid of Requirements Cards */}
      {displayedReqs.length === 0 ? (
        <div className="e-glass-card" style={{ padding: 48, textAlign: 'center', color: '#becab9' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#3f4a3d', marginBottom: 8, display: 'block' }}>inventory_2</span>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', marginBottom: 4 }}>
            No {activeTab} requirements found
          </div>
          <div style={{ fontSize: 12 }}>Create a bulk requirement to request produce from West Bengal farmers.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
          {displayedReqs.map(req => {
            const reqQty = req.requiredQuantity || req.quantity || 0;
            const allocQty = req.allocatedQuantity || 0;
            const remQty = req.remainingQuantity !== undefined ? req.remainingQuantity : (reqQty - allocQty);
            const pct = Math.min(100, Math.round((allocQty / (reqQty || 1)) * 100));

            return (
              <div key={req.id} className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '4px solid #84e684' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="e-badge e-badge-green" style={{ marginBottom: 6 }}>{req.id}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: '4px 0 0 0' }}>
                      {req.product}
                    </h3>
                  </div>
                  {getStatusBadge(req.fulfillmentStatus)}
                </div>

                {/* Specs Box */}
                <div style={{ background: 'rgba(16,47,49,0.5)', padding: 14, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#becab9' }}>Required Quantity:</span>
                    <strong style={{ color: '#d5e4f4' }}>{reqQty.toLocaleString()} {req.unit} ({req.quality})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#becab9' }}>Target Price:</span>
                    <strong style={{ color: '#edc22b' }}>₹{Number(req.targetPrice || 0).toLocaleString()} / {req.unit}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#becab9' }}>Delivery Destination:</span>
                    <strong style={{ color: '#84e684' }}>{req.deliveryAddress?.title || req.deliveryAddress?.district || 'West Bengal Hub'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#becab9' }}>Required Delivery Date:</span>
                    <strong style={{ color: '#d5e4f4' }}>{req.deliveryDate}</strong>
                  </div>
                </div>

                {/* Quantity Fulfillment Progress Bar (Section 3 & 4) */}
                <div style={{ background: 'rgba(14,29,40,0.6)', padding: 12, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                    <span style={{ color: '#84e684' }}>{allocQty.toLocaleString()} {req.unit} allocated</span>
                    <span style={{ color: remQty > 0 ? '#edc22b' : '#38bdf8' }}>
                      {remQty > 0 ? `${remQty.toLocaleString()} ${req.unit} remaining` : 'Fully Allocated'}
                    </span>
                  </div>

                  <div style={{ height: 8, background: '#102F31', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: pct === 100 ? 'linear-gradient(90deg, #38bdf8, #84e684)' : 'linear-gradient(90deg, #edc22b, #84e684)',
                      borderRadius: 99,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: '#becab9', textAlign: 'right' }}>
                    {pct}% fulfilled ({allocQty.toLocaleString()} / {reqQty.toLocaleString()} {req.unit})
                  </div>
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => handleViewDetails(req.id)}
                    className="e-btn-primary"
                    style={{ flex: 1, padding: '8px 14px', fontSize: 13 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>gavel</span>
                    {req.fulfillmentStatus === 'FULFILLED' ? 'View Orders & History' : 'View Bids'}
                  </button>

                  {(req.fulfillmentStatus === 'OPEN' || req.fulfillmentStatus === 'PARTIALLY_FULFILLED') && (
                    <button
                      onClick={() => setConfirmCloseReq(req)}
                      className="e-btn-ghost"
                      style={{ padding: '8px 12px', fontSize: 12, color: '#f87171' }}>
                      Close
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Closing Requirement */}
      {confirmCloseReq && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,21,32,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="e-glass-card" style={{ maxWidth: 450, width: '100%', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#f87171' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 32 }}>warning</span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
                Close Requirement {confirmCloseReq.id}?
              </h3>
            </div>

            <p style={{ fontSize: 13, color: '#becab9', margin: 0, lineHeight: 1.5 }}>
              Closing this requirement will stop receiving new farmer bids. Existing accepted bids and created orders will remain active.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
              <button className="e-btn-ghost" onClick={() => setConfirmCloseReq(null)}>
                Cancel
              </button>
              <button className="e-btn-danger" onClick={handleConfirmClose}>
                Confirm Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
