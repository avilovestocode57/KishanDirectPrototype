// ConsumerApp.jsx — Root shell for KisanDirect Consumer Marketplace
import React, { useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import './consumer.css';
import { ConsumerProvider, useConsumer } from './ConsumerContext';
import Marketplace      from './Marketplace';
import ProductDetails   from './ProductDetails';
import FarmerShop       from './FarmerShop';
import ShoppingCart     from './ShoppingCart';
import Checkout         from './Checkout';
import BuyNowCheckout   from './BuyNowCheckout';
import OrderConfirmation from './OrderConfirmation';
import OrderTracking    from './OrderTracking';
import ConsumerProfile  from './ConsumerProfile';
import RolesButton      from '../components/RolesButton';

// ─── Route Wrappers for Params ────────────────────────────────────────────────
function ProductDetailsWrapper({ onNavigate }) {
  const { productId } = useParams();
  return <ProductDetails onNavigate={onNavigate} productId={productId} />;
}

function BuyNowWrapper({ onNavigate }) {
  const { productId } = useParams();
  return <BuyNowCheckout onNavigate={onNavigate} productId={productId} />;
}

function FarmerShopWrapper({ onNavigate }) {
  const { farmerId } = useParams();
  return <FarmerShop onNavigate={onNavigate} farmerId={farmerId} />;
}

function OrderConfirmationWrapper({ onNavigate }) {
  const { orderId } = useParams();
  return <OrderConfirmation onNavigate={onNavigate} orderId={orderId} />;
}

function OrderTrackingWrapper({ onNavigate }) {
  const { orderId } = useParams();
  return <OrderTracking onNavigate={onNavigate} orderId={orderId} />;
}

// ─── Top Navigation Header ─────────────────────────────────────────────────────
function ConsumerHeader({ onNavigate, onBack }) {
  const { cartCount } = useConsumer();
  const location = useLocation();

  const isPath = (p) => location.pathname === p;

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
        style={{ background:'transparent', border:'none', cursor:'pointer', color: isPath('/consumer/marketplace') ? '#84e684' : '#becab9', display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'6px 10px', borderRadius:6, transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#84e684'}
        onMouseLeave={e => e.currentTarget.style.color = isPath('/consumer/marketplace') ? '#84e684' : '#becab9'}>
        <span className="material-symbols-outlined" style={{ fontSize:18 }}>storefront</span>
        <span className="desktop-only">Shop</span>
      </button>

      {/* Cart */}
      <button onClick={() => onNavigate('cart')}
        style={{ background:'transparent', border:'none', cursor:'pointer', color: isPath('/consumer/cart') ? '#84e684' : '#becab9', display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'6px 10px', borderRadius:6, position:'relative', transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#84e684'}
        onMouseLeave={e => e.currentTarget.style.color = isPath('/consumer/cart') ? '#84e684' : '#becab9'}>
        <span className="material-symbols-outlined" style={{ fontSize:22 }}>shopping_cart</span>
        {cartCount > 0 && <span className="c-cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
        <span className="desktop-only">Cart {cartCount > 0 ? `(${cartCount})` : ''}</span>
      </button>

      {/* Profile */}
      <button onClick={() => onNavigate('profile')}
        style={{ background:'transparent', border:'none', cursor:'pointer', color: isPath('/consumer/profile') ? '#84e684' : '#becab9', display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'6px 10px', borderRadius:6, transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#84e684'}
        onMouseLeave={e => e.currentTarget.style.color = isPath('/consumer/profile') ? '#84e684' : '#becab9'}>
        <span className="material-symbols-outlined" style={{ fontSize:20 }}>account_circle</span>
        <span className="desktop-only">Profile</span>
      </button>

      {/* Roles Button */}
      {onBack && <RolesButton onClick={onBack} />}
    </header>
  );
}

// ─── Router Shell ──────────────────────────────────────────────────────────────
function ConsumerShell({ onBack }) {
  const navigate = useNavigate();

  const handleNavigate = useCallback((screenOrDelta, payload = {}) => {
    if (screenOrDelta === -1) {
      navigate(-1);
      return;
    }

    switch (screenOrDelta) {
      case 'marketplace':
        navigate('/consumer/marketplace');
        break;
      case 'product':
        navigate(`/consumer/product/${payload.productId || payload}`);
        break;
      case 'farmer-shop':
        navigate(`/consumer/farmer/${payload.farmerId || payload}`);
        break;
      case 'cart':
        navigate('/consumer/cart');
        break;
      case 'checkout':
        navigate('/consumer/checkout');
        break;
      case 'buy-now':
        navigate(`/consumer/buy-now/${payload.productId || payload}`, { state: { quantity: payload.quantity || 1 } });
        break;
      case 'order-confirmation':
        navigate(`/consumer/order-confirmation/${payload.orderId || payload}`);
        break;
      case 'order-tracking':
        navigate(`/consumer/order-tracking/${payload.orderId || payload}`);
        break;
      case 'profile':
        navigate('/consumer/profile');
        break;
      default:
        navigate('/consumer/marketplace');
        break;
    }
  }, [navigate]);

  return (
    <div className="consumer-root" style={{ minHeight:'100vh' }}>
      <ConsumerHeader onNavigate={handleNavigate} onBack={onBack} />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="marketplace" replace />} />
          <Route path="marketplace" element={<Marketplace onNavigate={handleNavigate} />} />
          <Route path="product/:productId" element={<ProductDetailsWrapper onNavigate={handleNavigate} />} />
          <Route path="farmer/:farmerId" element={<FarmerShopWrapper onNavigate={handleNavigate} />} />
          <Route path="cart" element={<ShoppingCart onNavigate={handleNavigate} />} />
          <Route path="checkout" element={<Checkout onNavigate={handleNavigate} />} />
          <Route path="buy-now/:productId" element={<BuyNowWrapper onNavigate={handleNavigate} />} />
          <Route path="order-confirmation/:orderId" element={<OrderConfirmationWrapper onNavigate={handleNavigate} />} />
          <Route path="order-tracking/:orderId" element={<OrderTrackingWrapper onNavigate={handleNavigate} />} />
          <Route path="profile" element={<ConsumerProfile onNavigate={handleNavigate} />} />
          <Route path="*" element={<Navigate to="marketplace" replace />} />
        </Routes>
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
