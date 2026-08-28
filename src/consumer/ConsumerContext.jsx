// ConsumerContext.jsx — Single source of truth for KisanDirect Consumer Marketplace
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

import tomatoImg     from '../assets/consumer-tomato.png';
import potatoImg     from '../assets/consumer-potato.png';
import cauliImg      from '../assets/consumer-cauliflower.png';
import riceImg       from '../assets/consumer-rice.png';
import mangoImg      from '../assets/consumer-mango.png';
import brinjalImg    from '../assets/consumer-brinjal.png';

// ─── Farmers ──────────────────────────────────────────────────────────────────
export const FARMERS = {
  'f1': { id: 'f1', name: 'Ramesh Das',    location: 'Krishnanagar, Nadia', district: 'Nadia',        state: 'West Bengal', description: 'Organic vegetable farmer with 15+ years of experience. Specializes in tomatoes and seasonal vegetables using eco-friendly practices.', rating: 4.8, totalSales: '₹4.2L' },
  'f2': { id: 'f2', name: 'Amit Mondal',   location: 'Hooghly',             district: 'Hooghly',       state: 'West Bengal', description: 'Large-scale potato farmer supplying Kolkata markets. Certified organic produce from the fertile Hooghly plains.', rating: 4.6, totalSales: '₹6.1L' },
  'f3': { id: 'f3', name: 'Suman Ghosh',   location: 'Bardhaman',           district: 'East Burdwan',  state: 'West Bengal', description: 'Specialized in Rabi season vegetables including cauliflower and green vegetables. Winner of State Best Farmer Award 2023.', rating: 4.9, totalSales: '₹3.8L' },
  'f4': { id: 'f4', name: 'Sanjay Roy',    location: 'Bankura',             district: 'Bankura',       state: 'West Bengal', description: 'Traditional rice farmer growing premium Gobindobhog and Swarna varieties using generations-old methods from Bankura.', rating: 4.7, totalSales: '₹8.5L' },
  'f5': { id: 'f5', name: 'Debashis Paul', location: 'Malda',               district: 'Malda',         state: 'West Bengal', description: 'Renowned for Malda\'s celebrated Fazli and Himsagar mangoes. Exporting quality mangoes since 2005.', rating: 4.9, totalSales: '₹12.3L' },
  'f6': { id: 'f6', name: 'Arindam Das',   location: 'Nadia',               district: 'Nadia',         state: 'West Bengal', description: 'Specialist in brinjal and leafy vegetables. Uses natural farming techniques passed down for three generations.', rating: 4.5, totalSales: '₹2.9L' },
};

// ─── Products ──────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 'p1', name: 'Organic Tomato',     category: 'Vegetables', price: 40,  unit: 'kg', image: tomatoImg,  description: 'Farm-fresh organic tomatoes from Krishnanagar. Rich in lycopene, perfect for cooking and salads. Harvested daily to ensure peak freshness.', stock: 100, farmerId: 'f1', district: 'Nadia',       state: 'West Bengal' },
  { id: 'p2', name: 'Fresh Potato',       category: 'Vegetables', price: 30,  unit: 'kg', image: potatoImg,  description: 'Premium quality Kufri Jyoti potatoes from the fertile Hooghly plains. Excellent for all cooking purposes. Freshly harvested.', stock: 150, farmerId: 'f2', district: 'Hooghly',     state: 'West Bengal' },
  { id: 'p3', name: 'White Cauliflower',  category: 'Vegetables', price: 45,  unit: 'kg', image: cauliImg,   description: 'Fresh white cauliflower from Bardhaman\'s renowned vegetable belt. Crisp, dense heads with high nutritional value. Farm picked.', stock: 80,  farmerId: 'f3', district: 'East Burdwan', state: 'West Bengal' },
  { id: 'p4', name: 'Gobindobhog Rice',   category: 'Grains',     price: 60,  unit: 'kg', image: riceImg,    description: 'Premium Gobindobhog rice — Bengal\'s prized GI-tagged aromatic rice variety. Ideal for pulaos, biriyani and festive occasions. Small grain, rich aroma.', stock: 200, farmerId: 'f4', district: 'Bankura',     state: 'West Bengal' },
  { id: 'p5', name: 'Malda Himsagar Mango', category: 'Fruits',   price: 90,  unit: 'kg', image: mangoImg,   description: 'World-famous Himsagar mangoes from Malda — the king of mangoes. Intensely sweet, fibreless pulp with a heavenly aroma. Limited seasonal stock.', stock: 120, farmerId: 'f5', district: 'Malda',       state: 'West Bengal' },
  { id: 'p6', name: 'Purple Brinjal',     category: 'Vegetables', price: 35,  unit: 'kg', image: brinjalImg, description: 'Deep-purple glossy brinjal from Nadia\'s organic farms. Tender texture, excellent for begun bhaja, curries and stir-fries.', stock: 70,  farmerId: 'f6', district: 'Nadia',       state: 'West Bengal' },
];

