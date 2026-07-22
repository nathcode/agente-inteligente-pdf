# Imagen base de Node
FROM node:22-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar código fuente
COPY . .

# Puerto del backend
EXPOSE 3000

# Ejecutar aplicación
CMD ["npm", "start"]