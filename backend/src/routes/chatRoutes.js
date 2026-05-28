const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// GET - Obtener mensajes
router.get('/messages', chatController.getMessages);

// POST - Enviar mensaje
router.post('/message', chatController.sendMessage);

module.exports = router;
