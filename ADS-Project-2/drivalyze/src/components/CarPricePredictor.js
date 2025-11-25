import React, { useState, useEffect } from 'react';
import { FaCar, FaTachometerAlt, FaGasPump, FaCog, FaCalendarAlt, FaSearchDollar } from 'react-icons/fa';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './CarPricePredictor.css';

const API_BASE_URL = 'http://localhost:5001';

const CarPricePredictor = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    fuel_type: '',
    transmission: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableFuelTypes, setAvailableFuelTypes] = useState([]);
  const [availableTransmissions, setAvailableTransmissions] = useState([]);
  const { currentUser } = useAuth();

  // Fetch available brands, years, and transmissions from dataset on component mount
  useEffect(() => {
    const fetchDatasetOptions = async () => {
      try {
        // Fetch brands
        const brandsResponse = await fetch(`${API_BASE_URL}/api/brands`);
        if (!brandsResponse.ok) throw new Error('Failed to fetch brands');
        const brandsData = await brandsResponse.json();
        setAvailableBrands(brandsData.brands || []);

        // Fetch years
        const yearsResponse = await fetch(`${API_BASE_URL}/api/years`);
        if (yearsResponse.ok) {
          const yearsData = await yearsResponse.json();
          setAvailableYears(yearsData.years || []);
        }

        // Fetch transmissions
        const transmissionResponse = await fetch(`${API_BASE_URL}/api/transmissions`);
        if (transmissionResponse.ok) {
          const transmissionData = await transmissionResponse.json();
          setAvailableTransmissions(transmissionData.transmissions || []);
        }
      } catch (err) {
        console.error('Error fetching dataset options:', err);
        setError('Failed to load data. Please make sure the backend server is running.');
      }
    };
    fetchDatasetOptions();
  }, []);

  // Fetch models when brand changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!formData.brand) {
        setAvailableModels([]);
        setFormData(prev => ({ ...prev, model: '', fuel_type: '' }));
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/models/${encodeURIComponent(formData.brand)}`);
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        const models = data.models || [];
        setAvailableModels(models);
        
        // Reset model and fuel_type selection if the current model is not in the new list
        if (formData.model && !models.includes(formData.model)) {
          setFormData(prev => ({ ...prev, model: '', fuel_type: '' }));
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load car models. Please try again.');
        setAvailableModels([]);
      }
    };
    fetchModels();
  }, [formData.brand, formData.model]);

  // Fetch fuel types when brand and model are selected
  useEffect(() => {
    const fetchFuelTypes = async () => {
      if (!formData.brand || !formData.model) {
        setAvailableFuelTypes([]);
        setFormData(prev => ({ ...prev, fuel_type: '' }));
        return;
      }
      
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/fuel-types/${encodeURIComponent(formData.brand)}/${encodeURIComponent(formData.model)}`
        );
        if (!response.ok) throw new Error('Failed to fetch fuel types');
        const data = await response.json();
        const fuelTypes = data.fuel_types || [];
        setAvailableFuelTypes(fuelTypes);
        
        // Reset fuel_type selection if the current fuel_type is not in the new list
        if (formData.fuel_type && !fuelTypes.includes(formData.fuel_type)) {
          setFormData(prev => ({ ...prev, fuel_type: '' }));
        }
      } catch (err) {
        console.error('Error fetching fuel types:', err);
        setError('Failed to load fuel types. Please try again.');
        setAvailableFuelTypes([]);
      }
    };
    fetchFuelTypes();
  }, [formData.brand, formData.model, formData.fuel_type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'brand') {
      // When brand changes, reset model and fuel_type
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        model: '',
        fuel_type: ''
      }));
    } else if (name === 'model') {
      // When model changes, reset fuel_type
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        fuel_type: ''
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to make predictions');
      }

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          fuel_type: formData.fuel_type,
          transmission: formData.transmission
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get prediction');
      }
      
      const data = await response.json();
      const predictedPrice = data.predicted_price;
      setPrediction(predictedPrice);
      
      // Save prediction to Firestore
      try {
        await addDoc(collection(db, 'predictions'), {
          userId: currentUser.uid,
          userEmail: currentUser.email,
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          fuelType: formData.fuel_type,
          transmission: formData.transmission,
          predictedPrice: predictedPrice,
          timestamp: serverTimestamp()
        });
      } catch (firestoreError) {
        console.error('Error saving prediction to Firestore:', firestoreError);
        // Don't fail the prediction if Firestore save fails
      }
      
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Failed to get price prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    if (!price) return '';
    const formattedNumber = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
    return `₹${formattedNumber}`;
  };

  const isFormValid = formData.brand && formData.model && formData.year && formData.fuel_type && formData.transmission;

  return (
    <div className="predictor-container">
      <div className="predictor-header">
        <div className="header-content">
          <h1><FaSearchDollar className="header-icon" /> Car Price Predictor</h1>
          <p className="subtitle">Get an accurate estimate of your car's market value in seconds</p>
        </div>
        <div className="header-illustration">
          <div className="car-animation">
            <div className="car">
              <div className="car-top"></div>
              <div className="car-body">
                <div className="window"></div>
                <div className="wheel front"></div>
                <div className="wheel back"></div>
              </div>
              <div className="headlight"></div>
            </div>
            <div className="road"></div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="prediction-form glass-card">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <div className="input-with-icon">
            <FaCar className="input-icon" />
            <select 
              id="brand" 
              name="brand" 
              value={formData.brand}
              onChange={handleChange}
              required
              disabled={isLoading || availableBrands.length === 0}
              className={formData.brand ? 'has-value' : ''}
            >
            <option value="">Select Brand</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
            </select>
            <label htmlFor="brand" className={formData.brand ? 'active' : ''}>Car Brand</label>
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-with-icon">
            <FaCar className="input-icon" />
            <select 
              id="model" 
              name="model" 
              value={formData.model}
              onChange={handleChange}
              required
              disabled={!formData.brand || isLoading || availableModels.length === 0}
              className={formData.model ? 'has-value' : ''}
            >
            <option value="">Select Model</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
            </select>
            <label htmlFor="brand" className={formData.brand ? 'active' : ''}>Car Brand</label>
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-with-icon">
            <FaCalendarAlt className="input-icon" />
            <select 
              id="year" 
              name="year" 
              value={formData.year}
              onChange={handleChange}
              required
              disabled={isLoading || availableYears.length === 0}
              className={formData.year ? 'has-value' : ''}
            >
            <option value="">Select Year</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
            </select>
            <label htmlFor="brand" className={formData.brand ? 'active' : ''}>Car Brand</label>
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-with-icon">
            <FaGasPump className="input-icon" />
            <select 
              id="fuel_type" 
              name="fuel_type" 
              value={formData.fuel_type}
              onChange={handleChange}
              required
              disabled={!formData.brand || !formData.model || isLoading || availableFuelTypes.length === 0}
              className={formData.fuel_type ? 'has-value' : ''}
            >
            <option value="">Select Fuel Type</option>
            {availableFuelTypes.map(fuel => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
            </select>
            <label htmlFor="brand" className={formData.brand ? 'active' : ''}>Car Brand</label>
          </div>
        </div>
        
        <div className="form-group">
          <div className="input-with-icon">
            <FaCog className="input-icon" />
            <select 
              id="transmission" 
              name="transmission" 
              value={formData.transmission}
              onChange={handleChange}
              required
              disabled={isLoading || availableTransmissions.length === 0}
              className={formData.transmission ? 'has-value' : ''}
            >
            <option value="">Select Transmission</option>
            {availableTransmissions.map(transmission => (
              <option key={transmission} value={transmission}>{transmission}</option>
            ))}
            </select>
            <label htmlFor="brand" className={formData.brand ? 'active' : ''}>Car Brand</label>
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`predict-button ${!isFormValid ? 'disabled' : ''}`}
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <span className="button-loading">
              <span className="spinner"></span>
              Predicting...
            </span>
          ) : (
            <>
              <FaTachometerAlt className="button-icon" />
              Get Price Estimate
            </>
          )}
        </button>
      </form>
      
      {prediction && (
        <div className="prediction-result glass-card">
          <div className="result-header">
            <h3>Estimated Market Value</h3>
            <p>Based on current market trends and your vehicle details</p>
          </div>
          <div className="price-container">
            <div className="price">{formatPrice(prediction)}</div>
            <div className="price-label">Ex-Showroom Price</div>
          </div>
          <div className="disclaimer">
            <p>This is an estimated price. Actual market value may vary based on condition, mileage, and location.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarPricePredictor;
