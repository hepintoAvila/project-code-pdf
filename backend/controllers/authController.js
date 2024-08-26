// backend/src/controllers/authController.js
const express = require('express');
const checkJwt = require('../config/auth0');

const router = express.Router();

router.get('/private', checkJwt, (req, res) => {
  res.json({ message: "This is a protected route." });
});

module.exports = router;
