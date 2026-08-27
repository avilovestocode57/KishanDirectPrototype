// AdminContext.jsx — Centralized state management for KisanDirect Admin Portal
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// ─── West Bengal Districts ──────────────────────────────────────────────────
export const WB_DISTRICTS = [
  'All Districts',
  'Kolkata',
  'Nadia',
  'Hooghly',
  'Howrah',
  'Purba Bardhaman',
  'Paschim Bardhaman',
  'North 24 Parganas',
  'South 24 Parganas',
  'Malda',
  'Bankura',
  'Murshidabad',
  'Birbhum',
  'Purulia',
  'Jalpaiguri',
  'Darjeeling',
  'Cooch Behar',
  'Alipurduar',
  'Uttar Dinajpur',
  'Dakshin Dinajpur',
  'Jhargram',
  'Paschim Medinipur',
  'Purba Medinipur',
];

// ─── Initial Mock Data (Strictly West Bengal) ───────────────────────────────
const INITIAL_USERS = [
  { id: 'u1', name: 'Ramesh Das',    role: 'Farmer',     district: 'Nadia',             joined: '12 Jan 2026', ordersCount: 42, status: 'Active', phone: '9830112233', email: 'ramesh.das@kisan.wb' },
  { id: 'u2', name: 'Amit Mondal',   role: 'Farmer',     district: 'Hooghly',           joined: '15 Jan 2026', ordersCount: 58, status: 'Active', phone: '9830223344', email: 'amit.mondal@kisan.wb' },
  { id: 'u3', name: 'Priya Sharma',  role: 'Consumer',   district: 'Kolkata',           joined: '02 Feb 2026', ordersCount: 14, status: 'Active', phone: '9876543210', email: 'priya.s@gmail.com' },
  { id: 'u4', name: 'Suman Ghosh',   role: 'Farmer',     district: 'Purba Bardhaman',   joined: '18 Jan 2026', ordersCount: 31, status: 'Active', phone: '9830334455', email: 'suman.ghosh@kisan.wb' },
  { id: 'u5', name: 'Bengal Agro Ltd', role: 'Enterprise', district: 'Kolkata',          joined: '05 Jan 2026', ordersCount: 112, status: 'Active', phone: '9830445566', email: 'procurement@bengalagro.in' },
  { id: 'u6', name: 'Subhash Roy',   role: 'Consumer',   district: 'Howrah',            joined: '10 Feb 2026', ordersCount: 6,  status: 'Active', phone: '9876112233', email: 'subhash.roy@yahoo.in' },
  { id: 'u7', name: 'Debashis Paul', role: 'Farmer',     district: 'Malda',             joined: '20 Jan 2026', ordersCount: 89, status: 'Active', phone: '9830556677', email: 'debashis.paul@kisan.wb' },
  { id: 'u8', name: 'Sanjay Roy',    role: 'Farmer',     district: 'Bankura',           joined: '22 Jan 2026', ordersCount: 64, status: 'Active', phone: '9830667788', email: 'sanjay.roy@kisan.wb' },
  { id: 'u9', name: 'Kolkata Fresh Mart', role: 'Enterprise', district: 'North 24 Parganas', joined: '12 Jan 2026', ordersCount: 95, status: 'Active', phone: '9830778899', email: 'contact@kolkatafresh.com' },
  { id: 'u10', name: 'Arindam Das',  role: 'Farmer',     district: 'Nadia',             joined: '25 Jan 2026', ordersCount: 19, status: 'Banned', phone: '9830889900', email: 'arindam.das@kisan.wb' },
  { id: 'u11', name: 'Ananya Sen',   role: 'Consumer',   district: 'South 24 Parganas', joined: '14 Feb 2026', ordersCount: 8,  status: 'Active', phone: '9876223344', email: 'ananya.sen@outlook.com' },
  { id: 'u12', name: 'Bikash Chatterjee', role: 'Admin',  district: 'Kolkata',           joined: '01 Jan 2026', ordersCount: 0,  status: 'Active', phone: '9830000001', email: 'admin.bikash@kisandirect.in' },
];

