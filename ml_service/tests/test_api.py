import sys
import os
import io
from unittest.mock import MagicMock, patch

tf_mock = MagicMock()
sys.modules['tensorflow'] = tf_mock
sys.modules['tensorflow.keras'] = tf_mock.keras
sys.modules['tensorflow.keras.models'] = tf_mock.keras.models

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient


def make_image_bytes(width=200, height=200, mode='RGB', fmt='JPEG'):
    img = Image.new(mode, (width, height), color=(120, 200, 80))
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    buf.seek(0)
    return buf.read()


def make_mock_model(class_index=1):
    mock_model = MagicMock()
    probs = np.zeros((1, 10), dtype=np.float32)
    probs[0][class_index] = 0.9743
    mock_model.predict.return_value = probs
    return mock_model


@pytest.fixture(scope='module')
def client():
    mock_model = make_mock_model(class_index=1)
    with patch('model_loader.get_model', return_value=mock_model):
        with patch('model_loader._model', mock_model):
            from main import app
            with TestClient(app) as c:
                yield c


class TestRootEndpoint:

    def test_root_returns_200(self, client):
        res = client.get('/')
        assert res.status_code == 200

    def test_root_returns_message(self, client):
        res = client.get('/')
        data = res.json()
        assert 'message' in data

    def test_root_returns_version(self, client):
        res = client.get('/')
        data = res.json()
        assert 'version' in data
        assert data['version'] == '1.0.0'

    def test_root_returns_status_healthy(self, client):
        res = client.get('/')
        data = res.json()
        assert data['status'] == 'healthy'


class TestHealthEndpoint:

    def test_health_returns_200(self, client):
        res = client.get('/health')
        assert res.status_code == 200

    def test_health_returns_model_loaded_field(self, client):
        res = client.get('/health')
        data = res.json()
        assert 'model_loaded' in data

    def test_health_returns_num_classes(self, client):
        res = client.get('/health')
        data = res.json()
        assert data['num_classes'] == 10

    def test_health_returns_input_size(self, client):
        res = client.get('/health')
        data = res.json()
        assert 'input_size' in data
        assert '128' in data['input_size']

    def test_health_returns_classes_list(self, client):
        res = client.get('/health')
        data = res.json()
        assert 'classes' in data
        assert len(data['classes']) == 10

    def test_health_status_field_present(self, client):
        res = client.get('/health')
        data = res.json()
        assert data['status'] in ('healthy', 'degraded')


class TestDiseasesEndpoint:

    def test_diseases_returns_200(self, client):
        res = client.get('/diseases')
        assert res.status_code == 200

    def test_diseases_returns_10_entries(self, client):
        res = client.get('/diseases')
        data = res.json()
        assert data['total'] == 10

    def test_diseases_list_has_correct_keys(self, client):
        res = client.get('/diseases')
        data = res.json()
        first = data['diseases'][0]
        assert 'id' in first
        assert 'class_name' in first
        assert 'display_name' in first

    def test_diseases_class_names_start_with_tomato(self, client):
        res = client.get('/diseases')
        data = res.json()
        for d in data['diseases']:
            assert d['class_name'].startswith('Tomato___')

    def test_diseases_ids_are_sequential(self, client):
        res = client.get('/diseases')
        data = res.json()
        ids = [d['id'] for d in data['diseases']]
        assert ids == list(range(10))


class TestPredictEndpoint:

    def test_predict_valid_jpeg_returns_200(self, client):
        mock_model = make_mock_model(1)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        assert res.status_code == 200

    def test_predict_returns_disease_key(self, client):
        mock_model = make_mock_model(1)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        data = res.json()
        assert 'disease_key' in data

    def test_predict_returns_confidence(self, client):
        mock_model = make_mock_model(1)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        data = res.json()
        assert 'confidence' in data
        assert 0 <= data['confidence'] <= 100

    def test_predict_returns_is_healthy(self, client):
        mock_model = make_mock_model(1)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        data = res.json()
        assert 'is_healthy' in data
        assert isinstance(data['is_healthy'], bool)

    def test_predict_returns_display_name(self, client):
        mock_model = make_mock_model(1)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        data = res.json()
        assert 'display_name' in data
        assert isinstance(data['display_name'], str)

    def test_predict_non_image_returns_400(self, client):
        res = client.post('/predict', files={'file': ('doc.pdf', b'pdf content', 'application/pdf')})
        assert res.status_code == 400

    def test_predict_empty_file_returns_400(self, client):
        res = client.post('/predict', files={'file': ('empty.jpg', b'', 'image/jpeg')})
        assert res.status_code == 400

    def test_predict_png_returns_200(self, client):
        mock_model = make_mock_model(9)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes(fmt='PNG')
            res = client.post('/predict', files={'file': ('leaf.png', img_bytes, 'image/png')})
        assert res.status_code == 200

    def test_predict_healthy_class_is_healthy_true(self, client):
        mock_model = make_mock_model(class_index=9)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        data = res.json()
        assert data['is_healthy'] is True

    def test_predict_status_field_success(self, client):
        mock_model = make_mock_model(1)
        with patch('predictor.get_model', return_value=mock_model):
            img_bytes = make_image_bytes()
            res = client.post('/predict', files={'file': ('leaf.jpg', img_bytes, 'image/jpeg')})
        data = res.json()
        assert data['status'] == 'success'
