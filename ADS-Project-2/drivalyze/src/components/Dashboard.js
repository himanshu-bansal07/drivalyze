import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCar, FaSignOutAlt, FaUser } from "react-icons/fa";
import './Dashboard.css';

function Dashboard({ onShowPredictor, onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handlePredictClick = () => {
    if (onShowPredictor) {
      onShowPredictor();
    } else {
      navigate('/predict');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <FaCar className="logo-icon" />
          <h2>Drivalyze</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item active">
            <FaCar className="nav-icon" />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={handleProfileClick}>
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </button>
        </nav>
      </div>
      
      <div 
        className="dashboard-main"
        onMouseEnter={() => setIsHeaderVisible(true)}
        onMouseLeave={() => setIsHeaderVisible(false)}
      >
        <header className={`dashboard-header ${isHeaderVisible ? 'visible' : ''}`}>
          <h1>Welcome Back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <div className="user-avatar-initial">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        
        <div className="dashboard-content">
          <div className="welcome-card">
            <div className="welcome-text">
              <h2>Welcome to Your Dashboard</h2>
              <p>Manage your account and access important information from one place.</p>
              <div className="quick-actions">
                <button className="action-button primary" onClick={handlePredictClick}>
                  <FaCar className="action-icon" />
                  <span>Predict Price</span>
                </button>
                <button className="action-button" onClick={handleProfileClick}>
                  <FaUser className="action-icon" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>
            <div className="welcome-illustration">
              <FaCar className="car-illustration" />
            </div>
          </div>
          
          <div className="info-cards">
            <div className="info-card">
              <h3>Account Status</h3>
              <p>Your account is active and in good standing.</p>
              <p className="last-login">Last login: {new Date().toLocaleString()}</p>
            </div>
            
            <div className="info-card">
              <h3>Need Help?</h3>
              <p>Visit our help center or contact support for assistance.</p>
              <button className="help-button" onClick={() => navigate('/contact')}>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
