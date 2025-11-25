import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';
import CarPricePredictor from './components/CarPricePredictor';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import './App.css';
import './components/Home.css';
import './components/Dashboard.css';
import './components/Contact.css';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  // Initialize isLoggedIn from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showPredictor, setShowPredictor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on initial load and on auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          // User is signed in
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', user.email || '');
          localStorage.setItem('userId', user.uid);
        } else {
          // User is signed out
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userId');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
      } finally {
        setIsLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    if (status) {
      setShowPredictor(false);
      // Ensure the login state is properly stored
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }
  };

  const handleAuth = async () => {
    if (isLoggedIn) {
      try {
        // Sign out from Firebase
        await auth.signOut();
        
        // Clear local state
        setIsLoggedIn(false);
        setShowPredictor(false);
        
        // Clear local storage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        
        // Force a full page reload to reset all component states
        window.location.href = '/';
      } catch (error) {
        console.error('Error signing out:', error);
        // Even if there's an error, still try to clear local state
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        window.location.href = '/';
      }
    } else {
      // Navigate to login page
      window.location.href = '/login';
    }
  };

  const handleGetStarted = () => {
    handleAuth(); // This will log the user in
  };

  // This function is used by the Dashboard component to show the predictor
  const handleShowPredictor = () => {
    setShowPredictor(true);
  };

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className={`App ${isLoggedIn ? 'dashboard-view' : ''}`}>
          <Navbar isLoggedIn={isLoggedIn} onAuthClick={handleAuth} />
          <main>
            <Routes>
              <Route 
                path="/login" 
                element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
              />
              <Route 
                path="/signup" 
                element={isLoggedIn ? <Navigate to="/" /> : <Signup onSignup={handleLogin} />} 
              />
              <Route 
                path="/" 
                element={
                  isLoggedIn ? (
                    showPredictor ? (
                      <CarPricePredictor />
                    ) : (
                      <Dashboard />
                    )
                  ) : (
                    <Home isLoggedIn={isLoggedIn} onGetStarted={handleGetStarted} />
                  )
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute isAuthenticated={isLoggedIn}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/predict" element={
                <ProtectedRoute isAuthenticated={isLoggedIn}>
                  <CarPricePredictor />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute isAuthenticated={isLoggedIn}>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer>
            <div className="footer-content">
              <nav className="footer-links">
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </nav>
              <div className="social-links">
                <a href="#twitter" aria-label="Twitter">🐦</a>
                <a href="#facebook" aria-label="Facebook">👍</a>
                <a href="#instagram" aria-label="Instagram">📷</a>
                <a href="#linkedin" aria-label="LinkedIn">💼</a>
              </div>
              <p className="copyright">
                &copy; 2025 drivalyze — Empowering Smart Automotive Decisions.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
