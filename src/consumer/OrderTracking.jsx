// OrderTracking.jsx — Order timeline + Next Status advancement
import React from 'react';
import { ORDER_STATUSES, useConsumer } from './ConsumerContext';

const STATUS_META = {
  'Order Placed':     { icon: 'check_circle',       label: 'Order Placed',     sub: 'Your order has been received' },
  'Confirmed':        { icon: 'thumb_up',            label: 'Confirmed',        sub: 'Farmer has confirmed your order' },
  'Preparing':        { icon: 'agriculture',         label: 'Preparing',        sub: 'Farmer is packing your produce' },
  'Out for Delivery': { icon: 'local_shipping',      label: 'Out for Delivery', sub: 'Your order is on the way' },
  'Delivered':        { icon: 'home',                label: 'Delivered',        sub: 'Enjoy your fresh produce!' },
};

function statusBadgeClass(s) {
  if (s === 'Order Placed')     return 'c-status-placed';
  if (s === 'Confirmed')        return 'c-status-confirmed';
  if (s === 'Preparing')        return 'c-status-preparing';
  if (s === 'Out for Delivery') return 'c-status-out';
  if (s === 'Delivered')        return 'c-status-delivered';
  return '';
}

export default function OrderTracking({ orderId, onNavigate }) {
  const { orders, advanceOrder } = useConsumer();
  const order = orders.find(o => o.id === orderId);

  if (!order) return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <div className="c-empty" style={{ minHeight:'60vh' }}>
        <span className="material-symbols-outlined icon">error_outline</span>
        <p>Order not found.</p>
        <button className="c-btn-primary" onClick={() => onNavigate('marketplace')}>Back to Marketplace</button>
      </div>
    </div>
  );

  const currentIdx  = ORDER_STATUSES.indexOf(order.status);
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <div style={{ maxWidth:700, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <button className="c-btn-ghost" onClick={() => onNavigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#d5e4f4', margin:0 }}>Order Tracking</h1>
        </div>

        {/* Order Info Card */}
        <div className="c-glass" style={{ padding:'18px 20px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:11, color:'#becab9', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>Order ID</div>
            <div style={{ fontWeight:800, fontSize:18, color:'#84e684', letterSpacing:1 }}>{order.id}</div>
          </div>
          <div>
            <div style={{ fontSize:11, color:'#becab9', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>Date</div>
            <div style={{ fontWeight:600, fontSize:13, color:'#d5e4f4' }}>{order.date}</div>
          </div>
          <div>
            <div style={{ fontSize:11, color:'#becab9', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>Total</div>
            <div style={{ fontWeight:800, fontSize:15, color:'#edc22b' }}>₹{order.total?.toLocaleString()}</div>
          </div>
          <div>
            <span className={`c-badge ${statusBadgeClass(order.status)}`} style={{ fontSize:12 }}>{order.status}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="c-glass" style={{ padding:'24px', marginBottom:20 }}>
          <h3 style={{ fontWeight:700, fontSize:14, color:'#d5e4f4', margin:'0 0 22px 0', display:'flex', alignItems:'center', gap:8 }}>
            <span className="material-symbols-outlined" style={{ color:'#84e684', fontSize:20 }}>timeline</span>
            Order Timeline
          </h3>
          <div className="c-timeline">
            {ORDER_STATUSES.map((status, idx) => {
              const meta = STATUS_META[status];
              const isDone    = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isPending = idx > currentIdx;
              return (
                <div key={status} className={`c-timeline-step ${isDone ? 'done' : ''}`} style={{ paddingBottom: idx < ORDER_STATUSES.length - 1 ? 28 : 0 }}>
                  <div className={`c-timeline-dot ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
                    <span className="material-symbols-outlined" style={{ fontSize:20 }}>
                      {isDone ? 'check' : meta.icon}
                    </span>
                  </div>
                  <div className="c-timeline-content">
                    <div className={`c-timeline-label ${isPending ? 'muted' : ''}`} style={{ fontWeight: isCurrent ? 700 : 500 }}>
                      {meta.label}
                      {isCurrent && <span style={{ marginLeft:8, fontSize:11, background:'rgba(132,230,132,0.15)', color:'#84e684', padding:'2px 8px', borderRadius:100, fontWeight:700 }}>CURRENT</span>}
                    </div>
                    <div className="c-timeline-sublabel" style={{ color: isCurrent ? '#84e684' : '#becab9' }}>{meta.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivered state */}
        {isDelivered && (
          <div style={{ background:'rgba(132,230,132,0.1)', border:'1px solid rgba(132,230,132,0.3)', borderRadius:10, padding:'16px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:12 }}>
            <span className="material-symbols-outlined" style={{ fontSize:28, color:'#84e684' }}>celebration</span>
            <div>
              <div style={{ fontWeight:700, color:'#84e684', fontSize:15 }}>Order Delivered!</div>
              <div style={{ fontSize:13, color:'#becab9' }}>Enjoy your fresh West Bengal produce.</div>
            </div>
          </div>
        )}

        {/* Next Status button */}
        {!isDelivered && (
          <button
            className="c-btn-primary"
            style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15, borderRadius:10, marginBottom:12 }}
            onClick={() => advanceOrder(order.id)}>
            <span className="material-symbols-outlined">skip_next</span>
            Advance to: {ORDER_STATUSES[currentIdx + 1]}
          </button>
        )}

        {/* Delivery Address */}
        <div className="c-glass-light" style={{ padding:'14px 18px', display:'flex', gap:10, alignItems:'flex-start' }}>
          <span className="material-symbols-outlined" style={{ color:'#84e684', fontSize:18, flexShrink:0 }}>location_on</span>
          <div style={{ fontSize:13 }}>
            <div style={{ color:'#becab9', marginBottom:2 }}>Delivering to</div>
            <div style={{ color:'#d5e4f4', fontWeight:600 }}>{order.customer?.name}</div>
            <div style={{ color:'#becab9' }}>{order.customer?.address}, {order.customer?.city}, West Bengal — {order.customer?.pincode}</div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ marginTop:20, display:'flex', justifyContent:'center' }}>
          <button className="c-btn-ghost" onClick={() => onNavigate('marketplace')}>
            <span className="material-symbols-outlined">storefront</span> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
