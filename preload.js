const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getDbPath: () => ipcRenderer.invoke("get-db-path"),
});