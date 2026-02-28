import json
import logging
import os
from io import BytesIO

import numpy as np
from PIL import Image

from model_loader import CLASS_LABELS, INPUT_SIZE, get_model


logger = logging.getLogger(__name__)


_SOLUTIONS_PATH: str = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "solutions.json"
)




def preprocess_image(image_bytes: bytes) -> np.ndarray:
    
    try:
        image = Image.open(BytesIO(image_bytes))
    except Exception as exc:
        raise ValueError(f"Could not decode image bytes: {exc}") from exc


    image = image.convert("RGB")


    image = image.resize(INPUT_SIZE)


    array = np.array(image, dtype=np.float32) / 255.0


    array = np.expand_dims(array, axis=0)

    return array




def predict_disease(image_bytes: bytes) -> dict:
    

    input_array = preprocess_image(image_bytes)


    try:
        model = get_model()
        predictions = model.predict(input_array, verbose=0)
    except Exception as exc:
        logger.error("Model prediction failed: %s", exc)
        raise RuntimeError(f"Prediction failed: {exc}") from exc


    probabilities = predictions[0]
    predicted_index: int = int(np.argmax(probabilities))
    disease_key: str = CLASS_LABELS[predicted_index]
    confidence: float = round(float(probabilities[predicted_index]) * 100, 2)
    is_healthy: bool = disease_key == "Tomato___Healthy"


    display_name: str = disease_key.replace("___", ": ").replace("_", " ")


    solution: str | None = None
    try:
        with open(_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
            solutions: dict = json.load(f)
        solution = solutions.get(disease_key)
        if solution is None:
            logger.warning(
                "No solution entry found for disease key '%s'.", disease_key
            )
    except FileNotFoundError:
        logger.warning(
            "solutions.json not found at '%s'. Continuing without solution data.",
            _SOLUTIONS_PATH,
        )
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse solutions.json: %s", exc)

    return {
        "disease_key": disease_key,
        "display_name": display_name,
        "confidence": confidence,
        "is_healthy": is_healthy,
        "solution": solution,
    }