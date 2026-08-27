import React, { useState, useEffect } from 'react';
import { useFarmer, deriveStatus } from './FarmerContext';
import asset3 from '../assets/farmer-asset-3.png';

const PRODUCE_OPTIONS = [
  { label: 'Gobindobhog Rice (Special Bengal Variety)',     unit: 'kg',      refPrice: 85,    image: null, subtitle: 'Special Bengal Variety' },
  { label: 'Kufri Jyoti Potatoes',                          unit: 'kg',      refPrice: 18,    image: null, subtitle: 'Hooghly / Nadia Harvest' },
  { label: 'Raw Tossa Jute',                                unit: 'kg',      refPrice: 70,    image: null, subtitle: 'Cash Crop • Murshidabad' },
  { label: 'Mustard Seeds (Yellow)',                        unit: 'kg',      refPrice: 60,    image: null, subtitle: 'Rabi Crop • West Bengal' },
  { label: 'Sharbati Wheat',                                unit: 'kg',      refPrice: 30,    image: null, subtitle: 'Rabi Crop • West Bengal' },
  { label: 'Golden Maize (Corn)',                          unit: 'kg',      refPrice: 22,    image: null, subtitle: 'Kharif Crop • Jalpaiguri' },
  { label: 'Sukh Sagar Red Onions',                       unit: 'kg',      refPrice: 24,    image: null, subtitle: 'Murshidabad Harvest' },
];

export default function AddProduct({ onNavigate, editProductId }) {
  const { products, addProduct, editProduct } = useFarmer();
  const [toast, setToast] = useState('');

  const existing = editProductId ? products.find(p => p.id === editProductId) : null;

  const [form, setForm] = useState({
    produceIndex: 0,
    quantity: 50,
    unit: 'quintal',
    price: 2500,
    harvestDate: '2024-11-15',
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (existing) {
      const idx = PRODUCE_OPTIONS.findIndex(o => o.label === existing.name);
      setForm({
        produceIndex: idx >= 0 ? idx : 0,
        quantity: existing.quantity,
        unit: existing.unit === 'quintal' ? 'quintal' : 'kg',
        price: existing.price,
        harvestDate: existing.harvestDate || '2024-11-15',
      });
    }
  }, [editProductId]);

  const selectedProduce = PRODUCE_OPTIONS[form.produceIndex];
  const displayQtyUnit  = form.unit === 'quintal' ? `${form.quantity} Quintals` : `${form.quantity} kg`;
  const displayPrice    = `₹${form.price.toLocaleString()}`;
  const qtyKg           = form.unit === 'quintal' ? form.quantity * 100 : form.quantity;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: existing?.id,
      name:      selectedProduce.label,
      subtitle:  selectedProduce.subtitle,
      price:     Number(form.price),
      unit:      'kg',
      quantity:  qtyKg,
      harvestDate: form.harvestDate,
      image:     existing?.image || null,
    };
    if (existing) {
      editProduct(payload);
      showToast('Product updated successfully.');
    } else {
      addProduct(payload);
      showToast('Product listed successfully.');
    }
    setTimeout(() => onNavigate('products'), 1200);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop overflow-y-auto pb-24 custom-scrollbar">

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container-low border border-primary text-primary px-5 py-3 rounded-xl shadow-xl font-bold text-label-md flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined">check_circle</span>{toast}
        </div>
      )}

      <div className="mb-stack_lg">
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2 tracking-tight">
          {existing ? 'Edit Product Listing' : 'List a New Produce Batch'}
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
          Bring your produce directly to the KisanDirect West Bengal marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Form */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <div className="bg-surface-container-high rounded-xl p-gutter border border-surface-variant shadow-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-stack_md">

              {/* Produce Category */}
              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-2">Produce Category</label>
                <select
                  value={form.produceIndex}
                  onChange={e => set('produceIndex', Number(e.target.value))}
                  className="w-full bg-surface border border-outline rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary">
                  {PRODUCE_OPTIONS.map((o, i) => (
                    <option key={i} value={i}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_md">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Available Quantity</label>
                  <input type="number" min="0" value={form.quantity}
                    onChange={e => set('quantity', Number(e.target.value))}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Unit of Measurement</label>
                  <select value={form.unit} onChange={e => set('unit', e.target.value)}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary">
                    <option value="quintal">Quintals (100 kg)</option>
                    <option value="kg">Kilograms</option>
                  </select>
                </div>
              </div>

              {/* Price & Harvest Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack_md">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Expected Price (per kg)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-on-surface-variant font-bold">₹</span>
                    <input type="number" min="0" value={form.price}
                      onChange={e => set('price', Number(e.target.value))}
                      className="w-full bg-surface border border-outline rounded-lg py-3 pl-8 pr-4 text-body-md text-on-surface focus:outline-none focus:border-primary" />
                  </div>
                  <p className="mt-1 text-label-sm text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    WB Market Avg: ₹{selectedProduce.refPrice} / kg
                  </p>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-2">Expected Harvest Date</label>
                  <input type="date" value={form.harvestDate}
                    onChange={e => set('harvestDate', e.target.value)}
                    className="w-full bg-surface border border-outline rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary [color-scheme:dark]" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => onNavigate('products')}
                  className="px-6 py-3 rounded-lg border border-outline text-on-surface font-label-md hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-8 py-3 rounded-lg bg-primary text-on-primary-fixed font-label-md font-bold hover:bg-primary-fixed-dim shadow-[0_0_15px_rgba(105,201,107,0.3)] transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  {existing ? 'Save Changes' : 'List Product Batch'}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-label-md font-label-md text-on-surface-variant mb-4 uppercase tracking-wider">Live Preview</h3>
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden shadow-2xl relative">
              <div className="h-40 bg-surface-container-high relative w-full overflow-hidden">
                <img src={existing?.image || asset3} alt="Preview" className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 right-3 bg-[#102F31]/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="text-label-sm font-semibold text-primary">{deriveStatus(qtyKg)}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-headline-md font-headline-md text-on-surface font-bold">{selectedProduce.label.split('(')[0].trim()}</h4>
                    <span className="text-body-lg font-bold text-secondary">{displayPrice}</span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">{selectedProduce.subtitle} • per kg</p>
                </div>
                <div className="h-[1px] w-full bg-outline-variant/30"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-label-sm text-on-surface-variant mb-1">Available Qty</p>
                    <p className="text-body-md font-semibold text-on-surface">{displayQtyUnit}</p>
                  </div>
                  <div>
                    <p className="text-label-sm text-on-surface-variant mb-1">Est. Harvest</p>
                    <p className="text-body-md font-semibold text-on-surface">{form.harvestDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
