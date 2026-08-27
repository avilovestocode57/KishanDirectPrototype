// FarmerContext.jsx — Single shared source of truth for all Farmer screens
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import asset23 from '../assets/farmer-asset-23.png';
import asset24 from '../assets/farmer-asset-24.png';
import asset25 from '../assets/farmer-asset-25.png';

// ─── Constants ─────────────────────────────────────────────────────────────────
const LOW_STOCK_THRESHOLD = 300; // kg

export function deriveStatus(qty) {
  if (qty === 0)               return 'Out of Stock';
  if (qty < LOW_STOCK_THRESHOLD) return 'Low Stock';
  return 'Active';
}

// Order lifecycle — farmer controls up to PACKED, admin handles beyond
export const ORDER_STATUSES = ['New Order', 'Confirmed', 'Preparing', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'];
export const FARMER_STATUSES = ['New Order', 'Confirmed', 'Preparing', 'Packed'];
export const ADMIN_STATUSES  = ['Dispatched', 'Out for Delivery', 'Delivered'];

export const ORDER_TRANSITIONS = {
  'New Order':  { next: 'Confirmed',  action: 'Confirm Order',   decline: true },
  'Confirmed':  { next: 'Preparing',  action: 'Start Preparing', decline: false },
  'Preparing':  { next: 'Packed',     action: 'Mark as Packed',  decline: false },
  'Packed':     { next: null,         action: null,              decline: false },
  'Declined':   { next: null,         action: null,              decline: false },
  'Dispatched': { next: null,         action: null,              decline: false },
  'Out for Delivery': { next: null,   action: null,              decline: false },
  'Delivered':  { next: null,         action: null,              decline: false },
};

// ─── Initial Products ──────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 'prod-1', name: 'Mustard Seeds (Yellow)', subtitle: 'Rabi Crop • West Bengal',  price: 60,  unit: 'kg', quantity: 1200, image: asset23, updatedAt: '2 hrs ago'  },
  { id: 'prod-2', name: 'Golden Maize (Corn)',    subtitle: 'Kharif Crop • Jalpaiguri', price: 22,  unit: 'kg', quantity: 4500, image: asset24, updatedAt: '1 day ago'  },
  { id: 'prod-3', name: 'Raw Jute (Tossa)',       subtitle: 'Cash Crop • Murshidabad',  price: 70,  unit: 'kg', quantity: 150,  image: asset25, updatedAt: '3 days ago' },
];

// ─── Initial Orders ────────────────────────────────────────────────────────────
const INITIAL_ORDERS = [
  {
    id: 'ORD-092', product: 'Organic Tomatoes (Grade A)', quantity: '25 kg', qty: 25, pricePerUnit: 40,
    buyerName: 'Anita Sharma',       buyerPhone: '+91 98765 43210',
    buyerAddress: '14, Salt Lake Sector 5, Bidhannagar, Kolkata, West Bengal 700091',
    locationShort: 'Kolkata, West Bengal', subtotal: 1000, logisticsHandling: 150, platformSubvention: 50, total: 1100,
    status: 'New Order', date: 'Oct 24, 2023 • 09:41 AM', imageIndex: 17,
  },
  {
    id: 'ORD-091', product: 'Baby Spinach', quantity: '10 kg', qty: 10, pricePerUnit: 35,
    buyerName: 'FreshMart Grocers',  buyerPhone: '+91 94560 78901',
    buyerAddress: 'GT Road, Shibpur, Howrah, West Bengal 711103',
    locationShort: 'Howrah, West Bengal', subtotal: 350, logisticsHandling: 80, platformSubvention: 20, total: 410,
    status: 'Confirmed', date: 'Oct 23, 2023 • 02:15 PM', imageIndex: 18,
  },
  {
    id: 'ORD-089', product: 'Gobindobhog Rice', quantity: '100 kg', qty: 100, pricePerUnit: 85,
    buyerName: 'Vikram Singh',       buyerPhone: '+91 97340 12345',
    buyerAddress: 'Hakimpara, Hospital Road, Siliguri, West Bengal 734001',
    locationShort: 'Siliguri, West Bengal', subtotal: 8500, logisticsHandling: 300, platformSubvention: 150, total: 8650,
    status: 'Preparing', date: 'Oct 21, 2023 • 10:00 AM', imageIndex: 19,
  },
  {
    id: 'ORD-085', product: 'Kufri Jyoti Potatoes', quantity: '50 kg', qty: 50, pricePerUnit: 18,
    buyerName: 'Hooghly Co-op Society', buyerPhone: '+91 93000 45678',
    buyerAddress: 'Chinsurah Bazar, Hooghly, West Bengal 712101',
    locationShort: 'Hooghly, West Bengal', subtotal: 900, logisticsHandling: 120, platformSubvention: 30, total: 990,
    status: 'Delivered', date: 'Oct 18, 2023 • 06:00 AM', imageIndex: 20,
  },
];

