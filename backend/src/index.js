const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const chatRoutes = require('./routes/chat.routes');
const logger = require('./middleware/logger.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors({
    origin: config.cors.origin
}));
app.use(express.json());
app.use(logger);

// Rutas
app.use('/api', chatRoutes);

// Manejador de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(config.port, () => {
    console.log(`Servidor backend escuchando en http://localhost:${config.port}`);
    console.log('Ambiente:', process.env.NODE_ENV || 'development');
}); 