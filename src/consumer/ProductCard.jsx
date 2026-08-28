// ProductCard.jsx — Shared Product Card with Quantity Selector
import React from 'react';
import { FARMERS, useConsumer } from './ConsumerContext';

export default function ProductCard({ product, onView, showFarmerInfo = true, onItemAdded }) {
  const { cart, addToCart, setCartQty } = useConsumer();
  const farmer = FARMERS[product.farmerId];

  const cartItem = cart.find(i => i.productId === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  function handleAdd(e) {
    e.stopPropagation();
    addToCart(product.id, 1);
    if (onItemAdded) {
      onItemAdded(product);
    }
  }

  function handleDec(e) {
    e.stopPropagation();
    setCartQty(product.id, Math.max(0, quantity - 1));
  }

  function handleInc(e) {
    e.stopPropagation();
    const maxStock = product.stock || 999;
    setCartQty(product.id, Math.min(maxStock, quantity + 1));
  }

  return (
    <div className="c-product-card c-fade-in" onClick={() => onView(product.id)}>
      <div className="c-product-img-wrap">
        <img src={product.image} alt={product.name} />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span className="c-badge c-badge-green" style={{ textTransform: 'none', fontWeight: 600 }}>
            {product.category}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(6,21,32,0.85)', borderRadius: 6, padding: '3px 8px', fontSize: 13, color: '#edc22b', fontWeight: 700 }}>
          ₹{product.price}/{product.unit || 'kg'}
        </div>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#d5e4f4', marginBottom: 2 }}>{product.name}</div>
            {showFarmerInfo && farmer && (
              <div style={{ fontSize: 12, color: '#becab9', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>person</span>
                {farmer.name}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: '#becab9', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>location_on</span>
              {product.district}
            </div>
            <div style={{ fontSize: 11, color: '#3f4a3d', marginTop: 1 }}>{product.stock} {product.unit || 'kg'} avail.</div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: '#becab9', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
          {product.description}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, paddingTop: 6 }}>
          {quantity === 0 ? (
            <button
              className="c-btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '9px 12px', fontSize: 13 }}
              onClick={handleAdd}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_shopping_cart</span>
              Add to Cart
            </button>
          ) : (
            <div
              className="c-qty-control"
              style={{ flex: 1, justifyContent: 'space-between', height: 38, padding: '0 4px', boxSizing: 'border-box' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="c-qty-btn"
                style={{ width: 34, height: 34, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleDec}
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontWeight: 700 }}>remove</span>
              </button>
              <span className="c-qty-val" style={{ fontSize: 14, fontWeight: 700, color: '#d5e4f4', minWidth: 28, textAlign: 'center', userSelect: 'none' }}>
                {quantity}
              </span>
              <button
                className="c-qty-btn"
                style={{ width: 34, height: 34, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={handleInc}
                disabled={product.stock ? quantity >= product.stock : false}
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, fontWeight: 700 }}>add</span>
              </button>
            </div>
          )}

          <button
            className="c-btn-ghost"
            style={{ padding: '9px 12px', fontSize: 13, flexShrink: 0 }}
            onClick={(e) => { e.stopPropagation(); onView(product.id); }}
            title="View Product Details"
            aria-label="View Product Details"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
          </button>
        </div>
      </div>
    </div>
  );
}
