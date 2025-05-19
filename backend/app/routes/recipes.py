from pydantic import BaseModel
from typing import List
import os
import requests
from fastapi import APIRouter
from fastapi.responses import JSONResponse



router = APIRouter()

SPOONACULAR_API_URL = "https://api.spoonacular.com/recipes/findByIngredients"

class IngredientsRequest(BaseModel):
    ingredients: List[str]

@router.post("/get-recipes")
async def get_recipes(payload: IngredientsRequest):
    try:
        ingredients_str = ",".join([i.replace(" ", "+") for i in payload.ingredients])

        params = {
            "ingredients": ingredients_str,
            # "number": 5,
            # "ranking": 1,
            # "ignorePantry": True,
        }

        headers = {
            "x-api-key": os.getenv("SPOONACULAR_API_KEY")
        }
        response = requests.get(SPOONACULAR_API_URL, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        recipes = [
            {
                "id": r["id"],
                "title": r["title"],
                "image": r["image"],
                "usedIngredients": [i["name"] for i in r["usedIngredients"]],
                "missedIngredients": [i["name"] for i in r["missedIngredients"]],
            }
            for r in data
        ]

        return {"recipes": recipes}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
