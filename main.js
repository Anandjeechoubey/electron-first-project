const { app, BrowserWindow, Menu, ipcMain } = require("electron");

const path = require("path");

process.env.NODE_ENV = "development";

let win;
let addWin;

const dockMenu = Menu.buildFromTemplate([
  {
    label: "New Window",
    click() {
      console.log("New Window");
    },
  },
  {
    label: "New Window with Settings",
    submenu: [{ label: "Basic" }, { label: "Pro" }],
  },
  { label: "New Command..." },
]);

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Todo",
        accelerator: "CmdOrCtrl+A",
        click: () => {
          console.log("Add Todo");
          createAddTodoWindow();
        },
      },
      {
        label: "Clear Todos",
        accelerator: "CmdOrCtrl+D",
        click: () => {
          win.webContents.send("todo:clear");
          //   removeAllTodos();
        },
      },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Add Todo",
        accelerator: "CmdOrCtrl+A",
        click: () => {
          console.log("Add Todo");
          createAddTodoWindow();
        },
      },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+H",
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Window",
    submenu: [
      {
        label: "Add Todo",
        accelerator: "CmdOrCtrl+A",
        click: () => {
          console.log("Add Todo");
          createAddTodoWindow();
        },
      },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+H",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+H",
        click() {
          app.quit();
        },
      },
    ],
  });
}

if (process.env.NODE_ENV === "development") {
  menuTemplate.push({
    label: "DevTools",
    submenu: [
      {
        label: "Toogle DevTools",
        accelerator: "CmdOrCtrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+H",
        click() {
          app.quit();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

ipcMain.on("todo:add", (event, todo) => {
  win.webContents.send("todo:add", todo);
  addWin.close();
});

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

const createAddTodoWindow = () => {
  addWin = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  addWin.loadFile("addTodo.html");

  addWin.on("close", () => {
    if (process.platform !== "darwin") app.quit();
  });
};

app
  .whenReady()
  .then(() => {
    if (process.platform === "darwin") {
      app.dock.setMenu(dockMenu);
    }
  })
  .then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const Todos = ["Buy Milk", "Buy Eggs", "Buy Bread", "Buy Cheese"];
