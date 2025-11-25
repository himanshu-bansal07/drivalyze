import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import './Login.css';

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Create floating particles (same as login)
  useEffect(() => {
    const loginContainer = document.querySelector('.login-container');
    if (!loginContainer) return;
    
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      const duration = Math.random() * 10 + 10;
      particle.style.setProperty('--duration', `${duration}s`);
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      loginContainer.appendChild(particle);
      
      setTimeout(() => {
        if (particle && particle.parentNode === loginContainer) {
          particle.remove();
        }
      }, duration * 1000);
    };

    let timeouts = [];
    for (let i = 0; i < 15; i++) {
      const timeout = setTimeout(createParticle, i * 1000);
      timeouts.push(timeout);
    }
    
    const interval = setInterval(createParticle, 2000);
    
    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      // Notify parent component about successful signup
      if (onSignup) {
        onSignup(true);
      }
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
      }
    }
    
    setIsLoading(false);
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
      
      // Notify parent component about successful signup
      if (onSignup) {
        onSignup(true);
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
          <h1>Create Account</h1>
          <p>Join drivalyze to get started</p>
        </div>

        <form onSubmit={handleSignup} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <i><FaUser /></i>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <i><FaLock /></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <i><FaLock /></i>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
            <FaArrowRight className="button-icon" />
          </button>
          
          <div className="divider">
            <span>or</span>
          </div>
          
          <button 
            type="button" 
            className="google-button"
            onClick={signInWithGoogle}
            disabled={isLoading}
          >
            <FaGoogle className="google-icon" />
            <span>Continue with Google</span>
          </button>
          
          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
