# GitHub Pages Deployment Setup Guide

## 🚀 Quick Start

Your repository is now configured for GitHub Pages deployment with the optimized dependencies!

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/RevIntellect/insight-dashboard`
2. Click on **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
5. Save the settings

### Step 2: Merge Your Branch

Merge your current branch (`claude/audit-dependencies-mjp9hka4dei5ah0i-DhpQ7`) into `main`:

```bash
# Option 1: Via GitHub PR
# Create a pull request and merge it on GitHub

# Option 2: Via command line
git checkout main
git pull origin main
git merge claude/audit-dependencies-mjp9hka4dei5ah0i-DhpQ7
git push origin main
```

### Step 3: Watch the Deployment

1. Go to the **Actions** tab in your repository
2. You'll see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually 2-3 minutes)
4. Your site will be live at: `https://revintellect.github.io/insight-dashboard/`

## 📋 What's Been Configured

### ✅ Vite Configuration (`vite.config.ts`)
- Added base path: `/insight-dashboard/` (only in production mode)
- Development server still uses `/` for local development

### ✅ SPA Routing Fix
- Created `public/404.html` - Handles GitHub Pages 404 errors
- Updated `index.html` - Restores correct URL after redirect
- This ensures React Router works correctly on page refresh

### ✅ GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically builds and deploys on push to `main`
- Uses Node.js 20
- Optimized with npm cache
- Deploys to GitHub Pages environment

### ✅ Build Verification
- ✅ Production build successful
- ✅ 404.html correctly copied to dist
- ✅ All assets properly referenced with base path
- ✅ Bundle size: 1,001 kB (gzipped: 277 kB)

## 🎯 Deployment Trigger

The workflow triggers on:
- **Push to main branch** (automatic)
- **Manual trigger** (workflow_dispatch)

### Manual Deployment

You can manually trigger a deployment from GitHub:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch `main`
5. Click "Run workflow"

## 🔧 Testing Locally with GitHub Pages Config

Test the production build with the GitHub Pages base path:

```bash
# Build with production mode (includes base path)
npm run build

# Preview the production build
npm run preview
```

**Note:** The preview server doesn't perfectly replicate GitHub Pages routing, but the build is configured correctly.

## 🌐 Your Live Site

Once deployed, your site will be available at:

**🔗 https://revintellect.github.io/insight-dashboard/**

## 📊 Deployment Status

Check deployment status:
- **Actions tab:** See workflow runs
- **Environments:** Check "github-pages" environment
- **Pages settings:** View deployment URL

## 🐛 Troubleshooting

### Build Fails
```bash
# Check the Actions tab for error logs
# Common issues:
# - Missing dependencies (run npm ci)
# - Build errors (check locally with npm run build)
```

### 404 Errors on Routes
- ✅ Already fixed with 404.html redirect
- Verify 404.html exists in dist/ after build
- Check browser console for errors

### Assets Not Loading
- ✅ Base path is configured in vite.config.ts
- Verify base path matches repository name
- Check that all assets use relative paths

### Deployment Not Triggering
- Ensure you pushed to `main` branch
- Check GitHub Actions is enabled in repository settings
- Verify workflow file is in `.github/workflows/deploy.yml`

## 🔄 Updating Your Site

Every time you push to `main`, the site will automatically rebuild and redeploy:

```bash
git checkout main
git pull origin main
# Make your changes
git add .
git commit -m "Update site"
git push origin main
# GitHub Actions will automatically deploy
```

## 📝 Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Pages**
2. Under "Custom domain", enter your domain
3. Add DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: www (or subdomain)
   Value: revintellect.github.io
   ```
4. Wait for DNS propagation (can take 24-48 hours)

## 🎉 You're All Set!

Your optimized Insight Dashboard is ready for GitHub Pages deployment with:
- ✅ 20% fewer dependencies
- ✅ Security vulnerabilities fixed
- ✅ SPA routing configured
- ✅ Automated CI/CD pipeline
- ✅ Production-ready build

Just merge to `main` and watch it deploy! 🚀
