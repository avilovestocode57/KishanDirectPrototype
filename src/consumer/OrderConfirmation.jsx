// OrderConfirmation.jsx — Success screen after order placement
import React from 'react';
import { useConsumer } from './ConsumerContext';

export default function OrderConfirmation({ orderId, onNavigate }) {
  const { orders } = useConsumer();
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

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'48px 24px' }}>

        {/* Success Icon */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(132,230,132,0.15)', border:'3px solid #84e684', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', animation:'c-checkPop 0.4s ease-out' }}>
            <span className="material-symbols-outlined" style={{ fontSize:40, color:'#84e684' }}>check_circle</span>
          </div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'#d5e4f4', margin:'0 0 8px', letterSpacing:'-0.5px' }}>Order Confirmed!</h1>
          <p style={{ fontSize:14, color:'#becab9' }}>Your fresh West Bengal produce is being prepared.</p>
        </div>

        {/* Order Details Card */}
        <div className="c-glass" style={{ padding:'22px', marginBottom:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, paddingBottom:14, borderBottom:'1px solid #3f4a3d' }}>
            <div>
              <div style={{ fontSize:11, color:'#becab9', marginBottom:3, textTransform:'uppercase', letterSpacing:'0.06em' }}>Order Placed</div>
              <div style={{ fontWeight:800, fontSize:18, color:'#84e684', letterSpacing:1 }}>{order.id}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'#becab9', marginBottom:3 }}>Date</div>
              <div style={{ fontWeight:600, fontSize:14, color:'#d5e4f4' }}>{order.date}</div>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:12, color:'#becab9', fontWeight:600, marginBottom:10 }}>ITEMS ORDERED</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                  <span style={{ color:'#d5e4f4' }}>{item.name} <span style={{ color:'#becab9' }}>× {item.quantity}kg</span></span>
                  <span style={{ color:'#edc22b', fontWeight:700 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          <div style={{ borderTop:'1px solid #3f4a3d', paddingTop:14, display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span style={{ color:'#becab9' }}>Subtotal</span>
              <span style={{ color:'#d5e4f4' }}>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span style={{ color:'#becab9' }}>Delivery</span>
              <span style={{ color:'#84e684' }}>₹{order.delivery}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:17, fontWeight:800, borderTop:'1px solid #3f4a3d', paddingTop:12 }}>
              <span style={{ color:'#d5e4f4' }}>Total Paid</span>
              <span style={{ color:'#edc22b' }}>₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="c-glass-light" style={{ padding:'16px 18px', marginBottom:18, display:'flex', gap:12, alignItems:'flex-start' }}>
          <span className="material-symbols-outlined" style={{ color:'#84e684', fontSize:22, flexShrink:0, marginTop:2 }}>location_on</span>
          <div>
            <div style={{ fontSize:12, color:'#becab9', fontWeight:600, marginBottom:4 }}>DELIVERY ADDRESS</div>
            <div style={{ fontSize:14, color:'#d5e4f4', fontWeight:700 }}>{order.customer?.name}</div>
            <div style={{ fontSize:13, color:'#becab9', lineHeight:1.6 }}>
              {order.customer?.address}, {order.customer?.city}, West Bengal — {order.customer?.pincode}
            </div>
            <div style={{ fontSize:13, color:'#becab9' }}>📞 +91 {order.customer?.phone}</div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div style={{ padding:'12px 16px', background:'rgba(132,230,132,0.08)', border:'1px solid rgba(132,230,132,0.2)', borderRadius:8, marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
          <span className="material-symbols-outlined" style={{ color:'#84e684', fontSize:20 }}>local_shipping</span>
          <span style={{ fontSize:13, color:'#d5e4f4' }}>Estimated Delivery: <strong style={{ color:'#84e684' }}>{order.estimatedDelivery}</strong></span>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', gap:12 }}>
          <button className="c-btn-primary" style={{ flex:1, justifyContent:'center', padding:'14px' }}
            onClick={() => onNavigate('order-tracking', { orderId: order.id })}>
            <span className="material-symbols-outlined">local_shipping</span>
            Track Order
          </button>
          <button className="c-btn-outline" style={{ flex:1, justifyContent:'center', padding:'14px' }}
            onClick={() => onNavigate('marketplace')}>
            <span className="material-symbols-outlined">storefront</span>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
