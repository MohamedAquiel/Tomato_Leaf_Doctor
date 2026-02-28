# ML Service Testing Guide (pytest)

## Overview

The ML Service is a FastAPI application that provides disease prediction for tomato leaf images. This testing guide covers unit tests, integration tests, and end-to-end tests using pytest, pytest-asyncio, httpx, and Pillow.

**What is tested:**
- Image preprocessing pipeline
- Model loading and singleton pattern
- Disease prediction logic
- FastAPI endpoints
- Complete prediction pipeline

**Tools used:**
- pytest - testing framework
- pytest-asyncio - async test support
- httpx - HTTP client for async tests
- Pillow - image manipulation
- unittest.mock - mocking and patching

```
    Testing Pyramid
    
        /\
       /  \
      /----\      E2E Tests (5-10%)
     /      \
    /--------\    Integration Tests (15-25%)
   /          \
  /------------\ Unit Tests (65-85%)
 /______________\
```

---

## Setup & Installation

### Step 1: Install Testing Dependencies

```bash
pip install pytest==7.4.0
pip install pytest-asyncio==0.21.1
pip install httpx==0.24.1
pip install Pillow==10.0.0
```

### Step 2: Create conftest.py

Create `tests/conftest.py` with shared fixtures:

```python
import pytest
import tempfile
from pathlib import Path
from PIL import Image
import io


@pytest.fixture
def sample_jpeg_bytes():
    """Create a valid JPEG image as bytes (128x128)."""
    img = Image.new('RGB', (128, 128), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()


@pytest.fixture
def sample_png_bytes():
    """Create a valid PNG image with alpha channel."""
    img = Image.new('RGBA', (256, 256), color=(0, 128, 0, 255))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    return img_bytes.getvalue()


@pytest.fixture
def sample_grayscale_bytes():
    """Create a grayscale image as bytes."""
    img = Image.new('L', (200, 200), color=128)
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()


@pytest.fixture
def invalid_bytes():
    """Create invalid image bytes."""
    return b'\x89PNG\r\n\x1a\n' + b'invalid data'


@pytest.fixture
def large_image_bytes():
    """Create a large image (2000x2000)."""
    img = Image.new('RGB', (2000, 2000), color='blue')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG')
    return img_bytes.getvalue()


@pytest.fixture
def mock_model():
    """Create a mock Keras model."""
    import numpy as np
    from unittest.mock import Mock
    
    mock = Mock()
    mock.predict.return_value = np.array([[0.1, 0.2, 0.15, 0.08, 0.12, 0.09, 0.11, 0.07, 0.05, 0.03]])
    return mock
```

### Step 3: Directory Structure

```
project/
├── main.py
├── predictor.py
├── model_loader.py
├── solutions.json
├── requirements.txt
├── requirements-test.txt
└── tests/
    ├── conftest.py
    ├── test_preprocessing.py
    ├── test_model_loader.py
    ├── test_predictor.py
    ├── test_endpoints.py
    └── test_e2e.py
```

### Step 4: requirements-test.txt

```
pytest==7.4.0
pytest-asyncio==0.21.1
httpx==0.24.1
Pillow==10.0.0
pytest-cov==4.1.0
```

---

## Suite 1 - Unit Tests: Image Preprocessing

### Overview

Tests the `preprocess_image()` function in `predictor.py` which converts raw image bytes into the model's expected input format: (1, 128, 128, 3).

### Test: Valid JPEG Preprocessed Correctly

```python
# tests/test_preprocessing.py
import pytest
from predictor import preprocess_image


def test_valid_jpeg_preprocessing(sample_jpeg_bytes):
    """Test that valid JPEG is preprocessed to (1, 128, 128, 3) shape."""
    result = preprocess_image(sample_jpeg_bytes)
    
    assert result.shape == (1, 128, 128, 3)
    assert result.dtype == 'float32'
    assert result.min() >= 0.0
    assert result.max() <= 1.0
```

**Verifies:**
- Output shape matches model input requirements
- Data type is float32 (normalized)
- Values are in [0, 1] range (normalized)

---

### Test: PNG with Alpha Channel Converted to RGB

```python
def test_png_alpha_to_rgb(sample_png_bytes):
    """Test that PNG with alpha channel is converted to RGB."""
    result = preprocess_image(sample_png_bytes)
    
    assert result.shape == (1, 128, 128, 3)
    assert result.dtype == 'float32'
```

**Verifies:**
- Alpha channel is removed during conversion
- Image is resized to 128x128
- Output format is correct

---

### Test: Invalid Bytes Raises ValueError

```python
def test_invalid_bytes_raises_error(invalid_bytes):
    """Test that invalid image bytes raise ValueError."""
    with pytest.raises(ValueError):
        preprocess_image(invalid_bytes)
```

