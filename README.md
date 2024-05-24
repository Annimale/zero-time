
# Zero Time

## Descripción del Proyecto

Zero Time es una aplicación web que reúne tres principales funcionalidades en una misma plataforma:

1.  Compra de relojes de alta y media gama.
2.  Venta de relojes propios a través de la plataforma.
3.  Sección de noticias donde los usuarios pueden dejar comentarios sobre las noticias.

### Propósito

Con la tendencia de los relojes de alta y media gama, Zero Time permite conectar, comprar y vender a la comunidad aficionada a la relojería.

### Características Principales

-   **Compra de relojes:** Explora y compra relojes de diferentes marcas y modelos.
-   **Venta de relojes:** Vende tus relojes a través de la plataforma llenando un formulario.
-   **Noticias:** Lee y comenta en las noticias relacionadas con el mundo de la relojería.
-   **Autenticación:** Registro y login, incluyendo la opción de iniciar sesión con Google.
-   **Pasarela de pago:** Integración con PayPal para la compra de relojes.

## Instalación y Configuración

### Requisitos Previos

-   Node.js (v14.x o superior)
-   Angular CLI (v11.x o superior)
-   MySQL
-   XAMPP (para servidor local)
-   npm (v6.x o superior)

### Instrucciones de Instalación

1.  **Clona el repositorio:**
    
    `git clone https://github.com/tu-usuario/zero-time.git
    cd zero-time` 
    
2.  **Instala las dependencias:**
    
    `npm install
    cd client
    npm install` 
    
3.  **Configura la base de datos:**
    
    -   Configura MySQL y phpMyAdmin en XAMPP.
    -   Crea una base de datos llamada `zerotime`.
    -   Configura las variables de entorno para la conexión a la base de datos en un archivo `.env` en la raíz del proyecto:
        
        env
        
        Copiar código
        
        `DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=tu_contraseña
        DB_NAME=zerotime` 
        

### Comandos para Inicializar la Aplicación

1.  **Inicia el servidor de base de datos local con XAMPP.**
    
2.  **Instalación de dependencias:**
    
    `npm install` 
    
    
3.  **Inicia el servidor backend:**
     
    `node server` 
    
4.  **Inicia el cliente frontend:**
      
    `cd client
    ng serve` 

## Uso

### Instrucciones Básicas de Uso

-   **Home:** Página principal con un video y mensajes llamativos, últimas adquisiciones de relojes.
-   **News:** Sección de noticias filtrable por autor, fecha, título, categoría, etc. Permite comentarios en cada noticia.
-   **Brands:** Lista de marcas con sus descripciones y relojes asociados.
-   **Shop:** Todos los relojes disponibles en la tienda con filtros por precio, marca, modelo, etc. Detalles de cada reloj y opción de compra.
-   **Vender tu reloj:** Formulario para que los usuarios logueados puedan vender sus relojes.
-   **Perfil:** Funciones como editar perfil, ver usuarios, etc.
-   **Carrito:** Resumen de compras con total y productos añadidos, integración con PayPal para el pago.

## Arquitectura y Diseño

### Descripción de la Arquitectura del Proyecto

-   **Frontend:** Desarrollado en Angular.
-   **Backend:** Desarrollado en Node.js con Express.
-   **Base de Datos:** MySQL gestionado con Sequelize ORM.

### Principales Componentes y su Funcionalidad

-   **Cliente (Angular):** Interfaz de usuario, rutas y vistas.
-   **Servidor (Node.js/Express):** API REST, lógica de negocio.
-   **Base de Datos (MySQL):** Almacenamiento de datos, gestionado con Sequelize.

### Flujo de Datos

1.  El cliente hace una solicitud al servidor.
2.  El servidor procesa la solicitud y realiza operaciones en la base de datos.
3.  El servidor responde al cliente con los datos solicitados.

## Base de Datos

### Esquema de la Base de Datos

Describe las tablas principales y sus relaciones, por ejemplo:

-   **Usuarios:** id, nombre, email, contraseña, etc.
-   **Relojes:** id, marca, modelo, precio, características, etc.
-   **Noticias:** id, título, contenido, autor, etc.
-   **Comentarios:** id, noticia_id, usuario_id, comentario, etc.

### Instrucciones para Ejecutar Migraciones y Seeds

1.  **Migraciones:**
       
    `npx sequelize-cli db:migrate` 
    
2.  **Seeds:**
    
    `npx sequelize-cli db:seed:all` 
    

## Testing

### Estrategia de Testing

-   **Tipos de Tests:** Unitarios, de integración, de aceptación.
-   **Herramientas Utilizadas:** Jest, Supertest.

### Instrucciones para Ejecutar los Tests

`npm test` 

## Contribuciones

### Guía para Contribuir

1.  Haz un fork del proyecto.
2.  Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3.  Realiza tus cambios y haz commits (`git commit -m 'Agrega nueva funcionalidad'`).
4.  Empuja tus cambios (`git push origin feature/nueva-funcionalidad`).
5.  Crea un pull request.

## Información Adicional

### Problemas Conocidos y Soluciones

-   Los mensajes de `swal.fire` no están internacionalizados y los mensajes de la base de datos tampoco.

### Futuras Mejoras o Características Planeadas

-   Historial de compras y ventas para los usuarios.
-   Mejorar rendimiento.
-   Refactorización del código.

### Autores y Colaboradores

-   **Iván Torres Marcos**

