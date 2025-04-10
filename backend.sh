export PYTHONDONTWRITEBYTECODE=1 # no __pycache__ files

# start backend
cd backend
source .venv/bin/activate
pip install --upgrade pip
pip3 install --break-system-packages -r requirements.txt
uvicorn app.main:app --reload
