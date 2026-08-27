import React, { useState } from 'react';
import './farmer.css';
import { FarmerProvider } from './FarmerContext';
import FarmerDashboard from './FarmerDashboard';
import MyShop from './MyShop';
import ProductManagement from './ProductManagement';
import AddProduct from './AddProduct';
import Orders from './Orders';
import EnterpriseRequirements from './EnterpriseRequirements';
import FarmerProfile from './FarmerProfile';
import AiInsights from './AiInsights';
import farmerAvatar from '../assets/farmer-asset-1.png';

function FarmerShell({ onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null); // passed to ProductManagement → AddProduct

  const navItems = [
    { id: 'dashboard',   label: 'Dashboard',              icon: 'dashboard' },
    { id: 'shop',        label: 'My Shop',                icon: 'storefront' },
    { id: 'products',    label: 'Products',               icon: 'inventory_2' },
    { id: 'forecast',    label: 'AI Demand Forecast',     icon: 'trending_up' },
    { id: 'orders',      label: 'Orders',                 icon: 'shopping_cart' },
    { id: 'enterprise',  label: 'Enterprise Requirements',icon: 'business_center' },
    { id: 'profile',     label: 'Profile',                icon: 'person' },
  ];

  const navigate = (tab, payload) => {
    if (tab === 'add-product') setEditProductId(payload || null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="farmer-root min-h-screen flex bg-background text-on-background antialiased relative">

      {/* ── Desktop Sidebar ────────────────────────── */}
      <nav className="hidden md:flex flex-col h-full py-stack_lg px-stack_md bg-surface fixed left-0 top-0 w-sidebar_width z-40 border-r border-outline-variant/30">
        <div className="mb-stack_lg px-stack_sm flex items-center justify-between">
          <div>
            <h1 className="text-headline-md font-headline-md font-bold text-primary">KisanDirect</h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant">West Bengal Farmers</p>
          </div>
          {onBack && (
            <button onClick={onBack} title="Return to Role Selection"
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          )}
        </div>

        <ul className="flex flex-col gap-2 flex-grow">
          {navItems.map(item => {
            const isActive = activeTab === item.id || (activeTab === 'add-product' && item.id === 'products');
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-label-md font-label-md transition-colors duration-200 text-left ${
                    isActive
                      ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex items-center gap-3 px-4 py-3 border-t border-outline-variant/30 pt-stack_md">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/40 shrink-0">
            <img src={farmerAvatar} alt="Ramesh Kumar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-label-md font-label-md text-on-surface font-bold truncate">Ramesh Kumar</span>
            <span className="text-label-sm font-label-sm text-on-surface-variant truncate">Nadia, West Bengal</span>
          </div>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────── */}
      <div className="flex-1 flex flex-col md:ml-sidebar_width min-h-screen w-full relative">

        {/* Top Header */}
        <header className="flex justify-between items-center h-16 w-full px-margin_mobile md:px-margin_desktop bg-surface-container-low sticky top-0 z-30 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
            <span className="text-headline-sm font-headline-sm font-bold text-primary">KisanDirect</span>
          </div>

          <div className="hidden sm:flex relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input type="text" placeholder="Search crops, orders, markets..."
              className="w-full bg-surface border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-label-md text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary transition-all" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-highest border border-primary/30">
              <span className="text-primary text-[10px] animate-pulse">●</span>
              <span className="text-label-sm font-label-sm text-on-surface">ML Model Active</span>
            </div>
            <button className="text-on-surface-variant hover:text-primary relative p-2 rounded-full hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
            {onBack && (
              <button onClick={onBack}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:text-primary text-label-sm font-label-sm transition-colors ml-2">
                <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                Roles
              </button>
            )}
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bg-surface-container-low border-b border-outline-variant/30 z-50 p-4 flex flex-col gap-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => navigate(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-label-md font-label-md text-left ${
                  activeTab === item.id ? 'text-primary font-bold bg-surface-container-high' : 'text-on-surface-variant'
                }`}>
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            {onBack && (
              <button onClick={onBack} className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-md text-error font-bold border-t border-outline-variant/30 mt-2">
                <span className="material-symbols-outlined">logout</span>
                Exit to Role Selection
              </button>
            )}
          </div>
        )}

        {/* Screen Router */}
        {activeTab === 'dashboard'  && <FarmerDashboard onNavigate={navigate} />}
        {activeTab === 'shop'       && <MyShop          onNavigate={navigate} />}
        {activeTab === 'products'   && <ProductManagement onNavigate={navigate} />}
        {activeTab === 'add-product'&& <AddProduct       onNavigate={navigate} editProductId={editProductId} />}
        {activeTab === 'forecast'   && <AiInsights />}
        {activeTab === 'orders'     && <Orders           onNavigate={navigate} />}
        {activeTab === 'enterprise' && <EnterpriseRequirements />}
        {activeTab === 'profile'    && <FarmerProfile />}

      </div>
    </div>
  );
}

export default function FarmerApp({ onBack }) {
  return (
    <FarmerProvider>
      <FarmerShell onBack={onBack} />
    </FarmerProvider>
  );
}
