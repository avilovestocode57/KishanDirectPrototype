// RequirementDetailsBids.jsx — Screen 4: Requirement Details & Mock Payment Bid Acceptance
import React, { useState } from 'react';
import { useEnterprise } from './EnterpriseContext';

export default function RequirementDetailsBids({ reqId, onNavigate, setSelectedOrderId }) {
  const {
    getRequirementById,
    getBidsForRequirement,
    getOrdersForRequirement,
    acceptBid,
    closeRequirement,
  } = useEnterprise();

  const req = getRequirementById(reqId);
  const bids = getBidsForRequirement(reqId);
  const relatedOrders = getOrdersForRequirement(reqId);

  const [selectedBidForAccept, setSelectedBidForAccept] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'Net Banking' | 'Wallet'
  const [upiId, setUpiId] = useState('demo@upi');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');

  if (!req) {
    return (
      <div style={{ padding: 40, color: '#becab9' }}>
        Requirement not found. Return to Bulk Requirements.
      </div>
    );
  }

  const reqQty = req.requiredQuantity || req.quantity || 0;
  const allocQty = req.allocatedQuantity || 0;
  const remQty = req.remainingQuantity !== undefined ? req.remainingQuantity : (reqQty - allocQty);
  const pct = Math.min(100, Math.round((allocQty / (reqQty || 1)) * 100));

  // Calculates exact quantity to accept automatically (Section 1 & 5)
  const getAutoAcceptQuantity = (bid) => {
    if (!bid || remQty <= 0) return 0;
    const unacceptedInBid = bid.bidQuantity - (bid.acceptedQuantity || 0);
    return Math.min(unacceptedInBid, remQty);
  };

  const handleOpenAcceptModal = (bid) => {
    setSelectedBidForAccept(bid);
  };

  const handleConfirmPay = (e) => {
    e.preventDefault();
    if (selectedBidForAccept) {
      acceptBid(req.id, selectedBidForAccept.id, `Mock Payment (${paymentMethod})`);
      setSelectedBidForAccept(null);
    }
  };

  const handleTrackOrder = (orderId) => {
    setSelectedOrderId(orderId);
    onNavigate('order_tracking');
  };

  // Values for the open modal
  const modalAcceptQty = selectedBidForAccept ? getAutoAcceptQuantity(selectedBidForAccept) : 0;
  const modalTotalCost = selectedBidForAccept ? modalAcceptQty * selectedBidForAccept.price : 0;
  const modalRemainingAfter = Math.max(0, remQty - modalAcceptQty);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Back Button & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button
            onClick={() => onNavigate('requirements')}
            className="e-btn-ghost"
            style={{ marginBottom: 12, padding: '4px 10px', fontSize: 12 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Requirements
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
              {req.product}
            </h1>
            <span className="e-badge e-badge-green">{req.id}</span>
          </div>
        </div>

        {req.fulfillmentStatus === 'OPEN' || req.fulfillmentStatus === 'PARTIALLY_FULFILLED' ? (
          <button
            onClick={() => closeRequirement(req.id)}
            className="e-btn-ghost"
            style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}>
            Close Requirement
          </button>
        ) : (
          <span className="e-badge e-badge-blue">{req.fulfillmentStatus}</span>
        )}
      </div>

      {/* Main Grid: Spec Card + Quantity Fulfillment Header Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        
        {/* Requirement Specs Details */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '4px solid #84e684' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 10 }}>
            Requirement Specifications
          </h2>

          <div style={{ background: 'rgba(16,47,49,0.5)', padding: 14, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div><strong style={{ color: '#84e684' }}>Required Volume:</strong> {reqQty.toLocaleString()} {req.unit} ({req.quality})</div>
            <div><strong style={{ color: '#84e684' }}>Target Price:</strong> ₹{Number(req.targetPrice || 0).toLocaleString()} / {req.unit}</div>
            <div><strong style={{ color: '#84e684' }}>Delivery Address:</strong> {req.deliveryAddress?.title} ({req.deliveryAddress?.district}, WB)</div>
            <div><strong style={{ color: '#84e684' }}>Required Date:</strong> {req.deliveryDate}</div>
            <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 6, color: '#edc22b', fontWeight: 700 }}>
              Max Est. Budget: ₹{(reqQty * req.targetPrice).toLocaleString()}
            </div>
          </div>

          {req.notes && (
            <div style={{ fontSize: 12, color: '#becab9', fontStyle: 'italic', background: 'rgba(14,29,40,0.5)', padding: 12, borderRadius: 6 }}>
              "{req.notes}"
            </div>
          )}
        </div>

        {/* Quantity Fulfillment Progress Indicator (Section 3 & 4) */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '4px solid #edc22b' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 10 }}>
            QUANTITY FULFILLMENT STATUS
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, textAlign: 'center' }}>
            <div style={{ background: 'rgba(16,47,49,0.5)', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#becab9' }}>Required</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', marginTop: 2 }}>{reqQty.toLocaleString()} <span style={{ fontSize: 11 }}>{req.unit}</span></div>
            </div>

            <div style={{ background: 'rgba(132,230,132,0.12)', padding: 12, borderRadius: 8, border: '1px solid rgba(132,230,132,0.3)' }}>
              <div style={{ fontSize: 11, color: '#84e684' }}>Allocated</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#84e684', marginTop: 2 }}>{allocQty.toLocaleString()} <span style={{ fontSize: 11 }}>{req.unit}</span></div>
            </div>

            <div style={{ background: remQty > 0 ? 'rgba(237,194,43,0.12)' : 'rgba(56,189,248,0.12)', padding: 12, borderRadius: 8, border: remQty > 0 ? '1px solid rgba(237,194,43,0.3)' : '1px solid rgba(56,189,248,0.3)' }}>
              <div style={{ fontSize: 11, color: remQty > 0 ? '#edc22b' : '#38bdf8' }}>Remaining</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: remQty > 0 ? '#edc22b' : '#38bdf8', marginTop: 2 }}>{remQty.toLocaleString()} <span style={{ fontSize: 11 }}>{req.unit}</span></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#d5e4f4' }}>
              <span>Progress</span>
              <span>{allocQty.toLocaleString()} / {reqQty.toLocaleString()} {req.unit} fulfilled ({pct}%)</span>
            </div>
            <div style={{ height: 10, background: '#102F31', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: pct === 100 ? 'linear-gradient(90deg, #38bdf8, #84e684)' : 'linear-gradient(90deg, #edc22b, #84e684)',
                borderRadius: 99,
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Farmer Bids Section */}
      <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
              Submitted Farmer Bids ({bids.length})
            </h2>
            <div style={{ fontSize: 12, color: '#becab9', marginTop: 2 }}>
              Accept farmer bids to allocate quantity towards your {reqQty.toLocaleString()} {req.unit} requirement.
            </div>
          </div>
        </div>

        {bids.length === 0 ? (
          <div style={{ padding: 36, textAlign: 'center', color: '#becab9' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#3f4a3d', marginBottom: 6, display: 'block' }}>gavel</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#d5e4f4' }}>No farmer bids submitted yet</div>
            <div style={{ fontSize: 12, marginTop: 2 }}>Verified West Bengal farmers will submit bids for your requirement.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bids.map(bid => {
              const autoAcceptQty = getAutoAcceptQuantity(bid);
              const isFullyAccepted = bid.status === 'ACCEPTED';
              const isPartiallyAccepted = bid.status === 'PARTIALLY_ACCEPTED';

              return (
                <div key={bid.id} style={{
                  background: isFullyAccepted ? 'rgba(132,230,132,0.08)' : isPartiallyAccepted ? 'rgba(237,194,43,0.08)' : 'rgba(16,47,49,0.4)',
                  border: isFullyAccepted ? '1px solid #84e684' : isPartiallyAccepted ? '1px solid #edc22b' : '1px solid #3f4a3d',
                  borderRadius: 10,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}>
                  {/* Farmer Info Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', background: '#84e684', color: '#061520',
                        fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                      }}>
                        {bid.farmerName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#d5e4f4', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {bid.farmerName}
                          <span style={{ fontSize: 12, color: '#edc22b', display: 'flex', alignItems: 'center', gap: 2 }}>
                            ★ {bid.farmerRating || 4.8}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#84e684' }}>
                          {bid.shopName} • {bid.farmerLocation}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#edc22b' }}>
                        ₹{bid.price.toLocaleString()} / {req.unit}
                      </div>
                      <div style={{ fontSize: 12, color: '#becab9' }}>
                        Offered: <strong style={{ color: '#d5e4f4' }}>{bid.bidQuantity.toLocaleString()} {req.unit}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Message & Proposal Box */}
                  <div style={{ background: 'rgba(14,29,40,0.5)', padding: 12, borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <div style={{ color: '#becab9', fontStyle: bid.message ? 'normal' : 'italic' }}>
                      {bid.message ? `"${bid.message}"` : 'No additional proposal notes provided.'}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#84e684', shrink: 0, marginLeft: 16 }}>
                      Total Offered Value: ₹{bid.total.toLocaleString()}
                    </div>
                  </div>

                  {/* Status & Action Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(63,74,61,0.5)', paddingTop: 12 }}>
                    <div style={{ fontSize: 12, color: '#becab9' }}>
                      {bid.acceptedQuantity > 0 && (
                        <span style={{ color: '#84e684', fontWeight: 700 }}>
                          Accepted: {bid.acceptedQuantity.toLocaleString()} {req.unit} (₹{(bid.acceptedQuantity * bid.price).toLocaleString()})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {isFullyAccepted ? (
                        <span className="e-badge e-badge-green" style={{ padding: '6px 14px', fontSize: 12 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span> Accepted Entire Bid
                        </span>
                      ) : remQty === 0 ? (
                        <span className="e-badge e-badge-blue" style={{ padding: '6px 14px', fontSize: 12 }}>
                          Requirement Fully Allocated
                        </span>
                      ) : autoAcceptQty > 0 ? (
                        <button
                          onClick={() => handleOpenAcceptModal(bid)}
                          className="e-btn-primary"
                          style={{ padding: '8px 16px', fontSize: 13 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>payment</span>
                          Accept {autoAcceptQty.toLocaleString()} {req.unit}
                        </button>
                      ) : (
                        <span className="e-badge" style={{ background: 'rgba(190,202,185,0.15)', color: '#becab9' }}>
                          No remaining quantity to accept
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Related Orders Section (Section 18) */}
      {relatedOrders.length > 0 && (
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, borderLeft: '4px solid #38bdf8' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 10 }}>
            Orders Created From Accepted Bids ({relatedOrders.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {relatedOrders.map(ord => (
              <div key={ord.id} style={{
                background: 'rgba(16,47,49,0.4)',
                border: '1px solid #3f4a3d',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ color: '#84e684', fontSize: 14 }}>{ord.id}</strong>
                    <span className="e-badge e-badge-blue" style={{ fontSize: 10 }}>{ord.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#becab9', marginTop: 4 }}>
                    Farmer: {ord.farmerName} • {ord.quantity.toLocaleString()} {ord.unit} @ ₹{ord.price.toLocaleString()}/{ord.unit}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#edc22b' }}>
                    ₹{ord.total.toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleTrackOrder(ord.id)}
                    className="e-btn-secondary"
                    style={{ padding: '6px 12px', fontSize: 12 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>radar</span> Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accept Partial Bid & Mock Payment Modal (Section 1 & 2) */}
      {selectedBidForAccept && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,21,32,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={handleConfirmPay} className="e-glass-card" style={{ maxWidth: 520, width: '100%', padding: 28, display: 'flex', flexDirection: 'column', gap: 20, maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="e-badge e-badge-green" style={{ marginBottom: 4 }}>Accept Bid & Execute Payment</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#d5e4f4', margin: '4px 0 0 0' }}>
                  {req.product}
                </h3>
              </div>
              <button type="button" className="e-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setSelectedBidForAccept(null)}>
                ✕
              </button>
            </div>

            {/* Calculated Values Summary (Section 1: No quantity input field) */}
            <div style={{ background: 'rgba(16,47,49,0.5)', padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div><strong style={{ color: '#84e684' }}>Farmer:</strong> {selectedBidForAccept.farmerName} ({selectedBidForAccept.shopName})</div>
              <div><strong style={{ color: '#84e684' }}>Offered Price:</strong> ₹{selectedBidForAccept.price.toLocaleString()} / {req.unit}</div>
              <div><strong style={{ color: '#84e684' }}>Farmer Offered Quantity:</strong> {selectedBidForAccept.bidQuantity.toLocaleString()} {req.unit}</div>
              <div><strong style={{ color: '#84e684' }}>Max Available to Accept:</strong> {modalAcceptQty.toLocaleString()} {req.unit}</div>
              <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#becab9' }}>Quantity Being Accepted:</span>
                <strong style={{ color: '#84e684' }}>{modalAcceptQty.toLocaleString()} {req.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#becab9' }}>Total Order Cost:</span>
                <strong style={{ color: '#edc22b', fontSize: 16 }}>₹{modalTotalCost.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#becab9' }}>
                <span>Remaining Requirement After Acceptance:</span>
                <span style={{ color: modalRemainingAfter > 0 ? '#edc22b' : '#38bdf8', fontWeight: 700 }}>{modalRemainingAfter.toLocaleString()} {req.unit}</span>
              </div>
            </div>

            {/* Mock Payment Demo Section (Section 2) */}
            <div style={{ background: 'rgba(14,29,40,0.8)', border: '1px solid #3f4a3d', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: '#84e684', fontSize: 20 }}>lock</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#d5e4f4' }}>Mock Payment (Demo)</span>
                </div>
                <span className="e-badge e-badge-green" style={{ fontSize: 9 }}>KisanDirect Escrow Protected</span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {['UPI', 'Card', 'Net Banking', 'Wallet'].map(pm => (
                  <button
                    key={pm}
                    type="button"
                    onClick={() => setPaymentMethod(pm)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 6,
                      background: paymentMethod === pm ? 'rgba(132,230,132,0.15)' : 'rgba(16,47,49,0.5)',
                      color: paymentMethod === pm ? '#84e684' : '#becab9',
                      border: paymentMethod === pm ? '1px solid #84e684' : '1px solid #3f4a3d',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}>
                    {pm}
                  </button>
                ))}
              </div>

              {/* Demo Fields Based on Selected Method */}
              {paymentMethod === 'UPI' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                    Demo Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    className="e-input"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="demo@upi"
                  />
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                      Demo Card Number
                    </label>
                    <input
                      className="e-input"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input className="e-input" value="12 / 28" readOnly placeholder="MM/YY" />
                    <input className="e-input" value="***" readOnly placeholder="CVV" />
                  </div>
                </div>
              )}

              {paymentMethod === 'Net Banking' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                    Select Demo Bank
                  </label>
                  <select className="e-select" defaultValue="HDFC Bank">
                    <option value="HDFC Bank">HDFC Bank (Demo Corporate)</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank Commercial</option>
                    <option value="Axis Bank">Axis Bank B2B</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'Wallet' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                    Select Demo Business Wallet
                  </label>
                  <select className="e-select" defaultValue="PhonePe Business">
                    <option value="PhonePe Business">PhonePe Enterprise Wallet</option>
                    <option value="Paytm Business">Paytm Agri Escrow</option>
                    <option value="Amazon Pay">Amazon Pay Business</option>
                  </select>
                </div>
              )}

              <div style={{ fontSize: 11, color: '#becab9', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#edc22b' }}>info</span>
                This is a mock payment for demo purposes. No real money will be charged.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button
                type="button"
                className="e-btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setSelectedBidForAccept(null)}>
                Cancel
              </button>
              <button
                type="submit"
                className="e-btn-primary"
                style={{ flex: 1, padding: '12px 16px', fontSize: 14 }}>
                <span className="material-symbols-outlined">verified</span>
                Confirm & Pay ₹{modalTotalCost.toLocaleString()}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
