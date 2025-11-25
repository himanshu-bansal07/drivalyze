import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Removed particle effect for cleaner UI

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.uid);
      
      // Notify parent component about successful login
      if (onLogin) {
        onLogin(true);
      }
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // More specific error messages based on Firebase error codes
      switch(error.code) {
        case 'auth/user-not-found':
          setError('No user found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        default:
          setError('Failed to sign in. Please check your credentials and try again.');
      }
      
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Clear any existing popup state
      if (window.googleAuthPopup) {
        window.googleAuthPopup.close();
      }
      
      // Add a small delay to ensure any previous popup is fully closed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      // Notify parent component about successful login
      if (onLogin) {
        onLogin(true);
      }
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Google sign in error:', error);
      // Don't show error if user closed the popup
      if (error.code !== 'auth/cancelled-popup-request' && 
          error.code !== 'auth/popup-closed-by-user') {
        setError('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="label-wrapper">
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-loader"></span>
            ) : (
              <>
                Sign In
                <FiArrowRight className="button-icon" />
              </>
            )}
          </button>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <button 
            type="button" 
            className="google-button"
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
            <FaGoogle className="google-icon" />
            Google
          </button>
          
          <div className="signup-link">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-text">
              <FiUserPlus className="signup-icon" /> Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

