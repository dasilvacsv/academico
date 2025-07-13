// main/index.ts
import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { initializeDatabase, getDatabasePath } from './database';
import { fork } from 'child_process';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // La URL siempre apunta a localhost:3000, tanto en desarrollo como en producción.
  win.loadURL('http://localhost:3000');

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', () => {
  // 1. Inicializa la base de datos (la crea si no existe).
  initializeDatabase();
  
  // 2. Obtiene la ruta de la base de datos.
  const dbPath = getDatabasePath();

  // 3. Establece la ruta como una variable de entorno.
  //    Esto permite que el servidor de Next.js (que es otro proceso) la pueda leer.
  process.env.DB_PATH = dbPath;

  // 4. Si estamos en producción, iniciamos el servidor de Next.js empaquetado.
  if (!isDev) {
    // La ruta apunta al servidor dentro de los recursos de la app empaquetada.
    const serverPath = path.join(process.resourcesPath, 'app/.next/standalone/server.js');
    // Usamos fork para iniciar el servidor en un nuevo proceso, pasando las variables de entorno.
    fork(serverPath, [], { env: process.env });
  }

  // 5. Creamos la ventana de la aplicación.
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
