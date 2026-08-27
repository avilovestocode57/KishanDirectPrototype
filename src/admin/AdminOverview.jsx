// AdminOverview.jsx — Screen 1: Overview Dashboard
import React from 'react';
import { useAdmin } from './AdminContext';

export default function AdminOverview({ onNavigate }) {
  const {
    totalUsers, totalFarmers, totalConsumers, totalEnterprises,
    activeProducts, pendingProducts,
    totalOrders, pendingOrders, completedOrders,
    estimatedRevenue, estimatedProfit,
    products, orders,
  } = useAdmin();

  const pendingApprovalsList = products.filter(p => p.status === 'Pending');
  const pendingOrdersList    = orders.filter(o => o.status === 'Ready for Dispatch' || o.status === 'Delayed');

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="a-badge a-badge-green">West Bengal Ecosystem</span>
          <span style={{ fontSize: 12, color: '#becab9' }}>Real-time Overview</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
          Admin Dashboard Overview
        </h1>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Users', value: totalUsers, sub: `${totalFarmers} Farmers · ${totalConsumers} Consumers · ${totalEnterprises} Enterprise`, icon: 'group', color: '#84e684' },
          { label: 'Active Products', value: activeProducts, sub: `${pendingProducts} Pending Approval`, icon: 'inventory_2', color: '#82b7ff' },
          { label: 'Total Orders', value: totalOrders, sub: `${pendingOrders} Pending Action · ${completedOrders} Delivered`, icon: 'shopping_bag', color: '#edc22b' },
          { label: 'Estimated Revenue', value: `₹${(estimatedRevenue / 1000).toFixed(1)}k`, sub: 'West Bengal Marketplace GMV', icon: 'payments', color: '#84e684' },
          { label: 'Estimated Profit', value: `₹${(estimatedProfit / 1000).toFixed(1)}k`, sub: 'Estimated Platform Yield (~12%)', icon: 'trending_up', color: '#d2a8ff' },
        ].map((kpi, idx) => (
          <div key={idx} className="a-glass-card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#becab9' }}>{kpi.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(19, 33, 44, 0.8)', border: `1px solid ${kpi.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: kpi.color }}>{kpi.icon}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', letterSpacing: '-0.5px' }}>{kpi.value}</div>
              <div style={{ fontSize: 11, color: '#becab9', marginTop: 4 }}>{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* User Growth & Revenue Charts */}
        <div className="a-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
              West Bengal Growth & GMV Trend (2026)
            </h2>
            <span className="a-badge a-badge-blue">Monthly Analytics</span>
          </div>

          {/* SVG Trend Lines */}
          <div style={{ height: 200, width: '100%', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#3f4a3d" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#3f4a3d" strokeDasharray="3 3" opacity="0.4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#3f4a3d" strokeDasharray="3 3" opacity="0.4" />

              {/* Area Fill */}
              <polygon points="0,160 80,130 160,110 240,80 320,60 400,30 480,20 480,180 0,180" fill="rgba(132, 230, 132, 0.08)" />

              {/* Line 1: Revenue (Green) */}
              <polyline points="0,160 80,130 160,110 240,80 320,60 400,30 480,20" fill="none" stroke="#84e684" strokeWidth="3" />
              {/* Line 2: Orders (Yellow) */}
              <polyline points="0,170 80,150 160,135 240,115 320,95 400,70 480,50" fill="none" stroke="#edc22b" strokeWidth="2" strokeDasharray="5 3" />

              {/* Dots */}
              {[
                { x: 0, y: 160 }, { x: 80, y: 130 }, { x: 160, y: 110 }, { x: 240, y: 80 }, { x: 320, y: 60 }, { x: 400, y: 30 }, { x: 480, y: 20 }
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#84e684" stroke="#0e1d28" strokeWidth="2" />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#becab9', marginTop: 8 }}>
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, borderTop: '1px solid rgba(63,74,61,0.4)', paddingTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 12, height: 3, background: '#84e684', borderRadius: 2 }} />
              <span style={{ color: '#d5e4f4' }}>Platform Revenue (₹)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <div style={{ width: 12, height: 3, background: '#edc22b', borderRadius: 2 }} />
              <span style={{ color: '#d5e4f4' }}>Order Volume</span>
            </div>
          </div>
        </div>

        {/* Regional Breakdown (West Bengal Only) */}
        <div className="a-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
              Regional Order Share
            </h2>
            <span className="a-badge a-badge-amber">WB Districts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { district: 'Kolkata', share: 38, count: '1,240 orders', color: '#84e684' },
              { district: 'Nadia', share: 26, count: '760 orders', color: '#edc22b' },
              { district: 'Hooghly', share: 22, count: '680 orders', color: '#82b7ff' },
              { district: 'Purba Bardhaman', share: 14, count: '410 orders', color: '#d2a8ff' },
            ].map(r => (
              <div key={r.district}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#d5e4f4', fontWeight: 600 }}>{r.district}</span>
                  <span style={{ color: '#becab9' }}>{r.count} ({r.share}%)</span>
                </div>
                <div style={{ height: 6, background: '#0e1d28', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${r.share}%`, background: r.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 12px', background: 'rgba(63,74,61,0.25)', borderRadius: 8, border: '1px solid rgba(63,74,61,0.4)', fontSize: 11, color: '#becab9', marginTop: 'auto' }}>
            💡 <strong>Insight:</strong> Nadia and Hooghly supply 64% of vegetables consumed in Kolkata.
          </div>
        </div>
      </div>

      {/* Actionable Operational Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Pending Approvals Widget */}
        <div className="a-glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: '#edc22b' }}>fact_check</span>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>Pending Product Approvals ({pendingApprovalsList.length})</h3>
            </div>
            <button className="a-btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => onNavigate('approvals')}>
              Review All
            </button>
          </div>

          {pendingApprovalsList.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#becab9', fontSize: 13 }}>
              All submitted products have been reviewed!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingApprovalsList.slice(0, 3).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#0e1d28', borderRadius: 8, border: '1px solid rgba(63,74,61,0.4)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#d5e4f4' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#becab9' }}>Farmer: {p.farmer} ({p.district})</div>
                  </div>
                  <button className="a-btn-primary" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => onNavigate('approvals')}>
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Operational Dispatch Alerts */}
        <div className="a-glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ color: '#84e684' }}>local_shipping</span>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>Orders Pending Dispatch ({pendingOrdersList.length})</h3>
            </div>
            <button className="a-btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => onNavigate('orders')}>
              Manage Orders
            </button>
          </div>

          {pendingOrdersList.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#becab9', fontSize: 13 }}>
              No orders requiring immediate dispatch action.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingOrdersList.slice(0, 3).map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#0e1d28', borderRadius: 8, border: '1px solid rgba(63,74,61,0.4)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#84e684' }}>{o.id} · ₹{o.amount}</div>
                    <div style={{ fontSize: 11, color: '#becab9' }}>{o.buyer} → {o.district}</div>
                  </div>
                  <span className={`a-badge ${o.status === 'Delayed' ? 'a-badge-red' : 'a-badge-amber'}`} style={{ fontSize: 10 }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
