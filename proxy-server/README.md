OpenRouter Proxy

Small Node/Express proxy to keep your OpenRouter API key server-side and avoid hosting restrictions.

Quick start (local):

1. Copy `.env.example` to `.env` and set `OPENROUTER_API_KEY`.

2. Install deps and run:

```bash
npm install
npm run start
```

3. Test validation endpoint:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"model":"arcee-ai/trinity-large-preview:free"}' http://localhost:3000/api/validateKey
```

Deploy:

- Render / Fly / Heroku / Vercel: push this folder and set `OPENROUTER_API_KEY` in the environment variables. Use `start` script.
- Restrict `CORS` origins in `server.js` to your frontend domain before deploying to production.

Security notes:

- Keep the `OPENROUTER_API_KEY` secret in environment variables.
- Add IP or origin allowlists where possible.
- Consider request signing and stricter rate limits for production.
