import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FaHistory, FaCar, FaCalendarAlt, FaGasPump, FaCog, FaRupeeSign } from 'react-icons/fa';
import './PredictionHistory.css';

const PredictionHistory = ({ userId }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const predictionsRef = collection(db, 'predictions');
        const q = query(
          predictionsRef,
          where('userId', '==', userId),
          orderBy('timestamp', 'desc'),
          limit(10) // Show only the 10 most recent predictions
        );
        
        const querySnapshot = await getDocs(q);
        const predictionList = [];
        
        querySnapshot.forEach((doc) => {
          predictionList.push({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamp to JavaScript Date
            timestamp: doc.data().timestamp?.toDate() || new Date()
          });
        });
        
        setPredictions(predictionList);
        setError('');
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load prediction history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPredictions();
  }, [userId]);

  // Format date to a readable string
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your prediction history...</p>
      </div>
    );
  }

  return (
    <div className="prediction-history">
      <h3 className="section-title">
        <FaHistory className="icon" /> Prediction History
      </h3>
      
      {error && <div className="error-message">{error}</div>}
      
      {predictions.length === 0 ? (
        <div className="no-predictions">
          <p>You haven't made any predictions yet.</p>
        </div>
      ) : (
        <div className="predictions-grid">
          {predictions.map((prediction) => (
            <div key={prediction.id} className="prediction-card">
              <div className="prediction-header">
                <span className="prediction-date">
                  <FaCalendarAlt className="icon" /> {formatDate(prediction.timestamp)}
                </span>
              </div>
              <div className="prediction-details">
                <div className="detail-row">
                  <FaCar className="icon" />
                  <span className="detail-value">{prediction.brand} {prediction.model}</span>
                </div>
                <div className="detail-row">
                  <FaCalendarAlt className="icon" />
                  <span className="detail-value">{prediction.year}</span>
                </div>
                <div className="detail-row">
                  <FaGasPump className="icon" />
                  <span className="detail-value">{prediction.fuelType}</span>
                </div>
                <div className="detail-row">
                  <FaCog className="icon" />
                  <span className="detail-value">{prediction.transmission}</span>
                </div>
              </div>
              <div className="prediction-price">
                <FaRupeeSign className="icon" />
                <span className="price">{formatPrice(prediction.predictedPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
