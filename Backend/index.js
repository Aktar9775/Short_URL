require("dotenv").config();
const express = require('express');
const cors = require('cors');
const urlRoute = require('./routes/url');
const User = require('./routes/auth');
const URL = require('./models/url');
const { connectMongoDB } = require('./connect');

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

const app = express();

connectMongoDB(MONGO_URL).then(() => {
  console.log('✅ Server running');
});

// 🔹 CORS Middleware Function
const allowCors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Consider using a specific origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
   res.setHeader('Access-Control-Allow-Credentials', 'true'); // Required if using cookies or authentication
  
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
};

// 🔹 Apply the `allowCors` Middleware
app.use(allowCors);

app.use(cors({
  origin: 'https://urlshortener-ebon.vercel.app',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true, // access-control-allow-credentials:true
  optionSuccessStatus: 200
}));

app.use(express.json());

app.use('/url', urlRoute);
app.use('/user', User);

app.get('/', (req, res) => {
  res.json(`✅ Server is running on PORT ${PORT}`);
});

app.get('/favicon.ico', (req, res) => res.status(204).send());

app.get('/:shortId', async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: { visitHistory: { timestamp: Date.now() } }
      }
    );
    if (!entry) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.redirect(entry.redirectURL);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
