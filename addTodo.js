const { ipcRenderer } = require("electron");

console.log("Add Todo");

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ipcRenderer.send("todo:add", e.target[0].value);
});
