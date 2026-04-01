import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Charities from './pages/Charities';
import CharityDetail from './pages/CharityDetail';
import ClaimPrize from './pages/ClaimPrize';
import './index.css';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
    } else {
      setUserInfo(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/');
  };

  return (
    <nav className="navbar animate-fade-in">
      <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', 
          background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', 
          borderRadius: '10px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <span>Hero<span style={{ color: 'var(--primary-color)' }}>Golf</span></span>
      </Link>
      
      <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/charities" className="nav-link">Charities</NavLink>
        <NavLink to="/admin" className="nav-link">Admin</NavLink>
        {userInfo ? (
          <>
            <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
            <button onClick={handleSignOut} className="btn btn-primary" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>Sign Out</button>
          </>
        ) : (
          <Link to="/auth" className="btn btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <Navigation />

        <main style={{ minHeight: 'calc(100vh - 250px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/charity/:id" element={<CharityDetail />} />
            <Route path="/claim" element={<ClaimPrize />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="footer-wrapper" style={{ 
          marginTop: '4rem', 
          padding: '2rem 0', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          color: 'var(--text-muted)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '18px', height: '18px', 
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', 
                  borderRadius: '4px', 
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '8px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                Hero<span style={{ color: 'var(--primary-color)' }}>Golf</span>
              </span>
            </div>
            <span style={{ fontSize: '0.875rem' }}>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          
          <div className="footer-links" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <Link to="/privacy" className="nav-link">Privacy Policy</Link>
            <Link to="/terms" className="nav-link">Terms of Service</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
