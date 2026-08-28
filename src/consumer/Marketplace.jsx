// Marketplace.jsx — Consumer Product Discovery
import React, { useState, useMemo } from 'react';
import { PRODUCTS, FARMERS, useConsumer } from './ConsumerContext';
import ProductCard from './ProductCard';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains'];

export default function Marketplace({ onNavigate }) {
  const { cartCount } = useConsumer();
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [toast, setToast]     = useState('');

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2000); }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PRODUCTS.filter(p => {
      const farmer = FARMERS[p.farmerId];
      const matchSearch = !q
        || p.name.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q)
        || (farmer?.name || '').toLowerCase().includes(q)
        || (farmer?.location || '').toLowerCase().includes(q)
        || p.district.toLowerCase().includes(q)
        || p.state.toLowerCase().includes(q);
      const matchCat = category === 'All' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      {/* Toast */}
      {toast && <div className="c-toast"><span className="material-symbols-outlined">check_circle</span>{toast}</div>}

      {/* Hero Banner */}
      <div style={{ background:'linear-gradient(135deg,#0e2a1e 0%,#061520 60%)', borderBottom:'1px solid #3f4a3d', padding:'36px 24px 28px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, justifyContent:'center' }}>
            <span className="material-symbols-outlined" style={{ color:'#84e684', fontSize:20 }}>storefront</span>
            <span style={{ color:'#84e684', fontSize:12, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>West Bengal Marketplace</span>
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#d5e4f4', margin:'0 0 8px 0', letterSpacing:'-0.5px' }}>
            Fresh from Farm to Your Doorstep
          </h1>
          <p style={{ fontSize:14, color:'#becab9', maxWidth:520, lineHeight:1.6, margin:'0 auto' }}>
            Buy directly from verified West Bengal farmers. Fresh produce, fair prices, no middlemen.
          </p>

          {/* Search */}
          <div style={{ marginTop:20, position:'relative', maxWidth:480, width:'100%' }}>
            <span className="material-symbols-outlined" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#becab9', fontSize:20 }}>search</span>
            <input
              type="text"
              placeholder="Search products, farmers, locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="c-input"
              style={{ paddingLeft:44, background:'rgba(13,29,40,0.9)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', color:'#becab9', cursor:'pointer', display:'flex' }}>
                <span className="material-symbols-outlined" style={{ fontSize:18 }}>close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px 24px 48px' }}>
        {/* Category Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:13, color:'#becab9', fontWeight:600, marginRight:4 }}>Filter:</span>
          {CATEGORIES.map(cat => (
            <button key={cat} className={`c-tag ${category === cat ? 'active' : ''}`} onClick={() => setCategory(cat)}>
              {cat === 'All' && <span className="material-symbols-outlined" style={{ fontSize:13 }}>apps</span>}
              {cat === 'Vegetables' && <span className="material-symbols-outlined" style={{ fontSize:13 }}>eco</span>}
              {cat === 'Fruits' && <span className="material-symbols-outlined" style={{ fontSize:13 }}>nutrition</span>}
              {cat === 'Grains' && <span className="material-symbols-outlined" style={{ fontSize:13 }}>grass</span>}
              {cat}
            </button>
          ))}
          {(search || category !== 'All') && (
            <button className="c-tag" onClick={() => { setSearch(''); setCategory('All'); }} style={{ marginLeft:'auto', color:'#ffb4ab', borderColor:'rgba(255,180,171,0.3)' }}>
              <span className="material-symbols-outlined" style={{ fontSize:13 }}>filter_list_off</span>
              Clear filters
            </button>
          )}
          <span style={{ marginLeft:'auto', fontSize:13, color:'#becab9' }}>{filtered.length} products found</span>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="c-empty">
            <span className="material-symbols-outlined icon">search_off</span>
            <p style={{ fontSize:16, fontWeight:600, color:'#d5e4f4' }}>No products found</p>
            <p style={{ fontSize:14 }}>Try different keywords or clear the filters</p>
            <button className="c-btn-outline" style={{ marginTop:8 }} onClick={() => { setSearch(''); setCategory('All'); }}>
              Show all products
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onView={id => onNavigate('product', { productId: id })}
                onItemAdded={p => showToast(`${p.name} added to cart!`)}
              />
            ))}
          </div>
        )}

        {/* Farmer Strip */}
        <div style={{ marginTop:48, borderTop:'1px solid #3f4a3d', paddingTop:32 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#d5e4f4', margin:0 }}>Our West Bengal Farmers</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
            {Object.values(FARMERS).map(f => (
              <button key={f.id} onClick={() => onNavigate('farmer-shop', { farmerId: f.id })}
                className="c-glass" style={{ padding:'16px', textAlign:'left', cursor:'pointer', border:'1px solid rgba(63,74,61,0.4)', transition:'all 0.2s', borderRadius:12, background:'rgba(11,26,43,0.7)', width:'100%' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(132,230,132,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(63,74,61,0.4)'}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#13212c,#1d2b37)', border:'2px solid rgba(132,230,132,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:20, color:'#84e684' }}>person</span>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'#d5e4f4' }}>{f.name}</div>
                    <div style={{ fontSize:11, color:'#becab9', display:'flex', alignItems:'center', gap:3 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:11 }}>location_on</span>{f.district}, WB
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, color:'#becab9' }}>
                    {PRODUCTS.filter(p => p.farmerId === f.id).length} product{PRODUCTS.filter(p => p.farmerId === f.id).length !== 1 ? 's' : ''}
                  </span>
                  <div style={{ display:'flex', alignItems:'center', gap:3, color:'#edc22b', fontSize:12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:13 }}>star</span>{f.rating}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
