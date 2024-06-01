import { app, BrowserWindow } from "electron";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { exec, execSync } from "child_process";

const isDev = process.env.NODE_ENV === 'development';
const __dirname = path.resolve();

console.log(`isDev: ${isDev}`);

let backendProcess;

function startBackend() {

    if (!backendProcess) {  //condicional para iniciar backend apenas uma vez

    const backendDir = path.join(__dirname, "/resources/api");
    const backendCommand = "npm start";
    
    backendProcess = exec(backendCommand, { cwd: backendDir, shell: true }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting backend: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`Backend stderr: ${stderr}`);
            return;
        }
        console.log(`Backend stdout: ${stdout}`);
    });
    } else {
        console.log("Backend already running.");
    }
};

function createWindow() {
    console.log("criando janela")
    const win = new BrowserWindow({
        width: 1440,
        height: 900,
        resizable: true,
        webPreferences: {
            //preload: path.join(__dirname, "preloader.js"),
            contextIsolation: true,
            nodeIntegration: true
        }
    });
    console.log(`Modo de desenvolvimento: ${isDev}`);
    win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "/resources/build/index.html")}`);

    startBackend(); // Iniciar o backend 
}

app.whenReady().then(() => {
    createWindow();
    console.log('Hello from Electron');
    console.log("Caminho atual do dirname:", __dirname);
    console.log(`Este e o caminho com path:   file://${path.join(__dirname, "/resources/build/index.html")}`);
    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", async () => {
    if(process.platform !== "darwin")
    app.quit();
});