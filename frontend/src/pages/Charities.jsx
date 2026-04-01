import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Charities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/charities`);
        setCharities(response.data);
      } catch (error) {
        console.error('Error fetching charities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our <span className="gradient-text">Impact Partners</span></h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Every swing counts. A minimum of 10% of your guaranteed subscription is strictly forwarded to these verified global organizations.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading impact partners...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {charities.map(charity => (
            <div key={charity._id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(8px)'
                }}>
                  {charity.logoUrl ? (
                    <img 
                      src={charity.logoUrl} 
                      alt={charity.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.75rem' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                      {charity.name.charAt(0)}
                    </span>
                  )}
                </div>
                {charity.featured && <span style={{ background: 'var(--primary-color)', color: '#fff', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>Featured</span>}
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{charity.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
                {charity.description.length > 100 ? `${charity.description.substring(0, 100)}...` : charity.description}
              </p>
              
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Platform Raised</div>
                  <strong style={{ color: 'var(--primary-color)' }}>${(charity.totalRaised || 0).toLocaleString()}</strong>
                </div>
                <Link to={`/charity/${charity._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Charities;
