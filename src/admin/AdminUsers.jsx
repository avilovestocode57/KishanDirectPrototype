// AdminUsers.jsx — Screen 2: Users & Roles Management
import React, { useState, useMemo } from 'react';
import { useAdmin, WB_DISTRICTS } from './AdminContext';

export default function AdminUsers() {
  const { users, toggleBanUser } = useAdmin();

  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter]     = useState('All');

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType]       = useState(null); // 'ban' | 'view'
  const [toast, setToast]               = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchSearch = !q
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.phone.toLowerCase().includes(q)
        || u.district.toLowerCase().includes(q);
      const matchRole     = roleFilter === 'All' || u.role === roleFilter;
      const matchDistrict = districtFilter === 'All Districts' || u.district === districtFilter;
      const matchStatus   = statusFilter === 'All' || u.status === statusFilter;
      return matchSearch && matchRole && matchDistrict && matchStatus;
    });
  }, [users, search, roleFilter, districtFilter, statusFilter]);

  function handleConfirmBanToggle() {
    if (!selectedUser) return;
    toggleBanUser(selectedUser.id);
    const newStatus = selectedUser.status === 'Banned' ? 'Active' : 'Banned';
    showToast(`User ${selectedUser.name} is now ${newStatus}`);
    setSelectedUser(null);
    setModalType(null);
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
          <span className="a-badge a-badge-blue">West Bengal Directory</span>
          <span style={{ fontSize: 12, color: '#becab9' }}>{users.length} Registered Stakeholders</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#d5e4f4', margin: 0, letterSpacing: '-0.5px' }}>
          Users & Roles Management
        </h1>
      </div>

      {/* Filters Bar */}
      <div className="a-glass-card" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#becab9', fontSize: 18 }}>search</span>
          <input
            className="a-input"
            style={{ paddingLeft: 38 }}
            placeholder="Search by name, email, phone, district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Role Filter */}
        <select className="a-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="All">All Roles</option>
          <option value="Farmer">Farmers</option>
          <option value="Consumer">Consumers</option>
          <option value="Enterprise">Enterprises</option>
          <option value="Admin">Admins</option>
        </select>

        {/* WB District Filter */}
        <select className="a-select" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
          {WB_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Status Filter */}
        <select className="a-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Banned">Banned Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="a-glass-card" style={{ overflow: 'hidden' }}>
        <table className="a-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>West Bengal District</th>
              <th>Joined Date</th>
              <th>Activity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#becab9' }}>
                  No users match the selected filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const isBanned = user.status === 'Banned';
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#d5e4f4' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: '#becab9' }}>{user.email} · {user.phone}</div>
                    </td>
                    <td>
                      <span className={`a-badge ${
                        user.role === 'Farmer' ? 'a-badge-green' :
                        user.role === 'Consumer' ? 'a-badge-blue' :
                        user.role === 'Enterprise' ? 'a-badge-amber' : 'a-badge-purple'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#84e684' }}>location_on</span>
                        {user.district}, WB
                      </div>
                    </td>
                    <td style={{ color: '#becab9' }}>{user.joined}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#d5e4f4' }}>{user.ordersCount}</span> <span style={{ fontSize: 11, color: '#becab9' }}>orders</span>
                    </td>
                    <td>
                      <span className={`a-badge ${isBanned ? 'a-badge-red' : 'a-badge-green'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          className="a-btn-ghost"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() => { setSelectedUser(user); setModalType('view'); }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span> View
                        </button>
                        {user.role !== 'Admin' && (
                          <button
                            className={isBanned ? 'a-btn-secondary' : 'a-btn-danger'}
                            style={{ padding: '4px 10px', fontSize: 12 }}
                            onClick={() => { setSelectedUser(user); setModalType('ban'); }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{isBanned ? 'check_circle' : 'block'}</span>
                            {isBanned ? 'Unban' : 'Ban'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {modalType && selectedUser && (
        <div className="a-modal-overlay">
          <div className="a-modal">
            {modalType === 'ban' ? (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: selectedUser.status === 'Banned' ? 'rgba(132,230,132,0.15)' : 'rgba(255,180,171,0.15)', border: `2px solid ${selectedUser.status === 'Banned' ? '#84e684' : '#ffb4ab'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 24, color: selectedUser.status === 'Banned' ? '#84e684' : '#ffb4ab' }}>
                      {selectedUser.status === 'Banned' ? 'check_circle' : 'block'}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#d5e4f4', margin: '0 0 4px 0' }}>
                      {selectedUser.status === 'Banned' ? `Unban ${selectedUser.name}?` : `Ban ${selectedUser.name}?`}
                    </h3>
                    <p style={{ fontSize: 13, color: '#becab9', margin: 0 }}>
                      {selectedUser.status === 'Banned'
                        ? 'This will restore full marketplace access for this account.'
                        : 'This user will be restricted from listing products or placing orders on KisanDirect.'}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 16px', background: '#0e1d28', borderRadius: 8, border: '1px solid #3f4a3d', marginBottom: 20, fontSize: 12 }}>
                  <div style={{ color: '#d5e4f4', fontWeight: 700 }}>{selectedUser.name} ({selectedUser.role})</div>
                  <div style={{ color: '#becab9' }}>District: {selectedUser.district}, West Bengal · {selectedUser.phone}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button className="a-btn-ghost" onClick={() => { setSelectedUser(null); setModalType(null); }}>Cancel</button>
                  <button
                    className={selectedUser.status === 'Banned' ? 'a-btn-primary' : 'a-btn-danger'}
                    onClick={handleConfirmBanToggle}>
                    {selectedUser.status === 'Banned' ? 'Confirm Unban' : 'Confirm Ban'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #3f4a3d', paddingBottom: 12 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#d5e4f4', margin: 0 }}>User Profile Details</h3>
                  <button className="a-btn-ghost" style={{ padding: '4px 8px' }} onClick={() => { setSelectedUser(null); setModalType(null); }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
                  <div><strong style={{ color: '#becab9' }}>Full Name:</strong> <span style={{ color: '#d5e4f4' }}>{selectedUser.name}</span></div>
                  <div><strong style={{ color: '#becab9' }}>Role:</strong> <span style={{ color: '#84e684' }}>{selectedUser.role}</span></div>
                  <div><strong style={{ color: '#becab9' }}>Email:</strong> <span style={{ color: '#d5e4f4' }}>{selectedUser.email}</span></div>
                  <div><strong style={{ color: '#becab9' }}>Phone:</strong> <span style={{ color: '#d5e4f4' }}>+91 {selectedUser.phone}</span></div>
                  <div><strong style={{ color: '#becab9' }}>West Bengal District:</strong> <span style={{ color: '#d5e4f4' }}>{selectedUser.district}</span></div>
                  <div><strong style={{ color: '#becab9' }}>Joined Date:</strong> <span style={{ color: '#d5e4f4' }}>{selectedUser.joined}</span></div>
                  <div><strong style={{ color: '#becab9' }}>Total Orders/Listings:</strong> <span style={{ color: '#edc22b' }}>{selectedUser.ordersCount}</span></div>
                  <div><strong style={{ color: '#becab9' }}>Current Status:</strong> <span className={`a-badge ${selectedUser.status === 'Banned' ? 'a-badge-red' : 'a-badge-green'}`}>{selectedUser.status}</span></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                  <button className="a-btn-ghost" onClick={() => { setSelectedUser(null); setModalType(null); }}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
