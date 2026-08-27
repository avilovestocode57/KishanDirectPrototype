import React, { useState } from 'react';
import { useFarmer, deriveStatus } from './FarmerContext';

function StatusBadge({ qty }) {
  const status = deriveStatus(qty);
  if (status === 'Active')       return <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00390c] border border-primary border-opacity-30"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span><span className="text-label-sm font-label-sm text-primary font-bold">Active</span></div>;
  if (status === 'Low Stock')    return <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container/20 border border-error/30"><span className="w-1.5 h-1.5 rounded-full bg-error"></span><span className="text-label-sm font-label-sm text-error font-bold">Low Stock</span></div>;
  return <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/50"><span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span><span className="text-label-sm font-label-sm text-on-surface-variant font-bold">Out of Stock</span></div>;
}

export default function ProductManagement({ onNavigate }) {
  const { products, deleteProduct } = useFarmer();
  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = products.filter(p => {
    const st = deriveStatus(p.quantity);
    if (filter === 'active')    return st === 'Active';
    if (filter === 'low')       return st === 'Low Stock';
    if (filter === 'out')       return st === 'Out of Stock';
    return true;
  });

  const tabClass = (id) =>
    filter === id
      ? 'px-4 py-2 rounded-full text-label-md font-label-md bg-primary-container text-on-primary-container border border-primary font-bold'
      : 'px-4 py-2 rounded-full text-label-md font-label-md bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors';

  return (
    <div className="flex-1 p-margin_mobile md:p-margin_desktop pb-24 overflow-x-hidden overflow-y-auto custom-scrollbar">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface tracking-tight">
            Product Inventory
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Manage your agricultural listings and stock status.
          </p>
        </div>
        <button
          onClick={() => onNavigate('add-product')}
          className="bg-primary text-[#002204] hover:bg-primary-fixed transition-colors px-6 py-3 rounded-lg font-label-md text-label-md flex items-center gap-2 glow-effect font-bold">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Product
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className={tabClass('all')}   onClick={() => setFilter('all')}>All Products</button>
        <button className={tabClass('active')} onClick={() => setFilter('active')}>Active Stock</button>
        <button className={tabClass('low')}   onClick={() => setFilter('low')}>Low Stock</button>
        <button className={tabClass('out')}   onClick={() => setFilter('out')}>Out of Stock</button>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-xl overflow-hidden w-full border border-outline-variant/30">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/30">
                <th className="p-4 text-label-md font-label-md text-on-surface-variant font-medium">Product</th>
                <th className="p-4 text-label-md font-label-md text-on-surface-variant font-medium">Price</th>
                <th className="p-4 text-label-md font-label-md text-on-surface-variant font-medium">Quantity</th>
                <th className="p-4 text-label-md font-label-md text-on-surface-variant font-medium">Status</th>
                <th className="p-4 text-label-md font-label-md text-on-surface-variant font-medium">Updated</th>
                <th className="p-4 text-label-md font-label-md text-on-surface-variant font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant text-body-md">
                    No products match this filter.
                  </td>
                </tr>
              )}
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-surface-container/60 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-surface-container-highest overflow-hidden border border-outline-variant shrink-0">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          : <span className="material-symbols-outlined text-on-surface-variant text-[20px] flex items-center justify-center w-full h-full">eco</span>
                        }
                      </div>
                      <div>
                        <p className="text-body-md font-body-md text-on-surface font-bold">{product.name}</p>
                        <p className="text-label-sm font-label-sm text-on-surface-variant">{product.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-secondary font-bold">₹{product.price}/{product.unit}</span>
                  </td>
                  <td className="p-4 text-on-surface font-medium">
                    <span className={product.quantity === 0 ? 'text-error font-bold' : product.quantity < 300 ? 'text-error font-bold' : ''}>
                      {product.quantity.toLocaleString()} {product.unit}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge qty={product.quantity} />
                  </td>
                  <td className="p-4 text-label-md font-label-md text-on-surface-variant">
                    {product.updatedAt}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onNavigate('add-product', product.id)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit product">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      title="Delete product">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <span className="material-symbols-outlined text-error text-[24px] shrink-0">warning</span>
              <div>
                <h3 className="text-headline-md font-headline-md text-on-surface font-bold">Remove this product?</h3>
                <p className="text-body-md font-body-md text-on-surface-variant mt-1">
                  <strong className="text-on-surface">"{deleteTarget.name}"</strong> will be permanently removed from all listings.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-lg border border-outline text-on-surface font-label-md hover:bg-surface-container-high transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
                className="px-5 py-2.5 rounded-lg bg-error text-on-error font-label-md font-bold hover:opacity-90 transition-colors">
                Remove Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
