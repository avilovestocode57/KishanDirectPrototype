import React, { useState } from 'react';
import { useFarmer, deriveStatus } from './FarmerContext';
import asset12 from '../assets/farmer-asset-12.png';

// ─── Public Shop Modal ─────────────────────────────────────────────────────────
function PublicShopModal({ shop, products, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl w-full max-w-3xl shadow-2xl">
        <div className="flex justify-between items-start p-6 border-b border-outline-variant/30">
          <div>
            <h2 className="text-headline-md font-headline-md text-on-surface font-bold">{shop.name}</h2>
            <p className="text-label-md text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>{shop.location}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6">
          <p className="text-body-md text-on-surface-variant mb-6">{shop.description}</p>
          <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-4">Available Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.filter(p => deriveStatus(p.quantity) !== 'Out of Stock').map(p => (
              <div key={p.id} className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-surface-container-high overflow-hidden border border-outline-variant shrink-0">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <span className="material-symbols-outlined text-on-surface-variant text-[24px] flex items-center justify-center w-full h-full">eco</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-md font-label-md text-on-surface font-bold truncate">{p.name}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">{p.subtitle}</p>
                  <p className="text-secondary font-bold mt-1">₹{p.price}/{p.unit}</p>
                </div>
              </div>
            ))}
            {products.filter(p => deriveStatus(p.quantity) !== 'Out of Stock').length === 0 && (
              <p className="text-on-surface-variant col-span-2 text-center py-4">No active products listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Shop Profile Modal ───────────────────────────────────────────────────
function EditShopModal({ shop, onSave, onClose }) {
  const [form, setForm] = useState({ ...shop });
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-outline-variant/30">
          <h2 className="text-headline-md font-headline-md text-on-surface font-bold">Edit Shop Profile</h2>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-error rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-1">Farm / Shop Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-1">Location (West Bengal)</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="w-full bg-surface border border-outline rounded-lg py-2.5 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-label-md font-label-md text-on-surface mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
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

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const status = deriveStatus(product.quantity);
  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden hover:border-primary transition-colors group relative">
      <div className="absolute top-3 right-3 z-10">
        {status === 'Active'       && <div className="bg-surface-container-highest text-primary px-2 py-1 rounded text-label-sm font-label-sm flex items-center gap-1 border border-primary/30"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Active</div>}
        {status === 'Low Stock'    && <div className="bg-error-container/80 text-error px-2 py-1 rounded text-label-sm font-label-sm flex items-center gap-1 border border-error/30"><span className="w-2 h-2 rounded-full bg-error"></span> Low Stock</div>}
        {status === 'Out of Stock' && <div className="bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded text-label-sm font-label-sm border border-outline-variant/30">Out of Stock</div>}
      </div>
      <div className="h-48 w-full overflow-hidden relative bg-surface-container-lowest">
        {product.image
          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center bg-surface-container-high"><span className="material-symbols-outlined text-on-surface-variant text-[48px]">eco</span></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-body-lg font-body-lg text-on-surface font-bold">{product.name}</h4>
            <p className="text-label-md font-label-md text-on-surface-variant">{product.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-headline-md font-headline-md text-secondary font-bold">₹{product.price}<span className="text-label-sm font-label-sm text-on-surface-variant font-normal">/{product.unit}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Available Stock</p>
            <p className="text-body-md font-body-md text-on-surface font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary text-[16px]">scale</span> {product.quantity.toLocaleString()} {product.unit}
            </p>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Location</p>
            <p className="text-body-md font-body-md text-on-surface font-semibold text-xs truncate">{product.subtitle?.split('•')[1]?.trim() || 'West Bengal'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyShop({ onNavigate }) {
  const { products, shop, updateShop } = useFarmer();
  const [showPublicShop, setShowPublicShop] = useState(false);
  const [showEditShop,   setShowEditShop]   = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-margin_mobile md:p-margin_desktop pb-24 custom-scrollbar">

      {/* Modals */}
      {showPublicShop && <PublicShopModal shop={shop} products={products} onClose={() => setShowPublicShop(false)} />}
      {showEditShop   && <EditShopModal   shop={shop} onSave={updateShop} onClose={() => setShowEditShop(false)} />}

      <div className="max-w-7xl mx-auto space-y-stack_lg">

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface">My Shop</h1>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">Your public storefront on KisanDirect.</p>
          </div>
        </div>

        {/* Shop Profile Banner */}
        <div className="glassmorphism-card rounded-xl p-gutter flex flex-col md:flex-row gap-gutter items-start md:items-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 border-outline-variant overflow-hidden shrink-0 shadow-lg">
            <img src={asset12} alt="Farm Banner" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-2 z-10">
            <h2 className="text-headline-md font-headline-md text-on-surface font-bold">{shop.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-label-md font-label-md text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-tertiary text-[18px]">location_on</span> {shop.location}</span>
              <span className="flex items-center gap-1 text-secondary"><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8 (124 Reviews)</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-[18px]">inventory_2</span> {products.length} Products</span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl mt-2">{shop.description}</p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0 z-10">
            <button onClick={() => setShowPublicShop(true)}
              className="bg-primary text-on-primary-fixed w-full md:w-auto px-6 py-3 rounded-lg font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-colors shadow-[0_0_15px_rgba(105,201,107,0.3)] flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">visibility</span> View Public Shop
            </button>
            <button onClick={() => setShowEditShop(true)}
              className="border border-primary text-primary bg-[#102F31] w-full md:w-auto px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">edit</span> Edit Shop Profile
            </button>
          </div>
        </div>

        {/* Products Header */}
        <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4 pt-4">
          <div>
            <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Your Active Store Products</h3>
          </div>
          <button onClick={() => onNavigate('add-product')}
            className="bg-primary text-on-primary-fixed px-5 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-colors flex items-center gap-2 glow-effect">
            <span className="material-symbols-outlined">add</span> Add Product
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
          {products.length === 0 && (
            <div className="col-span-3 text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-4 block">inventory_2</span>
              <p className="text-body-lg">No products listed yet. Add your first product!</p>
              <button onClick={() => onNavigate('add-product')} className="mt-4 bg-primary text-on-primary font-bold px-6 py-3 rounded-lg hover:bg-primary-fixed-dim transition-colors">
                + Add Product
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
