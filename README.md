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

## Requisitos

- Git.
- XAMPP.
- PHP con extensión PDO para MySQL.
- MySQL o MariaDB.
- Navegador web.
- Conexión a Internet.

## Instalación y ejecución

### 1. Descargar el proyecto desde GitHub

Abrir PowerShell y ejecutar los siguientes comandos:

```powershell
cd C:\xampp\htdocs
git clone https://github.com/Lakeret/Pokedex.git
```

Esto descargará el repositorio y creará automáticamente la carpeta `Pokedex` dentro de `htdocs`.

### 2. Iniciar XAMPP

1. Abrir el panel de control de XAMPP.
2. Iniciar los servicios Apache y MySQL.

### 3. Configurar la base de datos

1. Abrir `http://localhost/phpmyadmin/`.
2. Seleccionar la opción Importar.
3. Elegir el archivo `pokedex_db.sql`, ubicado en la carpeta del proyecto.
4. Ejecutar la importación.

El archivo contiene las instrucciones necesarias para crear la base de datos `pokedex_db` y su tabla `favoritos`.

### 4. Configurar la conexión

Verificar el archivo `backend/conexion.php`.

La configuración inicial utiliza los valores habituales de XAMPP:

- Servidor: `localhost`
- Base de datos: `pokedex_db`
- Usuario: `root`
- Contraseña: vacía

Si la instalación local utiliza otras credenciales, será necesario modificarlas.

### 5. Ejecutar la aplicación

Abrir el navegador y acceder a:

```text
http://localhost/Pokedex/
```

La aplicación ya estará disponible para utilizarse.

## API utilizada

La aplicación utiliza [PokéAPI](https://pokeapi.co/), una API pública y gratuita que proporciona información sobre Pokémon, tipos, habilidades y estadísticas.

## Autor

Proyecto desarrollado con fines educativos.
