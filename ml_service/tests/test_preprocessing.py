import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import pytest
import numpy as np
from unittest.mock import MagicMock, patch

import sys
tf_mock = MagicMock()
sys.modules['tensorflow'] = tf_mock
sys.modules['tensorflow.keras'] = tf_mock.keras
sys.modules['tensorflow.keras.models'] = tf_mock.keras.models

from predictor import preprocess_image
from conftest import make_image_bytes


class TestPreprocessImage:

    def test_valid_jpeg_returns_correct_shape(self, valid_jpeg_bytes):
        result = preprocess_image(valid_jpeg_bytes)
        assert result.shape == (1, 128, 128, 3)

    def test_valid_png_rgba_converted_to_rgb(self, valid_png_bytes):
        result = preprocess_image(valid_png_bytes)
        assert result.shape == (1, 128, 128, 3)

    def test_grayscale_converted_to_rgb(self, grayscale_bytes):
        result = preprocess_image(grayscale_bytes)
        assert result.shape == (1, 128, 128, 3)

    def test_large_image_resized_correctly(self, large_image_bytes):
        result = preprocess_image(large_image_bytes)
        assert result.shape == (1, 128, 128, 3)

    def test_output_dtype_is_float32(self, valid_jpeg_bytes):
        result = preprocess_image(valid_jpeg_bytes)
        assert result.dtype == np.float32

    def test_pixel_values_normalized_between_0_and_1(self, valid_jpeg_bytes):
        result = preprocess_image(valid_jpeg_bytes)
        assert result.min() >= 0.0
        assert result.max() <= 1.0

    def test_invalid_bytes_raises_value_error(self, invalid_bytes):
        with pytest.raises(ValueError, match="Could not decode image bytes"):
            preprocess_image(invalid_bytes)

    def test_empty_bytes_raises_value_error(self):
        with pytest.raises(ValueError):
            preprocess_image(b'')

    def test_batch_dimension_added(self, valid_jpeg_bytes):
        result = preprocess_image(valid_jpeg_bytes)
        assert len(result.shape) == 4
        assert result.shape[0] == 1
