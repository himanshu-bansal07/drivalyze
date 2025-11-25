import React from 'react';
import { FaCar, FaChartLine, FaShieldAlt, FaMobileAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ isLoggedIn, onGetStarted }) => {
  const navigate = useNavigate();
  
  if (isLoggedIn) return null;

  const handleGetStarted = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <FaChartLine className="feature-icon" />,
      title: "AI-Powered Accuracy",
      description: "Get precise car price estimates using our advanced machine learning algorithms trained on thousands of transactions."
    },
    {
      icon: <FaCar className="feature-icon" />,
      title: "Wide Range of Models",
      description: "From hatchbacks to luxury SUVs, we cover all major brands and models in the Indian market."
    },
    {
      icon: <FaShieldAlt className="feature-icon" />,
      title: "Trusted by Thousands",
      description: "Join over 100,000+ users who trust us for their car valuation needs."
    },
    {
      icon: <FaMobileAlt className="feature-icon" />,
      title: "Mobile Friendly",
      description: "Access our platform anytime, anywhere, on any device with our responsive design."
    }
  ];

  const testimonials = [
    {
      quote: "Got a fair price for my car within minutes. The prediction was spot on!",
      author: "Rahul Sharma, Mumbai"
    },
    {
      quote: "The most accurate price prediction I've seen. Helped me negotiate a better deal!",
      author: "Priya Patel, Delhi"
    },
    {
      quote: "Simple to use and saved me from overpaying for my new car. Highly recommended!",
      author: "Amit Kumar, Bangalore"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Know Your Car's True Value in Seconds</h1>
          <p className="hero-subtitle">
            Get instant, accurate car price estimates powered by AI. Make informed decisions when buying or selling your car.
          </p>
          <div className="cta-buttons">
            <button onClick={handleGetStarted} className="cta-primary">
              Get Started for Free
            </button>
            <a href="#how-it-works" className="cta-secondary">
              How It Works →
            </a>
          </div>
          <div className="trust-badges">
            <div className="trust-item">
              <span className="trust-number">1M+</span>
              <span className="trust-label">Cars Valued</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">98%</span>
              <span className="trust-label">Accuracy</span>
            </div>
            <div className="trust-item">
              <span className="trust-number">4.9★</span>
              <span className="trust-label">User Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose drivalyze?</h2>
          <p>We make car valuation simple, fast, and accurate</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get your car's value in just 3 simple steps</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter Car Details</h3>
            <p>Fill in your car's make, model, year, and other relevant information.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Instant Estimate</h3>
            <p>Our AI analyzes thousands of data points to provide an accurate price.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Make Informed Decision</h3>
            <p>Use the estimate to buy or sell your car with confidence.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Trusted by car owners across India</p>
        </div>
        <div className="testimonial-cards">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-text">{testimonial.quote}</p>
              <p className="testimonial-author">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Discover Your Car's True Value?</h2>
          <p>Get started now and make smarter car buying or selling decisions.</p>
          <button onClick={handleGetStarted} className="cta-primary cta-large">
            Get Your Free Estimate
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
