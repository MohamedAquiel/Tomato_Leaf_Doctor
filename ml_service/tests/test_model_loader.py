import sys
import os
from unittest.mock import MagicMock, patch

tf_mock = MagicMock()
sys.modules['tensorflow'] = tf_mock
sys.modules['tensorflow.keras'] = tf_mock.keras
sys.modules['tensorflow.keras.models'] = tf_mock.keras.models

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest


class TestConstants:

    def test_class_labels_has_10_entries(self):
        from model_loader import CLASS_LABELS
        assert len(CLASS_LABELS) == 10

    def test_class_labels_contains_healthy(self):
        from model_loader import CLASS_LABELS
        assert 'Tomato___Healthy' in CLASS_LABELS

    def test_class_labels_all_strings(self):
        from model_loader import CLASS_LABELS
        assert all(isinstance(label, str) for label in CLASS_LABELS)

    def test_class_labels_start_with_tomato(self):
        from model_loader import CLASS_LABELS
        for label in CLASS_LABELS:
            assert label.startswith('Tomato___')

    def test_input_size_is_128x128(self):
        from model_loader import INPUT_SIZE
        assert INPUT_SIZE == (128, 128)

    def test_input_size_is_tuple(self):
        from model_loader import INPUT_SIZE
        assert isinstance(INPUT_SIZE, tuple)

    def test_input_size_has_two_elements(self):
        from model_loader import INPUT_SIZE
        assert len(INPUT_SIZE) == 2

    def test_all_class_labels_unique(self):
        from model_loader import CLASS_LABELS
        assert len(CLASS_LABELS) == len(set(CLASS_LABELS))


class TestGetModel:

    def test_model_file_not_found_raises_error(self):
        import model_loader
        model_loader._model = None
        with patch('os.path.exists', return_value=False):
            with pytest.raises(FileNotFoundError):
                model_loader.get_model()
        model_loader._model = None

    def test_get_model_returns_cached_on_second_call(self):
        import model_loader
        mock_model = MagicMock()
        model_loader._model = mock_model
        result = model_loader.get_model()
        assert result is mock_model
        model_loader._model = None

    def test_model_load_failure_raises_runtime_error(self):
        import model_loader
        model_loader._model = None
        with patch('os.path.exists', return_value=True):
            with patch('model_loader.tf') as mock_tf:
                mock_tf.keras.models.load_model.side_effect = Exception('load failed')
                with pytest.raises(RuntimeError):
                    model_loader.get_model()
        model_loader._model = None
