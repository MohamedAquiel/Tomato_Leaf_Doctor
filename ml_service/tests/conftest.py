import io
import pytest
from PIL import Image


def make_image_bytes(width=200, height=200, mode='RGB', fmt='JPEG'):
    img = Image.new(mode, (width, height), color=(120, 200, 80))
    buf = io.BytesIO()
    save_fmt = 'PNG' if fmt == 'PNG' else 'JPEG'
    img.save(buf, format=save_fmt)
    buf.seek(0)
    return buf.read()


@pytest.fixture
def valid_jpeg_bytes():
    return make_image_bytes(fmt='JPEG')


@pytest.fixture
def valid_png_bytes():
    return make_image_bytes(fmt='PNG', mode='RGBA')


@pytest.fixture
def grayscale_bytes():
    img = Image.new('L', (200, 200), color=120)
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    return buf.read()


@pytest.fixture
def large_image_bytes():
    return make_image_bytes(width=1024, height=1024, fmt='JPEG')


@pytest.fixture
def invalid_bytes():
    return b'this is not an image at all'
