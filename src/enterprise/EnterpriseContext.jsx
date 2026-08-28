// EnterpriseContext.jsx — Centralized state management for KisanDirect Enterprise Procurement Module
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ─── West Bengal Districts ───────────────────────────────────────────────────
export const WB_LOCATIONS = [
  'Kolkata, West Bengal',
  'Howrah, West Bengal',
  'Hooghly, West Bengal',
  'North 24 Parganas, West Bengal',
  'South 24 Parganas, West Bengal',
  'Nadia, West Bengal',
  'Purba Bardhaman, West Bengal',
  'Paschim Bardhaman, West Bengal',
  'Murshidabad, West Bengal',
  'Malda, West Bengal',
  'Jalpaiguri, West Bengal',
  'Bankura, West Bengal',
  'Birbhum, West Bengal',
];

// ─── Initial Profile Data ──────────────────────────────────────────────────
const INITIAL_PROFILE = {
  id: 'ent-101',
  businessName: 'Bengal Agro Processing & Wholesale Ltd',
  businessType: 'Institution',
  contactName: 'Subhash Roy',
  phone: '+91 98301 23456',
  email: 'procurement@bengalagro.in',
  gstin: '19AABCB1234D1Z5',
  addresses: [
    {
      id: 'addr-1',
      title: 'Main Logistics Hub & Office',
      street: '14, Salt Lake Sector 5, Bidhannagar',
      district: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Dankuni Cold Storage Depot',
      street: 'Plot 45, Dankuni Industrial Complex',
      district: 'Hooghly',
      state: 'West Bengal',
      pincode: '712311',
      isDefault: false,
    },
    {
      id: 'addr-3',
      title: 'Shibpur Warehouse',
      street: 'GT Road, Shibpur Industrial Area',
      district: 'Howrah',
      state: 'West Bengal',
      pincode: '711103',
      isDefault: false,
    },
  ],
};

// ─── Initial Requirements Seed Data ──────────────────────────────────────────
const INITIAL_REQUIREMENTS = [
  {
    id: 'REQ-702',
    product: 'Swarna Paddy Rice',
    requiredQuantity: 150,
    allocatedQuantity: 0,
    remainingQuantity: 150,
    unit: 'kg',
    quality: 'Standard',
    targetPrice: 38,
    deliveryAddressId: 'addr-3',
    deliveryAddress: INITIAL_PROFILE.addresses[2],
    deliveryDate: '2026-09-20',
    notes: 'Bulk grain procurement for Swarna Paddy Rice. Moisture limit < 12%. Quality inspection upon gate entry at Shibpur Warehouse.',
    fulfillmentStatus: 'OPEN', // OPEN | PARTIALLY_FULFILLED | FULLY_ALLOCATED | FULFILLED | CLOSED | DRAFT
    createdAt: '2026-08-27',
  },
  {
    id: 'REQ-701',
    product: 'Raw Tossa Jute (Grade TD-4)',
    requiredQuantity: 180,
    allocatedQuantity: 0,
    remainingQuantity: 180,
    unit: 'kg',
    quality: 'Grade A',
    targetPrice: 72,
    deliveryAddressId: 'addr-1',
    deliveryAddress: INITIAL_PROFILE.addresses[0],
    deliveryDate: '2026-09-15',
    notes: 'High-strength natural jute fibers for industrial sack manufacturing. Flexible delivery at Salt Lake hub.',
    fulfillmentStatus: 'OPEN',
    createdAt: '2026-08-25',
  },
  {
    id: 'REQ-703',
    product: 'Jyoti / Chandramukhi Potatoes',
    requiredQuantity: 120,
    allocatedQuantity: 40,
    remainingQuantity: 80,
    unit: 'kg',
    quality: 'Grade A',
    targetPrice: 24,
    deliveryAddressId: 'addr-2',
    deliveryAddress: INITIAL_PROFILE.addresses[1],
    deliveryDate: '2026-09-10',
    notes: 'Urgent requirement for cold-storage ready potatoes. Direct depot unloading at Dankuni.',
    fulfillmentStatus: 'PARTIALLY_FULFILLED',
    createdAt: '2026-08-27',
  },
  {
    id: 'REQ-698',
    product: 'Mustard Oilseeds (Yellow)',
    requiredQuantity: 95,
    allocatedQuantity: 0,
    remainingQuantity: 95,
    unit: 'kg',
    quality: 'Grade B',
    targetPrice: 65,
    deliveryAddressId: 'addr-1',
    deliveryAddress: INITIAL_PROFILE.addresses[0],
    deliveryDate: '2026-08-15',
    notes: 'Draft requirement for upcoming Q4 oil extraction production run.',
    fulfillmentStatus: 'DRAFT',
    createdAt: '2026-08-22',
  },
];

