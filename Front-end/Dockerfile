# Use an image de nginx como base
FROM nginx

# Copiar los archivos a la carpeta de trabajo de nginx
COPY . /usr/share/nginx/html

# Establecer la carpeta de trabajo
WORKDIR /usr/share/nginx/html


# Exponer el puerto 82
EXPOSE 80

# Ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]