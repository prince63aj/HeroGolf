import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [scores, setScores] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState('');
  const navigate = useNavigate();

  // Added Charity Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCharity, setActiveCharity] = useState({
    name: 'Wildlife Conservation Trust',
    rate: 15,
    initial: 'W',
    color: 'var(--accent-color)'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        navigate('/auth');
        return;
      }

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setUser(data);
        setSelectedNumbers(data.drawNumbers || []);
        if (data.charityConfig?.charityId) {
          // If we had a real charity fetch, we'd update activeCharity here
        }
        
        // Fetch User's 5 recent scores from backend securely
        try {
          const scoreRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/scores/${userInfo._id}`);
          if (scoreRes.data) {
             setScores(scoreRes.data.map(s => ({
                 points: s.points,
                 date: new Date(s.datePlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
             })));
          }
        } catch (scoreErr) { console.error('Failed fetching scores', scoreErr) }

      } catch (err) {
        console.error('Profile fetch failed', err);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const toggleNumber = (num) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < 5) {
        setSelectedNumbers(prev => [...prev, num].sort((a,b) => a-b));
      }
    }
  };

  const handleQuickRandomize = () => {
    const nums = new Set();
    while (nums.size < 5) {
      nums.add(Math.floor(Math.random() * 50) + 1);
    }
    setSelectedNumbers(Array.from(nums).sort((a,b) => a-b));
  };

  const saveNumbers = async () => {
    if (selectedNumbers.length !== 5) return;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth/profile/draw-numbers`, 
        { drawNumbers: selectedNumbers },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setUser(prev => ({ ...prev, drawNumbers: selectedNumbers }));
      setIsPickerOpen(false);
      alert('Lucky numbers synchronized with the network!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update numbers');
    }
  };

  const charitiesList = [
    { name: 'Wildlife Conservation Trust', initial: 'W', color: 'var(--accent-color)' },
    { name: 'Global Education Fund', initial: 'G', color: '#3b82f6' },
    { name: 'Clean Oceans Initiative', initial: 'C', color: '#0ea5e9' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newScore || !newDate || !user) return;
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/scores`, {
        userId: user._id,
        points: Number(newScore),
        datePlayed: newDate
      });
      // The API returns the sorted 5 scores directly after creating
      setScores(res.data.map(s => ({
          points: s.points,
          date: new Date(s.datePlayed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      })));
      setNewScore('');
      setNewDate('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving score');
    }
  };

  const handleCharityChange = (charity) => {
    setActiveCharity({ ...charity, rate: activeCharity.rate });
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Lucky Numbers Picker Modal */}
      {isPickerOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
          <div className="card animate-fade-in" style={{ width: '95%', maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Select Lucky Numbers</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Choose 5 unique numbers for the monthly draw.</p>
              </div>
              <button onClick={() => setIsPickerOpen(false)} style={{ background: 'none', color: 'var(--text-main)', fontSize: '2rem', padding: 0 }}>&times;</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
              {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s',
                    background: selectedNumbers.includes(num) ? 'var(--primary-color)' : 'var(--bg-color)',
                    color: selectedNumbers.includes(num) ? '#fff' : 'var(--text-main)',
                    border: selectedNumbers.includes(num) ? 'none' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleQuickRandomize} className="btn btn-outline" style={{ flex: 1 }}>Quick Randomize</button>
              <button 
                onClick={saveNumbers} 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                disabled={selectedNumbers.length !== 5}
              >
                Save Numbers ({selectedNumbers.length}/5)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Charity Select Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card animate-fade-in" style={{ width: '90%', maxWidth: '500px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Select New Charity</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', color: 'var(--text-main)', fontSize: '2rem', lineHeight: 1, padding: 0 }}>
                &times;
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {charitiesList.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => handleCharityChange(c)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    padding: '1rem', 
                    background: c.name === activeCharity.name ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-color)', 
                    border: `1px solid ${c.name === activeCharity.name ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', background: c.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                    {c.initial}
                  </div>
                  <strong style={{ flex: 1 }}>{c.name}</strong>
                  {c.name === activeCharity.name && <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>✓</span>}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Update Contribution Rate (%)</label>
              <input 
                type="number" 
                min="10" max="100" 
                value={activeCharity.rate} 
                onChange={(e) => setActiveCharity({...activeCharity, rate: e.target.value})}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Minimum requirement is 10%.</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Confirm Selection</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex-center" style={{ height: '60vh' }}>
          <div className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: '600' }}>Synchronizing Secure Session...</div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>Welcome back, <span className="gradient-text">{user?.name || 'Player'}</span></h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Handicap: Pro | Region: Global</p>
            </div>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-color)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '600' }}>
              Subscription: {user?.role?.toUpperCase() || 'ACTIVE'}
            </span>
          </div>

          <div className="dashboard-layout">
            {/* Lucky Numbers Section */}
            <div className="card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0,0,0,0))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>My Lucky Numbers</h3>
                <button onClick={() => setIsPickerOpen(true)} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Customize</button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {(user?.drawNumbers || [0,0,0,0,0]).map((num, i) => (
                  <div key={i} style={{ 
                    width: '45px', height: '45px', borderRadius: '50%', 
                    background: 'var(--surface-color)', border: '2px solid var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                  }}>
                    {num}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                These numbers are synced to the secure Monthly Draw network.
              </p>
            </div>

            {/* Score Entry Area */}
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Enter Score</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Stableford Score</label>
                    <input type="number" min="1" max="45" placeholder="e.g. 36" required value={newScore} onChange={e => setNewScore(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Date Played</label>
                    <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Submit Score</button>
              </form>
            </div>
          </div>

          <div className="dashboard-layout" style={{ marginTop: '2rem' }}>
             {/* Latest 5 Scores */}
            <div className="card glass-panel" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                Latest 5 Performance Scores
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>Rolling Monthly Basis</span>
              </h3>
              
              <div className="score-grid">
                {scores.map((score, idx) => (
                  <div key={idx} className="animate-fade-in" style={{ textAlign: 'center', padding: '1.25rem 0.5rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{score.points}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{score.date}</div>
                  </div>
                ))}
                {scores.length === 0 && (
                   <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No recent scores entered. Submit your stableford score above!
                   </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Charity Target</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '40px', height: '40px', background: activeCharity.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                  {activeCharity.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem' }}>{activeCharity.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeCharity.rate}% Contribution</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem' }}>Adjust</button>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(234, 179, 8, 0.05)', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.1)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>Jackpot: $12,500</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Draws in 14 days</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Dashboard;
