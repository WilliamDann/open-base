const { app, BrowserWindow } = require('electron/main')
const ejse                   = require('ejs-electron');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1300,
    height: 850,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#171717',
      symbolColor: '#a3a3a3',
    },
  })

  win.loadFile('public/template/page.ejs');
  ejse.listen();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})