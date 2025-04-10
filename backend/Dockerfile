# Use slim Python base image
FROM python:3.13-slim

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Set working directory
WORKDIR /app

# Copy dependency list first (for Docker cache)
COPY requirements.txt .

# Install system-level dependencies needed by FastAPI, Uvicorn, and friends
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libffi-dev \
    libssl-dev \
    libjpeg-dev \
    libpq-dev \
    libxml2-dev \
    libxslt1-dev \
    libglib2.0-0 \
    libgl1-mesa-glx \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose internal app port (use 7070 if running SSL)
EXPOSE 7070

# Run the server (non-SSL version)
CMD ["uvicorn", "app.main:app","--host", "0.0.0.0","--port", "7070","--ssl-certfile", "/etc/letsencrypt/live/api.arryan.xyz/fullchain.pem","--ssl-keyfile", "/etc/letsencrypt/live/api.arryan.xyz/privkey.pem"]