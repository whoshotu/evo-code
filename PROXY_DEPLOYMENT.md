# Node OpenRouter Proxy Deployment Guide

Since AlterVista blocks direct outbound calls to AI APIs, we use a **Node.js proxy** running on a separate host (Render, Vercel, AWS, etc.) to forward requests to OpenRouter.

## Architecture

```
Frontend (AlterVista)
    ↓
PHP Backend (AlterVista) → Node Proxy (Rendered/Vercel/etc.)
    ↓                           ↓
    └─────────────→ OpenRouter API
```

The PHP backend (`backend/api/ai-proxy.php`) now calls your Node proxy instead of calling OpenRouter directly.

---

## Step 1: Deploy the Node Proxy

Choose one of the options below:

### Option A: Render (Recommended - Free tier, always on)

1. **Prepare the folder:**
   - In your workspace, you have `proxy-server/` with `server.js`, `package.json`, `.env.example`

2. **Create a Render account:**
   - Go to [render.com](https://render.com) and sign up (free tier available)

3. **Connect GitHub or upload:**
   - Create a new **Web Service**
   - Connect your GitHub repo OR upload the `proxy-server/` folder
   - Runtime: `Node`
   - Build command: `npm install`
   - Start command: `npm start`

4. **Set environment variables in Render dashboard:**
   - Name: `OPENROUTER_API_KEY`
   - Value: `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`
   - Name: `OPENROUTER_MODEL`
   - Value: `arcee-ai/trinity-large-preview:free`
   - Name: `PORT`
   - Value: `3000`

5. **Deploy and copy the URL:**
   - Render will give you a URL like: `https://openrouter-proxy-abc123.onrender.com`
   - Copy this URL

### Option B: Vercel

1. **Push to GitHub** (required for Vercel):
   ```bash
   git add proxy-server/
   git commit -m "Add Node proxy"
   git push origin main
   ```

2. **Log in to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project" → import your GitHub repo

3. **Configure:**
   - Set root directory to `proxy-server/`
   - Set environment variables:
     - `OPENROUTER_API_KEY`: your key
     - `OPENROUTER_MODEL`: `arcee-ai/trinity-large-preview:free`

4. **Deploy** and copy the URL (e.g., `https://proxy-abc123.vercel.app`)

### Option C: Local Testing (Dev Only)

For testing locally:

1. **Copy .env.example to .env:**
   ```bash
   cd proxy-server
   cp .env.example .env
   ```

2. **Edit `.env`:**
   ```
   OPENROUTER_API_KEY=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
   OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free
   PORT=3000
   ```

3. **Install and run:**
   ```bash
   npm install
   npm start
   ```
   - Server runs on `http://localhost:3000`

4. **Test validation:**
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"model":"arcee-ai/trinity-large-preview:free"}' \
     http://localhost:3000/api/validateKey
   ```

---

## Step 2: Update AlterVista Configuration

Once your Node proxy is deployed, update the PHP config:

1. **Edit `backend/config/config.php` on your AlterVista server:**
   ```php
   define('NODE_PROXY_URL', 'https://your-proxy-url-here.onrender.com');
   ```
   Replace with your actual deployed proxy URL.

2. **Save and upload to AlterVista.**

---

## Step 3: Test the Connection

### Test from Command Line
```bash
# Test /api/validateKey endpoint
curl -X POST -H "Content-Type: application/json" \
  -d '{"model":"arcee-ai/trinity-large-preview:free"}' \
  https://your-proxy-url.onrender.com/api/validateKey
```

Expected response:
```json
{
  "success": true,
  "data": { ... }
}
```

### Test from Browser

1. Open your AlterVista app: `https://hereisreal.altervista.org/evolve-code`
2. Click "Start Coding" and begin a lesson
3. Request AI help (ask the tutor a question)
4. You should see the AI response

If you see an error, check:
- [ ] `NODE_PROXY_URL` is set correctly in `backend/config/config.php`
- [ ] Proxy is running on Render/Vercel/your host
- [ ] Network request is not blocked (check browser DevTools → Network tab)

---

## File Locations

- **Frontend .env:** `/home/whoshotya/Downloads/Antigravity/projects (1)/projects/evo-code/.env`
  - Contains `NODE_PROXY_URL` for reference (frontend doesn't use it directly)

- **PHP Backend config:** `backend/config/config.php` (on your AlterVista server)
  - Line with `NODE_PROXY_URL` — this needs to be updated

- **Node Proxy:** `proxy-server/` folder
  - `server.js` — main proxy server
  - `package.json` — dependencies
  - `.env` — environment variables (keep secret, never commit)

---

## Troubleshooting

### "Cannot reach Node proxy"
- Verify the URL in `backend/config/config.php`
- Check that proxy is running: `curl https://your-proxy-url.onrender.com/`
- Should return: `"OpenRouter proxy running"`

### "OpenRouter API error"
- Check API key in Render/Vercel environment variables
- Verify key is valid: login to [openrouter.ai/keys](https://openrouter.ai/keys)

### "Network error in browser"
- Check CORS headers in proxy server (they're set to allow all origins for dev)
- For production, restrict `CORS` in `proxy-server/server.js`

### "Rate limit exceeded"
- The proxy has basic rate limiting (60 reqs/min)
- Increase in `proxy-server/server.js` if needed

---

## Security Notes

1. **Never commit `.env`** file or API keys to version control
2. **Use environment variables** on production hosts (Render, Vercel set these securely)
3. **Restrict CORS origins** in `proxy-server/server.js` before going live:
   ```javascript
   app.use(cors({ origin: 'https://hereisreal.altervista.org' }));
   ```
4. **Monitor usage** on Render/Vercel to avoid unexpected costs (free tier usually sufficient for learning app)

---

## Next Steps

After deployment:
1. Upload new `backend/config/config.php` to AlterVista
2. Re-upload `dist/` frontend files to AlterVista
3. Test the app in browser
4. Enjoy AI-powered tutoring without blocking! 🚀
