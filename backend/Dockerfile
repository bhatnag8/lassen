# backend/Dockerfile
FROM python:latest

WORKDIR /app

# Copy backend code
COPY . .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Run your app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7070", "--ssl-certfile", "/etc/letsencrypt/live/api.arryan.xyz/fullchain.pem", "--ssl-keyfile", "/etc/letsencrypt/live/api.arryan.xyz/privkey.pem"]