const { app, BrowserWindow, ipcMain } = require('electron');

var Gpio = require('onoff').Gpio;
const output_gpio24 = new Gpio(24, 'out');
let input_gpio11 = new Gpio(11, 'in', 'both');


//input gpio
ipcMain.on('input-tomain', () => {
    input_gpio11.watch(function (err, value) {
        if (err) {
            console.log('There was an error' + err);
            throw err;
        }
        console.log('input : ' + value);
        mainWindow.webContents.send('input-torenderer', value)
    });
});

process.on('SIGINT', function () {
    console.log('Finished process');
    input_gpio11.unexport();
});



// output gpio
ipcMain.handle('output_gpio', (event, arg) => {
    console.log("output_gpio", arg);
    if (arg === 'ON') {
        output_gpio24.write(1);
        return 'output_gpio ON'
    }
    output_gpio24.write(0)
    return 'output_gpio OFF'
});



let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    mainWindow.loadFile('index.html')
    //開発者ツールを表示
    mainWindow.webContents.openDevTools()
}


// 初期化時にwindowを作成
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
});


app.on('activate', () => {
    //全画面表示
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})