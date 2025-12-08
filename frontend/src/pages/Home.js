

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home" style={{
      textAlign: 'center',
      padding: '50px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Help Stray Animals in Need</h1>
      <p style={{ fontSize: '18px', color: '#d3da4eff' }}>
        See a stray animal? Report it now and help save a life.
      </p>

      <div style={{ margin: '40px 0' }}>
        <Link to="/report">
          <button style={{
            padding: '16px 40px',
            fontSize: '20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(231,76,60,0.4)'
          }}>
            Report Stray Animal
          </button>
        </Link>
      </div>

      <div style={{ marginTop: '60px' }}>
        <Link to="/register-ngo" style={{ color: '#3498db', fontSize: '18px' }}>
          Are you an NGO? Register Here →
        </Link>
      </div>
    </div>
  );
}

