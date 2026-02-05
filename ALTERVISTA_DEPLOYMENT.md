# 🚀 Deploying EvolveCode to AlterVista

## ⚠️ Important Considerations

### ✅ What Works on AlterVista

- ✅ Static file hosting (HTML, CSS, JavaScript)
- ✅ React SPA deployment
- ✅ `.htaccess` configuration for routing
- ✅ Free HTTPS certificates
- ✅ FTP/SFTP access
- ✅ File manager interface

### ❌ Critical Limitations

**🔴 MAJOR ISSUE: API Key Security**

AlterVista is **client-side only** hosting. This means:

- ❌ **Your Gemini API key will be exposed** in the JavaScript bundle
- ❌ No backend to proxy API requests
- ❌ Anyone can extract your API key from the browser
- ❌ This could lead to **unauthorized usage and charges**

**Recommendation**:

- For **demo/portfolio purposes**: Acceptable with usage limits
- For **production**: Use Vercel/Netlify with backend API proxy

---

## 📋 Deployment Steps

### Step 1: Prepare the Build

```bash
# 1. Navigate to project directory
cd /home/whoshotya/Downloads/Antigravity/projects\ \(1\)/projects/evo-code

# 2. Install dependencies (if not already done)
npm install

# 3. Build for production
npm run build
```

This creates a `dist/` folder with optimized static files.

### Step 2: Configure for AlterVista

#### Option A: Root Domain Deployment

If deploying to `yourusername.altervista.org`:

**No changes needed** - the app is already configured for root deployment.

#### Option B: Subdirectory Deployment

If deploying to `yourusername.altervista.org/evo-code/`:

1. **Update `vite.config.ts`**:

```typescript
// vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/evo-code/', // ADD THIS LINE - change to your subdirectory
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

1. **Rebuild**:

```bash
npm run build
```

### Step 3: Create `.htaccess` File

Create a file named `.htaccess` in your `dist/` folder:

```apache
# .htaccess for React SPA on AlterVista

# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # If subdirectory deployment, change to:
  # RewriteBase /evo-code/
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  # Prevent clickjacking
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # XSS Protection
  Header always set X-XSS-Protection "1; mode=block"
  
  # Prevent MIME sniffing
  Header always set X-Content-Type-Options "nosniff"
</IfModule>

# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

**Save this file in the `dist/` folder** before uploading.

### Step 4: Upload to AlterVista

#### Method 1: FTP/SFTP (Recommended)

1. **Get FTP credentials** from AlterVista control panel
2. **Connect using FileZilla or similar**:
   - Host: `ftp.yourusername.altervista.org`
   - Username: Your AlterVista username
   - Password: Your AlterVista password
   - Port: 21 (FTP) or 22 (SFTP)

3. **Upload files**:
   - Navigate to the root directory (or subdirectory)
   - Upload **all contents** of the `dist/` folder
   - **Include the `.htaccess` file**

#### Method 2: File Manager

1. **Login to AlterVista control panel**
2. **Open File Manager**
3. **Navigate to public directory** (usually `public_html/` or root)
4. **Upload files**:
   - Zip the `dist/` folder contents
   - Upload the zip file
   - Extract in the file manager

### Step 5: Configure Environment Variables

**⚠️ CRITICAL SECURITY ISSUE**

Since AlterVista doesn't support server-side environment variables, you have two options:

#### Option A: Hardcode API Key (NOT RECOMMENDED)

**Only for demos/testing with usage limits set in Google Cloud Console**

1. Create a `.env.production` file:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

1. Rebuild:

```bash
npm run build
```

1. **Set usage limits** in Google Cloud Console to prevent abuse

#### Option B: Remove API Key (Recommended for Public Demo)

1. **Modify `geminiService.ts`** to show a warning:

```typescript
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Demo Mode: API key not configured. AI features disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};
```

1. **Update UI** to show "Demo Mode" when API is unavailable

2. **Deploy without API key** - users can add their own key in the UI

---

## 🔒 Security Best Practices

### Protect Your API Key

1. **Set Usage Quotas** in Google Cloud Console:
   - Daily request limit
   - Per-minute rate limit
   - Budget alerts

2. **Restrict API Key** in Google Cloud Console:
   - Application restrictions → HTTP referrers
   - Add: `*.altervista.org/*`

3. **Monitor Usage**:
   - Check Google Cloud Console regularly
   - Set up billing alerts

### Alternative: Backend Proxy (Recommended)

**For production, use a hybrid approach**:

1. **Deploy frontend to AlterVista** (free)
2. **Deploy backend API to Vercel/Netlify** (free tier)
3. **Backend proxies Gemini API** (keeps key secure)

Example backend structure:

```
vercel-backend/
├── api/
│   └── gemini.js  # Proxies requests to Gemini
└── vercel.json    # Configuration
```

---

## 🧪 Testing After Deployment

### Checklist

1. **Visit your site**: `https://yourusername.altervista.org`
2. **Test routing**:
   - Click through different stages
   - Refresh page (should not show 404)
