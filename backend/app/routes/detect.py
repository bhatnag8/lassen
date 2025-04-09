import os
import base64
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from clarifai.client.model import Model
from app.helpers.ingredient_keywords import FOOD_KEYWORDS
from pydantic import BaseModel

class DetectionRequest(BaseModel):
    filename: str

router = APIRouter()

UPLOAD_DIR = "./uploads"

@router.post("/detect-ingredients")
async def detect_ingredients(data: DetectionRequest):
    filename = data.filename
    filepath = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(filepath):
        return JSONResponse(status_code=404, content={"error": "File not found"})

    try:
        # Read the image file
        with open(filepath, "rb") as f:
            image_bytes = f.read()

        # Load Clarifai model
        general_model = Model(
            model_id="general-image-recognition",
            pat=os.getenv("CLARIFAI_API_KEY")
        )
        
        # Predict using Clarifai
        response = general_model.predict_by_bytes(image_bytes, input_type="image")

        # Extract food-related concepts with confidence > 0.5
        concepts = response.outputs[0].data.concepts
        # print(dc.name for d in concepts)
        ingredients = [
            c.name for c in concepts
            if c.value > 0.5 and (
                any(word in c.name.lower() for word in FOOD_KEYWORDS)
            )
        ]

        return {"ingredients": ingredients}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})