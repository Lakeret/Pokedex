# Pokédex

Una aplicación web inspirada en la Pokédex del universo Pokémon. Permite explorar Pokémon, consultar sus características y guardar favoritos.

## Tecnologías utilizadas

- **HTML5:** estructura de la página.
- **CSS3:** diseño y estilos visuales.
- **JavaScript:** funcionalidades e interacción con la API.
- **PHP:** comunicación con la base de datos.
- **MySQL:** almacenamiento de Pokémon favoritos.
- **PokéAPI:** API externa para obtener información de los Pokémon.
- **XAMPP:** entorno de desarrollo local.

## Funcionalidades

- Visualización de Pokémon mediante tarjetas.
- Búsqueda por nombre o número.
- Filtros por tipo de Pokémon.
- Ordenamiento por diferentes características.
- Fichas individuales con información y estadísticas.
- Sistema de favoritos conectado a MySQL.
- Panel con estadísticas generales.
- Diseño adaptable a diferentes tamaños de pantalla.

## Estructura del proyecto

```text
Pokedex/
├── Index.html
├── css/
│   └── Styles.css
├── js/
│   └── app.js
├── backend/
│   ├── conexion.php
│   ├── obtener_favoritos.php
│   ├── agregar_favorito.php
│   └── eliminar_favorito.php
└── pokedex_db.sql
```

## Base de datos

El proyecto utiliza una base de datos MySQL llamada `pokedex_db`.

La tabla `favoritos` almacena los Pokémon guardados, incluyendo su identificador, nombre, imagen y fecha de registro.

El archivo `pokedex_db.sql` contiene la estructura necesaria para crear e importar la base de datos.

## Requisitos

- XAMPP.
- PHP con extensión PDO para MySQL.
- MySQL o MariaDB.
- Navegador web con conexión a Internet.

## Instalación y ejecución

1. Instalar y ejecutar XAMPP.
2. Iniciar los servicios Apache y MySQL.
3. Copiar la carpeta `Pokedex` dentro de `C:\xampp\htdocs\`.
4. Abrir phpMyAdmin desde `http://localhost/phpmyadmin/`.
5. Importar el archivo `pokedex_db.sql`.
6. Verificar la configuración de conexión en `backend/conexion.php`.
7. Abrir el proyecto desde el navegador:

   `http://localhost/Pokedex/`

## API utilizada

La aplicación utiliza [PokéAPI](https://pokeapi.co/), una API pública y gratuita que proporciona información sobre Pokémon, tipos, habilidades y estadísticas.

## Autor

Proyecto desarrollado con fines educativos.
