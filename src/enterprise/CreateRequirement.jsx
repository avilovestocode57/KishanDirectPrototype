// CreateRequirement.jsx — Screen 7: Create Bulk Requirement with Saved Delivery Addresses
import React, { useState } from 'react';
import { useEnterprise } from './EnterpriseContext';

const AGRI_PRODUCTS = [
  'Raw Tossa Jute (Grade TD-4)',
  'Swarna Paddy Rice',
  'Jyoti / Chandramukhi Potatoes',
  'Gobindobhog Aromatic Rice',
  'Himsagar Premium Mangoes',
  'Mustard Seeds (Yellow)',
  'Organic Royal Tomatoes',
  'Burdwan White Cauliflower',
  'Golden Maize (Corn)',
  'Brinjal (Kolkata Black)',
];

export default function CreateRequirement({ onNavigate, setSelectedReqId }) {
  const { createRequirement, profile } = useEnterprise();

  const todayStr = new Date().toISOString().split('T')[0];

  const hasAddresses = profile.addresses && profile.addresses.length > 0;
  const defaultAddr = hasAddresses ? (profile.addresses.find(a => a.isDefault) || profile.addresses[0]) : null;

  const [form, setForm] = useState({
    product: AGRI_PRODUCTS[0],
    requiredQuantity: 500,
    unit: 'quintal',
    quality: 'Grade A',
    targetPrice: 2500,
    selectedAddressId: defaultAddr ? defaultAddr.id : '',
    deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  const [error, setError] = useState('');
  const [successReq, setSuccessReq] = useState(null);

  // Selected address reference
  const selectedAddress = profile.addresses.find(a => a.id === form.selectedAddressId) || defaultAddr;

  // Dynamic live summary calculations
  const estimatedValue = (Number(form.requiredQuantity) || 0) * (Number(form.targetPrice) || 0);

  const handleSubmit = (status = 'OPEN') => {
    if (!form.product || !form.requiredQuantity || form.requiredQuantity <= 0) {
      setError('Please provide a valid agricultural product and required quantity.');
      return;
    }
    if (!selectedAddress) {
      setError('Please select a saved delivery address or add a new location in your Enterprise Profile.');
      return;
    }
    if (!form.deliveryDate) {
      setError('Please select a required delivery date.');
      return;
    }

    const newReq = {
      product: form.product,
      requiredQuantity: Number(form.requiredQuantity),
      allocatedQuantity: 0,
      remainingQuantity: Number(form.requiredQuantity),
      unit: form.unit,
      quality: form.quality,
      targetPrice: Number(form.targetPrice) || 0,
      deliveryAddressId: selectedAddress.id,
      deliveryAddress: selectedAddress,
      deliveryDate: form.deliveryDate,
      notes: form.notes,
      fulfillmentStatus: status === 'Draft' ? 'DRAFT' : 'OPEN',
      status: status === 'Draft' ? 'Draft' : 'Open for Bids',
    };

    createRequirement(newReq);
    setSuccessReq(newReq);
  };

  if (successReq) {
    return (
      <div style={{ padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div className="e-glass-card" style={{ maxWidth: 560, width: '100%', padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(132,230,132,0.15)', border: '1px solid #84e684', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#84e684' }}>check_circle</span>
          </div>

          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#d5e4f4', margin: '0 0 8px 0' }}>
              {successReq.fulfillmentStatus === 'DRAFT' ? 'Requirement Saved as Draft' : 'Bulk Requirement Published!'}
            </h2>
            <p style={{ fontSize: 14, color: '#becab9', margin: 0, lineHeight: 1.5 }}>
              {successReq.fulfillmentStatus === 'DRAFT'
                ? 'Your requirement draft has been saved. You can edit and post it anytime under Bulk Requirements.'
                : `Your bulk requirement for ${successReq.requiredQuantity} ${successReq.unit} of ${successReq.product} is now live for partial farmer bidding.`}
            </p>
          </div>

          <div style={{ background: 'rgba(16,47,49,0.5)', borderRadius: 8, padding: 16, width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            <div><strong style={{ color: '#84e684' }}>Product:</strong> {successReq.product}</div>
            <div><strong style={{ color: '#84e684' }}>Volume Required:</strong> {successReq.requiredQuantity} {successReq.unit} ({successReq.quality})</div>
            <div><strong style={{ color: '#84e684' }}>Target Price:</strong> ₹{successReq.targetPrice.toLocaleString()} / {successReq.unit}</div>
            <div><strong style={{ color: '#84e684' }}>Delivery Address:</strong> {successReq.deliveryAddress?.title} — {successReq.deliveryAddress?.street}, {successReq.deliveryAddress?.district}, West Bengal ({successReq.deliveryAddress?.pincode})</div>
            <div><strong style={{ color: '#84e684' }}>Estimated Value:</strong> ₹{(successReq.requiredQuantity * successReq.targetPrice).toLocaleString()}</div>
          </div>

          <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
            <button
              onClick={() => onNavigate('requirements')}
              className="e-btn-primary"
              style={{ flex: 1 }}>
              <span className="material-symbols-outlined">inventory_2</span> View Bulk Requirements
            </button>
            <button
              onClick={() => { setSuccessReq(null); setError(''); }}
              className="e-btn-ghost"
              style={{ flex: 1 }}>
              Create Another Requirement
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => onNavigate('requirements')}
            className="e-btn-ghost"
            style={{ marginBottom: 12, padding: '4px 10px', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Requirements
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
            Create Bulk Procurement Requirement
          </h1>
          <div style={{ fontSize: 12, color: '#becab9', marginTop: 4 }}>
            Post a bulk crop requirement with partial farmer bidding support
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: 14, background: 'rgba(248,113,113,0.15)', border: '1px solid #f87171', borderRadius: 8, color: '#f87171', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined">error</span> {error}
        </div>
      )}

      {/* Main Grid — Form + Live Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        
        {/* Form Inputs Panel */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
            Requirement Specifications
          </h2>

          {/* Product Select */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
              Agricultural Product / Crop *
            </label>
            <select
              className="e-select"
              value={form.product}
              onChange={e => setForm({ ...form, product: e.target.value })}>
              {AGRI_PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Quantity & Unit Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
                Required Quantity *
              </label>
              <input
                type="number"
                min="1"
                className="e-input"
                value={form.requiredQuantity}
                onChange={e => setForm({ ...form, requiredQuantity: e.target.value })}
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
                Unit *
              </label>
              <select
                className="e-select"
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}>
                <option value="kg">kg</option>
                <option value="quintal">quintal</option>
                <option value="tonne">tonne</option>
              </select>
            </div>
          </div>

          {/* Quality & Target Price Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
                Quality Grade
              </label>
              <select
                className="e-select"
                value={form.quality}
                onChange={e => setForm({ ...form, quality: e.target.value })}>
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Grade B">Grade B (Commercial)</option>
                <option value="Standard">Standard</option>
                <option value="Any Quality">Any Quality</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
                Target Price per {form.unit} (₹)
              </label>
              <input
                type="number"
                min="0"
                className="e-input"
                value={form.targetPrice}
                onChange={e => setForm({ ...form, targetPrice: e.target.value })}
                placeholder="e.g. 25"
              />
            </div>
          </div>

          {/* Saved Delivery Address Dropdown (Section 1) */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
              Delivery Address *
            </label>
            {hasAddresses ? (
              <select
                className="e-select"
                value={form.selectedAddressId}
                onChange={e => setForm({ ...form, selectedAddressId: e.target.value })}>
                {profile.addresses.map(addr => (
                  <option key={addr.id} value={addr.id}>
                    {addr.title} — {addr.street}, {addr.district}, {addr.state} ({addr.pincode}) {addr.isDefault ? '[Default]' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#f87171' }}>No delivery addresses saved.</span>
                <button type="button" className="e-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onNavigate('profile')}>
                  + Add Location
                </button>
              </div>
            )}
          </div>

          {/* Required Delivery Date */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
              Required Delivery Date *
            </label>
            <input
              type="date"
              min={todayStr}
              className="e-input"
              value={form.deliveryDate}
              onChange={e => setForm({ ...form, deliveryDate: e.target.value })}
            />
          </div>

          {/* Additional Requirements */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 6 }}>
              Additional Instructions / Specifications (Optional)
            </label>
            <textarea
              className="e-textarea"
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Packaging requirements, moisture limits, delivery hub inspection guidelines..."
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid #3f4a3d' }}>
            <button
              onClick={() => handleSubmit('OPEN')}
              className="e-btn-primary"
              style={{ flex: 2 }}>
              <span className="material-symbols-outlined">send</span> Post Requirement
            </button>

            <button
              onClick={() => handleSubmit('Draft')}
              className="e-btn-ghost"
              style={{ flex: 1 }}>
              Save Draft
            </button>
          </div>
        </div>

        {/* Live Summary Card (Section 13) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, borderLeft: '4px solid #84e684' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="e-badge e-badge-green">Live Summary Preview</span>
              <span style={{ fontSize: 11, color: '#becab9' }}>West Bengal Scope</span>
            </div>

            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#d5e4f4', margin: '0 0 4px 0' }}>
                {form.product}
              </h3>
              <div style={{ fontSize: 13, color: '#84e684', fontWeight: 700 }}>
                {form.requiredQuantity ? Number(form.requiredQuantity).toLocaleString() : 0} {form.unit} • {form.quality}
              </div>
            </div>

            <div style={{ background: 'rgba(16,47,49,0.5)', padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#becab9' }}>Target Price per {form.unit}:</span>
                <span style={{ fontWeight: 700, color: '#edc22b' }}>₹{Number(form.targetPrice || 0).toLocaleString()}</span>
              </div>
              
              {/* Full Address Display (Section 13) */}
              <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 8 }}>
                <div style={{ fontSize: 11, color: '#becab9', marginBottom: 2 }}>Delivery Address:</div>
                {selectedAddress ? (
                  <div style={{ fontSize: 13, color: '#d5e4f4', lineHeight: 1.4 }}>
                    <strong style={{ color: '#84e684' }}>{selectedAddress.title}</strong><br />
                    {selectedAddress.street},<br />
                    {selectedAddress.district}, {selectedAddress.state} — {selectedAddress.pincode}
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: '#f87171' }}>No address selected</span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4 }}>
                <span style={{ color: '#becab9' }}>Required Date:</span>
                <span style={{ fontWeight: 600, color: '#d5e4f4' }}>{form.deliveryDate}</span>
              </div>

              <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 10, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#d5e4f4' }}>Est. Procurement Value:</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#84e684' }}>₹{estimatedValue.toLocaleString()}</span>
              </div>
            </div>

            {form.notes && (
              <div style={{ fontSize: 12, color: '#becab9', fontStyle: 'italic', background: 'rgba(14,29,40,0.5)', padding: 12, borderRadius: 6 }}>
                "{form.notes}"
              </div>
            )}

            <div style={{ fontSize: 11, color: '#becab9', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#84e684' }}>info</span>
              Farmers can submit partial bids up to {form.requiredQuantity} {form.unit}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
