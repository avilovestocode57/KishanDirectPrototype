import React from 'react';
import { useFarmer, deriveStatus } from './FarmerContext';
import asset7 from '../assets/farmer-asset-7.png';

// ─── Status badge styling ──────────────────────────────────────────────────────
function statusBadgeClass(s) {
  if (s === 'New Order')        return 'bg-tertiary-container/20 text-tertiary-container border border-tertiary-container/30';
  if (s === 'Confirmed')        return 'bg-primary-container/20 text-primary border border-primary/30';
  if (s === 'Preparing')        return 'bg-secondary-container/20 text-secondary border border-secondary/30';
  if (s === 'Packed')           return 'bg-[#102F31] text-primary border border-primary/40';
  if (s === 'Delivered')        return 'bg-surface-container text-on-surface-variant border border-outline-variant/30';
  if (s === 'Declined')         return 'bg-error-container/20 text-error border border-error/30';
  if (s === 'Dispatched')       return 'bg-tertiary/20 text-tertiary border border-tertiary/30';
  if (s === 'Out for Delivery') return 'bg-secondary/20 text-secondary border border-secondary/30';
  return 'bg-surface-container border border-outline-variant';
}

// ─── Bid status badge ──────────────────────────────────────────────────────────
function bidBadgeClass(s) {
  if (s === 'Pending')  return 'bg-secondary-container/20 text-secondary border border-secondary/30';
  if (s === 'Accepted') return 'bg-primary-container/20 text-primary border border-primary/30';
  if (s === 'Rejected') return 'bg-error-container/20 text-error border border-error/30';
  if (s === 'Expired')  return 'bg-surface-container text-on-surface-variant border border-outline-variant/30';
  return 'bg-surface-container border border-outline-variant';
}