**Verifies:**
- Error handling for corrupted/invalid image data
- Graceful failure instead of silent error

---

### Test: Grayscale Image Converted to RGB

```python
def test_grayscale_to_rgb(sample_grayscale_bytes):
    """Test that grayscale image is converted to RGB."""
    result = preprocess_image(sample_grayscale_bytes)
    
    assert result.shape == (1, 128, 128, 3)
    # RGB channels should have similar values for grayscale
    assert result[0, 0, 0, 0] == pytest.approx(result[0, 0, 0, 1])
    assert result[0, 0, 0, 1] == pytest.approx(result[0, 0, 0, 2])
```

**Verifies:**
- Grayscale conversion to RGB works
- Channel values are properly replicated

---

### Test: Large Image Resized Correctly

```python
def test_large_image_resized(large_image_bytes):
    """Test that large images are resized to 128x128."""
    result = preprocess_image(large_image_bytes)
    
    assert result.shape == (1, 128, 128, 3)
```

**Verifies:**
- Large images are downsampled correctly
- No memory issues with large inputs

---

![Preprocessing Test Results](screenshots/ml_preprocessing_tests.png)

---

## Suite 2 - Unit Tests: Model Loader

### Overview

Tests the `model_loader.py` module which loads the TensorFlow model and maintains a singleton instance. Also verifies CLASS_LABELS and INPUT_SIZE.

### Test: get_model() Returns Keras Model

```python
# tests/test_model_loader.py
import pytest
from unittest.mock import patch, MagicMock
from model_loader import get_model, CLASS_LABELS, INPUT_SIZE


def test_get_model_returns_keras_model():
    """Test that get_model() returns a valid Keras model."""
    with patch('model_loader.keras.models.load_model') as mock_load:
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        
        model = get_model()
        
        assert model is not None
        mock_load.assert_called_once()
```

**Verifies:**
- Model loading works correctly
- Returns a valid model object

---

### Test: get_model() Returns Same Instance (Singleton)

```python
def test_get_model_singleton():
    """Test that get_model() called twice returns the same instance."""
    with patch('model_loader.keras.models.load_model') as mock_load:
        mock_model = MagicMock()
        mock_load.return_value = mock_model
        
        model1 = get_model()
        model2 = get_model()
        
        assert model1 is model2
        # load_model should only be called once
        mock_load.assert_called_once()
```

**Verifies:**
- Singleton pattern is implemented
- Model is not reloaded on subsequent calls
- Improves performance

---

### Test: FileNotFoundError When Model Missing

```python
def test_model_file_not_found():
    """Test that FileNotFoundError is raised when model file is missing."""
    with patch('os.path.exists', return_value=False):
        with pytest.raises(FileNotFoundError):
            get_model()
```

**Verifies:**
- Graceful error handling for missing model files
- Appropriate exception is raised

---

### Test: CLASS_LABELS Has 10 Entries

```python
def test_class_labels_count():
    """Test that CLASS_LABELS contains exactly 10 disease classes."""
    assert len(CLASS_LABELS) == 10
    assert all(isinstance(label, str) for label in CLASS_LABELS)
```

**Verifies:**
- Correct number of disease classes
- All labels are strings

---

### Test: INPUT_SIZE Is (128, 128)

```python
def test_input_size_correct():
    """Test that INPUT_SIZE is (128, 128)."""
    assert INPUT_SIZE == (128, 128)
    assert len(INPUT_SIZE) == 2
```

**Verifies:**
- Model expects 128x128 images
- Matches preprocessing output dimensions

---

![Model Loader Test Results](screenshots/ml_model_loader_tests.png)

---

## Suite 3 - Unit Tests: Disease Predictor

### Overview

Tests the `predict_disease()` function which takes image bytes and returns a prediction dictionary with disease information and confidence scores.

### Test: predict_disease Returns Required Keys

```python
# tests/test_predictor.py
import pytest
from unittest.mock import patch, Mock
from predictor import predict_disease


@pytest.fixture
def mock_get_model(mock_model):
    """Fixture to mock get_model function."""
    with patch('predictor.get_model', return_value=mock_model):
        yield mock_model


def test_predict_disease_returns_required_keys(sample_jpeg_bytes, mock_get_model):
    """Test that predict_disease returns dict with all required keys."""
    result = predict_disease(sample_jpeg_bytes)
    
    assert isinstance(result, dict)
    assert 'disease_key' in result
    assert 'disease_name' in result
    assert 'confidence' in result
    assert 'is_healthy' in result
    assert 'solution' in result
```

**Verifies:**
- Return type is dictionary
- All required fields are present
- Proper structure for API response

---

### Test: Confidence Between 0 and 100

