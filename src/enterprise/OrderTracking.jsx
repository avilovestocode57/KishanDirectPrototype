// OrderTracking.jsx — Screen 2: Order Tracking (Stitch 54204d8104d7428b86300d74cf51e1e4)
import React from 'react';
import { useEnterprise } from './EnterpriseContext';

const LIFECYCLE_STAGES = [
  { id: 'Confirmed', label: 'Order Confirmed', desc: 'Bid accepted by Enterprise buyer. Order registered on KisanDirect platform.' },
  { id: 'Packed', label: 'Produce Quality Checked & Packed', desc: 'Farmer has sorted, quality-graded, and packed produce for transport.' },
  { id: 'Shipped', label: 'Dispatched & In-Transit (WB Route)', desc: 'Truck dispatched from farm hub. En-route via West Bengal highway logistics network.' },
  { id: 'Delivered', label: 'Delivered to Enterprise Depot', desc: 'Consignment safely arrived and unloaded at Enterprise warehouse location.' },
];

export default function OrderTracking({ orderId, onNavigate }) {
  const { orders, updateOrderStatus, getOrderById } = useEnterprise();

  const order = getOrderById(orderId) || orders[0];

  if (!order) {
    return (
      <div style={{ padding: 40, color: '#becab9' }}>
        No order selected for tracking. Return to Enterprise Orders.
      </div>
    );
  }

  const currentStatusIndex = LIFECYCLE_STAGES.findIndex(s => s.id === order.status);

  const handleAdvanceStatus = () => {
    if (currentStatusIndex < LIFECYCLE_STAGES.length - 1) {
      const nextStatus = LIFECYCLE_STAGES[currentStatusIndex + 1].id;
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Back Button & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button
            onClick={() => onNavigate('orders')}
            className="e-btn-ghost"
            style={{ marginBottom: 12, padding: '4px 10px', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Orders
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
              Live Order Fulfillment Tracking
            </h1>
            <span className="e-badge e-badge-green">{order.id}</span>
          </div>
        </div>

        {/* Status Advancement Simulation CTA */}
        {currentStatusIndex < LIFECYCLE_STAGES.length - 1 ? (
          <button onClick={handleAdvanceStatus} className="e-btn-secondary">
            <span className="material-symbols-outlined">fast_forward</span>
            Advance Stage to "{LIFECYCLE_STAGES[currentStatusIndex + 1].label}"
          </button>
        ) : (
          <span className="e-badge e-badge-green" style={{ padding: '8px 16px', fontSize: 13 }}>
            <span className="material-symbols-outlined">verified</span> Delivery Completed
          </span>
        )}
      </div>

      {/* Main Grid: Details Box + Progress Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        
        {/* Order Details Summary Card */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
            Consignment Information
          </h2>

          <div>
            <div style={{ fontSize: 12, color: '#becab9' }}>Product Item</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#d5e4f4', marginTop: 2 }}>{order.product}</div>
          </div>

          <div style={{ background: 'rgba(16,47,49,0.5)', padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div><strong style={{ color: '#84e684' }}>Farmer Supplier:</strong> {order.farmerName}</div>
            <div><strong style={{ color: '#84e684' }}>Farmer Phone:</strong> {order.farmerPhone || '+91 98765 43210'}</div>
            <div><strong style={{ color: '#84e684' }}>Quantity Ordered:</strong> {order.quantity} {order.unit}</div>
            <div><strong style={{ color: '#84e684' }}>Unit Price:</strong> ₹{order.price ? order.price.toLocaleString() : ''} / {order.unit}</div>
            <div><strong style={{ color: '#84e684' }}>Delivery Destination:</strong> {order.deliveryLocation}</div>
            <div><strong style={{ color: '#84e684' }}>Expected Delivery Date:</strong> {order.deliveryDate}</div>
            <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 8, marginTop: 4, fontSize: 16, fontWeight: 800, color: '#edc22b' }}>
              Total Amount: ₹{order.total.toLocaleString()}
            </div>
          </div>

          <div style={{ fontSize: 12, color: '#becab9', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#84e684' }}>verified_user</span>
            KisanDirect Logistics Escrow Protected
          </div>
        </div>

        {/* Live Timeline Component */}
        <div className="e-glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
            Fulfillment Lifecycle Steps
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 8 }}>
            {LIFECYCLE_STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;

              return (
                <div key={stage.id} className={`e-timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                  <div className="e-timeline-icon">
                    {isCompleted ? (
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{idx + 1}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 15, fontWeight: isCurrent || isCompleted ? 800 : 500, color: isCurrent ? '#84e684' : isCompleted ? '#d5e4f4' : '#becab9' }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: 12, color: '#becab9', lineHeight: 1.4 }}>
                      {stage.desc}
                    </div>
                    {isCurrent && (
                      <div style={{ marginTop: 4 }}>
                        <span className="e-badge e-badge-green" style={{ fontSize: 10 }}>Current Status</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