export default function FarmerDashboard({ onNavigate }) {
  const {
    products, orders, bids,
    activeProductCount, pendingOrderCount, totalStockKg, submittedBidsCount,
  } = useFarmer();

  const recentOrders = orders.slice(0, 3);
  const recentBids   = bids.slice(0, 3);

  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop pb-24 overflow-y-auto custom-scrollbar">

      {/* Page Header */}
      <div className="mb-stack_lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">
            Farmer Dashboard
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Welcome back, Ramesh • West Bengal Hub (Kolkata Region)
          </p>
        </div>
        <button onClick={() => onNavigate('add-product')}
          className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md font-bold hover:bg-primary-fixed-dim transition-colors flex items-center gap-2 glow-effect">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Listing
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">

        {/* Total Sales */}
        <div className="glass-panel p-stack_md rounded-xl flex flex-col justify-between col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Sales</span>
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
          </div>
          <div className="mt-4">
            <p className="text-headline-lg font-headline-lg text-on-surface font-bold">₹1,42,800</p>
            <p className="text-label-sm font-label-sm text-primary flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +14.2% this month
            </p>
          </div>
        </div>

        {/* Active Listings */}
        <div className="glass-panel p-stack_md rounded-xl flex flex-col justify-between col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Active Listings</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">inventory_2</span>
          </div>
          <div className="mt-4">
            <p className="text-headline-lg font-headline-lg text-on-surface font-bold">{activeProductCount} Products</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">{totalStockKg.toLocaleString()} kg total stock</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="glass-panel p-stack_md rounded-xl flex flex-col justify-between col-span-1 cursor-pointer hover:border-primary/30 border border-transparent transition-colors"
          onClick={() => onNavigate('orders')}>
          <div className="flex justify-between items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Pending Orders</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">shopping_bag</span>
          </div>
          <div className="mt-4">
            <p className="text-headline-lg font-headline-lg text-on-surface font-bold">{pendingOrderCount} Order{pendingOrderCount !== 1 ? 's' : ''}</p>
            <p className="text-label-sm font-label-sm text-secondary flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {pendingOrderCount} {pendingOrderCount === 1 ? 'requires action' : 'require action'}
            </p>
          </div>
        </div>

        {/* Submitted Bids */}
        <div className="glass-panel p-stack_md rounded-xl flex flex-col justify-between col-span-1 cursor-pointer hover:border-primary/30 border border-transparent transition-colors"
          onClick={() => onNavigate('enterprise')}>
          <div className="flex justify-between items-start">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Submitted Bids</span>
            <span className="material-symbols-outlined text-primary text-[20px]">gavel</span>
          </div>
          <div className="mt-4">
            <p className="text-headline-lg font-headline-lg text-on-surface font-bold">{submittedBidsCount} Bids</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">
              {bids.filter(b => b.status === 'Pending').length} awaiting response
            </p>
          </div>
        </div>

      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Left 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">

          {/* AI Insight Banner */}
          <div className="glassmorphism-card rounded-xl p-gutter relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                  <span className="text-label-sm font-label-sm text-primary uppercase font-bold tracking-wider">AI Demand Forecast Insight</span>
                </div>
                <h3 className="text-headline-md font-headline-md text-on-surface font-bold">
                  High Demand Surge Predicted for Potato & Rice
                </h3>
                <p className="text-body-md font-body-md text-on-surface-variant mt-1 max-w-xl">
                  Market demand in Kolkata & Howrah is forecasted to rise by 18.5% over the next 14 days.
                </p>
              </div>
              <button onClick={() => onNavigate('forecast')}
                className="bg-primary text-on-primary font-label-md font-bold px-5 py-3 rounded-lg hover:bg-primary-fixed-dim transition-colors shrink-0 flex items-center gap-2 glow-effect">
                Open AI Intelligence
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-panel rounded-xl p-stack_md flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
              <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Recent Orders</h3>
              <button onClick={() => onNavigate('orders')}
                className="text-primary text-label-md font-label-md hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {recentOrders.length === 0 && (
                <p className="text-on-surface-variant text-body-md text-center py-4">No orders yet.</p>
              )}
              {recentOrders.map(order => (
                <div key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-container/50 border border-outline-variant/30 cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => onNavigate('orders')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">shopping_bag</span>
                    </div>
                    <div>
                      <p className="text-label-md font-label-md text-on-surface font-bold">{order.product} ({order.quantity})</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">{order.buyerName} • {order.locationShort}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-label-md font-label-md text-secondary font-bold">₹{order.total.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass(order.status)}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Bids */}
          <div className="glass-panel rounded-xl p-stack_md flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
              <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Your Submitted Bids</h3>
              <button onClick={() => onNavigate('enterprise')}
                className="text-primary text-label-md font-label-md hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {bids.length === 0 ? (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-[36px] text-on-surface-variant block mb-2">gavel</span>
                <p className="text-on-surface-variant text-body-md">No bids submitted yet.</p>
                <button onClick={() => onNavigate('enterprise')}
                  className="mt-3 text-primary text-label-md hover:underline">
                  Browse Enterprise Requirements →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentBids.map(bid => (
                  <div key={bid.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-container/50 border border-outline-variant/30">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-label-md font-label-md text-on-surface font-bold truncate">{bid.requirementTitle}</p>
                      <p className="text-label-sm font-label-sm text-on-surface-variant">{bid.buyer} • {bid.quantityRequired}</p>
                      <p className="text-label-sm font-label-sm text-secondary font-bold">Your bid: ₹{Number(bid.bidPrice).toLocaleString()} {bid.priceUnit}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">{bid.submittedDate}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${bidBadgeClass(bid.status)}`}>{bid.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">

          {/* Storefront */}
          <div className="glass-panel p-stack_md rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Your Storefront</h3>
              <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary text-[10px] font-bold">PUBLIC</span>
            </div>
            <div className="h-32 rounded-lg overflow-hidden relative">
              <img src={asset7} alt="Shop Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-3">
                <p className="text-label-md font-label-md text-on-surface font-bold">Green Valley Organic Farm</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Nadia District, West Bengal</p>
              </div>
            </div>
            <button onClick={() => onNavigate('shop')}
              className="w-full py-2.5 rounded-lg border border-primary text-primary font-label-md hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              Manage Storefront
            </button>
          </div>

          {/* Enterprise Quick Access */}
          <div className="glass-panel p-stack_md rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Enterprise Bids</h3>
              <span className="px-2 py-0.5 rounded bg-secondary-container/20 text-secondary text-[10px] font-bold">WEST BENGAL</span>
            </div>
            <div className="p-3 rounded-lg bg-surface-container/50 border border-outline-variant/30 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-label-md font-label-md text-on-surface font-bold">Raw Jute (Grade A)</span>
                <span className="text-secondary font-bold">₹7,200 / Quintal</span>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Bengal Textiles Ltd, Kolkata</p>
              <p className="text-label-sm font-label-sm text-primary">Required: 5,000 Quintals</p>
            </div>
            <button onClick={() => onNavigate('enterprise')}
              className="w-full py-2.5 rounded-lg bg-surface-container-high text-on-surface font-label-md hover:text-primary border border-outline-variant transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">business_center</span>
              View All Open Bids
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
