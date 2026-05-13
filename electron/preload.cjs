const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  launchGame: () => ipcRenderer.invoke('launch-game'),
  checkFiles: () => ipcRenderer.invoke('check-files'),
});
