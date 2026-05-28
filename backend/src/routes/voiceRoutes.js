const express = require('express');
const { synthesizeVoice } = require('../controllers/voiceController');

const router = express.Router();

// POST /api/voice/synthesize - Generar audio
router.post('/synthesize', synthesizeVoice);

module.exports = router;
