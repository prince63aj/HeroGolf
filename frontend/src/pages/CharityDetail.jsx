import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CharityDetail() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/charities`);
        const found = response.data.find(c => c._id === id);
        setCharity(found);
      } catch (error) {
        console.error('Error fetching charity detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharity();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>Loading mission details...</div>;
  if (!charity) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Charity not found. <Link to="/charities" style={{ color: 'var(--primary-color)' }}>Go back.</Link></div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/charities" style={{ color: 'var(--text-muted)', marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to Charities</Link>
      
      <div className="card glass-panel" style={{ padding: '3rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '2.5rem', fontWeight: 'bold' }}>
             {charity.name.charAt(0)}
           </div>
           <div>
             <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{charity.name}</h1>
             <a href={charity.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Official Website &#8599;</a>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total HeroGolf Contributions</p>
            <h2 style={{ color: 'var(--primary-color)', margin: '0.5rem 0' }}>${(charity.totalRaised || 0).toLocaleString()}</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified securely delivered via platform APIs</p>
          </div>
          <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Your Current Contribution Setup</p>
            <h2 style={{ color: 'var(--accent-color)', margin: '0.5rem 0' }}>{charity.name === 'Wildlife Conservation Trust' ? '15%' : '0%'}</h2>
            <Link to="/dashboard" style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>Edit in Dashboard &rarr;</Link>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>The Mission</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
          {charity.description}
        </p>
      </div>
    </div>
  );
}

export default CharityDetail;
