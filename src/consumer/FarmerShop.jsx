// FarmerShop.jsx — Farmer profile + their products
import React, { useState } from 'react';
import { FARMERS, PRODUCTS, useConsumer } from './ConsumerContext';
import ProductCard from './ProductCard';

export default function FarmerShop({ farmerId, onNavigate }) {
  const farmer = FARMERS[farmerId];
  const [toast, setToast] = useState('');

  if (!farmer) return (
    <div className="c-empty" style={{ minHeight:'60vh' }}>
      <span className="material-symbols-outlined icon">store_off</span>
      <p>Farmer shop not found.</p>
      <button className="c-btn-primary" onClick={() => onNavigate('marketplace')}>Back to Marketplace</button>
    </div>
  );

  const farmerProducts = PRODUCTS.filter(p => p.farmerId === farmerId);

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      {toast && <div className="c-toast"><span className="material-symbols-outlined">check_circle</span>{toast}</div>}

      <div style={{ maxWidth:960, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Back */}
        <button className="c-btn-ghost" style={{ marginBottom:20 }} onClick={() => onNavigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span> Back
        </button>

        {/* Farmer Hero */}
        <div className="c-glass" style={{ padding:0, overflow:'hidden', marginBottom:28 }}>
          {/* Banner */}
          <div style={{ height:120, background:`linear-gradient(135deg, #0e2a1e 0%, #061520 100%)`, position:'relative', display:'flex', alignItems:'center', paddingLeft:24, gap:20, borderBottom:'1px solid rgba(63,74,61,0.4)' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#13212c,#1d2b37)', border:'3px solid rgba(132,230,132,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span className="material-symbols-outlined" style={{ fontSize:36, color:'#84e684' }}>person</span>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:22, color:'#d5e4f4', letterSpacing:'-0.5px' }}>{farmer.name}</div>
              <div style={{ fontSize:13, color:'#becab9', display:'flex', alignItems:'center', gap:5, marginTop:3 }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>location_on</span>
                {farmer.location}, {farmer.state}
              </div>
            </div>
            <div style={{ marginLeft:'auto', paddingRight:24, display:'flex', gap:20 }}>
              {[
                { label: 'Rating', value: `⭐ ${farmer.rating}` },
                { label: 'Revenue', value: farmer.totalSales },
                { label: 'Products', value: farmerProducts.length },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <div style={{ fontWeight:700, fontSize:16, color:'#d5e4f4' }}>{s.value}</div>
                  <div style={{ fontSize:11, color:'#becab9' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div style={{ padding:'16px 24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <span className="material-symbols-outlined" style={{ fontSize:16, color:'#84e684' }}>info</span>
              <span style={{ fontSize:13, fontWeight:600, color:'#d5e4f4' }}>About this Farmer</span>
            </div>
            <p style={{ fontSize:13, color:'#becab9', lineHeight:1.7, margin:0 }}>{farmer.description}</p>
          </div>
        </div>

        {/* Products Section */}
        <div style={{ marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontSize:17, fontWeight:700, color:'#d5e4f4', margin:0 }}>
            Products by {farmer.name} ({farmerProducts.length})
          </h2>
        </div>

        {farmerProducts.length === 0 ? (
          <div className="c-empty">
            <span className="material-symbols-outlined icon">inventory_2</span>
            <p>No products listed yet.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
            {farmerProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                showFarmerInfo={false}
                onView={id => onNavigate('product', { productId: id })}
                onItemAdded={p => { setToast(`${p.name} added to cart!`); setTimeout(() => setToast(''), 2000); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
