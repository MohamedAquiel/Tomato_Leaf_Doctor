# ML Service - Tomato Leaf Disease Prediction

## Overview

This is a **FastAPI** service that serves a Convolutional Neural Network (CNN) model for predicting diseases in tomato leaf images. The service accepts image uploads via a REST API and returns disease predictions along with confidence scores, enabling integration with any frontend or backend client.

---

## Prerequisites

- **Python 3.11** — ⚠️ **Important:** TensorFlow does **not** support Python 3.14 or later. You **must** use Python 3.11.
- **pip** (comes bundled with Python)

---

## Setup Instructions

### 1. Create a Virtual Environment

```bash
python -m venv venv
```

### 2. Activate the Virtual Environment

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **Linux / Mac:**
  ```bash
  source venv/bin/activate
  ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Service

```bash
python main.py
```

The service will start on `http://localhost:8000` by default.

---

## API Endpoints

| Method | Endpoint    | Description                              |
|--------|-------------|------------------------------------------|
| GET    | `/`         | Health check                             |
| GET    | `/health`   | Detailed health status with model info   |
| POST   | `/predict`  | Predict disease from an uploaded image   |
| GET    | `/diseases` | List all supported disease classes       |

---

## Example Usage

### Predict Disease from an Image

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -F "file=@tomato_leaf.jpg"
```

### Response Format

```json
{
  "success": true,
  "predicted_class": "Tomato___Early_blight",
  "confidence": 0.9732,
  "all_predictions": {
    "Tomato___Bacterial_spot": 0.0021,
    "Tomato___Early_blight": 0.9732,
    "Tomato___Late_blight": 0.0105,
    "Tomato___Leaf_Miner": 0.0012,
    "Tomato___Mosaic_virus": 0.0008,
    "Tomato___Septoria_leaf_spot": 0.0047,
    "Tomato___Spider_mites": 0.0031,
    "Tomato___Target_Spot": 0.0019,
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": 0.0014,
    "Tomato___healthy": 0.0011
  },
  "message": "Prediction completed successfully"
}
```

---

## Model

The CNN model file is expected to be located at:

```
../Model/best_improved_cnn.h5
```

Ensure the model file exists at this path relative to the `ml_service` directory before starting the service.

---

## CORS Configuration

The service is configured to allow cross-origin requests from the following origins:

- `http://localhost:3000`
- `http://localhost:5000`
- `http://localhost:5173`
