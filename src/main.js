const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const { spawn } = require('node:child_process');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1420,
    height: 900,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#090a0e',
    title: 'RedOS Launcher',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('redos:launch', async (_event, item) => {
  if (!item || typeof item.target !== 'string') throw new Error('Target i pavlefshëm.');
  const target = item.target.trim();
  if (!target) throw new Error('Vendos një program ose adresë.');
  if (target === '%DOWNLOADS%') {
    const result = await shell.openPath(app.getPath('downloads'));
    if (result) throw new Error(result);
    return true;
  }
  if (/^https?:\/\//i.test(target)) {
    await shell.openExternal(target);
    return true;
  }
  if (/^(ms-settings:|mailto:|tel:)/i.test(target)) {
    await shell.openExternal(target);
    return true;
  }
  if (target === 'explorer.exe' || target === 'notepad.exe' || target === 'calc.exe' ||
      target === 'mspaint.exe' || target === 'wt.exe' || target === 'cmd.exe') {
    const child = spawn(target, [], { detached: true, stdio: 'ignore', windowsHide: false });
    child.unref();
    return true;
  }
  if (path.isAbsolute(target) && /\.(exe|lnk|bat|cmd)$/i.test(target)) {
    const child = spawn(target, [], { detached: true, stdio: 'ignore', windowsHide: false });
    child.unref();
    return true;
  }
  if (path.isAbsolute(target)) {
    const result = await shell.openPath(target);
    if (result) throw new Error(result);
    return true;
  }
  throw new Error('Përdor një URL, komandë të mbështetur ose shtegun e plotë të programit (.exe).');
});

ipcMain.handle('redos:pick-exe', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Zgjidh aplikacionin Windows',
    properties: ['openFile'],
    filters: [{ name: 'Aplikacione Windows', extensions: ['exe', 'lnk'] }]
  });
  if (result.canceled || !result.filePaths[0]) return null;
  return result.filePaths[0];
});

ipcMain.handle('redos:open-explorer', async (_event, target) => {
  const safe = typeof target === 'string' && path.isAbsolute(target) ? target : app.getPath('home');
  const child = spawn('explorer.exe', [safe], { detached: true, stdio: 'ignore' });
  child.unref();
  return true;
});
