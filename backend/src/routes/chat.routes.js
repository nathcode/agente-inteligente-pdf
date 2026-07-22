const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Ruta de prueba
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Rutas de configuración
router.get('/config', chatController.getConfig);
router.post('/config/model', chatController.updateModel);
router.post('/config/assistant', chatController.updateAssistant);

// Ruta principal del chat
router.post('/chat', chatController.handleChat);

module.exports = router; 