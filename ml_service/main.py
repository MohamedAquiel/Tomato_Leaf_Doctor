import os
import json
import logging
from contextlib import asynccontextmanager

import numpy as np
import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model_loader import CLASS_LABELS, INPUT_SIZE, get_model
from predictor import predict_disease


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


SOLUTIONS_FILE = os.path.join(os.path.dirname(__file__), "solutions.json")



@asynccontextmanager
async def lifespan(app: FastAPI):
    

    logger.info("Starting up Tomato Disease Prediction ML Service …")
    try:
        get_model()
        logger.info("Keras model loaded successfully and ready for inference.")
    except Exception as exc:
        logger.error("Failed to load Keras model during startup: %s", exc)


    yield


    logger.info("Shutting down Tomato Disease Prediction ML Service. Goodbye!")



app = FastAPI(
    title="Tomato Disease Prediction API",
    version="1.0.0",
    description=(
        "A machine-learning microservice that classifies tomato leaf images "
        "into one of 10 disease categories using a trained Keras CNN model. "
        "Upload a leaf image to the /predict endpoint and receive an instant "
        "diagnosis along with confidence scores and treatment recommendations."
    ),
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




def _load_solutions() -> dict:
    
    if not os.path.exists(SOLUTIONS_FILE):
        logger.warning("solutions.json not found at %s", SOLUTIONS_FILE)
        return {}
    try:
        with open(SOLUTIONS_FILE, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse solutions.json: %s", exc)
        return {}


def _is_model_loaded() -> bool:
    
    try:
        model = get_model()
        return model is not None
    except Exception:
        return False




@app.get(
    "/",
    summary="Service root",
    tags=["General"],
)
async def root():
    
    return {
        "message": "Tomato Disease Prediction ML Service is running",
        "version": "1.0.0",
        "status": "healthy",
    }


@app.get(
    "/health",
    summary="Detailed health check",
    tags=["General"],
)
async def health():
    
    model_loaded = _is_model_loaded()

    if not model_loaded:
        logger.warning("/health called but model is not loaded.")

    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "num_classes": 10,
        "input_size": f"{INPUT_SIZE[0]}x{INPUT_SIZE[1]}",
        "classes": CLASS_LABELS,
    }


@app.post(
    "/predict",
    summary="Predict tomato leaf disease",
    tags=["Prediction"],
)
async def predict(file: UploadFile = File(...)):
    

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid file type '{file.content_type}'. "
                "Please upload a valid image file (JPEG, PNG, WebP, etc.)."
            ),
        )


    try:
        image_bytes = await file.read()
    except Exception as exc:
        logger.error("Failed to read uploaded file: %s", exc)
        raise HTTPException(
            status_code=500,
            detail="Failed to read the uploaded file.",
        ) from exc

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )


    try:
        logger.info(
            "Running inference on uploaded file '%s' (%d bytes).",
            file.filename,
            len(image_bytes),
        )
        result = predict_disease(image_bytes)
    except Exception as exc:
        logger.error("Inference error for file '%s': %s", file.filename, exc)
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during disease prediction: {str(exc)}",
        ) from exc

    # If the image was unreadable or not a tomato leaf, return 422 instead of 500
    if result.get("is_valid") is False:
        logger.warning(
            "File '%s' rejected as invalid: %s", file.filename, result.get("message")
        )
        raise HTTPException(
            status_code=422,
            detail=result.get(
                "message",
                "The uploaded file is not a valid tomato leaf image.",
            ),
        )

    logger.info(
        "Inference complete for '%s'. Predicted: '%s' (confidence: %.2f%%).",
        file.filename,
        result.get("disease_key", "unknown"),
        result.get("confidence", 0.0),
    )

    return {
        "status": "success",
        **result,
    }


@app.get(
    "/diseases",
    summary="List all disease classes",
    tags=["Information"],
)
async def diseases():
    
    solutions = _load_solutions()

    disease_list = []
    for idx, class_name in enumerate(CLASS_LABELS):
        entry = {
            "id": idx,
            "class_name": class_name,

            "display_name": class_name.replace("_", " ").title(),
        }

        if class_name in solutions:
            entry["solution"] = solutions[class_name]
        disease_list.append(entry)

    return {
        "total": len(disease_list),
        "diseases": disease_list,
    }



if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=False,

    )