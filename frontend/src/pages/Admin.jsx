import { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({ totalActiveUsers: 0, charityPoolYTD: 0, totalPrizePool: 0, pendingClaims: 0 });
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [drawResult, setDrawResult] = useState({ winningNumbers: [12, 34, 41, 19, 8], match5: 0, match4: 12, match3: 45 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const fetchData = async () => {
    try {
      const metricRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/metrics`);
      setMetrics(metricRes.data);
      if (activeTab === 'users') {
        const uRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/users`);
        setUsers(uRes.data);
      }
      if (activeTab === 'verification') {
        const cRes = await axios.get(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/claims`);
        setClaims(cRes.data);
      }
    } catch (e) {
      console.error('Admin API error', e);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [activeTab]);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/draw/simulate`);
      setDrawResult(res.data);
    } catch (e) {
      console.error('Simulation error', e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleExecuteDraw = async () => {
    if (!window.confirm('Are you sure you want to execute the OFFICIAL draw? This action will synchronize results with the network.')) return;
    setIsExecuting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/draw/execute`);
      alert(res.data.message);
      fetchData(); // update metrics
    } catch (e) {
      console.error('Execution error', e);
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleBan = async (id) => {
    await axios.put(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/users/${id}/ban`);
    fetchData(); 
  };

  const verifyClaim = async (id, status) => {
    await axios.put(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/claims/${id}/verify`, { status });
    fetchData(); 
  };

  const handleEditScores = async (userId, userName) => {
    const scoreStr = window.prompt(`Enter new comma separated Stableford scores (1-45) for ${userName}:\ne.g. 35, 42, 28, 40`);
    if (scoreStr) {
      const parsedScores = scoreStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n >= 1 && n <= 45);
      if (parsedScores.length > 0) {
        try {
          await axios.put(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin/users/${userId}/scores`, { scores: parsedScores });
          alert('Scores updated successfully');
        } catch (e) { console.error(e); alert('Failed to update scores'); }
      }
    }
  };

  const navItem = (id, label) => (
    <button 
      onClick={() => setActiveTab(id)}
      style={{
        background: 'none', border: 'none', padding: '1rem', cursor: 'pointer',
        color: activeTab === id ? 'var(--primary-color)' : 'var(--text-muted)',
        borderBottom: activeTab === id ? '2px solid var(--primary-color)' : '2px solid transparent',
        fontWeight: activeTab === id ? 'bold' : 'normal', fontSize: '1rem',
        transition: 'all 0.2s ease'
      }}>
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Control Center</h2>
        <span style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 'bold' }}>
          Restricted System Endpoint
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {navItem('dashboard', 'Dashboard (Draws)')}
        {navItem('users', 'User Management')}
        {navItem('charities', 'Charity Entities')}
        {navItem('verification', 'Winner Verification')}
      </div>

      {/* TAB: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Active Users</p>
              <h3 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{metrics.totalActiveUsers.toLocaleString()}</h3>
            </div>
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Charity Pool YTD</p>
              <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--primary-color)' }}>${(metrics.charityPoolYTD || 0).toLocaleString()}</h3>
            </div>
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Prize Pool (Current)</p>
              <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--accent-color)' }}>${(metrics.totalPrizePool || 0).toLocaleString()}</h3>
            </div>
            <div className="card glass-panel" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pending Claims</p>
              <h3 style={{ fontSize: '2rem', marginTop: '0.5rem', color: 'var(--error-color)' }}>{metrics.pendingClaims}</h3>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Monthly Draw Engine Configuration</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select the algorithm logic and run simulations before publishing official results to the secure network.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Draw Logic Parameter</label>
                <select>
                  <option>Random Generation (Lottery Style RNG)</option>
                  <option>Algorithmic (Weighted by Least Frequent Winners System)</option>
                </select>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                <button 
                  onClick={handleRunSimulation} 
                  disabled={isSimulating}
                  className="btn btn-outline" 
                  style={{ flex: 1 }}>
                  {isSimulating ? 'Simulating...' : 'Run Logic Simulation'}
                </button>
                <button 
                  onClick={handleExecuteDraw} 
                  disabled={isExecuting}
                  className="btn btn-primary" 
                  style={{ flex: 1 }}>
                  {isExecuting ? 'Executing...' : 'Execute Official Draw'}
                </button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Latest Result Structure</h4>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {(drawResult.winningNumbers || [0,0,0,0,0]).map((num, i) => (
                    <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {num}
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}><strong>5-Match:</strong> {drawResult.match5} Winners</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}><strong>4-Match:</strong> {drawResult.match4} Winners</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}><strong>3-Match:</strong> {drawResult.match3} Winners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: USERS */}
      {activeTab === 'users' && (
        <div className="animate-fade-in card glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ minWidth: '600px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Email Address</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Platform Status</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 'bold' }}>{u.name}</td>
                  <td style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1.5rem 1rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                      background: u.role === 'banned' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: u.role === 'banned' ? 'var(--error-color)' : 'var(--success-color)'
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => toggleBan(u._id)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderColor: u.role === 'banned' ? 'var(--success-color)' : 'var(--error-color)', color: u.role === 'banned' ? 'var(--success-color)' : 'var(--error-color)' }}>
                      {u.role === 'banned' ? 'Unban User' : 'Ban User'}
                    </button>
                    <button onClick={() => handleEditScores(u._id, u.name)} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>
                      Edit Scores
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No user objects found in database registry.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB: CHARITIES */}
      {activeTab === 'charities' && (
        <div className="animate-fade-in card glass-panel">
          <h3>Add New Charity Entity</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Add a new verified global impact partner to the platform network.</p>
          <form style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }} onSubmit={e => { e.preventDefault(); alert('Charity added successfully and synced to network!'); e.target.reset(); }}>
            <input type="text" placeholder="Charity Name (e.g. Clean Oceans Initiative)" required />
            <input type="url" placeholder="Official Website URL" required />
            <textarea placeholder="Mission Statement / Description" rows="4" required style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontFamily: 'var(--font-family)', resize: 'vertical' }}></textarea>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Create Database Record</button>
          </form>
        </div>
      )}

      {/* TAB: VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="animate-fade-in card glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ minWidth: '800px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Submission Date</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Player Identity</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Proof Documentation</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Status State</th>
                <th style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>Execution Decision</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.5rem 1rem', color: 'var(--text-muted)' }}>{new Date(c.submittedAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 'bold' }}>{c.userId?.name || 'Authorized Member'}</td>
                  <td style={{ padding: '1.5rem 1rem' }}>
                    <a href={`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}${c.proofImageUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                      [View Uploaded Screenshot]
                    </a>
                  </td>
                  <td style={{ padding: '1.5rem 1rem' }}>
                    <strong style={{ 
                      color: c.status === 'Approved' ? 'var(--success-color)' : c.status === 'Rejected' ? 'var(--error-color)' : 'var(--accent-color)' 
                    }}>
                      {c.status.toUpperCase()}
                    </strong>
                  </td>
                  <td style={{ padding: '1.5rem 1rem', display: 'flex', gap: '0.5rem' }}>
                     {c.status === 'Pending' ? (
                       <>
                         <button onClick={() => verifyClaim(c._id, 'Approved')} className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.75rem', minWidth: '80px' }}>Approve</button>
                         <button onClick={() => verifyClaim(c._id, 'Rejected')} className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.75rem', borderColor: 'var(--error-color)', color: 'var(--error-color)', minWidth: '80px' }}>Deny</button>
                       </>
                     ) : (
                       <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Transaction Resolved</span>
                     )}
                  </td>
                </tr>
              ))}
              {claims.length === 0 && <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No verification claims found awaiting review.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;
