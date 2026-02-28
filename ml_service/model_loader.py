import logging
import os

import tensorflow as tf


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)




CLASS_LABELS: list[str] = [
    "Tomato___Bacterial_Spot",
    "Tomato___Early_Blight",
    "Tomato___Late_Blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_Leaf_Spot",
    "Tomato___Spider_Mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Healthy",
]


INPUT_SIZE: tuple[int, int] = (128, 128)


_MODEL_PATH: str = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "Model",
    "best_improved_cnn.h5",
)


_model: tf.keras.Model | None = None




def get_model() -> tf.keras.Model:
    
    global _model

    if _model is not None:
        logger.debug("Returning cached model instance.")
        return _model

    model_path = os.path.normpath(_MODEL_PATH)
    logger.info("Loading model from: %s", model_path)

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at '{model_path}'. "
            "Ensure 'Model/best_improved_cnn.h5' exists relative to the "
            "project root."
        )

    try:
        _model = tf.keras.models.load_model(model_path)
        logger.info(
            "Model loaded successfully. Input shape: %s | Output classes: %d",
            INPUT_SIZE,
            len(CLASS_LABELS),
        )
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)
        raise RuntimeError(f"Could not load model from '{model_path}'.") from exc

    return _model