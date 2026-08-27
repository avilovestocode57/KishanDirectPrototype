import React, { useState, useCallback } from 'react';
import { useFarmer, ORDER_TRANSITIONS, FARMER_STATUSES } from './FarmerContext';
import asset17 from '../assets/farmer-asset-17.png';
import asset18 from '../assets/farmer-asset-18.png';
import asset19 from '../assets/farmer-asset-19.png';
import asset20 from '../assets/farmer-asset-20.png';
import asset21 from '../assets/farmer-asset-21.png';

const ORDER_IMAGES = { 17: asset17, 18: asset18, 19: asset19, 20: asset20, 21: asset21 };

// ─── Badge styling ──────────────────────────────────────────────────────────────
function statusBadgeClass(s) {
  if (s === 'New Order')        return 'bg-tertiary-container/20 text-tertiary-container border border-tertiary-container/30';
  if (s === 'Confirmed')        return 'bg-primary-container/20 text-primary border border-primary/30';
  if (s === 'Preparing')        return 'bg-secondary-container/20 text-secondary border border-secondary/30';
  if (s === 'Packed')           return 'bg-[#102F31] text-primary border border-primary/40';
  if (s === 'Dispatched')       return 'bg-tertiary/20 text-tertiary border border-tertiary/30';
  if (s === 'Out for Delivery') return 'bg-secondary/20 text-secondary border border-secondary/30';
  if (s === 'Delivered')        return 'bg-surface-container text-on-surface-variant border border-outline-variant/30';
  if (s === 'Declined')         return 'bg-error-container/20 text-error border border-error/30';
  return 'bg-surface-container border border-outline-variant';
}

