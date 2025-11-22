# 🎬 JellyRec: Movie Recommendations for Jellyfin

Get personalized movie and TV show recommendations based on your Jellyfin favorites!

For more details, check out this blog post: [https://zzuo123.github.io/blog/jellyrec/](https://zzuo123.github.io/blog/jellyrec/)

To checkout a hosted instance, visit [https://jrh1823rhui34y8.gzuo.me/login](https://jrh1823rhui34y8.gzuo.me/login) and login with your jellyfin credentials (or use the jellyfin demo page & credential). Note that you'll need to have at least 1/ONE movie favorited to generate recommendations. 

Have fun and enjoy! 

---

## 🚀 Quick Start (Easy Mode!)

Follow these simple steps to get JellyRec running on your computer:

### Step 1: Install Docker

Docker is a tool that makes it easy to run applications. You only need to install it once.

1. **Download Docker** for your system:
   - **Windows/Mac**: Download [Docker Desktop](https://docs.docker.com/get-docker/)
   - **Linux**: Follow the [official guide](https://docs.docker.com/engine/install/)

2. **Verify Docker is installed** by opening a terminal/command prompt and typing:
   ```bash
   docker --version
   ```
   You should see something like `Docker version 24.0.0`

### Step 2: Download JellyRec

Open a terminal/command prompt and run these commands:

```bash
# Download the code
git clone https://github.com/zzuo123/jellyrec.git

# Go into the folder
cd jellyrec
```

### Step 3: Configure Environment Variables

Create a file called `.env` in the `jellyrec-web` folder with these settings:

```bash
# Navigate to the web folder
cd jellyrec-web

# Create the .env file (use your favorite text editor)
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

Add this content to the `.env` file:

```env
# Session secret for authentication (use a random string)
SESSION_SECRET=your-super-secret-random-string-here

# Python API URL (keep this as-is for Docker)
REC_BACKEND_URL=http://python-api:8888

# OMDB API Key for movie posters and information
OMDB_API_KEY=your-omdb-api-key-here
```

**💡 How to get these values:**

1. **SESSION_SECRET**: Generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```

2. **REC_BACKEND_URL**: Keep as `http://python-api:8888` for Docker (already correct above)

3. **OMDB_API_KEY**: Get a free API key:
   - Go to [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Enter your email and select "FREE" (1,000 daily requests)
   - Check your email and click the activation link
   - Copy the API key and paste it in your `.env` file

Then go back to the main folder:
```bash
cd ..
```

### Step 4: Start JellyRec

From the `jellyrec` folder, run:

```bash
docker compose up -d
```

This will:
- ✅ Download everything needed
- ✅ Build the application
- ✅ Start the services in the background

**⏱️ First time setup takes 2-3 minutes**

### Step 5: Open JellyRec in Your Browser

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You'll see the login page!

---

## 🔐 Logging In

On the login page, you'll need to enter:

1. **Jellyfin Server URL**: The web address of your Jellyfin server
   - Local example: `http://localhost:8096`
   - Remote example: `http://192.168.1.100:8096`
   - With domain: `https://jellyfin.yourdomain.com`

2. **Username**: Your Jellyfin username

3. **Password**: Your Jellyfin password

Click "Sign In" and you're ready to get recommendations! 🎉

---

## 📋 Useful Commands

### Check if JellyRec is running
```bash
docker compose ps
```

### View logs (helpful for troubleshooting)
```bash
# All services
docker compose logs -f

# Just the web app
docker compose logs -f web

# Just the recommendation engine
docker compose logs -f python-api
```

### Stop JellyRec
```bash
docker compose down
```

### Restart JellyRec
```bash
docker compose restart
```

### Update to the latest version
```bash
# Pull the latest code
git pull

# Rebuild and restart
docker compose up -d --build
```

---

## 🛠️ Troubleshooting

### "Cannot connect to Docker daemon"
- Make sure Docker Desktop is running
- On Windows/Mac: Check the system tray for the Docker icon

### "Port 3000 is already in use"
- Another application is using port 3000
- Edit `docker-compose.yml` and change `"3000:3000"` to `"3001:3000"` (or any other port)
- Then access JellyRec at `http://localhost:3001`

### "Login failed" or "Cannot connect to Jellyfin"
- Double-check your Jellyfin server URL
- Make sure your Jellyfin server is running
- Verify your username and password are correct

### Container won't start
```bash
# Check the logs for errors
docker compose logs

# Try rebuilding from scratch
docker compose down
docker compose up -d --build
```

---

## 🔧 Advanced: Development Mode

If you want to run JellyRec without Docker (for development):

### Backend (Python API)
```bash
cd python
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python server.py
```

### Frontend (Next.js)
```bash
cd jellyrec-web
npm install
npm run dev
```

**Note**: For local development, change `REC_BACKEND_URL` in `.env` to `http://localhost:8888`

---

## 📊 How It Works

1. **You log in** with your Jellyfin credentials
2. **JellyRec analyzes** your favorited movies
3. **Machine learning** finds similar movies to your favorites
4. **Get recommendations** tailored to your taste!

---

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is open source. Check the LICENSE file for details.

---

## 💬 Need Help?

- **Issues**: [GitHub Issues](https://github.com/zzuo123/jellyrec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/zzuo123/jellyrec/discussions)

---

**Made with ❤️ for the Jellyfin community**
