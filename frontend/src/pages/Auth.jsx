import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [charityName, setCharityName] = useState('Wildlife Conservation Trust');
  const [charityRate, setCharityRate] = useState(10);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password, charityName, charityRate };
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${endpoint}`, payload);
      
      if (!isLogin) {
        // Stripe Subscriptions
        const paymentRes = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/payments/create-checkout-session`, {
           planType: 'monthly', // default for now, can be updated later
           userId: data._id,
           email: data.email
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        if (paymentRes.data.url && paymentRes.data.url.startsWith('http')) {
           window.location.href = paymentRes.data.url;
           return;
        } else {
           navigate(paymentRes.data.url || '/dashboard');
           return;
        }
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="animate-fade-in flex-center" style={{ minHeight: '70vh' }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && <div style={{ color: 'var(--error-color)', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input type="text" required placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Charity Partner</label>
                  <select value={charityName} onChange={e => setCharityName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', appearance: 'none' }}>
                    <option value="Wildlife Conservation Trust">Wildlife Conservation</option>
                    <option value="Global Education Fund">Global Education</option>
                    <option value="Clean Oceans Initiative">Clean Oceans</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Give %</label>
                  <input type="number" min="10" max="100" required value={charityRate} onChange={e => setCharityRate(e.target.value)} style={{ padding: '0.8rem' }} />
                </div>
              </div>
            </>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input type="email" required placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isLogin ? 'Sign In' : 'Join the Platform'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              color: 'var(--primary-color)', 
              fontWeight: '600',
              marginLeft: '0.5rem'
            }}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
