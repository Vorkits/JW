const electron = require('electron')

// Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
const { ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function sendStatusToWindow(text) {
    log.info(text);
    mainWindow.webContents.send('message', text);
}
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
            width: 1215,
            height: 655,
            minWidth: 1210,
            frame: false,
            transparent: true,
            webPreferences: {
                nodeIntegration: true
            }
        })
        //dsa

    // and load the index.html of the app.
    app.allowRendererProcessReuse = true
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({ mode: 'undocked' })
    //mainWindow.setMenu(null);
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}
a = {
    text: 'nones'
}
autoUpdater.on('checking-for-update', () => {
    log.info('check')
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
    a.text = 'found'
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
    a.text = 'not found'
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
    a.text = err
})
autoUpdater.on('download-progress', (progressObj) => {

    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    a.text = log_message;
})
autoUpdater.on('update-downloaded', (info) => {
    a.text = 'sucess'
    autoUpdater.quitAndInstall()

});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', function() {

    createWindow()
    autoUpdater.checkForUpdatesAndNotify();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})







// Event handler for asynchronous incoming messages

// Event handler for synchronous incoming messages
ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) // prints "ping"
    event.returnValue = a.text
})
app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.

    if (mainWindow === null) {
        createWindow()

    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.