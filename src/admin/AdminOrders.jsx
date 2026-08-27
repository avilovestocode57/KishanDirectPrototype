// AdminOrders.jsx — Screen 4: Orders & Operations Management
import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

export default function AdminOrders() {
  const { orders, dispatchOrder } = useAdmin();

  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dispatchConfirm, setDispatchConfirm] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const ORDER_STAGES = ['Order Placed', 'Confirmed', 'Packed', 'Ready for Dispatch', 'Dispatched', 'Delivered'];

  const filteredOrders = orders.filter(o => statusFilter === 'All' || o.status === statusFilter);

  function handleConfirmDispatch() {
    if (!selectedOrder) return;
    dispatchOrder(selectedOrder.id);
    showToast(`Order #${selectedOrder.id} dispatched successfully!`);
    setDispatchConfirm(false);
    setSelectedOrder(prev => prev ? { ...prev, status: 'Dispatched' } : null);
  }

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {toast && (
        <div className="a-toast">
          <span className="material-symbols-outlined">check_circle</span>
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="a-badge a-badge-green">West Bengal Logistics</span>
          <span style={{ fontSize: 12, color: '#becab9' }}>Operational Fulfillment</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
          Orders & Operations Monitoring
        </h1>
      </div>

      {/* Operational Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {[
          { label: 'Ready for Dispatch', count: orders.filter(o => o.status === 'Ready for Dispatch').length, badge: 'a-badge-amber' },
          { label: 'Dispatched In-Transit', count: orders.filter(o => o.status === 'Dispatched').length, badge: 'a-badge-blue' },
          { label: 'Delivered Succesfully', count: orders.filter(o => o.status === 'Delivered').length, badge: 'a-badge-green' },
          { label: 'Delayed / Flagged', count: orders.filter(o => o.status === 'Delayed').length, badge: 'a-badge-red' },
        ].map((m, i) => (
          <div key={i} className="a-glass-card" style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: '#becab9', fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#d5e4f4', marginTop: 2 }}>{m.count}</div>
            </div>
            <span className={`a-badge ${m.badge}`}>{m.count}</span>
          </div>
        ))}
      </div>

      {/* Filter Selector */}
      <div className="a-glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: '#becab9', fontWeight: 600 }}>Filter Status:</span>
        <select className="a-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="All">All Statuses ({orders.length})</option>
          <option value="Ready for Dispatch">Ready for Dispatch</option>
          <option value="Packed">Packed</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Delayed">Delayed</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="a-glass-card" style={{ overflow: 'hidden' }}>
        <table className="a-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Farmer</th>
              <th>Product & Quantity</th>
              <th>Amount</th>
              <th>District</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#becab9' }}>
                  No orders match your filter.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 800, color: '#84e684' }}>#{order.id}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#d5e4f4' }}>{order.buyer}</div>
                  </td>
                  <td>
                    <div style={{ color: '#d5e4f4' }}>{order.farmer}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#d5e4f4' }}>{order.product}</div>
                    <div style={{ fontSize: 11, color: '#becab9' }}>{order.quantity}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#edc22b' }}>₹{order.amount}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#84e684' }}>location_on</span>
                      {order.district}, WB
                    </div>
                  </td>
                  <td>
                    <span className={`a-badge ${
                      order.status === 'Delivered' ? 'a-badge-green' :
                      order.status === 'Dispatched' ? 'a-badge-blue' :
                      order.status === 'Ready for Dispatch' ? 'a-badge-amber' :
                      order.status === 'Delayed' ? 'a-badge-red' : 'a-badge-purple'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="a-btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => { setSelectedOrder(order); setDispatchConfirm(false); }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span> Operations
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Operations & Timeline Modal */}
      {selectedOrder && (
        <div className="a-modal-overlay">
          <div className="a-modal" style={{ maxWidth: 600 }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
                  Order Operational View — #{selectedOrder.id}
                </h3>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              {/* Status Timeline */}
              <div style={{ marginBottom: 24, padding: '16px', background: '#0e1d28', borderRadius: 8, border: '1px solid #3f4a3d' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 14 }}>FULFILLMENT TIMELINE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {ORDER_STAGES.map((stage, idx) => {
                    const currentIdx = ORDER_STAGES.indexOf(selectedOrder.status);
                    const isPassed   = idx <= currentIdx && selectedOrder.status !== 'Delayed';
                    const isCurrent  = stage === selectedOrder.status;

                    return (
                      <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: isCurrent ? '#84e684' : isPassed ? '#1d2b37' : '#0e1d28',
                          border: `2px solid ${isPassed ? '#84e684' : '#3f4a3d'}`,
                          color: isCurrent ? '#00390c' : isPassed ? '#84e684' : '#becab9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800,
                        }}>
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <div style={{ fontSize: 10, color: isCurrent ? '#84e684' : isPassed ? '#d5e4f4' : '#becab9', textAlign: 'center', marginTop: 6, fontWeight: isCurrent ? 700 : 400 }}>
                          {stage}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, marginBottom: 20 }}>
                <div><strong style={{ color: '#becab9' }}>Buyer:</strong> <span style={{ color: '#d5e4f4' }}>{selectedOrder.buyer}</span></div>
                <div><strong style={{ color: '#becab9' }}>Farmer:</strong> <span style={{ color: '#d5e4f4' }}>{selectedOrder.farmer}</span></div>
                <div><strong style={{ color: '#becab9' }}>Product:</strong> <span style={{ color: '#84e684' }}>{selectedOrder.product}</span></div>
                <div><strong style={{ color: '#becab9' }}>Quantity:</strong> <span style={{ color: '#d5e4f4' }}>{selectedOrder.quantity}</span></div>
                <div><strong style={{ color: '#becab9' }}>Total Amount:</strong> <span style={{ color: '#edc22b', fontWeight: 700 }}>₹{selectedOrder.amount}</span></div>
                <div><strong style={{ color: '#becab9' }}>Destination:</strong> <span style={{ color: '#d5e4f4' }}>{selectedOrder.district}, West Bengal</span></div>
              </div>

              {/* Dispatch Action Section */}
              {selectedOrder.status === 'Ready for Dispatch' && (
                <div style={{ padding: '14px', background: 'rgba(132,230,132,0.1)', borderRadius: 8, border: '1px solid rgba(132,230,132,0.3)', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#84e684', marginBottom: 4 }}>
                    Ready for Fulfillment Dispatch
                  </div>
                  <div style={{ fontSize: 12, color: '#becab9' }}>
                    This produce order has passed quality check and packing. Click below to initiate transit dispatch.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #3f4a3d', paddingTop: 16 }}>
                <button className="a-btn-ghost" onClick={() => setSelectedOrder(null)}>Close</button>
                {selectedOrder.status === 'Ready for Dispatch' && !dispatchConfirm && (
                  <button className="a-btn-primary" onClick={() => setDispatchConfirm(true)}>
                    <span className="material-symbols-outlined">local_shipping</span> Dispatch Order
                  </button>
                )}
                {selectedOrder.status === 'Ready for Dispatch' && dispatchConfirm && (
                  <button className="a-btn-primary" onClick={handleConfirmDispatch}>
                    Confirm Dispatch Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
