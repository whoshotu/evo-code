# 🚀 Quick Deploy Guide

Deploy EvolveCode to AlterVista in 5 minutes.

## 📋 What You Need

1. **OpenRouter API Key** → https://openrouter.ai/keys
2. **AlterVista Account** → https://altervista.org
3. **FTP Client** (FileZilla) or use File Manager

---

## 1️⃣ Configure Backend (2 min)

Edit `backend/config/config.php`:

```php
// Add your OpenRouter key
$OPENROUTER_API_KEY = 'sk-or-v1-xxxxxxxxxxxxx';

// Add your AlterVista database info
define('DB_NAME', 'my_yourusername');
define('DB_USER', 'yourusername');
define('DB_PASS', 'your_db_password');

// Update this to your domain
define('ALLOWED_ORIGINS', [
    'https://yourusername.altervista.org'
]);
```

---

## 2️⃣ Build the App (1 min)

```bash
npm install
npm run build
```

Creates `dist/` folder with your app.

---

## 3️⃣ Upload to AlterVista (2 min)

**Via FTP:**
- Host: `ftp.yourusername.altervista.org`
- Upload `dist/*` to `/public_html/`
- Upload `backend/` folder to `/public_html/backend/`

**Or use File Manager:**
- Zip `dist/` contents → upload & extract to root
- Zip `backend/` folder → upload & extract

---

## 4️⃣ Setup Database (30 sec)

1. Login to AlterVista Control Panel
2. Open **phpMyAdmin**
3. Click **Import** tab
4. Choose `backend/database/schema.sql`
5. Click **Go**

Done! Tables created automatically.

---

## ✅ Test It

- **App**: `https://yourusername.altervista.org`
- **API Test**: `https://yourusername.altervista.org/backend/test.php`

If test.php shows ✓ checks, you're good!

---

## 🔒 Security Checklist

- [ ] API key in `backend/config/config.php` (NOT in frontend)
- [ ] `.gitignore` ignores `backend/config/config.php`
- [ ] Database credentials updated
- [ ] CORS domain updated to your URL
- [ ] HTTPS enabled in AlterVista panel

---

## 🆘 Troubleshooting

**"API Key not found"**
→ Check `backend/config/config.php` has your key

**"Database connection failed"**
→ Check DB_NAME, DB_USER, DB_PASS in config.php

**"CORS error"**
→ Update ALLOWED_ORIGINS with your exact domain

**"Permission denied"**
→ Set file permissions: `chmod 644 backend/config/config.php`

---

## 📝 File Structure on Server

```
public_html/
├── index.html              ← dist contents
├── assets/
│   └── index-xxx.js
├── backend/
│   ├── api/ai-proxy.php
│   ├── config/config.php   ← your keys here
│   └── database/schema.sql
└── .htaccess
```

---

**Questions?** Check `BACKEND_DEPLOYMENT.md` for detailed troubleshooting.

**Deploy time**: ~5 minutes | **Security**: 100% API key protection ✅
