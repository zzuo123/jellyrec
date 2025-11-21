# Use Python 3.11 slim image
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if needed
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories for downloads and cache
RUN mkdir -p downloads

# Expose the port
EXPOSE 8888

# Run the server
CMD ["python", "server.py"]
