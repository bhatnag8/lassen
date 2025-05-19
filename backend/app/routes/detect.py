import os
from openai import OpenAI
import base64
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from clarifai.client.model import Model
from app.helpers.ingredient_keywords import FOOD_KEYWORDS
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("server.log"),
        logging.StreamHandler()  # keeps printing to terminal too
    ]
)
logger = logging.getLogger(__name__)


class DetectionRequest(BaseModel):
    filename: str

router = APIRouter()
load_dotenv()

UPLOAD_DIR = "./uploads"
client = OpenAI()
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Load once


def gpt_filter_ingredients(candidates):
    prompt = f"""
    You are an expert chef AI. From the list below, return only valid, individual cooking ingredients (e.g., "banana", "egg", "milk").
    List: {candidates}
    Respond only with a Python list of the valid ingredients.
    """
    response = client.chat.completions.create(
        # api_key = os.getenv("OPENAI_API_KEY"),
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    try:
        logger.info(response)
        return eval(response.choices[0].message.content)

    except Exception as e:
        print(f"GPT parse error: {e}")
        return candidates  # fallback to original if parsing fails


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
            model_id="food-item-v1-recognition",
            pat=os.getenv("CLARIFAI_API_KEY")
        )

        # Predict using Clarifai
        response = general_model.predict_by_bytes(image_bytes, input_type="image")

        # Extract food-related concepts with confidence > 0.5
        concepts = response.outputs[0].data.concepts
        # print(dc.name for d in concepts)
        # print(concepts)

        raw_ingredients = [
            c.name for c in concepts
            if c.value > 0.4 and (
                any(word in c.name.lower() for word in FOOD_KEYWORDS)
            )
        ]
        print(raw_ingredients)
        filtered = gpt_filter_ingredients(raw_ingredients)

        return {"ingredients": filtered}

    except Exception as e:
        import traceback
        logger.error("GPT filtering failed")
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
