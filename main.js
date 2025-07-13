const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec, spawn } = require("child_process");

// La forma correcta de detectar si estamos en desarrollo o en producción (empaquetado)
const isDev = !app.isPackaged;

// Variable para mantener una referencia al proceso del servidor de Next.js
let serverProcess;

function createWindow() {
  const dbPath = path.join(app.getPath("userData"), "school_system.db");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Si la base de datos no existe, la crea.
  if (!fs.existsSync(dbPath)) {
    const setupScript = path.join(__dirname, "scripts", "setup-database.js");
    exec(`node "${setupScript}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al crear la base de datos: ${error}`);
        return;
      }
      console.log(`Base de datos creada: ${stdout}`);
      if (stderr) {
        console.error(`Error en script: ${stderr}`);
      }
    });
  }

  if (isDev) {
    // MODO DESARROLLO: Carga la URL del servidor de desarrollo de Next.js
    win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    // MODO PRODUCCIÓN: Inicia el servidor 'standalone' y luego carga la URL
    const serverPath = path.join(__dirname, ".next/standalone/server.js");
    
    // Inicia el servidor de Node.js en un proceso separado
    serverProcess = spawn("node", [serverPath], {
      env: { ...process.env, PORT: "3000" },
    });

    // Muestra los logs del servidor en la consola principal (útil para depurar)
    serverProcess.stdout.on('data', (data) => {
        console.log(`server log: ${data}`);
    });
    serverProcess.stderr.on('data', (data) => {
        console.error(`server error: ${data}`);
    });

    // Esperamos un momento para que el servidor se inicie antes de cargar la URL.
    // 5 segundos es un tiempo de espera seguro.
    const serverReadyTimeout = 5000;
    setTimeout(() => {
        win.loadURL("http://localhost:3000");
    }, serverReadyTimeout);
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Importante: Al cerrar la aplicación, también debemos detener el proceso del servidor.
    if (serverProcess) {
        serverProcess.kill();
    }
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-db-path", (event) => {
  return path.join(app.getPath("userData"), "school_system.db");
});