// ─── Order Lifecycle ──────────────────────────────────────────────────────────
export const ORDER_STATUSES = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

// ─── Load/Save localStorage ───────────────────────────────────────────────────
function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Initial State ────────────────────────────────────────────────────────────
function getInitial() {
  return {
    cart:     load('kd_consumer_cart',     []),    // [{ productId, quantity }]
    orders:   load('kd_consumer_orders',   []),    // [{ id, items, total, status, address, date }]
    customer: load('kd_consumer_customer', null),  // { name, phone, address, city, pincode }
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'CART_ADD': {
      const { productId, quantity } = action.payload;
      const existing = state.cart.find(i => i.productId === productId);
      const product = PRODUCTS.find(p => p.id === productId);
      let cart;
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product?.stock || 999);
        cart = state.cart.map(i => i.productId === productId ? { ...i, quantity: newQty } : i);
      } else {
        cart = [...state.cart, { productId, quantity }];
      }
      return { ...state, cart };
    }

    case 'CART_SET_QTY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, cart: state.cart.filter(i => i.productId !== productId) };
      }
      return { ...state, cart: state.cart.map(i => i.productId === productId ? { ...i, quantity } : i) };
    }

    case 'CART_REMOVE':
      return { ...state, cart: state.cart.filter(i => i.productId !== action.payload) };

    case 'CART_CLEAR':
      return { ...state, cart: [] };

    case 'PLACE_ORDER': {
      const order = action.payload;
      const shouldClearCart = order.clearCart !== false;
      const { clearCart, ...cleanOrder } = order;
      return { ...state, orders: [cleanOrder, ...state.orders], cart: shouldClearCart ? [] : state.cart, customer: cleanOrder.customer || state.customer };
    }

    case 'ADVANCE_ORDER': {
      const { orderId } = action.payload;
      return {
        ...state,
        orders: state.orders.map(o => {
          if (o.id !== orderId) return o;
          const idx = ORDER_STATUSES.indexOf(o.status);
          const next = ORDER_STATUSES[Math.min(idx + 1, ORDER_STATUSES.length - 1)];
          return { ...o, status: next };
        }),
      };
    }

    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload };

    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ConsumerContext = createContext(null);

export function ConsumerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, getInitial());

  // Persist to localStorage on state change
  useEffect(() => { save('kd_consumer_cart',     state.cart);     }, [state.cart]);
  useEffect(() => { save('kd_consumer_orders',   state.orders);   }, [state.orders]);
  useEffect(() => { save('kd_consumer_customer', state.customer); }, [state.customer]);

  // Derived
  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = state.cart.reduce((s, i) => {
    const p = PRODUCTS.find(p => p.id === i.productId);
    return s + (p ? p.price * i.quantity : 0);
  }, 0);

  const addToCart     = useCallback((productId, qty = 1) => dispatch({ type: 'CART_ADD',    payload: { productId, quantity: qty } }), []);
  const setCartQty    = useCallback((productId, qty)     => dispatch({ type: 'CART_SET_QTY', payload: { productId, quantity: qty } }), []);
  const removeFromCart= useCallback((productId)          => dispatch({ type: 'CART_REMOVE',  payload: productId }), []);
  const clearCart     = useCallback(()                   => dispatch({ type: 'CART_CLEAR' }), []);
  const placeOrder    = useCallback((orderData)          => { const order = { ...orderData, id: `KD-${Date.now().toString(36).toUpperCase()}`, status: 'Order Placed', date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }; dispatch({ type: 'PLACE_ORDER', payload: order }); return order; }, []);
  const advanceOrder  = useCallback((orderId)            => dispatch({ type: 'ADVANCE_ORDER', payload: { orderId } }), []);
  const setCustomer   = useCallback((data)               => dispatch({ type: 'SET_CUSTOMER',  payload: data }), []);

  return (
    <ConsumerContext.Provider value={{
      cart: state.cart, orders: state.orders, customer: state.customer,
      cartCount, cartTotal,
      addToCart, setCartQty, removeFromCart, clearCart, placeOrder, advanceOrder, setCustomer,
    }}>
      {children}
    </ConsumerContext.Provider>
  );
}

export function useConsumer() {
  const ctx = useContext(ConsumerContext);
  if (!ctx) throw new Error('useConsumer must be inside ConsumerProvider');
  return ctx;
}
