// main.js
const { app, Tray, Menu, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fetch = require('node-fetch');
const keytar = require('keytar');

let tray = null;
let mainWindow = null;


ipcMain.on('quit-app', () => {
  app.quit();
});



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: true, 
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

}
app.whenReady().then(() => {
  createTray();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // Tray icon part
  function createTray() {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Status',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
          } else {
            createWindow();
          }
        },
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);
    tray.setToolTip('GitHub Runner Status');
    tray.setContextMenu(contextMenu);
  
    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      } else {
        createWindow();
      }
    });
  }
  

    // IPC handlers
    ipcMain.handle('get-token', async () => {
    const token = await keytar.getPassword('GitHub Runner Status', 'github_token');
    return token;
    });

    ipcMain.handle('set-token', async (event, token) => {
    await keytar.setPassword('GitHub Runner Status', 'github_token', token);
    });
    app.on('will-quit', () => {
        globalShortcut.unregisterAll();
    });

  app.on('before-quit', () => {
    // Perform any cleanup if necessary
  })
