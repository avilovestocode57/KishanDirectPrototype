// EnterpriseOrders.jsx — Screen 3: Enterprise Orders (Stitch 3c50bf8305974eaf9b6f31db1ef33227)
import React, { useState } from 'react';
import { useEnterprise } from './EnterpriseContext';

export default function EnterpriseOrders({ onNavigate, setSelectedOrderId }) {
  const { orders } = useEnterprise();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'confirmed' | 'in_progress' | 'delivered'
  const [viewOrderModal, setViewOrderModal] = useState(null);

  const confirmedOrders  = orders.filter(o => o.status === 'Confirmed');
  const inProgressOrders = orders.filter(o => o.status === 'Packed' || o.status === 'Shipped');
  const deliveredOrders  = orders.filter(o => o.status === 'Delivered');

  const displayedOrders = activeTab === 'all'
    ? orders
    : activeTab === 'confirmed'
    ? confirmedOrders
    : activeTab === 'in_progress'
    ? inProgressOrders
    : deliveredOrders;

  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    onNavigate('order_tracking');
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="e-badge e-badge-green">West Bengal Logistics</span>
            <span style={{ fontSize: 12, color: '#becab9' }}>Fulfillment Pipeline</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
            Enterprise Orders & Bulk Deliveries
          </h1>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'all' ? 'rgba(132,230,132,0.15)' : 'transparent',
            color: activeTab === 'all' ? '#84e684' : '#becab9',
            border: activeTab === 'all' ? '1px solid #84e684' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>All Orders</span>
          <span style={{ background: '#84e684', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('confirmed')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'confirmed' ? 'rgba(237,194,43,0.15)' : 'transparent',
            color: activeTab === 'confirmed' ? '#edc22b' : '#becab9',
            border: activeTab === 'confirmed' ? '1px solid #edc22b' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>Confirmed</span>
          <span style={{ background: '#edc22b', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {confirmedOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'in_progress' ? 'rgba(56,189,248,0.15)' : 'transparent',
            color: activeTab === 'in_progress' ? '#38bdf8' : '#becab9',
            border: activeTab === 'in_progress' ? '1px solid #38bdf8' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>In Progress (Shipped/Packed)</span>
          <span style={{ background: '#38bdf8', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {inProgressOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('delivered')}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: activeTab === 'delivered' ? 'rgba(132,230,132,0.15)' : 'transparent',
            color: activeTab === 'delivered' ? '#84e684' : '#becab9',
            border: activeTab === 'delivered' ? '1px solid #84e684' : '1px solid transparent',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
          <span>Delivered</span>
          <span style={{ background: '#84e684', color: '#061520', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 99 }}>
            {deliveredOrders.length}
          </span>
        </button>
      </div>

      {/* Orders List / Table */}
      <div className="e-glass-card" style={{ overflow: 'hidden' }}>
        {displayedOrders.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#becab9' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 44, color: '#3f4a3d', marginBottom: 8, display: 'block' }}>local_shipping</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', marginBottom: 4 }}>
              No {activeTab.replace('_', ' ')} orders found
            </div>
            <div style={{ fontSize: 12 }}>Accept farmer bids on your requirements to generate new orders.</div>
          </div>
        ) : (
          <table className="e-table">
            <thead>
              <tr>
                <th>Order ID & Date</th>
                <th>Produce Item</th>
                <th>Farmer Supplier</th>
                <th>Quantity</th>
                <th>Total Value</th>
                <th>Delivery Destination</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#84e684' }}>{order.id}</div>
                    <div style={{ fontSize: 11, color: '#becab9' }}>{order.createdAt || 'Recent'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#d5e4f4' }}>{order.product}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: '#d5e4f4', fontWeight: 600 }}>{order.farmerName}</div>
                    <div style={{ fontSize: 11, color: '#84e684' }}>{order.farmerLocation}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#d5e4f4' }}>{order.quantity} {order.unit}</div>
                    <div style={{ fontSize: 11, color: '#becab9' }}>₹{order.price ? order.price.toLocaleString() : ''} / {order.unit}</div>
                  </td>
                  <td style={{ fontWeight: 800, color: '#edc22b' }}>
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: '#d5e4f4', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#84e684' }}>location_on</span>
                      {order.deliveryLocation}
                    </div>
                  </td>
                  <td>
                    <span className={`e-badge ${
                      order.status === 'Delivered' ? 'e-badge-green' :
                      order.status === 'Shipped' ? 'e-badge-blue' :
                      order.status === 'Packed' ? 'e-badge-blue' : 'e-badge-gold'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setViewOrderModal(order)}
                        className="e-btn-ghost"
                        style={{ padding: '6px 10px', fontSize: 12 }}>
                        View
                      </button>
                      <button
                        onClick={() => handleTrackOrder(order.id)}
                        className="e-btn-primary"
                        style={{ padding: '6px 12px', fontSize: 12 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>radar</span>
                        Track
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Order Modal */}
      {viewOrderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,21,32,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="e-glass-card" style={{ maxWidth: 500, width: '100%', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="e-badge e-badge-green">{viewOrderModal.id}</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#d5e4f4', margin: '4px 0 0 0' }}>
                  {viewOrderModal.product}
                </h3>
              </div>
              <button className="e-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setViewOrderModal(null)}>
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(16,47,49,0.5)', padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div><strong style={{ color: '#84e684' }}>Farmer Supplier:</strong> {viewOrderModal.farmerName}</div>
              <div><strong style={{ color: '#84e684' }}>Farmer Phone:</strong> {viewOrderModal.farmerPhone || '+91 98765 43210'}</div>
              <div><strong style={{ color: '#84e684' }}>Quantity Ordered:</strong> {viewOrderModal.quantity} {viewOrderModal.unit}</div>
              <div><strong style={{ color: '#84e684' }}>Agreed Price:</strong> ₹{viewOrderModal.price ? viewOrderModal.price.toLocaleString() : ''} / {viewOrderModal.unit}</div>
              <div><strong style={{ color: '#84e684' }}>Delivery Location:</strong> {viewOrderModal.deliveryLocation}</div>
              <div><strong style={{ color: '#84e684' }}>Target Delivery Date:</strong> {viewOrderModal.deliveryDate}</div>
              <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 8, marginTop: 4, fontSize: 16, fontWeight: 800, color: '#edc22b' }}>
                Total Paid Amount: ₹{viewOrderModal.total.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setViewOrderModal(null); handleTrackOrder(viewOrderModal.id); }}
                className="e-btn-primary"
                style={{ flex: 1 }}>
                <span className="material-symbols-outlined">radar</span> Track Order Live
              </button>
              <button
                onClick={() => setViewOrderModal(null)}
                className="e-btn-ghost"
                style={{ flex: 1 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
