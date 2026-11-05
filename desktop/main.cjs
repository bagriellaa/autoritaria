const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
let window;
const savePath = () => path.join(app.getPath('userData'), 'campaign-v1.json');
ipcMain.handle('save:read', async () => { try { return JSON.parse(await fs.readFile(savePath(), 'utf8')); } catch { return null; } });
let pending = Promise.resolve();
ipcMain.handle('save:write', (_, data) => {
  const json = JSON.stringify(data);
  if (json.length > 4_000_000) throw new Error('Save demasiado grande');
  pending = pending.catch(() => {}).then(async () => {
    const target = savePath();
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target + '.tmp', json, 'utf8');
    await fs.rename(target + '.tmp', target);
  });
  return pending;
});
ipcMain.handle('window:fullscreen', () => window.setFullScreen(!window.isFullScreen()));
app.whenReady().then(() => {
  window = new BrowserWindow({ width: 1440, height: 900, minWidth: 800, minHeight: 600, backgroundColor: '#151c19', title: 'Autoritária', autoHideMenuBar: true, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', (event, url) => { if (!url.startsWith('file:') && !url.startsWith('http://127.0.0.1:5173')) event.preventDefault(); });
  if (process.argv.includes('--dev')) window.loadURL('http://127.0.0.1:5173');
  else window.loadFile(path.join(__dirname, '../dist/index.html'));
});
app.on('window-all-closed', () => app.quit());
