const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('redos', {
  launch: (item) => ipcRenderer.invoke('redos:launch', item),
  pickExe: () => ipcRenderer.invoke('redos:pick-exe'),
  openExplorer: (target) => ipcRenderer.invoke('redos:open-explorer', target)
});