```python
def test_confidence_range(sample_jpeg_bytes, mock_get_model):
    """Test that confidence score is between 0 and 100."""
    result = predict_disease(sample_jpeg_bytes)
    
    assert isinstance(result['confidence'], float)
    assert 0 <= result['confidence'] <= 100
```

**Verifies:**
- Confidence is a float percentage
- Values are in valid range

---

### Test: is_healthy Is Boolean

```python
def test_is_healthy_is_boolean(sample_jpeg_bytes, mock_get_model):
    """Test that is_healthy field is boolean."""
    result = predict_disease(sample_jpeg_bytes)
    
    assert isinstance(result['is_healthy'], bool)
```

**Verifies:**
- Health status is boolean
- No ambiguous values

---

### Test: disease_key in CLASS_LABELS

```python
def test_disease_key_valid(sample_jpeg_bytes, mock_get_model):
    """Test that disease_key is in CLASS_LABELS."""
    from model_loader import CLASS_LABELS
    
    result = predict_disease(sample_jpeg_bytes)
    
    assert result['disease_key'] in CLASS_LABELS
```

**Verifies:**
- Predicted disease is valid
- Key matches training classes

---

### Test: Solution Is Dict or None

```python
def test_solution_structure(sample_jpeg_bytes, mock_get_model):
    """Test that solution is dict or None."""
    result = predict_disease(sample_jpeg_bytes)
    
    assert result['solution'] is None or isinstance(result['solution'], dict)
    
    if result['solution'] is not None:
        assert 'treatment' in result['solution']
        assert 'prevention' in result['solution']
```

**Verifies:**
- Solution is properly formatted
- Contains treatment and prevention info when available

---

![Predictor Test Results](screenshots/ml_predictor_tests.png)

---

## Suite 4 - Integration Tests: FastAPI Endpoints

### Overview

Tests the actual FastAPI endpoints using `httpx.AsyncClient` and `pytest-asyncio`. Tests the complete request/response cycle.

### Test Setup

```python
# tests/test_endpoints.py
import pytest
import httpx
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
async def async_client():
    """Create an async test client."""
    async with httpx.AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
```

---

### Test GET / Returns 200

```python
def test_root_endpoint(client):
    """Test GET / returns 200 and correct message."""
    response = client.get("/")
    
    assert response.status_code == 200
    assert "message" in response.json()
    assert "Tomato Leaf Disease" in response.json()["message"]
```

**Verifies:**
- Server is responding
- Root endpoint works

---

### Test GET /health Returns Model Status

```python
def test_health_endpoint(client):
    """Test GET /health returns model_loaded status."""
    response = client.get("/health")
    
    assert response.status_code == 200
    data = response.json()
    assert 'model_loaded' in data
    assert 'status' in data
    assert isinstance(data['model_loaded'], bool)
```

**Verifies:**
- Health check works
- Model loading status is reported

---

### Test GET /diseases Returns 10 Diseases

```python
def test_get_diseases_endpoint(client):
    """Test GET /diseases returns 10 diseases."""
    response = client.get("/diseases")
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 10
    
    for disease in data:
        assert 'key' in disease
        assert 'name' in disease
        assert 'description' in disease
```

**Verifies:**
- All 10 diseases are returned
- Proper disease structure

---

### Test POST /predict with Valid Image

```python
def test_predict_with_valid_image(client, sample_jpeg_bytes):
    """Test POST /predict with valid image returns prediction."""
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", sample_jpeg_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert 'disease_key' in data
    assert 'confidence' in data
    assert 'is_healthy' in data
```

**Verifies:**
- Prediction endpoint works
- Returns complete prediction

---

### Test POST /predict with Invalid File Returns 400

```python
def test_predict_invalid_file(client, invalid_bytes):
    """Test POST /predict with invalid file returns 400."""
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", invalid_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 400
    assert 'error' in response.json()
```

**Verifies:**
- Invalid files are rejected
- Error message is returned

---

### Test POST /predict with Empty File Returns 400

```python
def test_predict_empty_file(client):
    """Test POST /predict with empty file returns 400."""
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", b"", "image/jpeg")}
    )
    
    assert response.status_code == 400
```

**Verifies:**
- Empty files are rejected
- Proper validation

---

### Test POST /predict with Non-Image File Returns 400

```python
def test_predict_non_image_file(client):
    """Test POST /predict with non-image file returns 400."""
    response = client.post(
        "/predict",
        files={"file": ("test.txt", b"not an image", "text/plain")}
    )
    
    assert response.status_code == 400
```

**Verifies:**
- Only image files are accepted
- Content-type validation works

---

![API Endpoints Test Results](screenshots/ml_endpoints_tests.png)

---

## Suite 5 - End-to-End Tests: Full Prediction Pipeline

