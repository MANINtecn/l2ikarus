import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false, // Custom frame for that "launcher" look
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#050508',
  });

  // In development, use the Vite dev server
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// --- IPC Handlers ---

// Window controls
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-close', () => app.quit());

// Launch Game
ipcMain.handle('launch-game', async () => {
  console.log('Launching game...');
  
  // Caminho relativo ao executável do launcher
  // Se o launcher estiver em "Cliente Samurai/zGamingSamurai/Samurai Launcher.exe"
  // O L2.exe está em "Emerald/system/L2.exe"
  const baseDir = app.isPackaged 
    ? (process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath)) 
    : app.getAppPath();
  const clientPath = path.join(baseDir, 'Emerald', 'system', 'L2.exe');
  
  console.log('Target client path:', clientPath);

  if (await fs.pathExists(clientPath)) {
    const child = exec(`"${clientPath}"`, { cwd: path.dirname(clientPath) });
    child.unref();
    return { success: true };
  } else {
    return { success: false, error: 'L2.exe não encontrado em: ' + clientPath };
  }
});

// File system check (placeholder for update logic)
ipcMain.handle('check-files', async () => {
  // Logic to compare local files with manifest
  return { status: 'ready' };
});
