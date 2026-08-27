// ConsumerProfile.jsx — Consumer profile + order history
import React from 'react';
import { useConsumer, ORDER_STATUSES } from './ConsumerContext';

function statusBadgeClass(s) {
  if (s === 'Order Placed')     return 'c-status-placed';
  if (s === 'Confirmed')        return 'c-status-confirmed';
  if (s === 'Preparing')        return 'c-status-preparing';
  if (s === 'Out for Delivery') return 'c-status-out';
  if (s === 'Delivered')        return 'c-status-delivered';
  return '';
}

export default function ConsumerProfile({ onNavigate }) {
  const { orders, customer } = useConsumer();

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <div style={{ maxWidth:820, margin:'0 auto', padding:'24px 24px 48px' }}>
        <h1 style={{ fontSize:22, fontWeight:800, color:'#d5e4f4', margin:'0 0 24px 0' }}>My Account</h1>

        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:24, alignItems:'start' }}>

          {/* Profile Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Avatar + Info */}
            <div className="c-glass" style={{ padding:'20px', textAlign:'center' }}>
              <div style={{ width:70, height:70, borderRadius:'50%', background:'linear-gradient(135deg,#13212c,#1d2b37)', border:'3px solid rgba(132,230,132,0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                <span className="material-symbols-outlined" style={{ fontSize:36, color:'#84e684' }}>person</span>
              </div>
              {customer ? (
                <>
                  <div style={{ fontWeight:800, fontSize:17, color:'#d5e4f4', marginBottom:4 }}>{customer.name}</div>
                  <div style={{ fontSize:13, color:'#becab9', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:14 }}>call</span>+91 {customer.phone}
                  </div>
                </>
              ) : (
                <div style={{ fontSize:13, color:'#becab9' }}>No profile yet — complete a checkout to create your profile.</div>
              )}
            </div>

            {/* Delivery Address */}
            {customer && (
              <div className="c-glass" style={{ padding:'16px' }}>
                <div style={{ fontSize:11, color:'#becab9', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10, fontWeight:600 }}>Saved Address</div>
                <div style={{ fontSize:13, lineHeight:1.7, color:'#d5e4f4' }}>
                  {customer.address},<br />{customer.city}, West Bengal<br />{customer.pincode}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="c-glass" style={{ padding:'16px' }}>
              <div style={{ fontSize:11, color:'#becab9', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12, fontWeight:600 }}>Activity</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { label:'Total Orders', value: orders.length },
                  { label:'Items Ordered', value: orders.reduce((s, o) => s + (o.items?.length || 0), 0) },
                  { label:'Total Spent', value: `₹${orders.reduce((s, o) => s + (o.total || 0), 0).toLocaleString()}` },
                  { label:'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
                ].map(s => (
                  <div key={s.label} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                    <span style={{ color:'#becab9' }}>{s.label}</span>
                    <span style={{ color:'#edc22b', fontWeight:700 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="c-btn-ghost" style={{ justifyContent:'center' }} onClick={() => onNavigate('marketplace')}>
              <span className="material-symbols-outlined">storefront</span>Browse Marketplace
            </button>
          </div>

          {/* Orders List */}
          <div>
            <h2 style={{ fontSize:17, fontWeight:700, color:'#d5e4f4', margin:'0 0 16px 0' }}>
              My Orders ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="c-empty" style={{ minHeight:'300px' }}>
                <span className="material-symbols-outlined icon">shopping_bag</span>
                <p style={{ fontSize:15, color:'#d5e4f4', fontWeight:600 }}>No orders yet</p>
                <p style={{ fontSize:13 }}>Browse the marketplace and place your first order.</p>
                <button className="c-btn-primary" style={{ marginTop:8 }} onClick={() => onNavigate('marketplace')}>
                  <span className="material-symbols-outlined">storefront</span>Shop Now
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {orders.map(order => (
                  <div key={order.id} className="c-glass" style={{ padding:'16px', cursor:'pointer', transition:'border-color 0.2s' }}
                    onClick={() => onNavigate('order-tracking', { orderId: order.id })}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(132,230,132,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(137,148,133,0.2)'}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, flexWrap:'wrap', gap:8 }}>
                      <div>
                        <div style={{ fontWeight:800, color:'#84e684', fontSize:16, letterSpacing:0.5, marginBottom:3 }}>{order.id}</div>
                        <div style={{ fontSize:12, color:'#becab9' }}>{order.date}</div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                        <span className={`c-badge ${statusBadgeClass(order.status)}`} style={{ fontSize:11 }}>{order.status}</span>
                        <div style={{ fontWeight:800, color:'#edc22b', fontSize:16 }}>₹{order.total?.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Items */}
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                      {order.items?.map((item, i) => (
                        <span key={i} style={{ fontSize:12, color:'#becab9', background:'rgba(63,74,61,0.3)', borderRadius:6, padding:'3px 8px' }}>
                          {item.name} × {item.quantity}kg
                        </span>
                      ))}
                    </div>

                    {/* Progress */}
                    <div style={{ display:'flex', gap:0, alignItems:'center' }}>
                      {ORDER_STATUSES.map((s, i) => {
                        const done    = i <= ORDER_STATUSES.indexOf(order.status);
                        const current = s === order.status;
                        return (
                          <React.Fragment key={s}>
                            <div style={{ width:10, height:10, borderRadius:'50%', background: done ? '#84e684' : '#3f4a3d', border: current ? '2px solid #84e684' : 'none', transition:'all 0.3s' }} title={s} />
                            {i < ORDER_STATUSES.length - 1 && <div style={{ flex:1, height:2, background: done && ORDER_STATUSES.indexOf(order.status) > i ? '#84e684' : '#3f4a3d', maxWidth:48, minWidth:16 }} />}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    <div style={{ marginTop:12, display:'flex', justifyContent:'flex-end' }}>
                      <span style={{ fontSize:12, color:'#84e684', display:'flex', alignItems:'center', gap:4 }}>
                        Track Order <span className="material-symbols-outlined" style={{ fontSize:14 }}>chevron_right</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
