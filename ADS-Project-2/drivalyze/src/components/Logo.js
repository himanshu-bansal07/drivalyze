import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = ({ onClick }) => {
  return (
    <Link to="/" className="logo-container" onClick={onClick}>
      <div className="logo-icon">
        <div className="car-icon">
          <div className="car-top"></div>
          <div className="car-body">
            <div className="wheel left"></div>
            <div className="wheel right"></div>
          </div>
          <div className="road-line"></div>
        </div>
      </div>
      <span className="logo-text">rivalyze</span>
    </Link>
  );
};

export default Logo;
