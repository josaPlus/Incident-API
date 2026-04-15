FROM node:alpine

WORKDIR /app

# Copiar el proyecto a la imagen de docker
COPY package.json package-lock.json ./

# Instalar las dependencias con npm i
RUN npm install

# copiamos el resto del proyecto
COPY . .

# compilar el proyecto
RUN npm run build
EXPOSE 3000

# Colocar un comando de inicio
CMD [ "node", "dist/main" ]