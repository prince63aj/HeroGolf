function Terms() {
  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Terms of Service</h2>
      <div className="card glass-panel" style={{ color: 'var(--text-muted)' }}>
        <p style={{ marginBottom: '1rem' }}>Welcome to HeroGolf. By using our platform, you agree to these fundamental rules.</p>
        
        <h4 style={{ color: 'var(--text-main)', marginTop: '2rem', marginBottom: '0.5rem' }}>1. Account Conduct</h4>
        <p>Members must report golf Stableford scores accurately. Fraudulent score reporting to manipulate the Monthly Draw Engine is strictly forbidden and will result in immediate account termination.</p>
        
        <h4 style={{ color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Charitable Contributions</h4>
        <p>A minimum of 10% of your subscription goes directly to your selected charity. The platform guarantees the transfer of these funds globally on a quarterly basis.</p>

        <h4 style={{ color: 'var(--text-main)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Monthly Draws</h4>
        <p>The monthly draw algorithmic jackpot is a generated reward system. Payout schedules and match verifications are handled automatically by the smart engine.</p>
      </div>
    </div>
  );
}

export default Terms;
