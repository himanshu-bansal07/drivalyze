import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

# Load the dataset
print("Loading dataset...")
df = pd.read_csv('data/cars_data.csv')

# Display basic info
print(f"\nDataset shape: {df.shape}")
print(f"\nFirst few rows:")
print(df.head())
print(f"\nData types:")
print(df.dtypes)
print(f"\nMissing values:")
print(df.isnull().sum())

# Clean and prepare data
print("\nCleaning data...")
df = df.dropna()  # Remove any missing values
df = df[df['ex_showroom_price'] > 0]  # Remove invalid prices

# Encode categorical variables
print("\nEncoding categorical variables...")
le_brand = LabelEncoder()
le_model = LabelEncoder()
le_fuel = LabelEncoder()
le_transmission = LabelEncoder()

df['brand_encoded'] = le_brand.fit_transform(df['brand'])
df['model_encoded'] = le_model.fit_transform(df['model'])
df['fuel_encoded'] = le_fuel.fit_transform(df['fuel_type'])
df['transmission_encoded'] = le_transmission.fit_transform(df['transmission'])

# Prepare features and target (include year as a feature)
X = df[['brand_encoded', 'model_encoded', 'year', 'fuel_encoded', 'transmission_encoded']]
y = df['ex_showroom_price']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
print("\nTraining Random Forest model...")
rf_model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=10)
rf_model.fit(X_train, y_train)

# Make predictions
y_train_pred = rf_model.predict(X_train)
y_test_pred = rf_model.predict(X_test)

# Evaluate the model
train_mae = mean_absolute_error(y_train, y_train_pred)
test_mae = mean_absolute_error(y_test, y_test_pred)
train_rmse = np.sqrt(mean_squared_error(y_train, y_train_pred))
test_rmse = np.sqrt(mean_squared_error(y_test, y_test_pred))
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)

print("\n" + "="*50)
print("Model Performance Metrics:")
print("="*50)
print(f"Training MAE:  ₹{train_mae:,.2f}")
print(f"Testing MAE:   ₹{test_mae:,.2f}")
print(f"Training RMSE: ₹{train_rmse:,.2f}")
print(f"Testing RMSE:  ₹{test_rmse:,.2f}")
print(f"Training R²:   {train_r2:.4f}")
print(f"Testing R²:    {test_r2:.4f}")
print("="*50)

# Save the model and encoders
print("\nSaving model and encoders...")
os.makedirs('models', exist_ok=True)

joblib.dump(rf_model, 'models/car_price_model.pkl')
joblib.dump(le_brand, 'models/brand_encoder.pkl')
joblib.dump(le_model, 'models/model_encoder.pkl')
joblib.dump(le_fuel, 'models/fuel_encoder.pkl')
joblib.dump(le_transmission, 'models/transmission_encoder.pkl')

# Save the unique values for API
unique_brands = sorted(df['brand'].unique().tolist())
unique_models_by_brand = {}
fuel_types_by_brand_model = {}

for brand in unique_brands:
    brand_df = df[df['brand'] == brand]
    unique_models_by_brand[brand] = sorted(brand_df['model'].unique().tolist())
    
    # Get fuel types for each brand-model combination
    for model in unique_models_by_brand[brand]:
        key = f"{brand}|{model}"
        fuel_types = sorted(brand_df[brand_df['model'] == model]['fuel_type'].unique().tolist())
        fuel_types_by_brand_model[key] = fuel_types

# Get available years from dataset
available_years = sorted(df['year'].unique().tolist())

import json
with open('models/dataset_info.json', 'w') as f:
    json.dump({
        'brands': unique_brands,
        'models_by_brand': unique_models_by_brand,
        'fuel_types_by_brand_model': fuel_types_by_brand_model,
        'fuel_types': sorted(df['fuel_type'].unique().tolist()),
        'transmissions': sorted(df['transmission'].unique().tolist()),
        'years': available_years,
        'year_range': {
            'min': int(df['year'].min()),
            'max': int(df['year'].max())
        }
    }, f, indent=2)

print("\nModel training completed successfully!")
print(f"Unique brands: {len(unique_brands)}")
print(f"Unique models: {sum(len(models) for models in unique_models_by_brand.values())}")
print("\nSaved files:")
print("  - models/car_price_model.pkl")
print("  - models/brand_encoder.pkl")
print("  - models/model_encoder.pkl")
print("  - models/fuel_encoder.pkl")
print("  - models/transmission_encoder.pkl")
print("  - models/dataset_info.json")

