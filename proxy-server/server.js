require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(helmet());
app.use(cors({ origin: '*' })); // Restrict origin in production
app.use(express.json({ limit: '1mb' }));

// Basic rate limiting
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

if (!OPENROUTER_API_KEY) {
  console.warn('Warning: OPENROUTER_API_KEY is not set. Set it in environment before deploying.');
}

app.post('/api/ai', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) return res.status(500).json({ success: false, error: 'Server missing OPENROUTER_API_KEY' });

    // Forward the incoming JSON body to OpenRouter (preserves client fields like model/messages/etc.)
    const response = await axios.post(
      'https://api.openrouter.ai/v1/chat/completions',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    return res.status(response.status).json(response.data);
  } catch (err) {
    const message = err.response && err.response.data ? err.response.data : err.message;
    return res.status(500).json({ success: false, error: message });
  }
});

// Small validation endpoint that tries a tiny completion to verify key/model
app.post('/api/validateKey', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) return res.status(500).json({ success: false, error: 'Server missing OPENROUTER_API_KEY' });

    const model = req.body.model || process.env.OPENROUTER_MODEL || 'arcee-ai/trinity-large-preview:free';
    const payload = {
      model,
      messages: [ { role: 'user', content: 'ping' } ],
      max_tokens: 1
    };

    const response = await axios.post(
      'https://api.openrouter.ai/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    return res.json({ success: true, data: response.data });
  } catch (err) {
    const status = (err.response && err.response.status) || 500;
    const body = (err.response && err.response.data) || err.message;
    return res.status(status).json({ success: false, error: body });
  }
});

app.get('/', (req, res) => res.send('OpenRouter proxy running'));

app.listen(PORT, () => console.log(`Proxy server listening on port ${PORT}`));
