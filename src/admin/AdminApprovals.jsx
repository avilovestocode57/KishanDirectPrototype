// AdminApprovals.jsx — Screen 3: Product Quality Approvals
import React, { useState } from 'react';
import { useAdmin } from './AdminContext';

export default function AdminApprovals() {
  const { products, approveProduct, rejectProduct } = useAdmin();

  const [activeTab, setActiveTab]         = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewMode, setReviewMode]       = useState(false);

  // Quality check ratings (1-5)
  const [ratings, setRatings] = useState({ freshness: 5, appearance: 5, size: 5 });
  const [inspectionNote, setInspectionNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Quality below standard');
  const [showRejectForm, setShowRejectForm]   = useState(false);
  const [toast, setToast]                     = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const filteredProducts = products.filter(p => p.status === activeTab);

  function openReview(product) {
    setSelectedProduct(product);
    setRatings(product.ratings?.freshness ? product.ratings : { freshness: 5, appearance: 5, size: 5 });
    setInspectionNote('');
    setShowRejectForm(false);
    setReviewMode(true);
  }

  function handleApprove() {
    if (!selectedProduct) return;
    approveProduct(selectedProduct.id, ratings);
    showToast(`Product "${selectedProduct.name}" has been Approved!`);
    setReviewMode(false);
    setSelectedProduct(null);
  }

  function handleReject() {
    if (!selectedProduct) return;
    rejectProduct(selectedProduct.id, rejectionReason, ratings);
    showToast(`Product "${selectedProduct.name}" has been Rejected.`);
    setReviewMode(false);
    setSelectedProduct(null);
  }

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {toast && (
        <div className="a-toast">
          <span className="material-symbols-outlined">check_circle</span>
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="a-badge a-badge-amber">Quality Inspection</span>
          <span style={{ fontSize: 12, color: '#becab9' }}>Farmer Produce Certification</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
          Product Approvals Management
        </h1>
      </div>

      {/* Status Tabs Bar */}
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
        {[
          { id: 'Pending',  label: 'Pending Approval',  badgeClass: 'a-badge-amber', count: products.filter(p => p.status === 'Pending').length },
          { id: 'Approved', label: 'Approved Products', badgeClass: 'a-badge-green', count: products.filter(p => p.status === 'Approved').length },
          { id: 'Rejected', label: 'Rejected Listings', badgeClass: 'a-badge-red',   count: products.filter(p => p.status === 'Rejected').length },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="a-btn-ghost"
              style={{
                borderColor: isActive ? '#84e684' : 'transparent',
                background: isActive ? 'rgba(132, 230, 132, 0.12)' : 'transparent',
                color: isActive ? '#84e684' : '#becab9',
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                padding: '8px 16px',
                borderRadius: 8,
              }}>
              {tab.label}
              <span className={`a-badge ${tab.badgeClass}`} style={{ fontSize: 10, padding: '2px 7px', marginLeft: 6 }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Approvals Table / Grid */}
      <div className="a-glass-card" style={{ overflow: 'hidden' }}>
        <table className="a-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Farmer & District</th>
              <th>Quantity & Proposed Price</th>
              <th>Submission Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#becab9' }}>
                  No products in "{activeTab}" status.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={product.image} alt={product.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', background: '#0e1d28' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#d5e4f4' }}>{product.name}</div>
                        <span className="a-badge a-badge-green" style={{ fontSize: 10, textTransform: 'none' }}>{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#d5e4f4' }}>{product.farmer}</div>
                    <div style={{ fontSize: 11, color: '#becab9', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#84e684' }}>location_on</span>
                      {product.district}, WB
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#edc22b' }}>₹{product.proposedPrice} / {product.unit}</div>
                    <div style={{ fontSize: 11, color: '#becab9' }}>Stock: {product.quantity}</div>
                  </td>
                  <td style={{ color: '#becab9' }}>{product.date}</td>
                  <td>
                    <span className={`a-badge ${
                      product.status === 'Approved' ? 'a-badge-green' :
                      product.status === 'Pending' ? 'a-badge-amber' : 'a-badge-red'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="a-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => openReview(product)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>rate_review</span>
                      {product.status === 'Pending' ? 'Review & Grade' : 'View Inspection'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Review & Quality Check Modal */}
      {reviewMode && selectedProduct && (
        <div className="a-modal-overlay">
          <div className="a-modal" style={{ maxWidth: 640 }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-symbols-outlined" style={{ color: '#84e684' }}>fact_check</span>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
                    Product Quality Inspection — {selectedProduct.name}
                  </h3>
                </div>
                <button className="a-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => setReviewMode(false)}>✕</button>
              </div>

              {/* Product Info Card */}
              <div style={{ display: 'flex', gap: 16, padding: '14px', background: '#0e1d28', borderRadius: 8, border: '1px solid #3f4a3d', marginBottom: 20 }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1, fontSize: 13 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#d5e4f4', marginBottom: 2 }}>{selectedProduct.name}</div>
                  <div style={{ color: '#becab9', marginBottom: 6 }}>
                    Farmer: <strong style={{ color: '#d5e4f4' }}>{selectedProduct.farmer}</strong> ({selectedProduct.district}, West Bengal)
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                    <span>Quantity: <strong style={{ color: '#84e684' }}>{selectedProduct.quantity}</strong></span>
                    <span>Proposed Price: <strong style={{ color: '#edc22b' }}>₹{selectedProduct.proposedPrice}/{selectedProduct.unit}</strong></span>
                  </div>
                  <div style={{ fontSize: 12, color: '#becab9', marginTop: 6, fontStyle: 'italic' }}>
                    "{selectedProduct.description}"
                  </div>
                </div>
              </div>

              {/* Quality Check Rating Ratings 1-5 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#d5e4f4', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="material-symbols-outlined" style={{ color: '#edc22b', fontSize: 18 }}>star</span>
                  Quality Inspection Grading (1 – 5 Stars)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, background: 'rgba(19,33,44,0.6)', padding: '14px', borderRadius: 8, border: '1px solid rgba(63,74,61,0.4)' }}>
                  {[
                    { key: 'freshness', label: 'Freshness' },
                    { key: 'appearance', label: 'Appearance' },
                    { key: 'size', label: 'Size & Uniformity' },
                  ].map(criterion => (
                    <div key={criterion.key}>
                      <div style={{ fontSize: 11, color: '#becab9', marginBottom: 6, fontWeight: 600 }}>{criterion.label}</div>
                      <div className="a-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            className={`a-star ${star <= (ratings[criterion.key] || 0) ? 'active' : ''}`}
                            onClick={() => selectedProduct.status === 'Pending' && setRatings(r => ({ ...r, [criterion.key]: star }))}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection reason box if rejecting */}
              {showRejectForm && (
                <div style={{ marginBottom: 20, padding: '14px', background: 'rgba(255,180,171,0.1)', borderRadius: 8, border: '1px solid rgba(255,180,171,0.3)' }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#ffb4ab', fontWeight: 700, marginBottom: 6 }}>
                    Select Rejection Reason *
                  </label>
                  <select className="a-select" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} style={{ width: '100%' }}>
                    <option value="Quality below standard">Quality below standard</option>
                    <option value="Product information incomplete">Product information incomplete</option>
                    <option value="Image/description issue">Image/description issue</option>
                    <option value="Quantity/price information issue">Quantity/price information issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #3f4a3d', paddingTop: 16 }}>
                <button className="a-btn-ghost" onClick={() => setReviewMode(false)}>Close</button>
                {selectedProduct.status === 'Pending' && !showRejectForm && (
                  <>
                    <button className="a-btn-danger" onClick={() => setShowRejectForm(true)}>
                      <span className="material-symbols-outlined">cancel</span> Reject Product
                    </button>
                    <button className="a-btn-primary" onClick={handleApprove}>
                      <span className="material-symbols-outlined">check_circle</span> Approve Product
                    </button>
                  </>
                )}
                {selectedProduct.status === 'Pending' && showRejectForm && (
                  <button className="a-btn-danger" onClick={handleReject}>
                    Confirm Rejection
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
