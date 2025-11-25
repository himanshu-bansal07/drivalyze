from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import json
import os

# Global variables to store the model and dataset info
model = None
brand_encoder = None
model_encoder = None
fuel_encoder = None
transmission_encoder = None
dataset_info = None

def load_models_and_data():
    """Load the model and dataset info"""
    global model, brand_encoder, model_encoder, fuel_encoder, transmission_encoder, dataset_info
    
    print("Loading model and encoders...")
    try:
        model = joblib.load('models/car_price_model.pkl')
        brand_encoder = joblib.load('models/brand_encoder.pkl')
        model_encoder = joblib.load('models/model_encoder.pkl')
        fuel_encoder = joblib.load('models/fuel_encoder.pkl')
        transmission_encoder = joblib.load('models/transmission_encoder.pkl')
        
        # Load dataset info
        with open('models/dataset_info.json', 'r') as f:
            dataset_info = json.load(f)
        
        print("Model and dataset info loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading model or dataset: {e}")
        return False

app = Flask(__name__)
CORS(app)

# Load models and dataset info on startup
load_models_and_data()

@app.route('/api/brands', methods=['GET'])
def get_brands():
    """Get all available brands from the dataset"""
    if dataset_info:
        return jsonify({'brands': dataset_info['brands']})
    return jsonify({'error': 'Dataset not loaded'}), 500

@app.route('/api/models/<brand>', methods=['GET'])
def get_models(brand):
    """Get all available models for a specific brand"""
    if dataset_info:
        brand = brand.replace('_', ' ')  # Handle URL encoding
        models = dataset_info['models_by_brand'].get(brand, [])
        return jsonify({'models': models, 'brand': brand})
    return jsonify({'error': 'Dataset not loaded'}), 500

@app.route('/api/fuel-types', methods=['GET'])
def get_fuel_types():
    """Get all available fuel types from the dataset (for backward compatibility)"""
    if dataset_info:
        return jsonify({'fuel_types': dataset_info['fuel_types']})
    return jsonify({'error': 'Dataset not loaded'}), 500

@app.route('/api/fuel-types/<brand>/<model>', methods=['GET'])
def get_fuel_types_for_model(brand, model):
    """Get available fuel types for a specific brand and model"""
    if dataset_info:
        brand = brand.replace('_', ' ')  # Handle URL encoding
        model = model.replace('_', ' ')  # Handle URL encoding
        key = f"{brand}|{model}"
        fuel_types = dataset_info.get('fuel_types_by_brand_model', {}).get(key, [])
        return jsonify({'fuel_types': fuel_types, 'brand': brand, 'model': model})
    return jsonify({'error': 'Dataset not loaded'}), 500

@app.route('/api/transmissions', methods=['GET'])
def get_transmissions():
    """Get all available transmissions from the dataset"""
    if dataset_info:
        return jsonify({'transmissions': dataset_info['transmissions']})
    return jsonify({'error': 'Dataset not loaded'}), 500

@app.route('/api/years', methods=['GET'])
def get_years():
    """Get all available years from the dataset"""
    if dataset_info:
        year_info = {
            'years': dataset_info.get('years', []),
            'year_range': dataset_info.get('year_range', {})
        }
        return jsonify(year_info)
    return jsonify({'error': 'Dataset not loaded'}), 500

@app.route('/predict', methods=['POST'])
def predict_price():
    """Predict ex-showroom price based on car features"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['brand', 'model', 'year', 'fuel_type', 'transmission']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        brand = data['brand']
        model_name = data['model']
        year = int(data['year'])
        fuel_type = data['fuel_type']
        transmission = data['transmission']
        
        # Validate that values exist in dataset
        if brand not in dataset_info['brands']:
            return jsonify({'error': f'Brand "{brand}" not found in dataset'}), 400
        
        if model_name not in dataset_info['models_by_brand'].get(brand, []):
            return jsonify({'error': f'Model "{model_name}" not found for brand "{brand}"'}), 400
        
        # Validate year is within range
        year_range = dataset_info.get('year_range', {})
        if year < year_range.get('min', 2019) or year > year_range.get('max', 2024):
            return jsonify({'error': f'Year {year} is out of valid range ({year_range.get("min", 2019)}-{year_range.get("max", 2024)})'}), 400
        
        if fuel_type not in dataset_info['fuel_types']:
            return jsonify({'error': f'Fuel type "{fuel_type}" not found in dataset'}), 400
        
        if transmission not in dataset_info['transmissions']:
            return jsonify({'error': f'Transmission "{transmission}" not found in dataset'}), 400
        
        # Encode the features
        try:
            brand_encoded = brand_encoder.transform([brand])[0]
            model_encoded = model_encoder.transform([model_name])[0]
            fuel_encoded = fuel_encoder.transform([fuel_type])[0]
            transmission_encoded = transmission_encoder.transform([transmission])[0]
        except ValueError as e:
            return jsonify({'error': f'Encoding error: {str(e)}'}), 400
        
        # Prepare features array (including year)
        features = np.array([[brand_encoded, model_encoded, year, fuel_encoded, transmission_encoded]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Ensure prediction is positive
        predicted_price = max(0, float(prediction))
        
        return jsonify({
            'predicted_price': round(predicted_price, 2),
            'brand': brand,
            'model': model_name,
            'year': year,
            'fuel_type': fuel_type,
            'transmission': transmission
        })
    
    except Exception as e:
        return jsonify({'error': f'Prediction error: {str(e)}'}), 500

@app.route('/api/reload', methods=['POST'])
def reload_data():
    """Reload the dataset info and models"""
    success = load_models_and_data()
    if success:
        return jsonify({
            'status': 'success',
            'message': 'Dataset and models reloaded successfully',
            'brands_count': len(dataset_info['brands']) if dataset_info else 0,
            'models_count': sum(len(models) for models in dataset_info['models_by_brand'].values()) if dataset_info else 0
        })
    else:
        return jsonify({
            'status': 'error',
            'message': 'Failed to reload dataset and models'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'dataset_info_loaded': dataset_info is not None,
        'brands_count': len(dataset_info['brands']) if dataset_info else 0,
        'models_count': sum(len(models) for models in dataset_info['models_by_brand'].values()) if dataset_info else 0
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)

