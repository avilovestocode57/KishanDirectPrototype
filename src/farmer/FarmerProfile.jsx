import React, { useState } from 'react';
import { useFarmer } from './FarmerContext';
import asset9  from '../assets/farmer-asset-9.png';

function EditProfileModal({ shop, onSave, onClose }) {
  const [form, setForm] = useState({ ...shop });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/30">
          <h2 className="text-headline-md font-headline-md text-on-surface font-bold">Edit Farm Profile</h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-1">Farm / Shop Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-1">Location</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary resize-none" />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface font-label-md hover:bg-surface-container-high transition-colors">
              Cancel
            </button>
            <button onClick={() => { onSave(form); onClose(); }}
              className="px-5 py-2.5 rounded-lg bg-primary text-on-primary-fixed font-label-md font-bold hover:bg-primary-fixed-dim transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmerProfile() {
  const { shop, updateShop, products } = useFarmer();
  const [showEdit, setShowEdit] = useState(false);

  const cropList = products.slice(0, 3).map(p => p.name);

  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop pb-24 overflow-y-auto custom-scrollbar">
      {showEdit && <EditProfileModal shop={shop} onSave={updateShop} onClose={() => setShowEdit(false)} />}

      <div className="max-w-5xl mx-auto space-y-gutter">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-on-surface font-bold text-[32px]">Farmer Profile</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-2">Manage your West Bengal farm identity and subscriptions.</p>
          </div>
          <button onClick={() => setShowEdit(true)}
            className="mt-4 md:mt-0 bg-primary text-on-primary font-bold py-3 px-6 rounded-lg text-label-md font-label-md hover:bg-primary-fixed-dim transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(105,201,107,0.3)]">
            <span className="material-symbols-outlined mr-2">edit</span> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

          {/* Left Profile Card */}
          <div className="md:col-span-5 lg:col-span-4 bg-[#0B1A2B] rounded-xl p-6 border border-surface-container-high relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#102F31]/30 to-transparent opacity-50 z-0 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-30"></div>
                <img src={asset9} alt="Ramesh Kumar" className="w-32 h-32 rounded-full object-cover border-2 border-primary relative z-10 shadow-lg" />
              </div>
              <h2 className="text-headline-lg font-headline-lg text-on-surface mb-1 font-bold">Ramesh Kumar</h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-4">{shop.name}</p>
              <div className="flex items-center justify-center space-x-2 text-secondary mb-6 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-label-md font-label-md text-secondary">4.8</span>
                <span className="text-label-sm font-label-sm text-on-surface-variant">(124 Market Deals)</span>
              </div>
              <div className="w-full space-y-4 pt-6 border-t border-outline-variant/30 text-left">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-on-surface-variant mr-3 w-6 text-center">location_on</span>
                  <div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Location</p>
                    <p className="text-body-md font-body-md text-on-surface font-semibold">{shop.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-on-surface-variant mr-3 w-6 text-center">calendar_month</span>
                  <div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Member Since</p>
                    <p className="text-body-md font-body-md text-on-surface font-semibold">March 2021</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-on-surface-variant mr-3 w-6 text-center">phone</span>
                  <div>
                    <p className="text-label-sm font-label-sm text-on-surface-variant">Contact</p>
                    <p className="text-body-md font-body-md text-on-surface font-semibold">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Info & Subscriptions */}
          <div className="md:col-span-7 lg:col-span-8 space-y-gutter">

            {/* Farm Info */}
            <div className="bg-[#0B1A2B] rounded-xl p-6 border border-surface-container-high">
              <h3 className="text-headline-md font-headline-md text-on-surface font-bold flex items-center mb-6">
                <span className="material-symbols-outlined text-primary mr-2">agriculture</span> Farm Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
                  <p className="text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Total Farm Area</p>
                  <p className="text-headline-md font-headline-md text-on-surface font-bold">15.5 <span className="text-body-md text-on-surface-variant">Acres</span></p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
                  <p className="text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Soil Type</p>
                  <p className="text-headline-md font-headline-md text-on-surface font-bold">Alluvial <span className="text-body-md text-on-surface-variant">(pH 6.8)</span></p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-3 uppercase tracking-wider">Current Listed Products</p>
                <div className="flex flex-wrap gap-3">
                  {products.length === 0
                    ? <p className="text-on-surface-variant text-body-md">No products listed yet.</p>
                    : products.map(p => (
                      <div key={p.id} className="flex items-center space-x-2 bg-surface-container px-3 py-2 rounded-lg border border-outline-variant/30">
                        <span className="material-symbols-outlined text-primary">eco</span>
                        <span className="text-body-md text-on-surface font-medium">{p.name}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="bg-gradient-to-r from-[#102F31] to-[#0B1A2B] rounded-xl p-6 border border-primary/30 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-headline-md font-headline-md text-on-surface font-bold">KisanDirect Pro</h3>
                    <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide">ACTIVE</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant max-w-md">
                    Premium Streamlit AI demand forecasting, priority West Bengal market access, and real-time mandi intelligence.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <p className="text-headline-lg font-headline-lg text-primary font-bold">₹399</p>
                  <p className="text-label-sm text-on-surface-variant">/ month</p>
                </div>
              </div>
              <div className="relative z-10 mt-6 pt-6 border-t border-outline-variant/30 flex justify-between items-center">
                <p className="text-label-md text-on-surface-variant">Next billing: <span className="text-on-surface font-bold">Nov 15, 2024</span></p>
                <button className="text-primary hover:underline text-label-md font-semibold">Manage Plan</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
