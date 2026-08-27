// AdminAIInsights.jsx — Screen 5: AI & Regional Insights (West Bengal)
import React, { useState } from 'react';
import { WB_DISTRICTS } from './AdminContext';

const STREAMLIT_EMBED_URL = 'https://kisandirect-ai-demand-forcasting-26.streamlit.app/?embed=true';
const STREAMLIT_DIRECT_URL = 'https://kisandirect-ai-demand-forcasting-26.streamlit.app/';

const WB_REGIONAL_DATA = [
  { district: 'Kolkata',           farmers: 420, orders: 1240, revenue: 840000, demand: 'High',      trend: '+18%' },
  { district: 'Nadia',             farmers: 280, orders: 760,  revenue: 490000, demand: 'High',      trend: '+24%' },
  { district: 'Hooghly',           farmers: 240, orders: 680,  revenue: 430000, demand: 'High',      trend: '+15%' },
  { district: 'Purba Bardhaman',   farmers: 310, orders: 520,  revenue: 380000, demand: 'Moderate',  trend: '+12%' },
  { district: 'Malda',             farmers: 190, orders: 410,  revenue: 350000, demand: 'Rising',    trend: '+30%' },
  { district: 'North 24 Parganas', farmers: 230, orders: 490,  revenue: 320000, demand: 'Moderate',  trend: '+9%'  },
  { district: 'South 24 Parganas', farmers: 180, orders: 360,  revenue: 260000, demand: 'Moderate',  trend: '+11%' },
  { district: 'Bankura',           farmers: 160, orders: 290,  revenue: 210000, demand: 'Rising',    trend: '+22%' },
  { district: 'Murshidabad',       farmers: 210, orders: 310,  revenue: 230000, demand: 'Moderate',  trend: '+14%' },
  { district: 'Birbhum',           farmers: 140, orders: 220,  revenue: 170000, demand: 'Moderate',  trend: '+8%'  },
];

export default function AdminAIInsights() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError]   = useState(false);

  const displayData = selectedDistrict === 'All Districts'
    ? WB_REGIONAL_DATA
    : WB_REGIONAL_DATA.filter(d => d.district === selectedDistrict);

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="a-badge a-badge-green">West Bengal AI Engine</span>
            <span style={{ fontSize: 12, color: '#becab9' }}>Streamlit Forecasting & Regional Analytics</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
            AI & Regional Insights — West Bengal, India
          </h1>
        </div>

        {/* External Direct Link Button */}
        <a
          href={STREAMLIT_DIRECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="a-btn-primary"
          style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined">open_in_new</span>
          Open AI Forecasting Tool
        </a>
      </div>

      {/* Embedded Streamlit Application Box */}
      <div className="a-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(132,230,132,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#84e684' }}>psychology</span>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#d5e4f4', margin: 0 }}>
                KisanDirect AI Demand Forecasting Engine
              </h2>
              <div style={{ fontSize: 11, color: '#becab9' }}>
                Predictive GradientBoosting Model · West Bengal Agricultural Yield & Pricing
              </div>
            </div>
          </div>
          <a
            href={STREAMLIT_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="a-btn-ghost"
            style={{ fontSize: 12, textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span> Full Screen Streamlit
          </a>
        </div>

        {/* Iframe Viewport Container */}
        <div style={{ minHeight: '750px', height: '750px', width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(132,230,132,0.25)', background: '#0e1d28', position: 'relative' }}>
          
          {/* Loading Indicator */}
          {isLoading && !hasError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#0e1d28', zIndex: 5 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(132,230,132,0.2)', borderTopColor: '#84e684', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#d5e4f4' }}>
                Loading AI Demand Forecasting Model...
              </div>
              <div style={{ fontSize: 12, color: '#becab9' }}>
                Connecting to Streamlit Cloud Engine
              </div>
            </div>
          )}

          {/* Fallback Error View */}
          {hasError ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center', background: 'radial-gradient(circle at center, #13212c 0%, #0e1d28 100%)' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(237,194,43,0.15)', border: '1px solid #edc22b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#edc22b' }}>warning</span>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: '0 0 6px 0' }}>
                  AI Forecasting Tool could not be embedded
                </h3>
                <p style={{ fontSize: 13, color: '#becab9', maxWidth: 520, margin: '0 auto', lineHeight: 1.5 }}>
                  The browser or network security settings prevented inline iframe rendering. Launch the live Streamlit app directly to interact with the demand forecasting engine.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                <a
                  href={STREAMLIT_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="a-btn-primary"
                  style={{ textDecoration: 'none', padding: '12px 24px', fontSize: 14 }}>
                  <span className="material-symbols-outlined">launch</span> Open AI Forecasting
                </a>
                <button className="a-btn-ghost" style={{ padding: '12px 18px', fontSize: 13 }} onClick={() => { setHasError(false); setIsLoading(true); }}>
                  Retry Loading App
                </button>
              </div>
            </div>
          ) : (
            /* Streamlit Cloud Embedded Iframe */
            <iframe
              src={STREAMLIT_EMBED_URL}
              title="KisanDirect AI Demand Forecasting"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="fullscreen; geolocation; microphone; camera"
              onLoad={() => setIsLoading(false)}
              onError={() => { setIsLoading(false); setHasError(true); }}
            />
          )}
        </div>
      </div>

      {/* West Bengal Regional Intelligence Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#d5e4f4', margin: '0 0 2px 0' }}>
              West Bengal Regional Analytics
            </h2>
            <div style={{ fontSize: 12, color: '#becab9' }}>
              District-wise breakdown of agricultural supply, order density, and demand surge
            </div>
          </div>

          {/* District Filter */}
          <select className="a-select" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} style={{ minWidth: 200 }}>
            {WB_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* District Metrics Table */}
        <div className="a-glass-card" style={{ overflow: 'hidden' }}>
          <table className="a-table">
            <thead>
              <tr>
                <th>West Bengal District</th>
                <th>Active Farmers</th>
                <th>Orders Completed</th>
                <th>Estimated GMV</th>
                <th>AI Demand Index</th>
                <th>Growth Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map(row => (
                <tr key={row.district}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#d5e4f4', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#84e684' }}>location_on</span>
                      {row.district}, WB
                    </div>
                  </td>
                  <td style={{ color: '#d5e4f4', fontWeight: 600 }}>{row.farmers}</td>
                  <td style={{ color: '#d5e4f4', fontWeight: 600 }}>{row.orders}</td>
                  <td style={{ color: '#edc22b', fontWeight: 700 }}>₹{(row.revenue / 100000).toFixed(2)} Lakh</td>
                  <td>
                    <span className={`a-badge ${
                      row.demand === 'High' ? 'a-badge-green' :
                      row.demand === 'Rising' ? 'a-badge-amber' : 'a-badge-blue'
                    }`}>
                      {row.demand}
                    </span>
                  </td>
                  <td style={{ color: '#84e684', fontWeight: 700 }}>{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
