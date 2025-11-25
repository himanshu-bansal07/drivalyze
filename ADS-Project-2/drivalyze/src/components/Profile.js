import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { FaUser, FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState({
    displayName: false,
    email: false,
    password: false
  });
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setFormData(prev => ({
        ...prev,
        displayName: currentUser.displayName || '',
        email: currentUser.email || ''
      }));
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      if (!formData.displayName.trim()) {
        setError('Display name cannot be empty');
        return;
      }

      await updateProfile(auth.currentUser, {
        displayName: formData.displayName.trim()
      });
      
      setEditMode(prev => ({ ...prev, displayName: false }));
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!formData.email || !formData.currentPassword) {
        setError('Please fill in all required fields');
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, formData.email);
      
      setEditMode(prev => ({ ...prev, email: false }));
      setFormData(prev => ({ ...prev, currentPassword: '' }));
      setSuccess('Email updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, formData.newPassword);
      
      setEditMode(prev => ({ ...prev, password: false }));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setSuccess('Password updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back to Dashboard
      </button>
      
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-initial">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
          </div>
        </div>
        <h1>{user.displayName || 'User Profile'}</h1>
        <p className="user-email">{user.email}</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-section">
        <div className="section-header">
          <h2><FaUser /> Profile Information</h2>
        </div>
        
        <div className="form-group">
          <label>Display Name</label>
          <div className="input-group">
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              disabled={!editMode.displayName}
              placeholder="Enter your name"
            />
            {editMode.displayName ? (
              <button 
                className="save-button"
                onClick={handleUpdateProfile}
              >
                <FaCheck /> Save
              </button>
            ) : (
              <button 
                className="edit-button"
                onClick={() => setEditMode(prev => ({ ...prev, displayName: true }))}
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode.email}
              placeholder="Enter your email"
            />
            {editMode.email ? (
              <button 
                className="save-button"
                onClick={handleUpdateEmail}
              >
                <FaCheck /> Save
              </button>
            ) : (
              <button 
                className="edit-button"
                onClick={() => setEditMode(prev => ({ ...prev, email: true }))}
              >
                Edit
              </button>
            )}
          </div>
          {editMode.email && (
            <div className="password-prompt">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password to confirm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2><FaLock /> Change Password</h2>
        </div>
        
        {editMode.password ? (
          <div className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>
            <div className="form-actions">
              <button 
                className="save-button"
                onClick={handleUpdatePassword}
              >
                <FaCheck /> Update Password
              </button>
              <button 
                className="cancel-button"
                onClick={() => setEditMode(prev => ({ ...prev, password: false }))}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="change-password-button"
            onClick={() => setEditMode(prev => ({ ...prev, password: true }))}
          >
            Change Password
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
