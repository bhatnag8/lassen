export PYTHONDONTWRITEBYTECODE=1 # no __pycache__ files

# start backend
cd backend
source venv/bin/activate
pip3 install -r requirements.txt
uvicorn app.main:app --reload
