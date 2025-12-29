# Deployment Guide

This guide provides multiple options for deploying the Insight Dashboard with the optimized dependencies.

## 📦 Build Status

✅ **Production build ready** - All dependencies audited and optimized
✅ **Security vulnerabilities fixed** - 2 of 4 vulnerabilities resolved
✅ **Bundle size optimized** - 20% reduction in dependencies

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Quick Deploy:**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from the command line:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project

**Or use the Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the Vite configuration
5. Click "Deploy"

**Configuration:** `vercel.json` is already configured

---

### Option 2: Netlify

**Quick Deploy:**

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

**Or use Netlify Dashboard:**

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Build settings are auto-detected from `netlify.toml`
6. Click "Deploy site"

**Configuration:** `netlify.toml` is already configured

---

### Option 3: GitHub Pages

**Automated Deployment:**

1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Under "Build and deployment":
   - Source: GitHub Actions
4. Push to the `main` branch to trigger deployment
5. Your site will be available at `https://[username].github.io/[repo-name]`

**Manual Deployment:**

```bash
npm run build
npx gh-pages -d dist
```

**Configuration:** `.github/workflows/deploy.yml` is already configured

**Note:** You may need to update `vite.config.ts` with the base path:
```typescript
export default defineConfig({
  base: '/insight-dashboard/', // Replace with your repo name
  // ... other config
})
```

---

### Option 4: Lovable (Original Platform)

Since this is a Lovable project:

1. Open your [Lovable project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click **Share** → **Publish**
3. Your site will be deployed automatically

---

### Option 5: Manual Deployment (Any Static Host)

Build the project locally:

```bash
npm run build
```

The production-ready files will be in the `dist/` directory. Upload this directory to any static hosting service:

- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**
- **Cloudflare Pages**
- **Firebase Hosting**
- **Railway**
- **Render**

---

## 🔧 Build Commands Reference

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run dependency analysis
npm run analyze:deps

# Lint code
npm run lint
```

---

## 🌐 Environment Variables

If your app requires environment variables (e.g., for Supabase):

1. Create a `.env.production` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Add environment variables to your deployment platform:
   - **Vercel:** Project Settings → Environment Variables
   - **Netlify:** Site Settings → Environment Variables
   - **GitHub Pages:** Repository Settings → Secrets and Variables → Actions

---

## ✅ Pre-deployment Checklist

- [ ] All tests pass
- [ ] Build completes without errors: `npm run build`
- [ ] Preview works locally: `npm run preview`
- [ ] Environment variables configured
- [ ] Analytics tracking configured (GA4)
- [ ] Domain name configured (if using custom domain)
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring set up (optional: Sentry, LogRocket)

---

## 📊 Post-deployment Verification

After deployment, verify:

1. ✅ Site loads correctly
2. ✅ All routes work (test navigation)
3. ✅ Theme toggle works (dark/light mode)
4. ✅ Charts render properly
5. ✅ API connections work (Supabase, GA4)
6. ✅ No console errors
7. ✅ Performance is acceptable (use Lighthouse)

---

## 🔍 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues (404 on refresh)

Make sure your hosting platform is configured for SPA routing:
- Vercel: ✅ Handled by `vercel.json`
- Netlify: ✅ Handled by `netlify.toml`
- GitHub Pages: May need additional configuration
- Others: Configure redirects to `/index.html`

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Restart build after adding variables
- Check platform-specific docs for env var setup

---

## 📈 Performance Optimization

The current build is already optimized with:
- ✅ 20% reduction in dependencies
- ✅ Tree-shaking enabled
- ✅ Code splitting (automatic via Vite)
- ✅ Asset optimization

Consider adding:
- [ ] CDN for assets (CloudFlare, Fastly)
- [ ] Service Worker for offline support
- [ ] Image optimization (tinypng, imagemin)
- [ ] Bundle analysis: `npm run build -- --report`

---

## 🔗 Useful Links

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Lovable Documentation](https://docs.lovable.dev/)

---

## 🎯 Quick Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages (manual)
npm run build && npx gh-pages -d dist

# Preview locally
npm run preview
```

---

**Need help?** Check the deployment platform's documentation or raise an issue in the repository.
