console.log("From the script.js file");
const { ipcRenderer } = require("electron");

const ol = document.querySelector("ol");

ipcRenderer.on("todo:add", (e, todo) => {
  const li = document.createElement("li");
  const todoText = document.createTextNode(todo);
  li.appendChild(todoText);
  ol.appendChild(li);
});

ipcRenderer.on("todo:clear", (e) => {
  ol.innerHTML = "";
});

ol.addEventListener("dblclick", (e) => {
  e.target.remove();
});

// addTodoButton.addEventListener("click", () => {
//   console.log("Add Todo");
// });
