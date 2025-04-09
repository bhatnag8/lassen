from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import image, detect, recipes, auth

load_dotenv()
app = FastAPI()

app.include_router(image.router)
app.include_router(detect.router)
app.include_router(recipes.router)
app.include_router(auth.router)

# Allow requests from your Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is up!"}