// EnterpriseRequirements.jsx — Farmer View for Enterprise Requirements & Bulk Bidding
import React, { useState } from 'react';
import { useFarmer } from './FarmerContext';

// ─── Seed Requirements for Farmer View ─────────────────────────────────────────
const INITIAL_FARMER_REQUIREMENTS = [
  {
    id: 'REQ-701',
    badge: 'High Volume Contract',
    badgeClass: 'bg-primary-container/20 text-primary border border-primary/30',
    borderColor: 'border-primary',
    title: 'Raw Tossa Jute (Grade TD-4)',
    buyer: 'Bengal Agro Processing & Wholesale Ltd',
    location: 'Kolkata, West Bengal',
    price: '₹72', priceUnit: 'per kg',
    priceVal: 72,
    unit: 'kg',
    description: 'Procuring high-strength natural jute fibers for industrial sack manufacturing. Flexible delivery timelines at Kolkata hub.',
    requiredQuantity: 180,
    allocatedQuantity: 0,
    remainingQuantity: 180,
    totalReq: '180 kg', minBid: '20 kg', deadline: 'Nov 30, 2026', hub: 'Kolkata Port Depot',
    defaultOffer: '60', defaultPrice: '70', defaultHub: 'Kolkata Port Depot, West Bengal',
  },
  {
    id: 'REQ-702',
    badge: 'Bulk Grain Procurement',
    badgeClass: 'bg-tertiary-container/20 text-tertiary-container border border-tertiary-container/30',
    borderColor: 'border-tertiary',
    title: 'Swarna Paddy Rice',
    buyer: 'Bengal Agro Processing & Wholesale Ltd',
    location: 'Howrah, West Bengal',
    price: '₹30', priceUnit: 'per kg',
    priceVal: 30,
    unit: 'kg',
    description: 'Looking for freshly harvested Swarna variety paddy rice from Bardhaman and Hooghly farmers. Quality inspection at gate.',
    requiredQuantity: 150,
    allocatedQuantity: 0,
    remainingQuantity: 150,
    totalReq: '150 kg', minBid: '20 kg', deadline: 'Dec 15, 2026', hub: 'Howrah Mandi Yard',
    defaultOffer: '50', defaultPrice: '29', defaultHub: 'Howrah Mandi Yard, West Bengal',
  },
  {
    id: 'REQ-703',
    badge: 'Processing Quality',
    badgeClass: 'bg-secondary-container/20 text-secondary border border-secondary/30',
    borderColor: 'border-secondary',
    title: 'Jyoti / Chandramukhi Potatoes',
    buyer: 'Bengal Agro Processing & Wholesale Ltd',
    location: 'Hooghly, West Bengal',
    price: '₹24', priceUnit: 'per kg',
    priceVal: 24,
    unit: 'kg',
    description: 'Urgent requirement for cold-storage ready potatoes. Direct farm pickup for lots above 30 kg.',
    requiredQuantity: 120,
    allocatedQuantity: 40,
    remainingQuantity: 80,
    totalReq: '120 kg', minBid: '15 kg', deadline: 'Nov 20, 2026', hub: 'Dankuni Cold Storage',
    defaultOffer: '30', defaultPrice: '23', defaultHub: 'Dankuni Cold Storage, West Bengal',
  },
];

function bidBadgeClass(s) {
  if (s === 'Pending' || s === 'SUBMITTED') return 'bg-secondary-container/20 text-secondary border border-secondary/30';
  if (s === 'Accepted' || s === 'ACCEPTED' || s === 'PARTIALLY_ACCEPTED') return 'bg-primary-container/20 text-primary border border-primary/30';
  if (s === 'Rejected' || s === 'REJECTED') return 'bg-error-container/20 text-error border border-error/30';
  return 'bg-surface-container border border-outline-variant';
}

