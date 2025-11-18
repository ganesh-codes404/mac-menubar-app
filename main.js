const { app, ipcMain } = require("electron");
app.commandLine.appendSwitch("disable-gpu");
app.disableHardwareAcceleration();

const { menubar } = require("menubar");
const path = require("path");
const fs = require("fs");

// ---------------------------------------------
// DATA FILE
// ---------------------------------------------
const dataPath = path.join(__dirname, "tasks.json");

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
  } catch {
    return { tasks: [], completed: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

let tasks = [];
let completedTasks = [];

// Load existing data on startup
const loaded = loadData();
tasks = loaded.tasks || [];
completedTasks = loaded.completed || [];

// ---------------------------------------------
// UTILITIES
// ---------------------------------------------
function isToday(ts) {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

// Progress % (how many tasks left for today)
function progress() {
  const todayTasks = tasks.filter((t) => isToday(t.createdAt));
  const total = todayTasks.length;
  if (total === 0) return 0;

  const undone = todayTasks.filter((t) => !t.done).length;
  return Math.round((undone / total) * 100);
}

function updateProgress() {
  mb.tray.setTitle(`${progress()}%`);
}

function refreshUI() {
  if (mb.window) {
    mb.window.webContents.send("load-tasks", tasks);
  }
  updateProgress();
}

// Automatically remove completed tasks after 20 mins
function scheduleRemoval(index) {
  setTimeout(() => {
    if (tasks[index] && tasks[index].done) {
      const removed = tasks.splice(index, 1)[0];

      completedTasks.push({
        title: removed.title,
        completedAt: Date.now(),
      });

      saveData({ tasks, completed: completedTasks });
      refreshUI();
    }
  }, 20 * 60 * 1000);
}

// ---------------------------------------------
// MENUBAR SETUP
// ---------------------------------------------
const mb = menubar({
  showDockIcon: false,
  preloadWindow: true,
  browserWindow: {
    width: 300,
    height: 420,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
  icon: path.join(__dirname, "/icons/1.jpg"),
});

mb.on("ready", () => {
  console.log("App ready!");

  mb.window.webContents.on("did-finish-load", () => {
    refreshUI();
  });
});

// ---------------------------------------------
// IPC HANDLERS
// ---------------------------------------------

// ADD TASK
ipcMain.on("add-task", (event, title) => {
  tasks.push({
    title,
    done: false,
    createdAt: Date.now(),
  });

  saveData({ tasks, completed: completedTasks });
  refreshUI();
});

// TOGGLE TASK DONE/UNDONE
ipcMain.on("toggle-task", (event, index) => {
  tasks[index].done = !tasks[index].done;

  if (tasks[index].done) {
    completedTasks.push({
      title: tasks[index].title,
      completedAt: Date.now(),
    });

    // schedule 20-minute removal
    scheduleRemoval(index);
  }

  saveData({ tasks, completed: completedTasks });
  refreshUI();
});

// DELETE TASK (no history saved)
ipcMain.on("delete-task", (event, index) => {
  tasks.splice(index, 1);

  saveData({ tasks, completed: completedTasks });
  refreshUI();
});

// REQUEST HISTORY POPUP
ipcMain.on("request-history", () => {
  mb.window.webContents.send("show-history", completedTasks);
});

// INITIAL HISTORY LOAD
ipcMain.on("request-history-cache", () => {
  mb.window.webContents.send("load-history", completedTasks);
});
const { exec } = require("child_process");

function getCpuTemp(callback) {
  exec("osx-cpu-temp", (err, stdout) => {
    if (err) return callback(null);
    callback(stdout.trim()); // Example: "52.0°C"
  });
}
setInterval(() => {
  getCpuTemp((temp) => {
    if (temp) mb.window.webContents.send("cpu-temp", temp);
  });
}, 3000);
