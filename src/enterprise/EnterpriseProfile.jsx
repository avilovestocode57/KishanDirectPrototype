// EnterpriseProfile.jsx — Screen 1: Enterprise Profile (Stitch 58f28a2c38f94249906c31ba3220d015)
import React, { useState } from 'react';
import { useEnterprise, WB_LOCATIONS } from './EnterpriseContext';

const BUSINESS_TYPES = [
  'Institution',
  'Restaurant',
  'Hotel',
  'Retailer',
  'Caterer',
  'Agri Processor',
  'Exporter',
  'Other Bulk Buyer',
];

export default function EnterpriseProfile({ onLogout }) {
  const { profile, updateProfile, addAddress, editAddress, deleteAddress, orders } = useEnterprise();

  const [editProfileModal, setEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    businessName: profile.businessName,
    businessType: profile.businessType,
    contactName: profile.contactName,
    phone: profile.phone,
    email: profile.email,
    gstin: profile.gstin,
  });

  const [addressModal, setAddressModal] = useState(false); // open for add/edit
  const [editingAddr, setEditingAddr] = useState(null); // null if adding
  const [addrForm, setAddrForm] = useState({
    title: '',
    street: '',
    district: 'Kolkata',
    state: 'West Bengal',
    pincode: '',
    isDefault: false,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setEditProfileModal(false);
  };

  const handleOpenAddAddress = () => {
    setEditingAddr(null);
    setAddrForm({
      title: 'New Logistics Hub',
      street: '',
      district: 'Kolkata',
      state: 'West Bengal',
      pincode: '700001',
      isDefault: false,
    });
    setAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddr(addr);
    setAddrForm({ ...addr });
    setAddressModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddr) {
      editAddress({ ...addrForm, id: editingAddr.id });
    } else {
      addAddress(addrForm);
    }
    setAddressModal(false);
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="e-badge e-badge-green">Verified Enterprise Buyer</span>
            <span style={{ fontSize: 12, color: '#becab9' }}>West Bengal Procurement Account</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
            Enterprise Account & Delivery Locations
          </h1>
        </div>

        <button onClick={onLogout} className="e-btn-ghost">
          <span className="material-symbols-outlined">logout</span>
          Switch Role / Logout
        </button>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>
        
        {/* Profile Info Box */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3f4a3d', pb: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
              Business Profile
            </h2>
            <button className="e-btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => {
              setProfileForm({
                businessName: profile.businessName,
                businessType: profile.businessType,
                contactName: profile.contactName,
                phone: profile.phone,
                email: profile.email,
                gstin: profile.gstin,
              });
              setEditProfileModal(true);
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span> Edit Details
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 12, background: 'linear-gradient(135deg, #102F31 0%, #84e684 100%)',
              color: '#061520', fontWeight: 900, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {profile.businessName.charAt(0)}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>
                {profile.businessName}
              </h3>
              <span className="e-badge e-badge-gold" style={{ marginTop: 4 }}>
                {profile.businessType}
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(16,47,49,0.5)', padding: 16, borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
            <div><strong style={{ color: '#84e684' }}>Primary Contact:</strong> {profile.contactName}</div>
            <div><strong style={{ color: '#84e684' }}>Phone Number:</strong> {profile.phone}</div>
            <div><strong style={{ color: '#84e684' }}>Email Address:</strong> {profile.email}</div>
            <div><strong style={{ color: '#84e684' }}>GSTIN / Tax ID:</strong> {profile.gstin}</div>
          </div>

          <div style={{ borderTop: '1px solid #3f4a3d', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#becab9' }}>
            <span>Verified Status: <strong style={{ color: '#84e684' }}>KisanDirect Enterprise Verified</strong></span>
            <span>Total Orders: <strong style={{ color: '#edc22b' }}>{orders.length}</strong></span>
          </div>
        </div>

        {/* Delivery Locations / Addresses Management */}
        <div className="e-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3f4a3d', pb: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
              West Bengal Delivery Hubs / Addresses ({profile.addresses.length})
            </h2>
            <button className="e-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={handleOpenAddAddress}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span> Add Location
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {profile.addresses.map(addr => (
              <div key={addr.id} style={{
                background: 'rgba(16,47,49,0.4)',
                border: addr.isDefault ? '1px solid #84e684' : '1px solid #3f4a3d',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#d5e4f4' }}>{addr.title}</span>
                    {addr.isDefault && <span className="e-badge e-badge-green" style={{ fontSize: 9 }}>Default</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="e-btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => handleOpenEditAddress(addr)}>
                      Edit
                    </button>
                    {profile.addresses.length > 1 && (
                      <button className="e-btn-danger" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => deleteAddress(addr.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: '#becab9' }}>
                  {addr.street}, {addr.district}, {addr.state} — {addr.pincode}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,21,32,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={handleSaveProfile} className="e-glass-card" style={{ maxWidth: 460, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 10 }}>
              Edit Enterprise Business Profile
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                Registered Business Name
              </label>
              <input
                className="e-input"
                required
                value={profileForm.businessName}
                onChange={e => setProfileForm({ ...profileForm, businessName: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                Business Category / Type
              </label>
              <select
                className="e-select"
                value={profileForm.businessType}
                onChange={e => setProfileForm({ ...profileForm, businessType: e.target.value })}>
                {BUSINESS_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                Primary Procurement Contact
              </label>
              <input
                className="e-input"
                required
                value={profileForm.contactName}
                onChange={e => setProfileForm({ ...profileForm, contactName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                  Phone
                </label>
                <input
                  className="e-input"
                  required
                  value={profileForm.phone}
                  onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                  GSTIN Number
                </label>
                <input
                  className="e-input"
                  value={profileForm.gstin}
                  onChange={e => setProfileForm({ ...profileForm, gstin: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                Email Address
              </label>
              <input
                type="email"
                className="e-input"
                required
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="e-btn-ghost" onClick={() => setEditProfileModal(false)}>
                Cancel
              </button>
              <button type="submit" className="e-btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {addressModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,21,32,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <form onSubmit={handleSaveAddress} className="e-glass-card" style={{ maxWidth: 460, width: '100%', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: 0, borderBottom: '1px solid #3f4a3d', paddingBottom: 10 }}>
              {editingAddr ? 'Edit Delivery Location' : 'Add West Bengal Delivery Hub'}
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                Location Title (e.g. Dankuni Cold Storage)
              </label>
              <input
                className="e-input"
                required
                value={addrForm.title}
                onChange={e => setAddrForm({ ...addrForm, title: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                Street Address / Premises
              </label>
              <input
                className="e-input"
                required
                value={addrForm.street}
                onChange={e => setAddrForm({ ...addrForm, street: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                  District (WB)
                </label>
                <select
                  className="e-select"
                  value={addrForm.district}
                  onChange={e => setAddrForm({ ...addrForm, district: e.target.value })}>
                  {WB_LOCATIONS.map(loc => <option key={loc} value={loc.split(',')[0]}>{loc.split(',')[0]}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#becab9', marginBottom: 4 }}>
                  Pincode
                </label>
                <input
                  className="e-input"
                  required
                  value={addrForm.pincode}
                  onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="isDefault"
                checked={addrForm.isDefault}
                onChange={e => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
              />
              <label htmlFor="isDefault" style={{ fontSize: 13, color: '#d5e4f4' }}>
                Set as Default Delivery Destination
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="e-btn-ghost" onClick={() => setAddressModal(false)}>
                Cancel
              </button>
              <button type="submit" className="e-btn-primary">
                Save Location
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
