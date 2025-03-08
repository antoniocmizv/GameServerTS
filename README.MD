# Documentación del Proyecto

## Visión General  
Este proyecto es una aplicación multijugador que utiliza un servidor basado en Node.js/Express y Socket.IO para gestionar la lógica del juego y la comunicación en tiempo real. Se implementan dos clientes:  
- **Cliente JavaScript**: Una interfaz sencilla que renderiza el tablero y permite interactuar mediante comandos (avanzar, rotar, disparar).  

## Arquitectura y Organización de Carpetas  
- **/server**:  
  - **src/**: Código fuente del servidor, que incluye:  
    - **game/**: Lógica del juego (GameService, BoardBuilder, entidades del juego, mappers).  
    - **player/**: Entidades y lógica de los jugadores.  
    - **room/**: Gestión de las salas (RoomService, entidades de Room).  
    - **server/**: Servicio principal del servidor (ServerService) que gestiona las conexiones y la comunicación con Socket.IO.  
    - **index.ts**: Punto de entrada de la aplicación del servidor.
  - **package.json**, **tsconfig.json**: Configuración y dependencias del servidor.

- **/cliente**:  
  - Código JavaScript para la conexión al servidor, renderización del tablero y control de jugadores (archivos en src/ y assets/).


## Tecnologías Utilizadas  
- **Backend**: Node.js, Express, Socket.IO, TypeScript  
- **Frontend (cliente JavaScript)**: JavaScript ES6, HTML, CSS  

## Instrucciones de Instalación y Ejecución

### Servidor  
1. Navega a la carpeta `/server`.  
2. Instala las dependencias:  
   ```bash
   npm install
   ```  
3. Inicia el servidor en modo desarrollo:  
   ```bash
   npm run dev
   ```  
4. El servidor escuchará en el puerto configurado (por defecto 3000).

### Cliente JavaScript  
1. Navega a la carpeta `/cliente`.  
2. Instala las dependencias:  
   ```bash
   npm install
   ```  
3. Abre el archivo `index.html` en un navegador para ejecutar la aplicación.



## Flujo del Juego  
1. El jugador se conecta al servidor mediante WebSocket.  
2. El servidor administra las salas y crea el juego cuando la sala está completa.  
3. Se envían actualizaciones del tablero y estados del juego a todos los clientes conectados.  
4. Los clientes muestran la interfaz de usuario y permiten al jugador interactuar (mover, rotar, disparar).  
5. La lógica de colisiones y finalización (Game Over) se gestiona en el servidor.

## Contribución  
- Clonar el repositorio.  
- Crear ramas para nuevas funcionalidades o correcciones de errores.  
- Realizar pull requests para integrar los cambios de forma colaborativa.

## Licencia  
Distribuido bajo la Licencia MIT.
