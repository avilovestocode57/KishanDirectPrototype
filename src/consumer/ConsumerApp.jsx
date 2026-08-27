// ConsumerApp.jsx — Root shell for KisanDirect Consumer Marketplace
import React, { useState, useCallback } from 'react';
import './consumer.css';
import { ConsumerProvider, useConsumer } from './ConsumerContext';
import Marketplace      from './Marketplace';
import ProductDetails   from './ProductDetails';
import FarmerShop       from './FarmerShop';
import ShoppingCart     from './ShoppingCart';
import Checkout         from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import OrderTracking    from './OrderTracking';
import ConsumerProfile  from './ConsumerProfile';

// ─── Top Navigation Header ─────────────────────────────────────────────────────
function ConsumerHeader({ onNavigate, onBack }) {
  const { cartCount } = useConsumer();
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,21,32,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(63,74,61,0.5)',
      height: 60,
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      gap: 16,
    }}>
      {/* Logo */}
      <button onClick={() => onNavigate('marketplace')} style={{ background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:16, fontWeight:800, color:'#84e684', letterSpacing:'-0.5px', fontFamily:'Inter,sans-serif' }}>🌾 KisanDirect</span>
      </button>
      <span style={{ fontSize:11, color:'#becab9', background:'rgba(63,74,61,0.4)', padding:'2px 8px', borderRadius:100, border:'1px solid #3f4a3d' }}>Marketplace</span>

      {/* Spacer */}
      <div style={{ flex:1 }} />

      {/* Nav Buttons */}
      <button onClick={() => onNavigate('marketplace')}
        style={{ background:'transparent', border:'none', cursor:'pointer', color:'#becab9', display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'6px 10px', borderRadius:6, transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#84e684'}
        onMouseLeave={e => e.currentTarget.style.color = '#becab9'}>
        <span className="material-symbols-outlined" style={{ fontSize:18 }}>storefront</span>
        <span className="desktop-only">Shop</span>
      </button>

      {/* Cart */}
      <button onClick={() => onNavigate('cart')}
        style={{ background:'transparent', border:'none', cursor:'pointer', color:'#becab9', display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'6px 10px', borderRadius:6, position:'relative', transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#84e684'}
        onMouseLeave={e => e.currentTarget.style.color = '#becab9'}>
        <span className="material-symbols-outlined" style={{ fontSize:22 }}>shopping_cart</span>
        {cartCount > 0 && <span className="c-cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
        <span className="desktop-only">Cart {cartCount > 0 ? `(${cartCount})` : ''}</span>
      </button>

      {/* Profile */}
      <button onClick={() => onNavigate('profile')}
        style={{ background:'transparent', border:'none', cursor:'pointer', color:'#becab9', display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'6px 10px', borderRadius:6, transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#84e684'}
        onMouseLeave={e => e.currentTarget.style.color = '#becab9'}>
        <span className="material-symbols-outlined" style={{ fontSize:20 }}>account_circle</span>
        <span className="desktop-only">Profile</span>
      </button>

      {/* Exit */}
      {onBack && (
        <button onClick={onBack}
          style={{ background:'transparent', border:'1px solid rgba(63,74,61,0.5)', cursor:'pointer', color:'#becab9', display:'flex', alignItems:'center', gap:5, fontSize:12, padding:'5px 12px', borderRadius:6, transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#84e684'; e.currentTarget.style.color='#84e684'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(63,74,61,0.5)'; e.currentTarget.style.color='#becab9'; }}>
          <span className="material-symbols-outlined" style={{ fontSize:16 }}>swap_horiz</span>
          <span className="desktop-only">Roles</span>
        </button>
      )}
    </header>
  );
}

// ─── Router Shell ──────────────────────────────────────────────────────────────
function ConsumerShell({ onBack }) {
  // Route state: { screen, payload }
  const [route, setRoute] = useState({ screen: 'marketplace', payload: {} });
  const [history, setHistory] = useState([]);

  const navigate = useCallback((screenOrDelta, payload = {}) => {
    if (screenOrDelta === -1) {
      // Go back
      setHistory(h => {
        if (h.length === 0) return h;
        const prev = h[h.length - 1];
        setRoute(prev);
        return h.slice(0, -1);
      });
      return;
    }
    setHistory(h => [...h, route]);
    setRoute({ screen: screenOrDelta, payload });
  }, [route]);

  const { screen, payload } = route;

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <ConsumerHeader onNavigate={navigate} onBack={onBack} />
      <main>
        {screen === 'marketplace'        && <Marketplace       onNavigate={navigate} />}
        {screen === 'product'            && <ProductDetails    onNavigate={navigate} productId={payload.productId} />}
        {screen === 'farmer-shop'        && <FarmerShop        onNavigate={navigate} farmerId={payload.farmerId} />}
        {screen === 'cart'               && <ShoppingCart      onNavigate={navigate} />}
        {screen === 'checkout'           && <Checkout          onNavigate={navigate} />}
        {screen === 'order-confirmation' && <OrderConfirmation onNavigate={navigate} orderId={payload.orderId} />}
        {screen === 'order-tracking'     && <OrderTracking     onNavigate={navigate} orderId={payload.orderId} />}
        {screen === 'profile'            && <ConsumerProfile   onNavigate={navigate} />}
      </main>
    </div>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────
export default function ConsumerApp({ onBack }) {
  return (
    <ConsumerProvider>
      <style>{`.desktop-only { } @media (max-width: 600px) { .desktop-only { display: none !important; } }`}</style>
      <ConsumerShell onBack={onBack} />
    </ConsumerProvider>
  );
}
