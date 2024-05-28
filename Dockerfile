# Use a base image with Node.js pre-installed
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar los archivos del proyecto al contenedor
COPY . .

# Instalar las dependencias de Node.js
RUN npm install

# Exponer el puerto en el que se ejecutará tu aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["npm", "start"]
