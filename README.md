# Chatbotia - Chat de Soporte Interno

Aplicación de chat de soporte interno que utiliza OpenAI para generar respuestas automáticas.

## Estructura del Proyecto

```
chatbotia/
├── backend/           # Servidor Node.js + Express
│   ├── src/
│   │   └── index.js   # Servidor principal
│   ├── .env          # Variables de entorno (no incluido en git)
│   └── package.json
│
└── frontend/         # Aplicación React Native
    ├── App.js        # Componente principal
    └── package.json
```

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta de OpenAI con API key
- Para desarrollo móvil:
  - Expo CLI
  - iOS Simulator (Mac) o Android Studio (Android)

## Configuración del Backend

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en el directorio `backend` con el siguiente contenido:
   ```
   OPENAI_API_KEY=tu_clave_api_de_openai
   PORT=3000
   NODE_ENV=development
   ```

4. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

El servidor estará disponible en `http://localhost:3000`

## Configuración del Frontend

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ajusta la URL de la API en `App.js`:
   - Para desarrollo local: `http://localhost:3000/api/chat`
   - Para emulador Android: `http://10.0.2.2:3000/api/chat`
   - Para producción: URL de tu servidor desplegado

4. Inicia la aplicación:
   ```bash
   npm start
   ```

5. Usa Expo Go en tu dispositivo móvil o un emulador para probar la aplicación.

## Despliegue

### Backend

El backend puede ser desplegado en servicios como:
- Render
- Railway
- Heroku
- Vercel

Recuerda configurar las variables de entorno en el servicio de hosting:
- `OPENAI_API_KEY`
- `PORT` (opcional, el servicio suele asignarlo)
- `NODE_ENV=production`

### Frontend

Para el frontend móvil:
1. Crea una cuenta en Expo
2. Configura el proyecto:
   ```bash
   expo login
   expo build:configure
   ```
3. Construye la aplicación:
   ```bash
   expo build:android  # Para Android
   expo build:ios      # Para iOS
   ```

## Características

- Interfaz de chat intuitiva
- Integración con OpenAI GPT-3.5 Turbo
- Manejo de errores robusto
- Diseño responsive
- Soporte para iOS y Android

## Próximas Mejoras

- [ ] Autenticación con JWT
- [ ] Streaming de respuestas
- [ ] Soporte para documentos PDF/URLs
- [ ] Persistencia de mensajes
- [ ] Temas personalizables
- [ ] Soporte para múltiples idiomas

## Solución de Problemas

### Backend

1. Error de conexión a OpenAI:
   - Verifica tu API key en el archivo `.env`
   - Comprueba tu conexión a internet
   - Revisa los logs del servidor

2. Error de CORS:
   - Asegúrate de que el frontend está usando la URL correcta
   - Verifica que el middleware CORS está habilitado

### Frontend

1. Error de conexión al backend:
   - Verifica la URL de la API en `App.js`
   - Asegúrate de que el backend está corriendo
   - Comprueba la configuración de red en el emulador

2. Problemas con Expo:
   - Limpia la caché: `expo start -c`
   - Actualiza Expo CLI: `npm install -g expo-cli`
   - Verifica la versión de Node.js

## Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles. 