// ─── Initial Bids Seed Data ────────────────────────────────────────────────
const INITIAL_BIDS = [
  // Bids for REQ-702 (Swarna Paddy Rice 150 kg test requirement)
  {
    id: 'BID-911',
    requirementId: 'REQ-702',
    farmerId: 'farmer-amit',
    farmerName: 'Amit Mondal',
    shopName: 'Bardhaman Grain Co-op',
    farmerRating: 4.9,
    farmerLocation: 'Purba Bardhaman, West Bengal',
    price: 38,
    bidQuantity: 50,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-18',
    message: 'Direct milling batch from Bardhaman paddy belt. Moisture tested at 11.5%.',
    total: 1900,
    status: 'SUBMITTED', // SUBMITTED | PARTIALLY_ACCEPTED | ACCEPTED | REJECTED | EXPIRED
    createdAt: '2026-08-27',
  },
  {
    id: 'BID-912',
    requirementId: 'REQ-702',
    farmerId: 'farmer-ramesh',
    farmerName: 'Ramesh Yadav',
    shopName: 'Purulia Farmers Group',
    farmerRating: 4.8,
    farmerLocation: 'Purulia, West Bengal',
    price: 37,
    bidQuantity: 40,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-19',
    message: 'High quality Swarna rice lot ready for truck dispatch from Purulia mandi yard.',
    total: 1480,
    status: 'SUBMITTED',
    createdAt: '2026-08-27',
  },
  {
    id: 'BID-913',
    requirementId: 'REQ-702',
    farmerId: 'farmer-suresh',
    farmerName: 'Suresh Patil',
    shopName: 'Satara Agro Co-op',
    farmerRating: 4.7,
    farmerLocation: 'Hooghly, West Bengal',
    price: 36,
    bidQuantity: 60,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-20',
    message: 'Cleaned, grade-checked Swarna paddy ready for Shibpur warehouse unloading.',
    total: 2160,
    status: 'SUBMITTED',
    createdAt: '2026-08-27',
  },
  {
    id: 'BID-914',
    requirementId: 'REQ-702',
    farmerId: 'farmer-mahesh',
    farmerName: 'Mahesh Singh',
    shopName: 'Bankura Farmer Collective',
    farmerRating: 4.6,
    farmerLocation: 'Bankura, West Bengal',
    price: 39,
    bidQuantity: 45,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-21',
    message: 'Supply available from Bankura regional aggregation hub.',
    total: 1755,
    status: 'SUBMITTED',
    createdAt: '2026-08-27',
  },
  {
    id: 'BID-915',
    requirementId: 'REQ-702',
    farmerId: 'farmer-jagdish',
    farmerName: 'Jagdish Prasad',
    shopName: 'Malda Agro Producer Co.',
    farmerRating: 4.8,
    farmerLocation: 'Malda, West Bengal',
    price: 35,
    bidQuantity: 30,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-22',
    message: 'Competitive price offer for 30 kg premium Swarna rice.',
    total: 1050,
    status: 'SUBMITTED',
    createdAt: '2026-08-27',
  },

  // Bids for REQ-701 (Raw Tossa Jute 180 kg requirement)
  {
    id: 'BID-901',
    requirementId: 'REQ-701',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Das',
    shopName: 'Nadia Organic Farms',
    farmerRating: 4.8,
    farmerLocation: 'Nadia, West Bengal',
    price: 70,
    bidQuantity: 75,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-12',
    message: 'Can supply 75 kg directly from Nadia farm hub. Certified Grade TD-4.',
    total: 5250,
    status: 'SUBMITTED',
    createdAt: '2026-08-26',
  },
  {
    id: 'BID-902',
    requirementId: 'REQ-701',
    farmerId: 'farmer-2',
    farmerName: 'Debashis Paul',
    shopName: 'Paul Jute Traders',
    farmerRating: 4.6,
    farmerLocation: 'Murshidabad, West Bengal',
    price: 74,
    bidQuantity: 60,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-14',
    message: 'Jute Board verified batch in Murshidabad warehouse.',
    total: 4440,
    status: 'SUBMITTED',
    createdAt: '2026-08-26',
  },
  {
    id: 'BID-903',
    requirementId: 'REQ-701',
    farmerId: 'farmer-3',
    farmerName: 'Subal Ghosh',
    shopName: 'Murshidabad Jute Guild',
    farmerRating: 4.7,
    farmerLocation: 'Murshidabad, West Bengal',
    price: 71,
    bidQuantity: 45,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-15',
    message: 'Premium long-strand TD-4 jute fibers packaged in 15 kg bales.',
    total: 3195,
    status: 'SUBMITTED',
    createdAt: '2026-08-26',
  },

  // Bids for REQ-703 (Jyoti / Chandramukhi Potatoes 120 kg requirement)
  {
    id: 'BID-904',
    requirementId: 'REQ-703',
    farmerId: 'farmer-5',
    farmerName: 'Tarun Ghosh',
    shopName: 'Hooghly Cold Storage Farmers',
    farmerRating: 4.7,
    farmerLocation: 'Hooghly, West Bengal',
    price: 23,
    bidQuantity: 40,
    acceptedQuantity: 40,
    unit: 'kg',
    deliveryDate: '2026-09-08',
    message: 'First lot of cold storage Jyoti potatoes ready for Dankuni depot.',
    total: 920,
    status: 'ACCEPTED',
    createdAt: '2026-08-27',
  },
  {
    id: 'BID-905',
    requirementId: 'REQ-703',
    farmerId: 'farmer-6',
    farmerName: 'Bikas Maity',
    shopName: 'Singur Farmers Collective',
    farmerRating: 4.8,
    farmerLocation: 'Hooghly, West Bengal',
    price: 24,
    bidQuantity: 50,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-09',
    message: 'Grade A fresh harvest Jyoti potatoes ready for immediate transport.',
    total: 1200,
    status: 'SUBMITTED',
    createdAt: '2026-08-27',
  },
  {
    id: 'BID-906',
    requirementId: 'REQ-703',
    farmerId: 'farmer-7',
    farmerName: 'Partha Roy',
    shopName: 'Tarakeswar Potato Hub',
    farmerRating: 4.6,
    farmerLocation: 'Hooghly, West Bengal',
    price: 22,
    bidQuantity: 30,
    acceptedQuantity: 0,
    unit: 'kg',
    deliveryDate: '2026-09-10',
    message: 'Sorted Chandramukhi potatoes packaged in moisture-resistant sacks.',
    total: 660,
    status: 'SUBMITTED',
    createdAt: '2026-08-27',
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-ENT-503',
    requirementId: 'REQ-703',
    bidId: 'BID-904',
    product: 'Jyoti / Chandramukhi Potatoes',
    farmerName: 'Tarun Ghosh (Hooghly Cold Storage Farmers)',
    farmerPhone: '+91 98311 99887',
    farmerLocation: 'Hooghly, West Bengal',
    quantity: 40,
    unit: 'kg',
    price: 23,
    total: 920,
    deliveryAddress: INITIAL_PROFILE.addresses[1],
    deliveryDate: '2026-09-08',
    status: 'Confirmed',
    createdAt: '2026-08-27 • 02:20 PM',
  },
];

