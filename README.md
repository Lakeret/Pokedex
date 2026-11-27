# Pokédex

Aplicación web interactiva que permite explorar Pokémon, consultar sus características y administrar una lista de favoritos. El proyecto utiliza **HTML, CSS y JavaScript** para el frontend, **PHP** para el backend y **MySQL** para almacenar los favoritos.

Los datos de los Pokémon se obtienen mediante la API pública [PokéAPI](https://pokeapi.co/).

---

# 1. Requisitos previos

Antes de comenzar, es necesario tener instaladas las siguientes herramientas:

| Herramienta | Utilidad |
|---|---|
| Windows | Sistema operativo utilizado en esta guía. |
| Git | Permite descargar el proyecto desde GitHub. |
| XAMPP | Proporciona Apache, PHP y MySQL/MariaDB para ejecutar el proyecto localmente. |
| Navegador web | Permite acceder a la aplicación. |
| Conexión a Internet | Necesaria para descargar el proyecto y consultar PokéAPI. |

No es necesario instalar PHP o MySQL por separado, ya que XAMPP incluye los componentes necesarios.

## 1.1. Instalar Git

Git permite descargar el repositorio del proyecto desde GitHub.

1. Ingresar en la página oficial: https://git-scm.com/downloads
2. Descargar la versión correspondiente a Windows.
3. Ejecutar el instalador.
4. Continuar con la instalación utilizando las opciones predeterminadas.
5. Una vez finalizada la instalación, abrir PowerShell.

Para comprobar que Git se instaló correctamente, ejecutar:

```powershell
git --version
```

Si la instalación fue correcta, aparecerá un número de versión de Git.

## 1.2. Instalar XAMPP

XAMPP permite ejecutar el proyecto en un servidor local.

1. Ingresar en la página oficial: https://www.apachefriends.org/
2. Descargar XAMPP para Windows.
3. Ejecutar el instalador.
4. Seleccionar los siguientes componentes:
   - Apache
   - MySQL
   - PHP
   - phpMyAdmin
5. Continuar con la instalación.
6. Se recomienda utilizar la carpeta predeterminada:

```text
C:\xampp
```

7. Finalizar la instalación.
8. Abrir el **XAMPP Control Panel**.

---

# 2. Descargar el proyecto desde GitHub

Una vez instaladas las herramientas, hay que descargar los archivos de la Pokédex.

## 2.1. Abrir PowerShell

1. Presionar las teclas `Windows + R`.
2. Escribir `powershell`.
3. Presionar Enter.

También se puede abrir PowerShell desde el menú Inicio.

## 2.2. Ubicarse en la carpeta de XAMPP

Apache utiliza la carpeta `htdocs` para almacenar los proyectos web.

Ejecutar el siguiente comando:

```powershell
cd C:\xampp\htdocs
```

Esto nos ubica dentro de la carpeta donde debe descargarse el proyecto.

## 2.3. Clonar el repositorio

Ejecutar:

```powershell
git clone https://github.com/Lakeret/Pokedex.git
```

Git descargará automáticamente los archivos del repositorio y creará una carpeta llamada `Pokedex`.

Esperar a que finalice la descarga. Al terminar, deberían aparecer mensajes indicando que se recibieron los objetos y se resolvieron las diferencias del repositorio.

## 2.4. Entrar en la carpeta del proyecto

Ejecutar:

```powershell
cd C:\xampp\htdocs\Pokedex
```

Para comprobar que los archivos se descargaron correctamente, ejecutar:

```powershell
Get-ChildItem
```

La carpeta debería contener una estructura similar a esta:

```text
Pokedex/
│
├── backend/
│   ├── conexion.php
│   ├── obtener_favoritos.php
│   ├── agregar_favorito.php
│   └── eliminar_favorito.php
│
├── css/
│   └── Styles.css
│
├── js/
│   └── app.js
│
├── Index.html
├── Pokedex.sql
└── README.md
```

Si aparecen estos archivos y carpetas, la descarga se realizó correctamente.

---

# 3. Configurar el servidor local con XAMPP

Ahora hay que iniciar los servicios necesarios para ejecutar la aplicación.

## 3.1. Abrir XAMPP Control Panel

1. Buscar `XAMPP Control Panel` en el menú Inicio.
2. Abrir el programa.
3. Localizar los módulos Apache y MySQL.

## 3.2. Iniciar Apache

Apache es el servidor web que permite ejecutar la aplicación y procesar los archivos PHP.

1. Buscar el módulo **Apache**.
2. Presionar el botón **Start**.
3. Esperar a que el módulo cambie su estado a verde.

## 3.3. Iniciar MySQL

MySQL es el sistema de gestión de bases de datos utilizado para almacenar los Pokémon favoritos.

1. Buscar el módulo **MySQL**.
2. Presionar el botón **Start**.
3. Esperar a que el módulo cambie su estado a verde.

Al finalizar, ambos servicios deberían estar funcionando.

**Importante:** Apache y MySQL deben permanecer iniciados mientras se utiliza la aplicación.

---

# 4. Crear e importar la base de datos

La aplicación necesita una base de datos para guardar los Pokémon favoritos.

El proyecto incluye un archivo SQL que crea automáticamente la base de datos y su tabla correspondiente.

## 4.1. Abrir phpMyAdmin

1. Abrir el navegador.
2. Ingresar en la siguiente dirección:

```text
http://localhost/phpmyadmin/
```

3. Esperar a que cargue phpMyAdmin.

phpMyAdmin es una herramienta web que permite administrar las bases de datos de MySQL.

## 4.2. Importar el archivo SQL

1. Dentro de phpMyAdmin, buscar la pestaña **Importar** en la parte superior.
2. Presionar el botón **Seleccionar archivo**.
3. Buscar la carpeta del proyecto:

```text
C:\xampp\htdocs\Pokedex
```

4. Seleccionar el archivo:

```text
Pokedex.sql
```

5. Bajar hasta el final de la página.
6. Presionar el botón **Importar** o **Continuar**, según la versión de phpMyAdmin.

Esperar a que finalice el proceso.

Si la importación se realizó correctamente, phpMyAdmin mostrará un mensaje de confirmación.

## 4.3. Comprobar la base de datos

En el panel izquierdo de phpMyAdmin debería aparecer una base de datos llamada:

```text
pokedex_db
```

Al seleccionarla, debería aparecer la tabla:

```text
favoritos
```

Esta tabla almacena los Pokémon agregados a favoritos.

**No es necesario crear la base de datos ni la tabla manualmente.** El archivo `Pokedex.sql` se encarga de hacerlo.

---

# 5. Verificar la conexión entre PHP y MySQL

Antes de abrir la aplicación, podemos comprobar que el backend logra conectarse correctamente a la base de datos.

## 5.1. Revisar el archivo de conexión

Abrir el siguiente archivo:

```text
backend/conexion.php
```

Este archivo contiene la configuración necesaria para que PHP pueda conectarse a MySQL mediante PDO.

En una instalación estándar de XAMPP, normalmente se utiliza:

- Servidor: `localhost`
- Usuario: `root`
- Contraseña: vacía, si no se configuró una.
- Base de datos: `pokedex_db`

Si se modificaron las credenciales de MySQL, hay que actualizar los valores correspondientes en este archivo.

No se debe modificar la configuración si la instalación utiliza los valores predeterminados y la conexión ya funciona.

## 5.2. Probar el endpoint de favoritos

Con Apache y MySQL iniciados, abrir:

```text
http://localhost/Pokedex/backend/obtener_favoritos.php
```

Si la conexión funciona y todavía no hay favoritos guardados, debería aparecer:

```json
[]
```

Esto significa que PHP pudo conectarse a MySQL y consultar la tabla `favoritos`, pero no encontró registros.

Si aparece un error, revisar la configuración de `conexion.php`, comprobar que MySQL esté iniciado y verificar que la base de datos `pokedex_db` exista.

---

# 6. Ejecutar la aplicación

Una vez completados los pasos anteriores, la Pokédex ya está lista para utilizarse.

Abrir el navegador e ingresar en:

```text
http://localhost/Pokedex/
```

Se debería mostrar la interfaz principal de la aplicación.

**Importante:** No abrir `Index.html` haciendo doble clic desde el Explorador de archivos. Hay que ingresar mediante `localhost`, ya que el proyecto utiliza PHP y necesita ejecutarse a través de Apache.

---

# 7. Funcionalidades de la Pokédex

## 7.1. Catálogo de Pokémon

La aplicación muestra un catálogo de Pokémon organizado en tarjetas.

Se cargan 20 Pokémon por página para facilitar la navegación.

## 7.2. Búsqueda

Permite buscar Pokémon mediante:

- Nombre.
- Número de Pokédex.

La búsqueda puede encontrar Pokémon aunque no estén en la página que se está visualizando.

## 7.3. Filtros por tipo

Permite filtrar los Pokémon según sus tipos.

Se encuentran disponibles los 18 tipos de Pokémon.

## 7.4. Ordenamiento

Permite organizar los resultados utilizando distintos criterios:

- Número de Pokédex.
- Nombre.
- Ataque.
- Defensa.
- Velocidad.

También permite seleccionar el orden ascendente o descendente.

## 7.5. Ficha individual

Al seleccionar un Pokémon se abre una ficha con información detallada:

- Imagen.
- Número de Pokédex.
- Nombre.
- Tipos.
- Altura.
- Peso.
- Habilidades.
- Estadísticas.

Las estadísticas se representan mediante barras visuales.

El modal puede cerrarse mediante el botón de cierre, haciendo clic fuera de la ventana o presionando Escape.

## 7.6. Sistema de favoritos

Los usuarios pueden agregar o eliminar Pokémon de una lista de favoritos.

Los favoritos se almacenan en MySQL, por lo que permanecen guardados aunque se cierre o recargue la página.

La lista es compartida por todos los usuarios de la misma instalación, ya que el proyecto no utiliza un sistema de cuentas personales.

## 7.7. Estadísticas generales

La aplicación también muestra información general:

- Cantidad de Pokémon disponibles.
- Cantidad de favoritos guardados.
- Cantidad de tipos disponibles.

---

# 8. Solución de problemas frecuentes

## 8.1. Apache no inicia

Puede ocurrir si otro programa está utilizando el puerto que necesita Apache.

**Qué hacer:**

1. Abrir XAMPP Control Panel.
2. Comprobar si aparece un error en el registro de Apache.
3. Verificar si otro servicio está utilizando el puerto 80 o 443.
4. Cerrar el programa que esté ocupando el puerto o configurar Apache para utilizar otro puerto.

## 8.2. MySQL no inicia

Puede existir un conflicto con otro servicio MySQL o con el puerto 3306.

**Qué hacer:**

1. Comprobar el registro de errores de MySQL en XAMPP.
2. Verificar si otro servidor MySQL está funcionando.
3. Revisar si el puerto 3306 está ocupado.

No eliminar ni modificar archivos internos de MySQL sin identificar primero el problema.

## 8.3. PowerShell no reconoce el comando git

Si aparece un mensaje indicando que `git` no se reconoce como comando:

1. Comprobar que Git esté instalado.
2. Cerrar y volver a abrir PowerShell.
3. Ejecutar:

```powershell
git --version
```

Si sigue sin funcionar, revisar la instalación y la configuración de PATH de Git.

## 8.4. Error de conexión con MySQL

Si la aplicación muestra un error relacionado con la conexión:

1. Comprobar que MySQL esté iniciado en XAMPP.
2. Abrir phpMyAdmin.
3. Verificar que exista `pokedex_db`.
4. Revisar las credenciales de `backend/conexion.php`.
5. Comprobar que el usuario y la contraseña coincidan con la configuración local de MySQL.

## 8.5. La página no carga correctamente

Comprobar lo siguiente:

- Apache está iniciado.
- El proyecto está dentro de `C:\xampp\htdocs\Pokedex`.
- La dirección utilizada es `http://localhost/Pokedex/`.
- El archivo principal se llama `Index.html`.
- La conexión a Internet funciona.

## 8.6. Los favoritos no se guardan

1. Comprobar que MySQL esté iniciado.
2. Verificar que exista la tabla `favoritos`.
3. Abrir el endpoint de consulta para comprobar la conexión:

```text
http://localhost/Pokedex/backend/obtener_favoritos.php
```

4. Revisar si aparecen errores en las herramientas de desarrollador del navegador, dentro de la pestaña Consola o Red.

---

# 9. Estructura del proyecto

```text
Pokedex/
│
├── backend/
│   ├── conexion.php
│   ├── obtener_favoritos.php
│   ├── agregar_favorito.php
│   └── eliminar_favorito.php
│
├── css/
│   └── Styles.css
│
├── js/
│   └── app.js
│
├── Index.html
├── Pokedex.sql
└── README.md
```

### Descripción de los archivos

| Archivo o carpeta | Función |
|---|---|
| `Index.html` | Estructura principal de la aplicación. |
| `css/Styles.css` | Estilos, diseño y adaptación a distintos dispositivos. |
| `js/app.js` | Lógica del frontend, catálogo, búsqueda, filtros, fichas y favoritos. |
| `backend/conexion.php` | Configuración de conexión a MySQL mediante PDO. |
| `backend/obtener_favoritos.php` | Consulta los favoritos almacenados. |
| `backend/agregar_favorito.php` | Agrega un Pokémon a favoritos. |
| `backend/eliminar_favorito.php` | Elimina un Pokémon de favoritos. |
| `Pokedex.sql` | Script para crear la base de datos y la tabla de favoritos. |
| `README.md` | Documentación e instrucciones de instalación. |

---

# 10. Tecnologías utilizadas

- **HTML5:** estructura de la aplicación.
- **CSS3:** diseño visual, animaciones y adaptación responsive.
- **JavaScript:** interacción y funcionamiento del frontend.
- **PHP:** procesamiento de solicitudes y comunicación con la base de datos.
- **PDO:** conexión entre PHP y MySQL.
- **MySQL:** almacenamiento persistente de favoritos.
- **Git y GitHub:** control de versiones y alojamiento del código.
- **XAMPP:** entorno de desarrollo local.
- **PokéAPI:** fuente externa de información de los Pokémon.

---

# 11. API utilizada

Los datos de los Pokémon se obtienen mediante:

[PokéAPI](https://pokeapi.co/)

Documentación oficial:

[https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)

La aplicación necesita conexión a Internet para consultar esta API y cargar la información e imágenes de los Pokémon.

---

# 12. Repositorio

Código fuente del proyecto:

[https://github.com/Lakeret/Pokedex](https://github.com/Lakeret/Pokedex)

---

**Proyecto desarrollado con fines educativos.**