// ─── Order Progress Indicator ──────────────────────────────────────────────────
const STEPS = ['New Order', 'Confirmed', 'Preparing', 'Packed'];
function OrderProgress({ status }) {
  const idx = STEPS.indexOf(status);
  if (idx < 0 || status === 'Declined') return null;
  return (
    <div className="flex items-center gap-1 my-3">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`flex flex-col items-center flex-1 text-center ${i <= idx ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${i < idx ? 'bg-primary text-on-primary' : i === idx ? 'bg-primary text-on-primary ring-2 ring-primary/30' : 'bg-surface-container border border-outline-variant text-on-surface-variant'}`}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] leading-tight ${i === idx ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 max-w-[24px] ${i < idx ? 'bg-primary' : 'bg-outline-variant/30'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Action Panel ──────────────────────────────────────────────────────────────
function OrderActions({ order, onAction, onDecline, isSimulating }) {
  const t = ORDER_TRANSITIONS[order.status];

  if (!t) return null;

  if (order.status === 'Packed') {
    return (
      <div className="p-4 rounded-lg bg-[#102F31] border border-primary/30 flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">local_shipping</span>
        <div>
          <p className="text-label-md font-label-md text-primary font-bold">Ready for Admin Dispatch</p>
          <p className="text-label-sm text-on-surface-variant mt-1">Order packed and ready for KisanDirect delivery handoff.</p>
        </div>
      </div>
    );
  }

  if (order.status === 'Declined') {
    return <p className="text-center text-on-surface-variant text-label-md py-2">Order is <strong className="text-error">Declined</strong>.</p>;
  }

  if (order.status === 'Delivered' || order.status === 'Dispatched' || order.status === 'Out for Delivery') {
    return <p className="text-center text-on-surface-variant text-label-md py-2">Status: <strong className="text-on-surface">{order.status}</strong> (handled by Admin)</p>;
  }

  return (
    <div className="flex gap-3 flex-col">
      {/* Simulate button */}
      {FARMER_STATUSES.includes(order.status) && order.status !== 'Packed' && (
        <button
          onClick={() => onAction('simulate')}
          disabled={isSimulating}
          className="w-full py-2.5 rounded-lg border border-outline-variant text-on-surface-variant text-label-md hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          <span className="material-symbols-outlined text-[18px]">fast_forward</span>
          {isSimulating ? 'Simulating…' : 'Simulate All Steps'}
        </button>
      )}

      <div className="flex gap-3">
        {t.decline && (
          <button onClick={onDecline}
            className="flex-1 px-4 py-3 rounded-lg border border-error text-error text-label-md font-label-md hover:bg-error/10 transition-colors">
            Decline Order
          </button>
        )}
        {t.action && (
          <button onClick={() => onAction('next')}
            className="flex-1 px-4 py-3 rounded-lg bg-primary text-on-primary-fixed text-label-md font-label-md glow-effect font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            <span className="material-symbols-outlined text-[20px]">check</span> {t.action}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Orders({ onNavigate }) {
  const { orders, updateOrderStatus, pendingOrderCount } = useFarmer();
  const [selectedId,  setSelectedId]   = useState(orders[0]?.id || null);
  const [tab,         setTab]          = useState('consumer');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLabel,    setSimLabel]     = useState('');

  const selected = orders.find(o => o.id === selectedId) || orders[0];

  // ── Simulate farmer steps with delay ────────────────────────────────────────
  const simulateSteps = useCallback(async (orderId, fromStatus) => {
    const farmerPath = {
      'New Order': ['Confirmed', 'Preparing', 'Packed'],
      'Confirmed': ['Preparing', 'Packed'],
      'Preparing': ['Packed'],
      'Packed': [],
    };
    const steps = farmerPath[fromStatus] || [];
    if (steps.length === 0) {
      setSimLabel('Order is already packed and ready for handoff.');
      setTimeout(() => setSimLabel(''), 2500);
      return;
    }
    setIsSimulating(true);
    for (const step of steps) {
      const labels = { 'Confirmed': 'Confirming…', 'Preparing': 'Preparing…', 'Packed': 'Packing…' };
      setSimLabel(labels[step] || step);
      await new Promise(r => setTimeout(r, 750));
      updateOrderStatus(orderId, step);
    }
    setSimLabel('Packed ✓  Ready for Admin Dispatch');
    setIsSimulating(false);
    setTimeout(() => setSimLabel(''), 3000);
  }, [updateOrderStatus]);

  const handleAction = (type) => {
    if (!selected) return;
    if (type === 'next') {
      const next = ORDER_TRANSITIONS[selected.status]?.next;
      if (next) updateOrderStatus(selected.id, next);
    } else if (type === 'simulate') {
      simulateSteps(selected.id, selected.status);
    }
  };

  const handleDecline = () => {
    if (selected) updateOrderStatus(selected.id, 'Declined');
  };

  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop pb-24 overflow-y-auto custom-scrollbar">

      {/* Header */}
      <div className="mb-stack_lg">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-1">Orders Management</h1>
        <p className="text-body-md font-body-md text-on-surface-variant">Manage incoming buyer orders across West Bengal markets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* ── Orders List ── */}
        <div className="lg:col-span-8 flex flex-col gap-stack_md">

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-outline-variant/30 pb-3">
            <div className="flex gap-4">
              <button onClick={() => setTab('consumer')}
                className={`text-label-md font-label-md pb-2 transition-colors ${tab === 'consumer' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                Consumer Orders
              </button>
              <button onClick={() => setTab('enterprise')}
                className={`text-label-md font-label-md pb-2 transition-colors ${tab === 'enterprise' ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}`}>
                Enterprise Orders
              </button>
            </div>
            <div className="text-label-sm text-on-surface-variant">
              {pendingOrderCount} pending action{pendingOrderCount !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Table */}
          <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline-variant/30 bg-surface-container/50 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
              <div className="col-span-2">Order ID</div>
              <div className="col-span-3">Product</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-3">Buyer / Location</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {orders.map(order => (
              <div key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`grid grid-cols-12 gap-4 p-4 cursor-pointer transition-colors border-b border-outline-variant/20 items-center ${
                  selectedId === order.id ? 'border-l-4 border-primary bg-surface-container-high' : 'hover:bg-surface-container/50'
                } ${['Delivered', 'Declined'].includes(order.status) ? 'opacity-60' : ''}`}>
                <div className="col-span-2 text-label-md font-label-md text-on-surface font-bold">#{order.id}</div>
                <div className="col-span-3 flex items-center gap-3">
                  <img src={ORDER_IMAGES[order.imageIndex] || asset17} alt={order.product}
                    className="w-8 h-8 rounded border border-outline-variant object-cover shrink-0" />
                  <span className="text-label-md font-label-md text-on-surface truncate">{order.product.split('(')[0].trim()}</span>
                </div>
                <div className="col-span-2 text-body-md text-on-surface-variant font-medium">{order.quantity}</div>
                <div className="col-span-3 flex flex-col">
                  <span className="text-label-md font-label-md text-on-surface truncate">{order.buyerName}</span>
                  <span className="text-label-sm font-label-sm text-on-surface-variant truncate">{order.locationShort}</span>
                </div>
                <div className="col-span-2 flex justify-end">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase whitespace-nowrap ${statusBadgeClass(order.status)}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail Panel ── */}
        {selected && (
          <div className="lg:col-span-4">
            <div className="glass-panel rounded-xl flex flex-col sticky top-4">

              {/* Header */}
              <div className="p-stack_md border-b border-outline-variant/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Order Detail</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusBadgeClass(selected.status)}`}>{selected.status}</span>
                </div>
                <h2 className="text-headline-md font-headline-md text-on-surface font-bold">#{selected.id}</h2>
                <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span> {selected.date}
                </p>
                {/* Progress */}
                <OrderProgress status={selected.status} />
              </div>

              {/* Content */}
              <div className="p-stack_md flex flex-col gap-stack_lg overflow-y-auto max-h-[55vh]">

                {/* Sim label */}
                {simLabel && selectedId === selected.id && (
                  <div className="p-3 rounded-lg bg-primary-container/20 border border-primary/30 text-primary text-label-md font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>{simLabel}
                  </div>
                )}

                {/* Product */}
                <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/30 flex items-start gap-4">
                  <img src={ORDER_IMAGES[selected.imageIndex] || asset21} alt="Produce"
                    className="w-16 h-16 rounded-lg object-cover border border-outline-variant shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-label-md font-label-md text-on-surface font-bold mb-1">{selected.product}</h3>
                    <div className="flex justify-between items-center text-body-md text-on-surface-variant">
                      <span>{selected.quantity} @ ₹{selected.pricePerUnit}/kg</span>
                      <span className="text-secondary font-bold">₹{selected.subtotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Buyer */}
                <div>
                  <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Buyer Information</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p className="text-label-md font-label-md text-on-surface font-bold">{selected.buyerName}</p>
                      <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">call</span> {selected.buyerPhone}
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/30 text-body-md text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] mt-0.5">location_on</span>
                    <span>{selected.buyerAddress}</span>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Payment Summary</h3>
                  <div className="flex flex-col gap-2 text-body-md text-on-surface-variant">
                    <div className="flex justify-between"><span>Subtotal</span><span>₹{selected.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Logistics & Handling</span><span>₹{selected.logisticsHandling}</span></div>
                    <div className="flex justify-between text-primary font-medium"><span>Platform Subvention</span><span>- ₹{selected.platformSubvention}</span></div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-outline-variant/30">
                      <span className="text-label-md font-label-md text-on-surface font-bold">Total Estimation</span>
                      <span className="text-secondary font-bold">₹{selected.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="p-stack_md border-t border-outline-variant/30 bg-surface-container/30">
                <OrderActions
                  order={selected}
                  onAction={handleAction}
                  onDecline={handleDecline}
                  isSimulating={isSimulating}
                />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