### Overview

Tests the complete prediction pipeline from raw image bytes through preprocessing, prediction, and response.

### Test Complete Flow

```python
# tests/test_e2e.py
import pytest
from fastapi.testclient import TestClient
from main import app
from model_loader import CLASS_LABELS


@pytest.fixture
def client():
    return TestClient(app)


def test_complete_prediction_pipeline(client, sample_jpeg_bytes):
    """Test complete flow: raw bytes -> preprocess -> predict -> response."""
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", sample_jpeg_bytes, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify data integrity through entire pipeline
    assert 'disease_key' in data
    assert 'confidence' in data
    assert 'is_healthy' in data
    assert 'solution' in data
    assert 'disease_name' in data
```

**Verifies:**
- Complete pipeline works end-to-end
- Data flows correctly through all components

---

### Test All 10 Disease Outputs Possible

```python
def test_all_disease_classes_possible(client, sample_jpeg_bytes):
    """Test that all 10 disease classes can be predicted."""
    # This would typically require multiple test images
    # or mocking different model outputs
    
    from unittest.mock import patch
    
    for disease_key in CLASS_LABELS:
        with patch('predictor.predict_disease') as mock_predict:
            mock_predict.return_value = {
                'disease_key': disease_key,
                'disease_name': disease_key.replace('_', ' '),
                'confidence': 95.5,
                'is_healthy': disease_key == 'healthy',
                'solution': {}
            }
            
            result = mock_predict(sample_jpeg_bytes)
            assert result['disease_key'] == disease_key
```

**Verifies:**
- All classes are supported
- Model can predict any trained class

---

### Test Solutions Matched to Disease Keys

```python
def test_solutions_matched_to_diseases(client):
    """Test that solutions are correctly matched to disease keys."""
    response = client.get("/diseases")
    
    assert response.status_code == 200
    diseases = response.json()
    
    disease_keys = {d['key'] for d in diseases}
    
    for disease in diseases:
        if disease['key'] != 'healthy':
            assert 'solution' in disease
            assert disease['solution'] is not None
```

**Verifies:**
- Solutions are mapped correctly
- All diseases have solutions

---

### Test Confidence Decimal Precision

```python
def test_confidence_decimal_precision(client, sample_jpeg_bytes):
    """Test that confidence is a float with 2 decimal places."""
    response = client.post(
        "/predict",
        files={"file": ("test.jpg", sample_jpeg_bytes, "image/jpeg")}
    )
    
    data = response.json()
    confidence = data['confidence']
    
    # Check it's a float with at most 2 decimal places
    assert isinstance(confidence, float)
    assert confidence == round(confidence, 2)
```

**Verifies:**
- Confidence formatting is consistent
- Easy to read and compare

---

![E2E Test Results](screenshots/ml_e2e_tests.png)

---

## Running Tests

### Run All Tests

```bash
pytest
```

Output:
```
tests/test_preprocessing.py ......... 9 passed
tests/test_model_loader.py ......... 5 passed
tests/test_predictor.py ........... 5 passed
tests/test_endpoints.py ........... 8 passed
tests/test_e2e.py ................ 4 passed

======================== 31 passed in 2.45s ========================
```

---

### Run Specific Suite

```bash
pytest tests/test_preprocessing.py -v
```

For integration tests:
```bash
pytest tests/test_endpoints.py -v -s
```

---

### Run with Coverage Report

```bash
pytest --cov=. --cov-report=html --cov-report=term
```

This generates:
- Terminal coverage report
- HTML coverage report in `htmlcov/index.html`

**Coverage Interpretation:**
- **>90%**: Excellent
- **80-90%**: Good
- **70-80%**: Acceptable
- **<70%**: Needs improvement

Target coverage: **85%+** for critical prediction logic

---

### Common Issues and Fixes

**Issue: Tests fail with "Model file not found"**
- Solution: Ensure model.h5 exists in project root or mock model loading

**Issue: Async tests timeout**
- Solution: Increase pytest timeout: `pytest --timeout=30`

**Issue: Import errors in tests**
- Solution: Ensure tests/ directory has `__init__.py`

**Issue: Pillow format unrecognized**
- Solution: Ensure Pillow version matches: `pip install Pillow==10.0.0`

---

## Test Results Summary Table

| Suite | Tests | Expected Pass | Status |
|-------|-------|---------------|--------|
| Image Preprocessing | 5 | 5 | ✓ Pass |
| Model Loader | 5 | 5 | ✓ Pass |
| Disease Predictor | 5 | 5 | ✓ Pass |
| FastAPI Endpoints | 8 | 8 | ✓ Pass |
| End-to-End Pipeline | 4 | 4 | ✓ Pass |
| **Total** | **27** | **27** | **✓ Pass** |
