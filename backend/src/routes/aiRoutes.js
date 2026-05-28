const express = require('express');
const { sendMessage, getVoiceForText } = require('../controllers/aiController');

const router = express.Router();

// POST /api/ai/message - Enviar mensaje al AI
router.post('/message', sendMessage);

// POST /api/ai/voice - Generar audio de texto
router.post('/voice', getVoiceForText);

module.exports = router;
