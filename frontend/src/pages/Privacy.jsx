function Privacy() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Privacy Policy</h2>
      <div className="card glass-panel" style={{ color: 'var(--text-muted)' }}>
        <p style={{ marginBottom: '1rem' }}>Last Updated: {new Date().toLocaleDateString()}</p>
        <h4 style={{ color: 'var(--text-main)', marginTop: '2rem', marginBottom: '0.5rem' }}>1. Data Collection</h4>
        <p>We collect your golf scores, email address, and payment information to operate the HeroGolf platform. We utilize industry-standard security to ensure your data remains highly secure.</p>
        
        <h4 style={{ color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Third-Party Sharing</h4>
        <p>Your data is never sold. Payment processing is handled securely by Stripe, and charity contributions are tracked and processed via trusted non-profit API partners.</p>
        
        <h4 style={{ color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Your Rights</h4>
        <p>You have the right to request a complete deletion of your account and associated score history from our servers at any time by contacting support.</p>
      </div>
    </div>
  );
}

export default Privacy;
