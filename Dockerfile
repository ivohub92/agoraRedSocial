# Imagen del backend (NestJS) para Render con runtime Docker.
# Se construye desde la raíz del repo: solo copia la carpeta backend/.
FROM node:22-alpine

WORKDIR /app

# Primero las dependencias (se cachean mientras no cambie package*.json).
COPY backend/package.json backend/package-lock.json backend/.npmrc ./
RUN npm ci

# Después el código, y se compila a dist/.
COPY backend/ ./
RUN npm run build

ENV NODE_ENV=production
# Render pasa el puerto en la variable PORT; main.ts la lee (3000 si no existe).
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