// ─── Initial Shop Profile ──────────────────────────────────────────────────────
const INITIAL_SHOP = {
  name: 'Green Valley Organic Farms',
  location: 'Nadia District, West Bengal',
  description: 'Specializing in organic, high-yield root vegetables, jute, and premium rice. Utilizing eco-smart irrigation for sustainable growth in West Bengal.',
};

// ─── Initial State ─────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  products: INITIAL_PRODUCTS,
  orders:   INITIAL_ORDERS,
  shop:     INITIAL_SHOP,
  bids:     [],  // { id, requirementId, requirementTitle, buyer, location, quantityRequired, bidPrice, priceUnit, submittedDate, status }
};

// ─── Reducer ───────────────────────────────────────────────────────────────────
function farmerReducer(state, action) {
  switch (action.type) {

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, { ...action.payload, id: `prod-${Date.now()}`, updatedAt: 'Just now' }] };

    case 'EDIT_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.payload.id ? { ...p, ...action.payload, updatedAt: 'Just now' } : p) };

    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) };

    case 'UPDATE_ORDER_STATUS':
      return { ...state, orders: state.orders.map(o => o.id === action.payload.id ? { ...o, status: action.payload.status } : o) };

    case 'UPDATE_SHOP':
      return { ...state, shop: { ...state.shop, ...action.payload } };

    case 'SUBMIT_BID': {
      // Enforce one bid per requirement
      const exists = state.bids.find(b => b.requirementId === action.payload.requirementId);
      if (exists) return state;
      return { ...state, bids: [...state.bids, { ...action.payload, id: `bid-${Date.now()}`, status: 'Pending', submittedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }] };
    }

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────
const FarmerContext = createContext(null);

export function FarmerProvider({ children }) {
  const [state, dispatch] = useReducer(farmerReducer, INITIAL_STATE);

  const addProduct        = useCallback(p  => dispatch({ type: 'ADD_PRODUCT',        payload: p }),   []);
  const editProduct       = useCallback(p  => dispatch({ type: 'EDIT_PRODUCT',       payload: p }),   []);
  const deleteProduct     = useCallback(id => dispatch({ type: 'DELETE_PRODUCT',     payload: id }),  []);
  const updateOrderStatus = useCallback((id, status) => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id, status } }), []);
  const updateShop        = useCallback(d  => dispatch({ type: 'UPDATE_SHOP',        payload: d }),   []);
  const submitBid         = useCallback(b  => dispatch({ type: 'SUBMIT_BID',         payload: b }),   []);

  // Derived values
  const activeProducts     = state.products.filter(p => deriveStatus(p.quantity) === 'Active');
  const activeProductCount = activeProducts.length;
  const pendingOrderCount  = state.orders.filter(o => o.status === 'New Order').length;   // Only truly pending

  // Total stock in kg across active products with unit conversion
  const totalStockKg = activeProducts.reduce((acc, p) => {
    const qtyInKg = (p.unit === 'quintal' || p.unit === 'Quintal' || p.unit === 'Quintals') 
      ? p.quantity * 100 
      : p.quantity;
    return acc + qtyInKg;
  }, 0);

  const submittedBidsCount = state.bids.length;

  const getBidForRequirement = useCallback(reqId => state.bids.find(b => b.requirementId === reqId) || null, [state.bids]);

  return (
    <FarmerContext.Provider value={{
      products: state.products,
      orders:   state.orders,
      shop:     state.shop,
      bids:     state.bids,
      activeProductCount,
      pendingOrderCount,
      totalStockKg,
      submittedBidsCount,
      addProduct, editProduct, deleteProduct,
      updateOrderStatus,
      updateShop,
      submitBid,
      getBidForRequirement,
    }}>
      {children}
    </FarmerContext.Provider>
  );
}

export function useFarmer() {
  const ctx = useContext(FarmerContext);
  if (!ctx) throw new Error('useFarmer must be used inside FarmerProvider');
  return ctx;
}
