const { app, BrowserWindow, ipcMain } = require('electron');
const util = require('util');
const fs = require('fs');

const path = require('path');

let mainWindow;

app.on('ready', () => {
    console.log('app ready');

    const htmlPath = path.join('src', 'index.html');

    // create browser window
    mainWindow = new BrowserWindow();

    // load html
    mainWindow.loadFile(htmlPath);
});

const stat = util.promisify(fs.stat);

ipcMain.on('files', async(event, filesArr) => {
    try {
        const data = await Promise.all(
            filesArr.map(async ({name, pathName}) => ({
                ...await stat(pathName),
                name,
                pathName
            }))
        );
        mainWindow.webContents.send('metadata', data)
    } catch (error) {
        mainWindow.webContents.send('metadata:error', error)
    }
});