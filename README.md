# Chatbotia - Chat de Soporte Interno

Aplicación de chat de soporte interno compatible con OpenAI y Ollama para generar respuestas automáticas.

## Estructura del Proyecto

```text
chatbotia/
├── backend/           # Servidor Node.js + Express
│   ├── src/
│   │   └── index.js   # Servidor principal
│   ├── .env          # Variables de entorno (no incluido en git)
│   └── package.json
│
└── frontend/         # Aplicación React
    ├── src/
    └── package.json
```

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Opcionalmente, una cuenta de OpenAI o una instancia local de Ollama

## Configuración del Backend

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` con alguna de estas opciones:

   Para OpenAI:
   ```env
   OPENAI_API_KEY=tu_clave_api_de_openai
   PORT=3000
   NODE_ENV=development
   LLM_PROVIDER=openai
   ```

   Para Ollama:
   ```env
   PORT=3000
   NODE_ENV=development
   LLM_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
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

3. Inicia la aplicación:
   ```bash
   npm start
   ```

## Características

- Interfaz de chat intuitiva
- Compatibilidad con OpenAI y Ollama
- Manejo de errores robusto
- Diseño responsive

## Solución de Problemas

### Backend

1. Error de conexión con Ollama:
   - Verifica que la instancia de Ollama esté corriendo en `http://localhost:11434`
   - Revisa que el modelo exista con `ollama pull llama3.2`

2. Error de CORS:
   - Asegúrate de que el frontend esté usando la URL correcta
   - Verifica que el middleware CORS está habilitado
 