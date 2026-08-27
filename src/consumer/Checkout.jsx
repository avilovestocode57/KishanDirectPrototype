// Checkout.jsx — Address form + order placement
import React, { useState } from 'react';
import { PRODUCTS, useConsumer } from './ConsumerContext';

const WB_CITIES = ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Krishnanagar', 'Malda', 'Bankura', 'Birbhum', 'Murshidabad', 'Hooghly', 'Nadia', 'Barasat'];

export default function Checkout({ onNavigate }) {
  const { cart, cartTotal, customer, placeOrder } = useConsumer();

  const cartItems = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return product ? { ...item, product } : null;
  }).filter(Boolean);

  const subtotal = cartTotal;
  const delivery = 49;
  const total    = subtotal + delivery;

  const [form, setForm] = useState({
    name:    customer?.name    || '',
    phone:   customer?.phone   || '',
    address: customer?.address || '',
    city:    customer?.city    || 'Kolkata',
    pincode: customer?.pincode || '',
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: '' })); }

  function validate() {
    const errs = {};
    if (!form.name.trim())    errs.name    = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    if (!form.city.trim())    errs.city    = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        items: cartItems.map(i => ({ productId: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity })),
        subtotal,
        delivery,
        total,
        customer: { ...form },
        estimatedDelivery: '3-5 business days',
      });
      setPlacing(false);
      onNavigate('order-confirmation', { orderId: order.id });
    }, 800);
  }

  if (cartItems.length === 0) {
    return (
      <div className="consumer-root" style={{ minHeight:'100vh' }}>
        <div style={{ maxWidth:700, margin:'0 auto', padding:'24px' }}>
          <div className="c-empty" style={{ minHeight:'50vh' }}>
            <span className="material-symbols-outlined icon">shopping_cart_off</span>
            <p>Your cart is empty. Add items before checkout.</p>
            <button className="c-btn-primary" onClick={() => onNavigate('marketplace')}>Browse Marketplace</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
          <button className="c-btn-ghost" onClick={() => onNavigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#d5e4f4', margin:0 }}>Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>

            {/* Form */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {/* Delivery Info */}
              <div className="c-glass" style={{ padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, paddingBottom:14, borderBottom:'1px solid #3f4a3d' }}>
                  <span className="material-symbols-outlined" style={{ color:'#84e684', fontSize:20 }}>local_shipping</span>
                  <h2 style={{ fontSize:15, fontWeight:700, color:'#d5e4f4', margin:0 }}>Delivery Information</h2>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {/* Name */}
                  <div>
                    <label style={{ display:'block', fontSize:12, color:'#becab9', fontWeight:600, marginBottom:6 }}>Full Name *</label>
                    <input className={`c-input ${errors.name ? 'error' : ''}`} placeholder="e.g. Priya Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
                    {errors.name && <p style={{ fontSize:11, color:'#ffb4ab', margin:'4px 0 0' }}>{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display:'block', fontSize:12, color:'#becab9', fontWeight:600, marginBottom:6 }}>Mobile Number *</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#becab9', fontSize:13, fontWeight:600 }}>+91</span>
                      <input className={`c-input ${errors.phone ? 'error' : ''}`} placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))} style={{ paddingLeft:46 }} />
                    </div>
                    {errors.phone && <p style={{ fontSize:11, color:'#ffb4ab', margin:'4px 0 0' }}>{errors.phone}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label style={{ display:'block', fontSize:12, color:'#becab9', fontWeight:600, marginBottom:6 }}>Delivery Address *</label>
                    <textarea className={`c-input ${errors.address ? 'error' : ''}`} placeholder="Flat/House No., Street, Area..." value={form.address} onChange={e => set('address', e.target.value)} style={{ minHeight:80, resize:'vertical' }} />
                    {errors.address && <p style={{ fontSize:11, color:'#ffb4ab', margin:'4px 0 0' }}>{errors.address}</p>}
                  </div>

                  {/* City + Pincode */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={{ display:'block', fontSize:12, color:'#becab9', fontWeight:600, marginBottom:6 }}>City *</label>
                      <select className={`c-input ${errors.city ? 'error' : ''}`} value={form.city} onChange={e => set('city', e.target.value)} style={{ appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23becab9' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center' }}>
                        {WB_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p style={{ fontSize:11, color:'#ffb4ab', margin:'4px 0 0' }}>{errors.city}</p>}
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:12, color:'#becab9', fontWeight:600, marginBottom:6 }}>Pincode *</label>
                      <input className={`c-input ${errors.pincode ? 'error' : ''}`} placeholder="700001" value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g,'').slice(0,6))} />
                      {errors.pincode && <p style={{ fontSize:11, color:'#ffb4ab', margin:'4px 0 0' }}>{errors.pincode}</p>}
                    </div>
                  </div>

                  {/* State (fixed) */}
                  <div style={{ padding:'10px 14px', background:'rgba(63,74,61,0.2)', borderRadius:8, border:'1px solid rgba(63,74,61,0.4)', fontSize:13, color:'#becab9', display:'flex', alignItems:'center', gap:6 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:14, color:'#84e684' }}>location_on</span>
                    State: <strong style={{ color:'#d5e4f4' }}>West Bengal</strong>
                  </div>
                </div>
              </div>

              {/* Payment note */}
              <div className="c-glass-light" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
                <span className="material-symbols-outlined" style={{ fontSize:24, color:'#84e684' }}>lock</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#d5e4f4' }}>Prototype — No Real Payment</div>
                  <div style={{ fontSize:12, color:'#becab9' }}>This is a demo. Click Place Order to simulate a successful transaction.</div>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:80 }}>
              {/* Items */}
              <div className="c-glass" style={{ padding:'16px' }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:'#d5e4f4', margin:'0 0 12px 0', paddingBottom:10, borderBottom:'1px solid #3f4a3d' }}>Your Order</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} style={{ display:'flex', gap:10, alignItems:'center' }}>
                      <div style={{ width:40, height:40, borderRadius:6, overflow:'hidden', flexShrink:0 }}>
                        <img src={product.image} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      </div>
                      <div style={{ flex:1, fontSize:12 }}>
                        <div style={{ color:'#d5e4f4', fontWeight:600 }}>{product.name}</div>
                        <div style={{ color:'#becab9' }}>₹{product.price} × {quantity}kg</div>
                      </div>
                      <span style={{ fontWeight:700, color:'#edc22b', fontSize:13 }}>₹{(product.price * quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="c-glass" style={{ padding:'16px' }}>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                    <span style={{ color:'#becab9' }}>Subtotal</span>
                    <span style={{ color:'#d5e4f4', fontWeight:600 }}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                    <span style={{ color:'#becab9' }}>Delivery</span>
                    <span style={{ color:'#84e684', fontWeight:600 }}>₹{delivery}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:17, fontWeight:800, borderTop:'1px solid #3f4a3d', paddingTop:12, marginTop:4 }}>
                    <span style={{ color:'#d5e4f4' }}>Total</span>
                    <span style={{ color:'#edc22b' }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" className="c-btn-primary"
                  style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15, borderRadius:10, marginTop:16 }}
                  disabled={placing}>
                  <span className="material-symbols-outlined">{placing ? 'hourglass_empty' : 'check_circle'}</span>
                  {placing ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
