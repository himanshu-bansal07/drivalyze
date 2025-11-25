import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.'
    });
    
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setFormStatus(prev => ({ ...prev, submitted: false }));
    }, 5000);
  };

  return (
    <div className="contact-page">
      <section className="contact-header">
        <div className="container">
          <h1>Get in Touch</h1>
          <p className="subtitle">We'd love to hear from you. Reach out to us with any questions or feedback.</p>
        </div>
      </section>

      <div className="contact-container">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p>Fill out the form or reach out to us through one of the channels below.</p>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3>Our Office</h3>
                  <p>201 Franklin B<br />Chitkara University, Rajpura</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3>Email Us</h3>
                  <p>hello@drivalyze.com<br />support@drivalyze.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567<br />Mon - Fri, 9am - 5pm PST</p>
                </div>
              </div>
              
              <div className="social-links">
                <a href="#twitter" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#linkedin" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            
            <div className="contact-form-container">
              <h2>Send Us a Message</h2>
              {formStatus.submitted && (
                <div className={`form-message ${formStatus.success ? 'success' : 'error'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-container">
        <iframe 
          title="Our Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.147840118938!2d-122.39986668468228!3d37.78841997975886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858062a9c3d3b1%3A0x9b70a3f49ee5c234!2s123%20Automotive%20Way%2C%20San%20Francisco%2C%20CA%2094107%2C%20USA!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
