# Docker Deployment Guide

This guide explains how to run Jellyrec using Docker and Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Web interface: http://localhost:3000
   - Python API: http://localhost:8888

## Environment Variables

Before running, make sure you have a `.env` file in the `jellyrec-web` directory.

**IMPORTANT:** The `REC_BACKEND_URL` is different for Docker vs local development:

### For Docker (use this in your .env when running docker-compose):
```env
SESSION_SECRET=your-secret-key-here
REC_BACKEND_URL=http://python-api:8888
OMDB_API_KEY=your-omdb-api-key-here
```

### For Local Development (use this in your .env when running npm run dev):
```env
SESSION_SECRET=your-secret-key-here
REC_BACKEND_URL=http://localhost:8888
OMDB_API_KEY=your-omdb-api-key-here
```

**Why the difference?**
- In Docker, containers communicate using service names (`python-api`) on the Docker network
- In local development, both services run on your host machine, so they use `localhost`

**How to get these values:**

1. **SESSION_SECRET**: Generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```

2. **OMDB_API_KEY**: Get a free API key at [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)

## Docker Commands

### Start services
```bash
docker-compose up
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f python-api
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

## Service Details

### Web Service (jellyrec-web)
- **Container name:** jellyrec-web
- **Port:** 3000
- **Technology:** Next.js 16
- **Build:** Multi-stage build with standalone output

### Python API Service (python-api)
- **Container name:** jellyrec-python
- **Port:** 8888
- **Technology:** Flask with Waitress server
- **Volumes:** 
  - `./python/downloads` - Persisted movie datasets
  - `./python/omdb_cache.json` - OMDB API cache

## Networking

Both services run on a shared Docker network called `jellyrec-network`, allowing them to communicate using service names (e.g., `http://python-api:8888`).

## Health Checks

The Python API includes a health check that runs every 30 seconds. The web service will wait for the Python API to be healthy before starting.

## Troubleshooting

### Container won't start
Check the logs:
```bash
docker-compose logs <service-name>
```

### Port already in use
Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to any available port
```

### Clear everything and start fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Production Deployment

For production deployment, consider:

1. Using environment-specific `.env` files
2. Setting up proper secrets management
3. Using a reverse proxy (nginx/traefik)
4. Enabling HTTPS
5. Setting resource limits in docker-compose.yml
6. Using Docker secrets instead of environment variables for sensitive data