3. **Test AI features**:
   - Click "Evolve" button
   - Ask AI assistant a question
4. **Check console**:
   - Open browser DevTools (F12)
   - Look for errors
5. **Test on mobile**:
   - Responsive design
   - Touch interactions

### Common Issues

#### Issue 1: 404 on Refresh

**Cause**: `.htaccess` not uploaded or incorrect  
**Fix**: Ensure `.htaccess` is in the root directory

#### Issue 2: Blank Screen

**Cause**: Incorrect `base` path in `vite.config.ts`  
**Fix**: Match `base` to your deployment path

#### Issue 3: Assets Not Loading

**Cause**: Incorrect asset paths  
**Fix**: Check browser console, verify `base` path

#### Issue 4: API Errors

**Cause**: API key not configured or restricted  
**Fix**: Check Google Cloud Console restrictions

---

## 📊 Performance Optimization

### Reduce Bundle Size

1. **Code Splitting** (future):

```typescript
const StagePro = React.lazy(() => import('./components/StagePro'));
```

1. **Remove unused dependencies**:

```bash
npm prune
```

1. **Analyze bundle**:

```bash
npm run build -- --analyze
```

### Enable Compression

The `.htaccess` file already includes GZIP compression. Verify it's working:

1. Open browser DevTools → Network tab
2. Check response headers for `Content-Encoding: gzip`

---

## 🔄 Update Workflow

### Deploying Updates

```bash
# 1. Make changes to code
# 2. Test locally
npm run dev

# 3. Build for production
npm run build

# 4. Upload via FTP
# - Connect to AlterVista FTP
# - Upload contents of dist/ folder
# - Overwrite existing files

# 5. Clear browser cache and test
```

### Automated Deployment (Advanced)

Create a deployment script:

```bash
#!/bin/bash
# deploy.sh

echo "Building for production..."
npm run build

echo "Uploading to AlterVista..."
lftp -u username,password ftp.yourusername.altervista.org <<EOF
mirror -R dist/ /
bye
EOF

echo "Deployment complete!"
```

Make executable:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📝 AlterVista-Specific Notes

### File Limits

- **Max file size**: Usually 10MB per file
- **Total space**: Check your plan (typically 500MB - 3GB)
- **Bandwidth**: Usually unlimited on free plans

### Supported Features

- ✅ Static files (HTML, CSS, JS)
- ✅ `.htaccess` configuration
- ✅ HTTPS (free Let's Encrypt)
- ✅ Custom domains (on some plans)
- ❌ Node.js server
- ❌ Environment variables
- ❌ Server-side rendering (SSR)

### Best Practices

1. **Keep bundle size small** (< 5MB total)
2. **Use CDN for large assets** (images, videos)
3. **Enable caching** (via `.htaccess`)
4. **Monitor bandwidth** usage

---

## 🆚 AlterVista vs. Alternatives

| Feature | AlterVista | Vercel | Netlify |
|---------|-----------|--------|---------|
| **Cost** | Free | Free tier | Free tier |
| **Setup** | Manual FTP | Git auto-deploy | Git auto-deploy |
| **Environment Vars** | ❌ No | ✅ Yes | ✅ Yes |
| **Backend API** | ❌ No | ✅ Yes (Serverless) | ✅ Yes (Functions) |
| **Custom Domain** | Limited | ✅ Yes | ✅ Yes |
| **HTTPS** | ✅ Yes | ✅ Yes | ✅ Yes |
| **API Key Security** | ❌ Exposed | ✅ Secure | ✅ Secure |

**Recommendation**:

- **Portfolio/Demo**: AlterVista is fine
- **Production**: Use Vercel or Netlify

---

## 🎯 Quick Deployment Checklist

- [ ] Build the project (`npm run build`)
- [ ] Create `.htaccess` file in `dist/`
- [ ] Configure `base` path in `vite.config.ts` (if subdirectory)
- [ ] Set API key usage limits in Google Cloud Console
- [ ] Upload `dist/` contents via FTP
- [ ] Test routing (refresh pages)
- [ ] Test AI features
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Monitor API usage

---

## 📞 Troubleshooting

### Getting Help

1. **AlterVista Support**: Check their forums
2. **Project Issues**: See `WORKFLOW_GUIDE.md`
3. **Deployment Issues**: Check `.htaccess` configuration

### Useful Commands

```bash
# Test build locally
npm run build
npm run preview

# Check bundle size
du -sh dist/

# List all files in dist
ls -lah dist/
```

---

## ⚠️ Final Warning

**DO NOT deploy to AlterVista with your real API key for production use.**

The API key will be visible in the JavaScript bundle, allowing anyone to:

- Extract your key
- Use it for their own purposes
- Potentially rack up charges on your Google Cloud account

**For production, use Vercel/Netlify with backend API proxy.**

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: 2026-02-04  
**Tested On**: AlterVista Free Hosting

*For secure production deployment, see `WORKFLOW_GUIDE.md` for Vercel/Netlify instructions.*