const INITIAL_PRODUCTS = [
  { id: 'pa1', name: 'Organic Royal Tomato', farmer: 'Ramesh Das', farmerId: 'u1', district: 'Nadia', quantity: '500 kg', proposedPrice: 42, unit: 'kg', date: '26 Aug 2026', status: 'Pending', category: 'Vegetables', description: 'Freshly harvested organic tomatoes with smooth skin and high juice content.', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80', ratings: { freshness: 0, appearance: 0, size: 0 }, rejectionReason: '' },
  { id: 'pa2', name: 'Jyoti Grade-A Potato', farmer: 'Amit Mondal', farmerId: 'u2', district: 'Hooghly', quantity: '1200 kg', proposedPrice: 32, unit: 'kg', date: '25 Aug 2026', status: 'Pending', category: 'Vegetables', description: 'Selected Kufri Jyoti potatoes, washed and sorted for enterprise procurement.', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80', ratings: { freshness: 0, appearance: 0, size: 0 }, rejectionReason: '' },
  { id: 'pa3', name: 'Burdwan White Cauliflower', farmer: 'Suman Ghosh', farmerId: 'u4', district: 'Purba Bardhaman', quantity: '400 kg', proposedPrice: 48, unit: 'kg', date: '26 Aug 2026', status: 'Pending', category: 'Vegetables', description: 'Crisp white cauliflower heads without pest marks.', image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=400&q=80', ratings: { freshness: 0, appearance: 0, size: 0 }, rejectionReason: '' },
  { id: 'pa4', name: 'Gobindobhog Aromatic Rice', farmer: 'Sanjay Roy', farmerId: 'u8', district: 'Bankura', quantity: '2500 kg', proposedPrice: 65, unit: 'kg', date: '20 Aug 2026', status: 'Approved', category: 'Grains', description: 'GI-tagged aromatic Gobindobhog rice. Cleaned and packed.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', ratings: { freshness: 5, appearance: 5, size: 4 }, rejectionReason: '' },
  { id: 'pa5', name: 'Himsagar Premium Mango', farmer: 'Debashis Paul', farmerId: 'u7', district: 'Malda', quantity: '800 kg', proposedPrice: 95, unit: 'kg', date: '18 Aug 2026', status: 'Approved', category: 'Fruits', description: 'Naturally ripened Malda Himsagar mangoes.', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', ratings: { freshness: 5, appearance: 5, size: 5 }, rejectionReason: '' },
  { id: 'pa6', name: 'Sub-standard Hybrid Brinjal', farmer: 'Arindam Das', farmerId: 'u10', district: 'Nadia', quantity: '300 kg', proposedPrice: 20, unit: 'kg', date: '15 Aug 2026', status: 'Rejected', category: 'Vegetables', description: 'Mixed size brinjal crop.', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80', ratings: { freshness: 2, appearance: 2, size: 2 }, rejectionReason: 'Quality below standard. High level of pest damage observed during inspection.' },
];

const INITIAL_ORDERS = [
  { id: 'ORD-8821', buyer: 'Priya Sharma', farmer: 'Ramesh Das', product: 'Organic Royal Tomato', quantity: '25 kg', amount: 1050, district: 'Kolkata', date: '26 Aug 2026', status: 'Ready for Dispatch' },
  { id: 'ORD-8822', buyer: 'Bengal Agro Ltd', farmer: 'Amit Mondal', product: 'Jyoti Grade-A Potato', quantity: '500 kg', amount: 16000, district: 'Hooghly', date: '26 Aug 2026', status: 'Packed' },
  { id: 'ORD-8823', buyer: 'Subhash Roy', farmer: 'Suman Ghosh', product: 'Burdwan White Cauliflower', quantity: '10 kg', amount: 480, district: 'Howrah', date: '25 Aug 2026', status: 'Confirmed' },
  { id: 'ORD-8824', buyer: 'Kolkata Fresh Mart', farmer: 'Debashis Paul', product: 'Himsagar Premium Mango', quantity: '200 kg', amount: 19000, district: 'North 24 Parganas', date: '24 Aug 2026', status: 'Dispatched' },
  { id: 'ORD-8825', buyer: 'Ananya Sen', farmer: 'Sanjay Roy', product: 'Gobindobhog Aromatic Rice', quantity: '15 kg', amount: 975, district: 'South 24 Parganas', date: '23 Aug 2026', status: 'Delivered' },
  { id: 'ORD-8826', buyer: 'Priya Sharma', farmer: 'Amit Mondal', product: 'Jyoti Grade-A Potato', quantity: '50 kg', amount: 1600, district: 'Kolkata', date: '22 Aug 2026', status: 'Delayed' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'New Product Submission', message: 'Ramesh Das submitted Organic Royal Tomato for approval.', target: 'approvals', read: false, time: '10m ago' },
  { id: 'n2', title: 'Dispatch Ready Alert', message: 'Order #ORD-8821 is ready for dispatch from Nadia transit hub.', target: 'orders', read: false, time: '30m ago' },
  { id: 'n3', title: 'High Demand Detected', message: 'AI Engine flagged 35% demand surge for Gobindobhog rice in Kolkata.', target: 'ai', read: false, time: '2h ago' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function getInitial() {
  return {
    users:         load('kd_admin_users',         INITIAL_USERS),
    products:      load('kd_admin_products',      INITIAL_PRODUCTS),
    orders:        load('kd_admin_orders',        INITIAL_ORDERS),
    notifications: load('kd_admin_notifications', INITIAL_NOTIFICATIONS),
  };
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'TOGGLE_BAN_USER': {
      const { userId } = action.payload;
      const users = state.users.map(u => {
        if (u.id !== userId) return u;
        const nextStatus = u.status === 'Banned' ? 'Active' : 'Banned';
        return { ...u, status: nextStatus };
      });
      return { ...state, users };
    }

    case 'APPROVE_PRODUCT': {
      const { productId, ratings } = action.payload;
      const products = state.products.map(p => {
        if (p.id !== productId) return p;
        return { ...p, status: 'Approved', ratings: ratings || { freshness: 5, appearance: 5, size: 5 } };
      });
      return { ...state, products };
    }

    case 'REJECT_PRODUCT': {
      const { productId, reason, ratings } = action.payload;
      const products = state.products.map(p => {
        if (p.id !== productId) return p;
        return { ...p, status: 'Rejected', rejectionReason: reason, ratings: ratings || { freshness: 2, appearance: 2, size: 2 } };
      });
      return { ...state, products };
    }

    case 'DISPATCH_ORDER': {
      const { orderId } = action.payload;
      const orders = state.orders.map(o => {
        if (o.id !== orderId) return o;
        return { ...o, status: 'Dispatched' };
      });
      return { ...state, orders };
    }

    case 'MARK_NOTIF_READ': {
      const notifications = state.notifications.map(n => ({ ...n, read: true }));
      return { ...state, notifications };
    }

    default: return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, getInitial());

  useEffect(() => { save('kd_admin_users',         state.users);         }, [state.users]);
  useEffect(() => { save('kd_admin_products',      state.products);      }, [state.products]);
  useEffect(() => { save('kd_admin_orders',        state.orders);        }, [state.orders]);
  useEffect(() => { save('kd_admin_notifications', state.notifications); }, [state.notifications]);

  // Derived Metrics
  const totalUsers       = state.users.length;
  const totalFarmers     = state.users.filter(u => u.role === 'Farmer').length;
  const totalConsumers   = state.users.filter(u => u.role === 'Consumer').length;
  const totalEnterprises = state.users.filter(u => u.role === 'Enterprise').length;

  const activeProducts   = state.products.filter(p => p.status === 'Approved').length;
  const pendingProducts  = state.products.filter(p => p.status === 'Pending').length;
  const rejectedProducts = state.products.filter(p => p.status === 'Rejected').length;

  const totalOrders      = state.orders.length;
  const pendingOrders    = state.orders.filter(o => ['Order Placed', 'Confirmed', 'Packed', 'Ready for Dispatch'].includes(o.status)).length;
  const completedOrders  = state.orders.filter(o => o.status === 'Delivered').length;
  const dispatchedOrders = state.orders.filter(o => o.status === 'Dispatched').length;

  const estimatedRevenue = state.orders.reduce((sum, o) => sum + o.amount, 0) + 142000;
  const estimatedProfit  = Math.round(estimatedRevenue * 0.12);

  const toggleBanUser   = useCallback((userId)                  => dispatch({ type: 'TOGGLE_BAN_USER', payload: { userId } }), []);
  const approveProduct  = useCallback((productId, ratings)      => dispatch({ type: 'APPROVE_PRODUCT', payload: { productId, ratings } }), []);
  const rejectProduct   = useCallback((productId, reason, ratings) => dispatch({ type: 'REJECT_PRODUCT', payload: { productId, reason, ratings } }), []);
  const dispatchOrder   = useCallback((orderId)                 => dispatch({ type: 'DISPATCH_ORDER',  payload: { orderId } }), []);
  const markNotifRead   = useCallback(()                        => dispatch({ type: 'MARK_NOTIF_READ' }), []);

  return (
    <AdminContext.Provider value={{
      users: state.users,
      products: state.products,
      orders: state.orders,
      notifications: state.notifications,
      totalUsers, totalFarmers, totalConsumers, totalEnterprises,
      activeProducts, pendingProducts, rejectedProducts,
      totalOrders, pendingOrders, completedOrders, dispatchedOrders,
      estimatedRevenue, estimatedProfit,
      toggleBanUser, approveProduct, rejectProduct, dispatchOrder, markNotifRead,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
