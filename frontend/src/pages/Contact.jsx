import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Contact Us</h2>
      <div className="card glass-panel">
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        {status === 'success' && (
          <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--success-color)' }}>
            <strong>Success!</strong> Your message has been sent to our hero support team.
          </div>
        )}
        
        {status === 'error' && (
          <div className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--error-color)' }}>
            <strong>Error:</strong> Something went wrong communicating with the server. Please try again later.
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
            <textarea 
              placeholder="How can we help?" 
              rows="5" 
              required 
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', fontFamily: 'var(--font-family)', resize: 'vertical' }}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              disabled={status === 'loading'}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', width: 'fit-content', padding: '1rem 3rem', opacity: status === 'loading' ? 0.7 : 1, transition: 'all 0.3s ease' }} 
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
