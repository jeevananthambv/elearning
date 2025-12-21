# Quick Start: Deploy to Vercel in 5 Minutes

## Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free) at https://vercel.com

## Step 1: Create Git Repository (2 minutes)

```bash
cd d:\Econtent\faculty-website

# Initialize Git
git init
git add .
git commit -m "Initial commit: Faculty E-Content Website"

# Create repository on GitHub:
# 1. Go to https://github.com/new
# 2. Create repository name: "faculty-website"
# 3. Copy the commands shown

# Add remote and push (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/faculty-website.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel (2 minutes)

**Method A: Via Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Paste your repository URL
5. Click "Import"
6. Vercel auto-detects Vite configuration
7. Click "Deploy"
8. ✅ Done! Get your live URL

**Method B: Via Vercel CLI**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
cd d:\Econtent\faculty-website
vercel

# Follow interactive prompts:
# - Link to existing Vercel project? (no for first time)
# - Project name? (faculty-website)
# - Directory containing code? (.)
# - Override settings? (no)
# - Deploy to production? (yes)
```

## Step 3: Configure Environment (1 minute)

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
VITE_API_URL=https://your-site.vercel.app/api
```

## That's It! 🎉

Your site is now live at: `https://your-project.vercel.app`

---

## What Vercel Automatically Does

✅ Runs `npm install && npm run build`
✅ Deploys `dist/` folder as static site
✅ Deploys `api/` folder as serverless functions
✅ Sets up HTTPS (automatic SSL)
✅ Provides global CDN
✅ Enables automatic deployments on git push
✅ Creates preview URLs for pull requests

---

## After Deployment

### Update in Production
Just push to main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically deploys!

### Monitor Your Site
- **Vercel Dashboard** → Check deployments, logs, analytics
- **Domains** → Add custom domain (optional)
- **Settings** → Configure environment variables
- **Analytics** → View performance metrics

### Access Your API
- Endpoint: `https://your-project.vercel.app/api`
- Health check: `https://your-project.vercel.app/api/health`
- All endpoints work as documented

---

## Testing After Deployment

```bash
# Test health endpoint
curl https://your-project.vercel.app/api/health

# Test API endpoint
curl https://your-project.vercel.app/api

# Test frontend
Open: https://your-project.vercel.app/
```

---

## Common Issues & Solutions

### Build Fails
**Error:** "Build command failed"
**Solution:** 
- Run `npm run build` locally to verify
- Check all dependencies in package.json
- Review Vercel build logs

### API Not Working
**Error:** "/api endpoints return 404"
**Solution:**
- Verify `api/index.js` exists
- Check `vercel.json` rewrites
- Review Function logs in Vercel

### CORS Issues
**Error:** "Access-Control-Allow-Origin missing"
**Solution:**
- Update environment variables
- Check CORS headers in api/index.js
- Restart deployment

### Stuck Builds
**Error:** "Build takes too long"
**Solution:**
- Check for infinite loops
- Verify dependencies aren't circular
- Contact Vercel support for limits increase

---

## Pro Tips

1. **Custom Domain:** Add your own domain in Vercel Settings
2. **Analytics:** Monitor site performance in Analytics tab
3. **Auto-Deploy:** Every git push automatically deploys
4. **Preview URLs:** Each PR gets a preview deployment
5. **Environment Variables:** Keep secrets secure in dashboard
6. **Logs:** Check Function logs for API debugging

---

## Next Steps

1. ✅ Initialize Git repository
2. ✅ Push to GitHub
3. ✅ Deploy via Vercel Dashboard
4. ✅ Configure environment variables
5. ✅ Test all API endpoints
6. ✅ Share your live URL

---

**Your faculty website is production-ready!** 🚀

Questions? Check:
- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
