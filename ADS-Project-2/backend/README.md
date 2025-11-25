# Car Price Prediction Backend

This backend provides a machine learning-based API for predicting car ex-showroom prices.

## Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Train the model:
```bash
python train_model.py
```

This will:
- Load and clean the car dataset
- Train a Random Forest model
- Save the model and encoders to the `models/` directory
- Generate `dataset_info.json` with available brands, models, fuel types, and transmissions

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5001`

## API Endpoints

- `GET /api/brands` - Get all available car brands from dataset
- `GET /api/models/<brand>` - Get available models for a specific brand
- `GET /api/fuel-types` - Get all available fuel types
- `GET /api/transmissions` - Get all available transmission types
- `POST /predict` - Predict ex-showroom price
  - Body: `{ "brand": "Hyundai", "model": "Creta", "fuel_type": "Petrol", "transmission": "Manual" }`

## Model Information

- Algorithm: Random Forest Regressor
- Features: Brand, Model, Fuel Type, Transmission
- Target: Ex-Showroom Price (in Indian Rupees)
- Dataset: 135 car configurations from popular Indian car brands