// ─── Initial State ───────────────────────────────────────────────────────────
const INITIAL_STATE = {
  profile: INITIAL_PROFILE,
  requirements: INITIAL_REQUIREMENTS,
  bids: INITIAL_BIDS,
  orders: INITIAL_ORDERS,
};

// ─── Reducer Function ────────────────────────────────────────────────────────
function enterpriseReducer(state, action) {
  switch (action.type) {
    case 'RESET_DEMO_DATA': {
      return {
        ...INITIAL_STATE,
        profile: state.profile, // keep enterprise profile
      };
    }

    case 'CREATE_REQUIREMENT': {
      const reqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      const reqQty = Number(action.payload.requiredQuantity || action.payload.quantity);
      const isDraft = action.payload.status === 'Draft' || action.payload.fulfillmentStatus === 'DRAFT';

      const newReq = {
        ...action.payload,
        id: reqId,
        requiredQuantity: reqQty,
        allocatedQuantity: 0,
        remainingQuantity: reqQty,
        fulfillmentStatus: isDraft ? 'DRAFT' : 'OPEN',
        createdAt: new Date().toISOString().split('T')[0],
      };
      return {
        ...state,
        requirements: [newReq, ...state.requirements],
      };
    }

    case 'UPDATE_REQUIREMENT': {
      return {
        ...state,
        requirements: state.requirements.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r),
      };
    }

    case 'CLOSE_REQUIREMENT': {
      return {
        ...state,
        requirements: state.requirements.map(r => r.id === action.payload ? { ...r, fulfillmentStatus: 'CLOSED' } : r),
      };
    }

    case 'ACCEPT_BID': {
      // Auto-determines quantity to accept based on bid and requirement remaining
      const { reqId, bidId, paymentMethod } = action.payload;
      const targetBid = state.bids.find(b => b.id === bidId);
      const targetReq = state.requirements.find(r => r.id === reqId);

      if (!targetBid || !targetReq || targetReq.remainingQuantity <= 0) return state;

      // Available unaccepted quantity in farmer's bid
      const unacceptedInBid = targetBid.bidQuantity - (targetBid.acceptedQuantity || 0);

      // System automatically caps quantity to min(unacceptedInBid, targetReq.remainingQuantity)
      const qtyToAccept = Math.min(unacceptedInBid, targetReq.remainingQuantity);

      if (qtyToAccept <= 0) return state;

      const newBidAcceptedQty = (targetBid.acceptedQuantity || 0) + qtyToAccept;
      const isFullyAcceptedBid = newBidAcceptedQty >= targetBid.bidQuantity;

      // Update Bid Status
      const updatedBids = state.bids.map(b => {
        if (b.id === bidId) {
          return {
            ...b,
            acceptedQuantity: newBidAcceptedQty,
            status: isFullyAcceptedBid ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED',
          };
        }
        return b;
      });

      // Update Requirement Allocations
      const newAllocatedQty = targetReq.allocatedQuantity + qtyToAccept;
      const newRemainingQty = Math.max(0, targetReq.requiredQuantity - newAllocatedQty);

      // Section 4: If remaining becomes 0, requirement is marked FULFILLED / Completed
      const newFulfillmentStatus = newRemainingQty === 0 ? 'FULFILLED' : 'PARTIALLY_FULFILLED';

      const updatedRequirements = state.requirements.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            allocatedQuantity: newAllocatedQty,
            remainingQuantity: newRemainingQty,
            fulfillmentStatus: newFulfillmentStatus,
          };
        }
        return r;
      });

      // Create new Order for accepted bid
      const newOrderId = `ORD-ENT-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderTotal = qtyToAccept * targetBid.price;

      const newOrder = {
        id: newOrderId,
        requirementId: reqId,
        bidId: bidId,
        product: targetReq.product,
        farmerName: `${targetBid.farmerName} (${targetBid.shopName})`,
        farmerPhone: '+91 98765 43210',
        farmerLocation: targetBid.farmerLocation,
        quantity: qtyToAccept,
        unit: targetBid.unit || targetReq.unit,
        price: targetBid.price,
        total: orderTotal,
        deliveryAddress: targetReq.deliveryAddress,
        deliveryDate: targetBid.deliveryDate || targetReq.deliveryDate,
        paymentMethod: paymentMethod || 'Mock Payment (Demo)',
        status: 'Confirmed',
        createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      return {
        ...state,
        bids: updatedBids,
        requirements: updatedRequirements,
        orders: [newOrder, ...state.orders],
      };
    }

    case 'SUBMIT_FARMER_BID': {
      const { requirementId, farmerId, farmerName, shopName, farmerRating, farmerLocation, bidQuantity, price, unit, deliveryDate, message } = action.payload;
      const req = state.requirements.find(r => r.id === requirementId);
      if (!req || req.remainingQuantity <= 0) return state;

      const existing = state.bids.find(b => b.requirementId === requirementId && (b.farmerId === farmerId || b.farmerName === farmerName));
      if (existing) return state;

      const validBidQty = Math.min(Number(bidQuantity), req.remainingQuantity);
      if (validBidQty <= 0) return state;

      const newBid = {
        id: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
        requirementId,
        farmerId: farmerId || 'farmer-custom',
        farmerName: farmerName || 'Verified WB Farmer',
        shopName: shopName || 'WB Farmer Hub',
        farmerRating: farmerRating || 4.8,
        farmerLocation: farmerLocation || req.deliveryAddress?.district || 'West Bengal',
        price: Number(price),
        bidQuantity: validBidQty,
        acceptedQuantity: 0,
        unit: unit || req.unit,
        deliveryDate: deliveryDate || req.deliveryDate,
        message: message || '',
        total: validBidQty * Number(price),
        status: 'SUBMITTED',
        createdAt: new Date().toISOString().split('T')[0],
      };

      return {
        ...state,
        bids: [newBid, ...state.bids],
      };
    }

    case 'UPDATE_ORDER_STATUS': {
      const { orderId, status } = action.payload;
      return {
        ...state,
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
      };
    }

    case 'UPDATE_PROFILE': {
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      };
    }

    case 'ADD_ADDRESS': {
      const newAddr = {
        ...action.payload,
        id: `addr-${Date.now()}`,
      };
      const updatedAddresses = action.payload.isDefault
        ? state.profile.addresses.map(a => ({ ...a, isDefault: false })).concat(newAddr)
        : [...state.profile.addresses, newAddr];

      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: updatedAddresses,
        },
      };
    }

    case 'EDIT_ADDRESS': {
      const updatedAddresses = state.profile.addresses.map(a => {
        if (a.id === action.payload.id) {
          return { ...a, ...action.payload };
        }
        if (action.payload.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });

      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: updatedAddresses,
        },
      };
    }

    case 'DELETE_ADDRESS': {
      return {
        ...state,
        profile: {
          ...state.profile,
          addresses: state.profile.addresses.filter(a => a.id !== action.payload),
        },
      };
    }

    default:
      return state;
  }
}

// ─── Context & Provider ──────────────────────────────────────────────────────
const EnterpriseContext = createContext(null);

export function EnterpriseProvider({ children }) {
  const [state, dispatch] = useReducer(enterpriseReducer, INITIAL_STATE);

  const resetDemoData     = useCallback(() => dispatch({ type: 'RESET_DEMO_DATA' }), []);
  const createRequirement = useCallback(req => dispatch({ type: 'CREATE_REQUIREMENT', payload: req }), []);
  const updateRequirement = useCallback(req => dispatch({ type: 'UPDATE_REQUIREMENT', payload: req }), []);
  const closeRequirement  = useCallback(id  => dispatch({ type: 'CLOSE_REQUIREMENT',  payload: id }),  []);
  const acceptBid         = useCallback((reqId, bidId, paymentMethod) => dispatch({ type: 'ACCEPT_BID', payload: { reqId, bidId, paymentMethod } }), []);
  const submitFarmerBid   = useCallback(bid => dispatch({ type: 'SUBMIT_FARMER_BID', payload: bid }), []);
  const updateOrderStatus = useCallback((orderId, status) => dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } }), []);
  const updateProfile     = useCallback(prof => dispatch({ type: 'UPDATE_PROFILE', payload: prof }), []);
  const addAddress        = useCallback(addr => dispatch({ type: 'ADD_ADDRESS', payload: addr }), []);
  const editAddress       = useCallback(addr => dispatch({ type: 'EDIT_ADDRESS', payload: addr }), []);
  const deleteAddress     = useCallback(id => dispatch({ type: 'DELETE_ADDRESS', payload: id }), []);

  // Helpers
  const getBidsForRequirement = useCallback((reqId) => {
    return state.bids.filter(b => b.requirementId === reqId);
  }, [state.bids]);

  const getOrdersForRequirement = useCallback((reqId) => {
    return state.orders.filter(o => o.requirementId === reqId);
  }, [state.orders]);

  const getRequirementById = useCallback((reqId) => {
    return state.requirements.find(r => r.id === reqId) || null;
  }, [state.requirements]);

  const getOrderById = useCallback((orderId) => {
    return state.orders.find(o => o.id === orderId) || null;
  }, [state.orders]);

  // Derived KPI metrics
  const activeRequirementsCount = state.requirements.filter(r => r.fulfillmentStatus === 'OPEN' || r.fulfillmentStatus === 'PARTIALLY_FULFILLED').length;
  const partiallyFulfilledCount = state.requirements.filter(r => r.fulfillmentStatus === 'PARTIALLY_FULFILLED').length;
  const pendingBidsCount = state.bids.filter(b => b.status === 'SUBMITTED' || b.status === 'Pending').length;
  const activeOrdersCount = state.orders.filter(o => o.status === 'Confirmed' || o.status === 'Packed' || o.status === 'Shipped').length;
  const completedRequirementsCount = state.requirements.filter(r => r.fulfillmentStatus === 'FULFILLED' || r.fulfillmentStatus === 'CLOSED').length;

  return (
    <EnterpriseContext.Provider value={{
      profile: state.profile,
      requirements: state.requirements,
      bids: state.bids,
      orders: state.orders,
      activeRequirementsCount,
      partiallyFulfilledCount,
      pendingBidsCount,
      activeOrdersCount,
      completedRequirementsCount,
      resetDemoData,
      createRequirement,
      updateRequirement,
      closeRequirement,
      acceptBid,
      submitFarmerBid,
      updateOrderStatus,
      updateProfile,
      addAddress,
      editAddress,
      deleteAddress,
      getBidsForRequirement,
      getOrdersForRequirement,
      getRequirementById,
      getOrderById,
    }}>
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useEnterprise() {
  const ctx = useContext(EnterpriseContext);
  if (!ctx) throw new Error('useEnterprise must be used inside EnterpriseProvider');
  return ctx;
}
