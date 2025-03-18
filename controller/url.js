const shortId = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewUrl(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const shortid = shortId.generate();
    const newUrl = await URL.create({
      shortId: shortid,
      redirectURL: url,
      visitHistory: [], 
      createdBy: req.user._id, 
    });

    return res.status(201).json({ id: shortid, message: 'Short URL created successfully' });
  } catch (error) {
    console.error('Generate URL Error:', error);
    return res.status(500).json({ error: 'Failed to create short URL' });
  }
}
const clients = [];
async function handleSSE(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send updates every 1 second
  const interval = setInterval(async () => {
    try {
      const urls = await URL.find({ createdBy: req.user._id }); // ✅ Filter URLs by user
      res.write(`data: ${JSON.stringify(urls)}\n\n`);
    } catch (error) {
      console.error('SSE Error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Failed to fetch URLs' })}\n\n`);
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval); // ✅ Cleanup
  });
}



function sendUrlsToClients() {
  URL.find({}).then((urls) => {
    clients.forEach((client) => {
      client.write(`data: ${JSON.stringify(urls)}\n\n`);
    });
  });
}


async function handleGetAllUrl(req, res) {
  try {
    const urls = await URL.find({ createdBy: req.user._id }) // ✅ Filter by user
    res.json(urls);
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch URLs' });
  }
}

module.exports = {
  handleGenerateNewUrl,
  handleGetAllUrl,
  handleSSE,
  sendUrlsToClients,
};
