const { ipcRenderer } = require("electron");

const tasksDiv = document.getElementById("tasks");

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (text.length === 0) return;

  ipcRenderer.send("add-task", text);
  input.value = "";

  setTimeout(() => input.focus(), 50);
}

ipcRenderer.on("load-tasks", (event, tasks) => {
  tasksDiv.innerHTML = "";

  tasks.forEach((task, index) => {
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.onclick = () => ipcRenderer.send("delete-task", index);
    const div = document.createElement("div");
    div.className = "task";

    const title = document.createElement("div");
    title.className = "task-title" + (task.done ? " done" : "");
    title.textContent = task.title;

    div.onclick = () => {
      if (!task.done) {
        title.classList.add("done");
      }
      ipcRenderer.send("toggle-task", index);
    };


    div.appendChild(del);
    div.appendChild(title);

    tasksDiv.appendChild(div);

    div.style.opacity = 0;
    div.style.transform = "translateY(5px)";
    setTimeout(() => {
      div.style.opacity = 1;
      div.style.transform = "translateY(0)";
    }, 50);
  });
});
