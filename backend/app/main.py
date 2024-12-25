from fastapi import FastAPI

# Create a FastAPI app
app = FastAPI()

# Define a simple GET route
@app.get("/")
def read_root():
    return {"message": "Welcome to Lassen API"}
    