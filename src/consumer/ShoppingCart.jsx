// ShoppingCart.jsx — Cart management
import React from 'react';
import { PRODUCTS, useConsumer } from './ConsumerContext';

export default function ShoppingCart({ onNavigate }) {
  const { cart, cartTotal, setCartQty, removeFromCart } = useConsumer();

  const cartItems = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    return product ? { ...item, product } : null;
  }).filter(Boolean);

  const subtotal = cartTotal;
  const delivery = cartItems.length > 0 ? 49 : 0;
  const total    = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <div className="consumer-root" style={{ minHeight:'100vh' }}>
        <div style={{ maxWidth:860, margin:'0 auto', padding:'24px 24px 48px' }}>
          <button className="c-btn-ghost" style={{ marginBottom:20 }} onClick={() => onNavigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span> Back
          </button>
          <div className="c-empty" style={{ minHeight:'50vh' }}>
            <span className="material-symbols-outlined icon">shopping_cart</span>
            <p style={{ fontSize:18, fontWeight:700, color:'#d5e4f4' }}>Your cart is empty</p>
            <p style={{ fontSize:14 }}>Add fresh produce from West Bengal farmers</p>
            <button className="c-btn-primary" style={{ marginTop:8 }} onClick={() => onNavigate('marketplace')}>
              <span className="material-symbols-outlined">storefront</span>Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <div style={{ maxWidth:860, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <button className="c-btn-ghost" onClick={() => onNavigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 style={{ fontSize:22, fontWeight:800, color:'#d5e4f4', margin:0 }}>Shopping Cart</h1>
          <span style={{ fontSize:13, color:'#becab9' }}>({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
          <button style={{ marginLeft:'auto', background:'transparent', border:'none', color:'#ffb4ab', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}
            onClick={() => { if (window.confirm('Remove all items from cart?')) cartItems.forEach(i => removeFromCart(i.productId)); }}>
            <span className="material-symbols-outlined" style={{ fontSize:16 }}>delete_sweep</span> Clear All
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>

          {/* Cart Items */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="c-glass" style={{ padding:'16px', display:'flex', gap:16, alignItems:'center' }}>
                <div style={{ width:80, height:80, borderRadius:10, overflow:'hidden', flexShrink:0, background:'#0e1d28' }}>
                  <img src={product.image} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:'#d5e4f4', marginBottom:2 }}>{product.name}</div>
                  <div style={{ fontSize:12, color:'#becab9', marginBottom:8 }}>₹{product.price}/kg</div>
                  <div className="c-qty-control">
                    <button className="c-qty-btn" onClick={() => setCartQty(product.id, quantity - 1)} disabled={quantity <= 1}>−</button>
                    <span className="c-qty-val">{quantity}</span>
                    <button className="c-qty-btn" onClick={() => setCartQty(product.id, quantity + 1)} disabled={quantity >= product.stock}>+</button>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, flexShrink:0 }}>
                  <div style={{ fontWeight:800, color:'#edc22b', fontSize:17 }}>₹{(product.price * quantity).toLocaleString()}</div>
                  <button onClick={() => removeFromCart(product.id)}
                    style={{ background:'transparent', border:'1px solid rgba(255,180,171,0.3)', borderRadius:6, color:'#ffb4ab', cursor:'pointer', padding:'4px 10px', display:'flex', alignItems:'center', gap:4, fontSize:12, transition:'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(255,180,171,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <span className="material-symbols-outlined" style={{ fontSize:14 }}>delete</span> Remove
                  </button>
                </div>
              </div>
            ))}
            <button className="c-btn-ghost" style={{ alignSelf:'flex-start' }} onClick={() => onNavigate('marketplace')}>
              <span className="material-symbols-outlined">storefront</span> Continue Shopping
            </button>
          </div>

          {/* Summary */}
          <div className="c-glass" style={{ padding:'20px', position:'sticky', top:80 }}>
            <h3 style={{ fontWeight:700, fontSize:16, color:'#d5e4f4', margin:'0 0 16px 0', paddingBottom:14, borderBottom:'1px solid #3f4a3d' }}>
              Order Summary
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'#becab9' }}>{product.name} × {quantity}kg</span>
                  <span style={{ color:'#d5e4f4', fontWeight:600 }}>₹{(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop:'1px solid #3f4a3d', paddingTop:14, display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'#becab9' }}>Subtotal</span>
                <span style={{ color:'#d5e4f4', fontWeight:600 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'#becab9' }}>Delivery</span>
                <span style={{ color:'#84e684', fontWeight:600 }}>₹{delivery}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:800, borderTop:'1px solid #3f4a3d', paddingTop:12, marginTop:4 }}>
                <span style={{ color:'#d5e4f4' }}>Total</span>
                <span style={{ color:'#edc22b' }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button className="c-btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15, borderRadius:10 }}
              onClick={() => onNavigate('checkout')}>
              <span className="material-symbols-outlined">payment</span>Proceed to Checkout
            </button>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:12, fontSize:11, color:'#becab9' }}>
              <span className="material-symbols-outlined" style={{ fontSize:14, color:'#84e684' }}>lock</span>
              Secure checkout · No real payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
