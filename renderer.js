const { ipcRenderer } = require("electron");

const tasksDiv = document.getElementById("tasks");

function addTask() {
  const input = document.getElementById("task-input");
  const text = input.value.trim();
  if (!text) return;

  ipcRenderer.send("add-task", text);
  input.value = "";
  setTimeout(() => input.focus(), 50);
}

ipcRenderer.on("load-tasks", (event, tasks) => {
  tasksDiv.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";

    // ICON (radio button)
    const icon = document.createElement("ion-icon");
    icon.name = task.done ? "radio-button-on" : "radio-button-off";
    icon.style.fontSize = "20px";
    icon.style.cursor = "pointer";
    icon.style.color = "var(--primary)";
    icon.onclick = (e) => {
      e.stopPropagation();
      ipcRenderer.send("toggle-task", index);
    };

    // TITLE
    const title = document.createElement("div");
    title.className = "task-title" + (task.done ? " done" : "");
    title.textContent = task.title;

    // DELETE BUTTON
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.onclick = (e) => {
      e.stopPropagation();
      ipcRenderer.send("delete-task", index);
    };

    div.appendChild(icon);
    div.appendChild(title);
    div.appendChild(del);
    tasksDiv.appendChild(div);

    // animation
    div.style.opacity = 0;
    div.style.transform = "translateY(5px)";
    setTimeout(() => {
      div.style.opacity = 1;
      div.style.transform = "translateY(0)";
    }, 40);
  });
});
document.getElementById("historyBtn").onclick = () => {
  ipcRenderer.send("request-history");
};

ipcRenderer.on("show-history", (event, list) => {
  const popup = document.getElementById("historyPopup");

  if (popup.style.display === "block") {
    popup.style.display = "none";
    return;
  }

  popup.innerHTML = list.length === 0 
    ? "<i>No completed tasks</i>"
    : list.map(t =>
        `<div style='margin-bottom:8px'>
          ${t.title} <br>
          <span style='opacity:0.6'>${new Date(t.completedAt).toLocaleString()}</span>
         </div>`
      ).join("");

  popup.style.display = "block";
});
// Close history popup when clicking anywhere else
document.addEventListener("mousedown", (e) => {
  const popup = document.getElementById("historyPopup");
  const historyBtn = document.getElementById("historyBtn");

  // If popup is not open → ignore
  if (popup.style.display !== "block") return;

  // If clicking inside popup → do nothing
  if (popup.contains(e.target)) return;

  // If clicking the button → do nothing
  if (historyBtn.contains(e.target)) return;

  // Otherwise hide popup
  popup.style.display = "none";
});