function RequirementCard({ req, existingBid, isSelected, onSelect }) {
  const pct = Math.min(100, Math.round((req.allocatedQuantity / (req.requiredQuantity || 1)) * 100));

  return (
    <div
      className={`glass-panel rounded-xl p-stack_md flex flex-col gap-4 border-l-4 ${req.borderColor} cursor-pointer transition-all ${isSelected ? 'ring-1 ring-primary/40' : 'hover:ring-1 hover:ring-outline-variant/50'}`}
      onClick={() => onSelect(req)}>

      <div className="flex justify-between items-start">
        <div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${req.badgeClass}`}>{req.badge}</span>
          <h2 className="text-headline-md font-headline-md text-on-surface font-bold mt-1">{req.title}</h2>
          <p className="text-label-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">domain</span> {req.buyer} • {req.location}
          </p>
        </div>
        <div className="text-right shrink-0 ml-3">
          <p className="text-headline-md font-headline-md text-secondary font-bold">{req.price}</p>
          <p className="text-label-sm text-on-surface-variant">{req.priceUnit}</p>
        </div>
      </div>

      <p className="text-body-md text-on-surface-variant">{req.description}</p>

      {/* Quantity & Remaining Progress Bar */}
      <div className="p-3 rounded-lg bg-surface-container/50 flex flex-col gap-2">
        <div className="flex justify-between text-label-sm font-bold">
          <span className="text-on-surface">{req.allocatedQuantity.toLocaleString()} {req.unit} allocated</span>
          <span className="text-secondary">{req.remainingQuantity.toLocaleString()} {req.unit} remaining</span>
        </div>
        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-surface-container/30 text-center">
        <div><p className="text-label-sm text-on-surface-variant">Required</p><p className="text-body-md font-bold text-on-surface">{req.requiredQuantity.toLocaleString()} {req.unit}</p></div>
        <div><p className="text-label-sm text-on-surface-variant">Remaining</p><p className="text-body-md font-bold text-secondary">{req.remainingQuantity.toLocaleString()} {req.unit}</p></div>
        <div><p className="text-label-sm text-on-surface-variant">Deadline</p><p className="text-body-md font-bold text-on-surface">{req.deadline}</p></div>
        <div><p className="text-label-sm text-on-surface-variant">Hub</p><p className="text-body-md font-bold text-primary">{req.hub}</p></div>
      </div>

      <div className="flex items-center justify-between">
        <button className="text-primary text-label-md font-bold hover:underline flex items-center gap-1"
          onClick={e => { e.stopPropagation(); onSelect(req); }}>
          {existingBid ? 'View Submitted Bid' : 'Submit Partial Supply Bid'} <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
        {existingBid && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bidBadgeClass(existingBid.status)}`}>
            Bid: {existingBid.bidQty || existingBid.quantityRequired} {req.unit} @ ₹{Number(existingBid.bidPrice).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

function BidPanel({ req, existingBid, onSubmit }) {
  const [form, setForm] = useState({ qty: req.defaultOffer, price: req.defaultPrice, hub: req.defaultHub });
  const [error, setError] = useState('');

  React.useEffect(() => {
    setForm({ qty: req.defaultOffer, price: req.defaultPrice, hub: req.defaultHub });
    setError('');
  }, [req.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bidQtyNum = Number(form.qty);

    if (bidQtyNum > req.remainingQuantity) {
      setError(`Only ${req.remainingQuantity.toLocaleString()} ${req.unit} is remaining for this requirement.`);
      return;
    }

    if (bidQtyNum <= 0) {
      setError('Please enter a valid supply quantity.');
      return;
    }

    setError('');
    onSubmit({
      requirementId: req.id,
      requirementTitle: req.title,
      buyer: req.buyer,
      location: req.location,
      quantityRequired: `${bidQtyNum} ${req.unit}`,
      bidQty: bidQtyNum,
      unit: req.unit,
      bidPrice: form.price,
      priceUnit: req.priceUnit,
    });
  };

  return (
    <div className="glass-panel rounded-xl p-stack_md flex flex-col gap-4 sticky top-4">
      <h3 className="text-headline-md font-headline-md text-on-surface font-bold border-b border-outline-variant/30 pb-3">
        {existingBid ? 'Your Submitted Bid' : 'Submit Partial Supply Bid'}
      </h3>

      <p className="text-label-sm text-on-surface-variant">
        Responding to: <strong className="text-primary">{req.title}</strong>
      </p>

      {error && (
        <div className="p-3 rounded-lg bg-error-container/20 border border-error/30 text-error text-label-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      {existingBid ? (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-lg bg-[#102F31] border border-primary/30 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">gavel</span>
              <span className="text-label-md font-label-md text-primary font-bold uppercase tracking-wider">Bid Submitted</span>
              <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${bidBadgeClass(existingBid.status)}`}>{existingBid.status}</span>
            </div>
            <div>
              <p className="text-headline-lg font-headline-lg text-on-surface font-bold">₹{Number(existingBid.bidPrice).toLocaleString()}</p>
              <p className="text-label-md text-on-surface-variant">{existingBid.priceUnit}</p>
            </div>
            <div className="border-t border-outline-variant/20 pt-3 flex flex-col gap-1 text-label-sm text-on-surface-variant">
              <p>Submitted Date: <strong className="text-on-surface">{existingBid.submittedDate}</strong></p>
              <p>Supply Offered: <strong className="text-on-surface">{existingBid.bidQty || existingBid.quantityRequired}</strong></p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 text-label-sm text-on-surface-variant flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] mt-0.5 text-secondary">info</span>
            You have already submitted a bid for this requirement. Farmers are limited to one bid per requirement.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-label-sm font-label-sm text-on-surface-variant">Supply Quantity ({req.unit}) *</label>
              <span className="text-label-sm text-secondary font-bold">Max: {req.remainingQuantity} {req.unit}</span>
            </div>
            <input
              type="number"
              min="1"
              max={req.remainingQuantity}
              value={form.qty}
              onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Bid Price per {req.unit} (₹) *</label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Delivery Hub in WB</label>
            <input
              type="text"
              value={form.hub}
              onChange={e => setForm(f => ({ ...f, hub: e.target.value }))}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-3 text-body-md text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-primary text-on-primary-fixed font-label-md font-bold hover:bg-primary-fixed-dim transition-colors glow-effect flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">send</span>
            Submit Supply Proposal
          </button>
        </form>
      )}
    </div>
  );
}

function SubmittedBidsTable({ bids, onViewRequirement }) {
  if (bids.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant block mb-3">gavel</span>
        <p className="text-body-md text-on-surface-variant">No bids submitted yet.</p>
        <p className="text-label-sm text-on-surface-variant mt-1">Open a requirement above and submit your proposal.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-4 border-b border-outline-variant/30">
        <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Submitted Bids</h3>
        <p className="text-label-sm text-on-surface-variant mt-1">{bids.length} bid{bids.length !== 1 ? 's' : ''} submitted</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-surface-container-high border-b border-outline-variant/30">
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium">Requirement</th>
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium">Buyer</th>
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium">Quantity</th>
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium">Your Bid</th>
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium">Submitted</th>
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium">Status</th>
              <th className="p-4 text-label-sm font-label-sm text-on-surface-variant font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {bids.map(bid => (
              <tr key={bid.id} className="hover:bg-surface-container/40 transition-colors">
                <td className="p-4">
                  <p className="text-label-md font-label-md text-on-surface font-bold">{bid.requirementTitle}</p>
                </td>
                <td className="p-4 text-label-md font-label-md text-on-surface-variant">{bid.buyer}</td>
                <td className="p-4 text-label-md font-label-md text-on-surface-variant">{bid.bidQty || bid.quantityRequired}</td>
                <td className="p-4 text-secondary font-bold">₹{Number(bid.bidPrice).toLocaleString()} <span className="text-on-surface-variant font-normal text-label-sm">{bid.priceUnit}</span></td>
                <td className="p-4 text-label-md font-label-md text-on-surface-variant">{bid.submittedDate}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${bidBadgeClass(bid.status)}`}>{bid.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => onViewRequirement(bid.requirementId)}
                    className="text-primary text-label-sm font-bold hover:underline flex items-center gap-1 ml-auto">
                    View <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EnterpriseRequirements() {
  const { bids, submitBid, getBidForRequirement } = useFarmer();
  const [requirements] = useState(INITIAL_FARMER_REQUIREMENTS);

  const availableRequirements = requirements.filter(r => r.remainingQuantity > 0);

  const [selectedReq, setSelectedReq] = useState(availableRequirements[0] || null);
  const [toast, setToast]             = useState('');
  const [activeTab, setActiveTab]     = useState('requirements');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleSubmit = (bidData) => {
    submitBid(bidData);
    showToast('Bid proposal submitted! The enterprise buyer will review your offer.');
  };

  const handleViewRequirement = (reqId) => {
    const req = requirements.find(r => r.id === reqId);
    if (req) { setSelectedReq(req); setActiveTab('requirements'); }
  };

  const existingBid = selectedReq ? getBidForRequirement(selectedReq.id) : null;

  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop pb-24 overflow-y-auto custom-scrollbar">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container-low border border-primary text-primary px-5 py-3 rounded-xl shadow-xl font-bold text-label-md flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined">check_circle</span>{toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-stack_lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-1">
            Enterprise Requirements & Bulk Bidding
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Direct bulk procurement from verified enterprise buyers in West Bengal.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-secondary-container/20 border border-secondary/30 text-secondary text-label-sm font-bold flex items-center gap-1 w-fit">
          <span className="material-symbols-outlined text-[16px]">verified</span> Verified WB Enterprises
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-outline-variant/30 pb-0">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-5 py-3 text-label-md font-label-md transition-colors border-b-2 -mb-px ${activeTab === 'requirements' ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-on-surface'}`}>
          Open Requirements ({availableRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`px-5 py-3 text-label-md font-label-md transition-colors border-b-2 -mb-px ${activeTab === 'submitted' ? 'text-primary border-primary font-bold' : 'text-on-surface-variant border-transparent hover:text-on-surface'}`}>
          Submitted Bids ({bids.length})
        </button>
      </div>

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Cards */}
          <div className="lg:col-span-8 flex flex-col gap-gutter">
            {availableRequirements.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant">
                No active bulk requirements available for bidding at the moment.
              </div>
            ) : (
              availableRequirements.map(req => (
                <RequirementCard
                  key={req.id}
                  req={req}
                  existingBid={getBidForRequirement(req.id)}
                  isSelected={selectedReq?.id === req.id}
                  onSelect={setSelectedReq}
                />
              ))
            )}
          </div>

          {/* Bid Panel */}
          <div className="lg:col-span-4">
            {selectedReq && (
              <BidPanel
                key={selectedReq.id}
                req={selectedReq}
                existingBid={existingBid}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      )}

      {/* Submitted Bids Tab */}
      {activeTab === 'submitted' && (
        <SubmittedBidsTable bids={bids} onViewRequirement={handleViewRequirement} />
      )}

    </div>
  );
}
