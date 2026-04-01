import { useState } from 'react';
import axios from 'axios';

function ClaimPrize() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please secure a valid scorecard screenshot first.');
      return;
    }

    setStatus('loading');
    const formData = new FormData();
    formData.append('screenshot', file);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/claims`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus('success');
      setFile(null);
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 6000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Secure Prize Verification</h2>
      
      <div className="card glass-panel">
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Congratulations on establishing a successful sequence in the monthly draw! Strictly per system rules, to finalize the jackpot payout wire transfer, you must securely upload a cryptographic verification of your finalized scorecard demonstrating your 5 matched scores.
        </p>
        
        {status === 'success' && (
          <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--success-color)' }}>
            <strong>Upload Successful!</strong> Your proof screenshot has been safely transmitted to the Admin Validation Team. You will be notified shortly via email upon authorization.
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--error-color)' }}>
            <strong>Validation Error:</strong> Failed to securely bridge the file to the network. Please ensure it is a valid image (.jpg, .png) and that your session is active.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold' }}>Scorecard Cryptographic Screenshot Upload</label>
            <div style={{
              border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ marginBottom: '1rem', width: '100%', color: 'var(--text-main)', cursor: 'pointer' }} 
                disabled={status === 'loading'}
              />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {file ? `Ready to Transfer: ${file.name}` : 'Network supports standard formats: PNG, JPG, JPEG max bound sizes (5MB).'}
              </p>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', opacity: status === 'loading' || !file ? 0.6 : 1, transition: 'all 0.3s ease' }}
            disabled={status === 'loading' || !file}
          >
            {status === 'loading' ? 'Encrypting & Initiating Network Transfer...' : 'Submit Verification Claim Data'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ClaimPrize;
