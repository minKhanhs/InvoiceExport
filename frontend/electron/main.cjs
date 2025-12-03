/* eslint-env node */
/* eslint-disable */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function getIconPath() {
    if (app.isPackaged) {
        // Production: Icon được electron-builder copy vào resources
        // Thử các đường dẫn có thể có
        const possiblePaths = [
            path.join(process.resourcesPath, 'app', 'public', 'icon.png'),
            path.join(__dirname, '..', 'public', 'icon.png'),
            path.join(__dirname, '..', '..', 'public', 'icon.png')
        ];

        for (const iconPath of possiblePaths) {
            if (fs.existsSync(iconPath)) {
                return iconPath;
            }
        }
        // Fallback: trả về path mặc định
        return path.join(__dirname, '..', 'public', 'icon.png');
    } else {
        // Development: Load từ public folder
        return path.join(__dirname, '..', 'public', 'icon.png');
    }
}

function createWindow() {
    const iconPath = getIconPath();

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        autoHideMenuBar: true,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load URL based on environment
    if (app.isPackaged) {
        // Production: Load from dist folder
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        // Development: Load from Vite dev server
        mainWindow.loadURL('http://localhost:5173');
    }

    // Open DevTools in development
    if (!app.isPackaged) {
        // mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

