import sys
import os
from unittest.mock import MagicMock, patch

tf_mock = MagicMock()
sys.modules['tensorflow'] = tf_mock
sys.modules['tensorflow.keras'] = tf_mock.keras
sys.modules['tensorflow.keras.models'] = tf_mock.keras.models

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
import numpy as np
from conftest import make_image_bytes


def make_mock_model(class_index=1):
    mock_model = MagicMock()
    probs = np.zeros((1, 10), dtype=np.float32)
    probs[0][class_index] = 0.9743
    mock_model.predict.return_value = probs
    return mock_model


class TestPredictDisease:

    def test_returns_dict_with_all_required_keys(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=1)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        required_keys = {'disease_key', 'display_name', 'confidence', 'is_healthy', 'solution'}
        assert required_keys.issubset(result.keys())

    def test_confidence_is_between_0_and_100(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=1)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert 0.0 <= result['confidence'] <= 100.0

    def test_confidence_rounded_to_2_decimal_places(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=1)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert result['confidence'] == round(result['confidence'], 2)

    def test_disease_key_in_class_labels(self):
        from predictor import predict_disease
        from model_loader import CLASS_LABELS
        mock_model = make_mock_model(class_index=2)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert result['disease_key'] in CLASS_LABELS

    def test_is_healthy_true_for_healthy_class(self):
        from predictor import predict_disease
        from model_loader import CLASS_LABELS
        healthy_index = CLASS_LABELS.index('Tomato___Healthy')
        mock_model = make_mock_model(class_index=healthy_index)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert result['is_healthy'] is True

    def test_is_healthy_false_for_diseased_class(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=0)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert result['is_healthy'] is False

    def test_is_healthy_is_boolean(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=1)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert isinstance(result['is_healthy'], bool)

    def test_solution_is_dict_or_none(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=1)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert result['solution'] is None or isinstance(result['solution'], dict)

    def test_display_name_is_string(self):
        from predictor import predict_disease
        mock_model = make_mock_model(class_index=1)
        with patch('predictor.get_model', return_value=mock_model):
            result = predict_disease(make_image_bytes())
        assert isinstance(result['display_name'], str)
        assert len(result['display_name']) > 0

    def test_model_inference_failure_raises_runtime_error(self):
        from predictor import predict_disease
        mock_model = MagicMock()
        mock_model.predict.side_effect = Exception('GPU out of memory')
        with patch('predictor.get_model', return_value=mock_model):
            with pytest.raises(RuntimeError, match='Prediction failed'):
                predict_disease(make_image_bytes())

    def test_invalid_image_raises_value_error(self, invalid_bytes):
        from predictor import predict_disease
        mock_model = make_mock_model()
        with patch('predictor.get_model', return_value=mock_model):
            with pytest.raises(ValueError):
                predict_disease(invalid_bytes)
