import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <div className="header-content">
          <h1>About Drivalyze</h1>
          <p className="header-subtitle">Revolutionizing Car Price Predictions with AI</p>
        </div>
      </header>

      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p className="mission-statement">
              At Drivalyze, we're committed to bringing transparency and confidence to the car buying and selling experience through advanced AI-powered price predictions.
            </p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Drivalyze?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>AI-Powered Accuracy</h3>
              <p>Our advanced algorithms analyze thousands of data points to deliver precise price predictions you can trust.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Instant Insights</h3>
              <p>Get real-time price estimates without the wait. Our system processes complex market data in seconds.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Market Intelligence</h3>
              <p>Stay ahead with comprehensive market analysis and trend data for smarter buying and selling decisions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Seamless Experience</h3>
              <p>Beautifully designed interface that works flawlessly across all your devices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Enter Vehicle Details</h3>
                <p>Select your car's make, model, year, and specifications from our intuitive interface.</p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>Our system processes your input against current market data and historical trends.</p>
              </div>
            </div>
            
            <div className="process-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Receive Your Estimate</h3>
                <p>Get a comprehensive price report with detailed market insights instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Discover Your Car's True Value?</h2>
          <p>Join thousands of satisfied users who trust Drivalyze for accurate car price predictions.</p>
          <a href="/" className="cta-button">Get Started Now</a>
        </div>
      </section>
    </div>
  );
};

export default About;
