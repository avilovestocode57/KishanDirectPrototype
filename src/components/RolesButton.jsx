import React from 'react';

/**
 * RolesButton — Shared top-right primary navigation button for switching user roles.
 * Styled with KisanDirect primary green (#84e684) fill, high contrast dark text (#00390c),
 * swap icon, and subtle hover/active micro-interactions.
 */
export default function RolesButton({ onClick, className = '', style = {} }) {
  if (!onClick) return null;

  return (
    <button
      onClick={onClick}
      type="button"
      title="Switch User Role"
      aria-label="Switch User Role"
      className={`kd-roles-btn ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: '#84e684',
        color: '#00390c',
        fontWeight: 700,
        fontSize: '13px',
        lineHeight: 1.2,
        padding: '7px 14px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(132, 230, 132, 0.25)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#97f297';
        e.currentTarget.style.boxShadow = '0 0 14px rgba(132, 230, 132, 0.45)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#84e684';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(132, 230, 132, 0.25)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '18px', fontWeight: 700, display: 'inline-block' }}
      >
        swap_horiz
      </span>
      <span>Roles</span>
    </button>
  );
}
