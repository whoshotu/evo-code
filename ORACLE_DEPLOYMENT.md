# Deploy Node OpenRouter Proxy to Oracle Cloud

Oracle Cloud's free tier includes an always-free **Compute instance** (VM) with 4 CPUs and 24GB RAM — perfect for hosting the Node proxy.

## Step 1: Create Oracle Compute Instance

1. **Log in to Oracle Cloud Console:** https://www.oracle.com/cloud/sign-in/

2. **Create a Compute Instance:**
   - Click **Compute** → **Instances**
   - Click **Create Instance**
   - **Image:** Ubuntu 22.04 (or latest LTS)
   - **Shape:** `VM.Standard.E2.1.Micro` (always free)
   - **VCN & Subnet:** Create new or use default
   - **SSH Key:** Download the private key (`*.key` file) — you'll need this
   - Click **Create**

3. **Wait for instance to boot** (usually 1-2 minutes)

4. **Note the public IP address** (shown in the instance details panel)

---

## Step 2: Connect via SSH

On your **local machine** (where you have the proxy-server folder):

```bash
# Set permissions on your private key
chmod 600 /path/to/your/private-key.key

# SSH into the Oracle instance
# Replace 123.45.67.89 with your public IP
ssh -i /path/to/your/private-key.key ubuntu@123.45.67.89
```

You should now be logged in to the Oracle VM.

---

## Step 3: Install Node.js and npm

On the **Oracle instance** (in the SSH terminal):

```bash
# Update package manager
sudo apt update
sudo apt upgrade -y

# Install Node.js LTS (18 or 20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installation
node --version
npm --version
```

---

## Step 4: Upload Proxy Code to Oracle

### Option A: Use Git (Recommended)

If your proxy-server is in a GitHub repo:

```bash
# On the Oracle instance
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/proxy-server
```

### Option B: Manual Upload

On your **local machine**, upload via SCP:

```bash
# Replace with your key path and IP
scp -i /path/to/key.key -r ./proxy-server ubuntu@123.45.67.89:/home/ubuntu/

# Then SSH and navigate to it
ssh -i /path/to/key.key ubuntu@123.45.67.89
cd proxy-server
```

---

## Step 5: Install Dependencies and Create .env

On the **Oracle instance**:

```bash
# Install npm packages
npm install

# Create .env file
cat > .env << 'EOF'
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=arcee-ai/trinity-large-preview:free
PORT=3000
EOF

# Verify .env was created
cat .env
```

---

## Step 6: Test Locally on Oracle

On the **Oracle instance**:

```bash
# Start the proxy server
npm start

# In another SSH terminal, test it
curl -X POST -H "Content-Type: application/json" \
  -d '{"model":"arcee-ai/trinity-large-preview:free"}' \
  http://localhost:3000/api/validateKey
```

You should get a JSON response (may error if OpenRouter key is invalid, but that's a proxy response, not a timeout).

---

## Step 7: Configure Firewall (Allow Port 3000)

The Oracle Compute instance has an **ingress firewall**. You need to open port 3000:

### From Oracle Cloud Console:

1. Go to **Networking** → **Virtual Cloud Networks**
2. Click your VCN name
3. Click **Security Lists** → select the default list
4. Click **Add Ingress Rule**
5. Configure:
   - **Stateless:** unchecked
   - **Protocol:** TCP
   - **Source Type:** CIDR
   - **Source CIDR:** `0.0.0.0/0` (allow all; restrict later if needed)
   - **Destination Port Range:** `3000`
6. Click **Add Ingress Rule**

Alternatively, from the **instance details** page, edit the Security Group directly.

---

## Step 8: Run Proxy with PM2 (Persistent)

Stop the test server (Ctrl+C) and set up PM2 to keep the proxy running:

On the **Oracle instance**:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Navigate to proxy-server
cd /home/ubuntu/proxy-server  # Adjust path if different

# Start with PM2
pm2 start server.js --name "openrouter-proxy"

# Configure to auto-start on reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# Verify it's running
pm2 list
pm2 logs openrouter-proxy
```

---

## Step 9: Test from Outside (Your Local Machine)

```bash
# Replace 123.45.67.89 with your Oracle public IP
curl -X POST -H "Content-Type: application/json" \
  -d '{"model":"arcee-ai/trinity-large-preview:free"}' \
  http://123.45.67.89:3000/api/validateKey
```

If successful, you'll get a JSON response.

---

## Step 10: Update AlterVista Config

Now update your AlterVista backend config:

1. **Edit `backend/config/config.php` on your AlterVista server:**

   ```php
   // Replace with your Oracle public IP
   define('NODE_PROXY_URL', 'http://123.45.67.89:3000');
   ```

2. **Upload the updated config to AlterVista**

---

## Step 11: Test the Full Stack

1. Open your app: `https://hereisreal.altervista.org/evolve-code`
2. Click "Start Coding" → Begin a lesson
3. Ask the AI tutor a question
4. Should see the AI response (powered by your Oracle proxy!)

---

## Monitoring & Maintenance

### View Logs

```bash
pm2 logs openrouter-proxy
```

### Restart the Proxy

```bash
pm2 restart openrouter-proxy
```

### Stop the Proxy

```bash
pm2 stop openrouter-proxy
```

### Update the API Key (if needed)

```bash
# Edit .env
nano .env

# Restart proxy to apply changes
pm2 restart openrouter-proxy
```

---

## Cost

- **Oracle Free Tier:** 1 always-free Compute instance (VM.Standard.E2.1.Micro)
- **Bandwidth:** 10GB monthly outbound, then paid
- **For a learning app:** you'll stay well within free limits

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Firewall rule not applied; verify port 3000 is open in Security List |
| `Cannot find module 'express'` | Run `npm install` again |
| `EADDRINUSE: address already in use :3000` | Another process is on port 3000; use `lsof -i :3000` to find and kill it |
| `OpenRouter API error` | Check API key in `.env`; verify key is valid at [openrouter.ai/keys](https://openrouter.ai/keys) |
| `Timeout connecting to Oracle IP` | Verify public IP is correct; check Oracle Compute instance status is `Running` |

---

## Quick Command Reference

```bash
# After SSH'ing into Oracle instance:

# Restart proxy
pm2 restart openrouter-proxy

# View status
pm2 status

# Tail logs
pm2 logs openrouter-proxy

# Update .env and restart
nano .env
pm2 restart openrouter-proxy

# Check if port 3000 is listening
netstat -tlnp | grep 3000
```

---

## Security Notes

1. **Always use HTTPS in production** — consider setting up nginx reverse proxy with Let's Encrypt SSL
2. **Restrict CORS origins** in `proxy-server/server.js` to your AlterVista domain:
   ```javascript
   app.use(cors({ origin: 'https://hereisreal.altervista.org' }));
   ```
3. **Limit rate** — increase/decrease in `server.js` if needed
4. **Keep API key secret** — never commit `.env` to version control
5. **Monitor usage** — check Oracle dashboard for bandwidth/load

---

## Next Steps

After everything is working:
- Monitor the proxy for a few days
- If stable, you can enable HTTPS with nginx + Certbot (optional)
- Share your setup with your team once tested!

Good luck! 🚀
