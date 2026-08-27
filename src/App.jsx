import { useState } from 'react'
import Auth from './auth'
import FarmerApp     from './farmer/FarmerApp'
import ConsumerApp   from './consumer/ConsumerApp'
import AdminApp      from './admin/AdminApp'
import EnterpriseApp from './enterprise/EnterpriseApp'

function App() {
  const [role, setRole] = useState(null)

  if (!role) {
    return <Auth onSelectRole={setRole} />
  }

  if (role === 'farmer') {
    return <FarmerApp onBack={() => setRole(null)} />
  }

  if (role === 'user') {
    return <ConsumerApp onBack={() => setRole(null)} />
  }

  if (role === 'admin') {
    return <AdminApp onBack={() => setRole(null)} />
  }

  if (role === 'enterprise') {
    return <EnterpriseApp onBack={() => setRole(null)} />
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0E1117',
      color: '#E8F3E8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <h1 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '24px' }}>
        {role} APPLICATION
      </h1>
      <p style={{ color: '#8FA99A', margin: '16px 0 24px 0' }}>
        Selected role: <strong>{role}</strong>
      </p>
      <button
        type="button"
        onClick={() => setRole(null)}
        style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid #285E4C',
          backgroundColor: '#123033',
          color: '#E8F3E8',
          cursor: 'pointer',
          fontSize: '14px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}
      >
        Change Role
      </button>
    </div>
  )
}

export default App
