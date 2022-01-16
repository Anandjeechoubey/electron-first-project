const { app, BrowserWindow, Menu } = require("electron");

const path = require("path");

const createAddTodoWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("addTodo.html");

  win.on("close", () => {
    if (process.platform !== "darwin") app.quit();
  });
};

module.exports = { createAddTodoWindow };
