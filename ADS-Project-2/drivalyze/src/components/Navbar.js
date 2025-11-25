import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Navbar.css';

const Navbar = ({ isLoggedIn, onAuthClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Logo onClick={closeMenu} />

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-links" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-links" onClick={closeMenu}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-links" onClick={closeMenu}>
                  Contact
                </Link>
              </li>
            </>
          )}
          <li className="nav-item nav-btn">
            <button 
              className={`auth-btn ${isLoggedIn ? 'logout' : 'login'}`}
              onClick={() => {
                onAuthClick();
                closeMenu();
              }}
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
