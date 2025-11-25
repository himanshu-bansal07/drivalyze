import pandas as pd
import json

# Load the dataset
df = pd.read_csv('data/cars_data.csv')

# Remove any rows with missing values
df = df.dropna()

# Get unique brands, models, fuel types, and transmissions
brands = sorted(df['brand'].unique().tolist())
models_by_brand = {}
fuel_types_by_brand_model = {}

# Group models by brand
for brand in brands:
    models = sorted(df[df['brand'] == brand]['model'].unique().tolist())
    models_by_brand[brand] = models
    
    # Get fuel types for each brand and model combination
    for model in models:
        fuel_types = sorted(df[(df['brand'] == brand) & (df['model'] == model)]['fuel_type'].unique().tolist())
        fuel_types_by_brand_model[f"{brand}|{model}"] = fuel_types

# Get all unique fuel types and transmissions
fuel_types = sorted(df['fuel_type'].unique().tolist())
transmissions = sorted(df['transmission'].unique().tolist())
years = sorted(df['year'].unique().tolist())

# Create dataset info dictionary
dataset_info = {
    'brands': brands,
    'models_by_brand': models_by_brand,
    'fuel_types': fuel_types,
    'transmissions': transmissions,
    'years': years,
    'year_range': {
        'min': int(df['year'].min()),
        'max': int(df['year'].max())
    },
    'fuel_types_by_brand_model': fuel_types_by_brand_model
}

# Save to file
with open('models/dataset_info.json', 'w') as f:
    json.dump(dataset_info, f, indent=2)

print("Dataset info updated successfully!")
print(f"Total brands: {len(brands)}")
print(f"Total models: {sum(len(models) for models in models_by_brand.values())}")
print(f"Fuel types: {fuel_types}")
print(f"Transmissions: {transmissions}")
print(f"Year range: {dataset_info['year_range']}")
