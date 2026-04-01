import { Trophy, Heart, TrendingUp, ShieldCheck, Target, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', paddingBottom: '2rem' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 4rem' }}>
        <h1 className="hero-title" style={{ fontSize: '4.5rem', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
          Play with Purpose. <br />
          <span className="gradient-text">Impact the World.</span>
        </h1>
        <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          Join the premium golf subscription platform that natively rewards your performance and securely supports global causes that matter. Every single swing contributes.
        </p>

        <div className="flex-center home-buttons" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
          <Link to="/auth" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', borderRadius: '12px' }}>
            Start Your Journey <ArrowRight size={20} />
          </Link>
          <a href="#how-it-works" className="btn btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
            Explore Core Mechanics
          </a>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No credit card required for standard tracking.</p>
      </section>

      {/* Global Impact / Data Stats Section */}
      <section className="parent-glow-card card glass-panel" style={{ marginBottom: '8rem', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}>
         <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Power of <span className="gradient-text">Community Scaling</span></h2>
         <p style={{ color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>When thousands of athletes align their subscriptions, the global philanthropic impact scales exponentially.</p>
         
         <div className="grid-3 global-stats-grid">
            <div className="animate-fade-in stat-card primary" style={{ animationDelay: '0.1s' }}>
               <h3 style={{ fontSize: '3.5rem', color: 'var(--primary-color)', marginBottom: '0.5rem', lineHeight: '1' }}>$1M+</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Donated to API partners</p>
            </div>
            <div className="animate-fade-in stat-card accent" style={{ animationDelay: '0.2s' }}>
               <h3 style={{ fontSize: '3.5rem', color: 'var(--accent-color)', marginBottom: '0.5rem', lineHeight: '1' }}>45K+</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Active premium members</p>
            </div>
            <div className="animate-fade-in stat-card info" style={{ animationDelay: '0.3s' }}>
               <h3 style={{ fontSize: '3.5rem', color: '#3b82f6', marginBottom: '0.5rem', lineHeight: '1' }}>142</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Verified Match Jackpots</p>
            </div>
         </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ marginBottom: '8rem', scrollMarginTop: '100px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sleek, Transparent Operations</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>Our platform completely automates score collection, algorithm jackpots, and charitable routing.</p>
        
        <div className="grid-3" style={{ textAlign: 'left' }}>
          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', width: 'fit-content' }}>
              <TrendingUp color="var(--primary-color)" size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Track Performance</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Enter your latest Stableford scores. The backend automatically splices your buffer to roll only the 5 most recent rounds for drawing participation.</p>
          </div>

          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '16px', width: 'fit-content' }}>
              <Heart color="var(--accent-color)" size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Support Charity</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>A minimum of 10% of your gateway subscription goes directly to an impact charity. Adjust up to 100% via your Dashboard controls.</p>
          </div>

          <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', width: 'fit-content' }}>
              <Trophy color="var(--text-main)" size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>Win Multi-Tier Rewards</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Automated monthly algorithms hit combinations against your scores. Secure massive jackpots if you land a 5-number simulation match.</p>
          </div>
        </div>
      </section>

      {/* Deep Features Grid */}
      <section style={{ marginBottom: '8rem', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>Why Switch to HeroGolf?</h2>
        <div className="grid-3" style={{ textAlign: 'left' }}>
           
           <div className="card glass-panel flex-col-mobile" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <ShieldCheck color="var(--primary-color)" size={48} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              <div>
                 <h4 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Verified Transparency</h4>
                 <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Every dollar routed to our charity partners is 100% strictly auditable through open API endpoints and blockchain-adjacent logs.</p>
              </div>
           </div>
           
           <div className="card glass-panel" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <Target color="var(--accent-color)" size={48} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              <div>
                 <h4 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Fair Match Algorithms</h4>
                 <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>We utilize secure hardware RNG simulation and fair-weighting logic engines to guarantee equal prize pool opportunity.</p>
              </div>
           </div>

           <div className="card glass-panel" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '2rem' }}>
              <Users color="var(--success-color)" size={48} strokeWidth={1.5} style={{ flexShrink: 0 }} />
              <div>
                 <h4 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Elite Modern Community</h4>
                 <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>Compete intensely alongside thousands of passionate members dedicated to athletic improvement and global philanthropy.</p>
              </div>
           </div>
           
        </div>
      </section>

      {/* Bottom Aggressive CTA */}
      <section className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(234, 179, 8, 0.1))', 
        padding: '5rem 2rem', 
        borderRadius: '24px',
        border: '1px solid var(--primary-color)',
        boxShadow: '0 20px 50px rgba(16, 185, 129, 0.1)'
      }}>
         <h2 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#fff' }}>Ready to Elevate Your Game?</h2>
         <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
            It takes exactly 60 seconds to create your secure account, construct your charity matrix, and post your first performance score.
         </p>
         <Link to="/auth" className="btn btn-primary" style={{ padding: '1.25rem 3.5rem', fontSize: '1.25rem', borderRadius: '12px', display: 'flex', width: '100%', maxWidth: '300px', margin: '0 auto', justifyContent: 'center' }}>
            Create Your Free Account
         </Link>
      </section>

    </div>
  );
}

export default Home;
