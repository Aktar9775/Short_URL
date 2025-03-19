const express = require('express');
const {
  handleGenerateNewUrl,
  handleGetAllUrl,
  handleSSE
} = require('../controller/url');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.post("/", authMiddleware, handleGenerateNewUrl);
router.get('/all', authMiddleware, handleGetAllUrl);
router.get('/updates', authMiddleware, handleSSE);
module.exports = router;
