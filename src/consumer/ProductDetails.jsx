// ProductDetails.jsx — Product detail page
import React, { useState } from 'react';
import { PRODUCTS, FARMERS, useConsumer } from './ConsumerContext';

export default function ProductDetails({ productId, onNavigate }) {
  const product = PRODUCTS.find(p => p.id === productId);
  const { addToCart } = useConsumer();
  const [qty, setQty]     = useState(1);
  const [toast, setToast] = useState('');
  const [addedAnim, setAddedAnim] = useState(false);

  if (!product) return (
    <div className="c-empty" style={{ minHeight:'60vh' }}>
      <span className="material-symbols-outlined icon">error_outline</span>
      <p>Product not found.</p>
      <button className="c-btn-primary" onClick={() => onNavigate('marketplace')}>Back to Marketplace</button>
    </div>
  );

  const farmer = FARMERS[product.farmerId];

  function handleAdd() {
    addToCart(product.id, qty);
    setToast(`${qty} kg of ${product.name} added to cart!`);
    setAddedAnim(true);
    setTimeout(() => { setToast(''); setAddedAnim(false); }, 2000);
  }

  const canDec = qty > 1;
  const canInc = qty < product.stock;

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      {toast && <div className="c-toast"><span className="material-symbols-outlined">check_circle</span>{toast}</div>}

      <div style={{ maxWidth:960, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Back Button */}
        <button className="c-btn-ghost" style={{ marginBottom:20 }} onClick={() => onNavigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32, alignItems:'start' }}>

          {/* Image Column */}
          <div>
            <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(63,74,61,0.5)', background:'#0e1d28', aspectRatio:'1', position:'relative' }}>
              <img src={product.image} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              <div style={{ position:'absolute', top:14, left:14 }}>
                <span className="c-badge c-badge-green" style={{ textTransform:'none', fontSize:12 }}>{product.category}</span>
              </div>
            </div>

            {/* Farmer Card */}
            <button onClick={() => onNavigate('farmer-shop', { farmerId: product.farmerId })}
              style={{ marginTop:16, width:'100%', textAlign:'left', cursor:'pointer', background:'transparent', borderRadius:12, border:'none', padding:0 }}>
              <div className="c-glass" style={{ padding:'16px', display:'flex', alignItems:'center', gap:14, transition:'border-color 0.2s', cursor:'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(132,230,132,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(137,148,133,0.2)'}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#13212c,#1d2b37)', border:'2px solid rgba(132,230,132,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:24, color:'#84e684' }}>person</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:'#d5e4f4', marginBottom:2 }}>{farmer?.name}</div>
                  <div style={{ fontSize:12, color:'#becab9', display:'flex', alignItems:'center', gap:4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:12 }}>location_on</span>
                    {farmer?.location}, West Bengal
                  </div>
                  <div style={{ fontSize:11, color:'#84e684', marginTop:4, display:'flex', alignItems:'center', gap:4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:12 }}>star</span>{farmer?.rating} rating
                  </div>
                </div>
                <div style={{ color:'#becab9', display:'flex', alignItems:'center', gap:4, fontSize:12 }}>
                  View Shop <span className="material-symbols-outlined" style={{ fontSize:16 }}>chevron_right</span>
                </div>
              </div>
            </button>
          </div>

          {/* Details Column */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div>
              <div style={{ fontSize:11, color:'#becab9', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {product.district}, West Bengal
              </div>
              <h1 style={{ fontSize:26, fontWeight:800, color:'#d5e4f4', margin:'0 0 8px 0', letterSpacing:'-0.5px' }}>{product.name}</h1>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontSize:32, fontWeight:800, color:'#edc22b' }}>₹{product.price}</span>
                <span style={{ fontSize:14, color:'#becab9' }}>per {product.unit}</span>
              </div>
            </div>

            <p style={{ fontSize:14, color:'#becab9', lineHeight:1.7, borderTop:'1px solid #3f4a3d', paddingTop:16 }}>
              {product.description}
            </p>

            {/* Availability */}
            <div className="c-glass-light" style={{ padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:12, color:'#becab9', marginBottom:2 }}>Available Stock</div>
                <div style={{ fontWeight:700, color:'#84e684', fontSize:15 }}>{product.stock} kg</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:12, color:'#becab9', marginBottom:2 }}>Category</div>
                <span className="c-badge c-badge-green" style={{ textTransform:'none', fontWeight:600, fontSize:12 }}>{product.category}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <div style={{ fontSize:13, color:'#becab9', marginBottom:10, fontWeight:600 }}>Select Quantity</div>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div className="c-qty-control">
                  <button className="c-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={!canDec}>−</button>
                  <span className="c-qty-val">{qty}</span>
                  <button className="c-qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={!canInc}>+</button>
                </div>
                <span style={{ fontSize:13, color:'#becab9' }}>= <strong style={{ color:'#edc22b' }}>₹{(product.price * qty).toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display:'flex', gap:12, flexDirection:'column' }}>
              <button
                className="c-btn-primary"
                style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:15, borderRadius:10 }}
                onClick={handleAdd}>
                <span className="material-symbols-outlined">{addedAnim ? 'check' : 'add_shopping_cart'}</span>
                {addedAnim ? `Added ${qty} kg!` : `Add ${qty} kg to Cart`}
              </button>
              <button
                className="c-btn-outline"
                style={{ width:'100%', justifyContent:'center', padding:'12px', fontSize:14, borderRadius:10 }}
                onClick={() => { addToCart(product.id, qty); onNavigate('cart'); }}>
                <span className="material-symbols-outlined">shopping_cart_checkout</span>
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display:'flex', gap:16, paddingTop:8, borderTop:'1px solid #3f4a3d' }}>
              {[
                { icon: 'verified', label: 'Verified Farmer' },
                { icon: 'eco', label: 'Fresh Produce' },
                { icon: 'local_shipping', label: 'Home Delivery' },
              ].map(b => (
                <div key={b.icon} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#becab9' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:15, color:'#84e684' }}>{b.icon}</span> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
