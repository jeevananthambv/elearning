# Vercel Deployment Guide - Faculty Website

## 🚀 Project Status: READY FOR DEPLOYMENT

Your project is fully configured and ready to be deployed on Vercel.

---

## Current Setup

### Frontend (React + Vite)
- **Framework:** React 19.2.0 with Vite 7.2.4
- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Dev Server:** `npm run dev` (runs on port 5173)

### Backend API (Express.js - Serverless)
- **Framework:** Express.js running as Vercel Serverless Functions
- **API Location:** `/api/**` routes
- **Configuration File:** `api/index.js`
- **Features:**
  - Authentication (JWT-based)
  - Video Management (CRUD)
  - Materials Management with file uploads
  - Contact Form handling
  - Statistics tracking
  - Profile Management

---

## Vercel Configuration

Your `vercel.json` is already configured:

```json
{
    "version": 2,
    "buildCommand": "npm install && npm run build",
    "outputDirectory": "dist",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "vite",
    "rewrites": [
        {
            "source": "/api/:path*",
            "destination": "/api"
        },
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ],
    "functions": {
        "api/**/*.js": {
            "maxDuration": 10
        }
    }
}
```

---

## How to Deploy to Vercel

### Option 1: Using Vercel Dashboard (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from terminal:**
   ```bash
   cd d:\Econtent\faculty-website
   vercel
   ```

3. **Follow prompts:**
   - Link to existing Vercel project or create new
   - Select project name
   - Choose production/preview deployment

4. **Done!** Your project is live

### Option 2: Connect Git Repository

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-url>
   git push -u origin main
   ```

2. **Connect on Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"
   - Import Git Repository
   - Select your repository
   - Click Deploy

3. **Automatic Deployments:**
   - Every push to main branch triggers deployment
   - Preview deployments for pull requests
   - Automatic rollbacks available

---

## Environment Variables (if needed)

Add these in Vercel Dashboard → Project Settings → Environment Variables:

- `VITE_API_URL` - API endpoint URL
- `JWT_SECRET` - JWT signing secret (already in server)
- `FRONTEND_URL` - Frontend URL for CORS
- `VERCEL` - Set automatically by Vercel

---

## Available API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Videos
- `GET /api/videos` - List all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create video (protected)
- `PUT /api/videos/:id` - Update video (protected)
- `DELETE /api/videos/:id` - Delete video (protected)

### Materials
- `GET /api/materials` - List materials
- `POST /api/materials` - Upload material (protected)
- `PUT /api/materials/:id` - Update material (protected)
- `DELETE /api/materials/:id` - Delete material (protected)
- `GET /api/materials/download/:id` - Download file

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get messages (protected)
- `PUT /api/contact/:id/read` - Mark as read (protected)
- `DELETE /api/contact/:id` - Delete message (protected)

### Profile
- `GET /api/profile` - Get profile info
- `PUT /api/profile` - Update profile (protected)

### Statistics
- `GET /api/stats` - Admin stats (protected)
- `GET /api/stats/public` - Public stats

### Health Check
- `GET /api/health` - Server health status
- `GET /api` - API info

---

## Default Credentials

**Admin Account:**
- Email: `admin@university.edu`
- Password: `admin123`

> **IMPORTANT:** Change these credentials in production!

---

## Project Structure

```
faculty-website/
├── src/                    # React frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── api.js            # API service (Firebase)
│   ├── firebase.js       # Firebase config
│   └── main.jsx          # Entry point
├── api/                   # Vercel serverless API
│   └── index.js          # Express app (exported for Vercel)
├── server/               # Local development server
│   ├── routes/          # API route handlers
│   ├── models/          # Data models
│   ├── middleware/      # Middleware functions
│   ├── server.js        # Node.js server
│   └── data.json        # Local data storage
├── dist/                # Production build output
├── vercel.json          # Vercel configuration
└── package.json         # Project dependencies
```

---

## Performance Optimization

### Current Bundle Size
- JS: 701.22 KB (gzip: 211.81 KB)
- CSS: 83.01 KB (gzip: 13.30 KB)

### Recommendations
1. Code splitting for routes (implement lazy loading)
2. Image optimization (use Next.js Image component)
3. Minification (already enabled in production build)

---

## Monitoring & Logs

After deployment, monitor on Vercel Dashboard:
- **Deployments** - Deployment history and status
- **Analytics** - Performance metrics
- **Logs** - Function and edge logs
- **Settings** - Environment variables and domains

---

## Troubleshooting

### Build Fails
- Check `npm run build` works locally
- Verify all dependencies are in package.json
- Check environment variables are set

### API Not Working
- Verify API routes are in `/api` folder
- Check `vercel.json` rewrites configuration
- Review Vercel Function logs

### CORS Issues
- Update `FRONTEND_URL` environment variable
- Check CORS headers in api/index.js

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com
- **Firebase Docs:** https://firebase.google.com/docs

---

## Deployment Checklist

✅ Frontend builds successfully
✅ API routes configured
✅ vercel.json properly configured
✅ Environment variables prepared
✅ Git repository initialized
✅ Default credentials documented
✅ Error handling implemented
✅ CORS configured

**Status: READY TO DEPLOY** 🚀
