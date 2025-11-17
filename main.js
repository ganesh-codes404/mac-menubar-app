const { app, ipcMain } = require("electron");
app.commandLine.appendSwitch("disable-gpu");
app.disableHardwareAcceleration();

const { menubar } = require("menubar");
const path = require("path");

let tasks = [];
let completedtask=[];

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

// Progress logic for today only
function progress() {
  const todayTasks = tasks.filter(t => isToday(t.createdAt));
  const total = todayTasks.length;
  if (total === 0) return 0;

  const undone = todayTasks.filter(t => !t.done).length;
  const percent = Math.round((undone / total) * 100);
  return percent;
}

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
    }
  },
  icon: path.join(__dirname, "iconTemplate.png"),
});

// Send tasks to UI
function refreshUI() {
  mb.window.webContents.send("load-tasks", tasks);
  mb.tray.setTitle(`${progress()}%`);
}

function scheduleRemoval(index) {
  setTimeout(() => {
    if (tasks[index] && tasks[index].done) {
        let x = tasks.splice(index, 1)[0];
      completedtask.push(x);
      refreshUI();
    }
  }, 20 * 60 * 1000); // 20 minutes
}

// -----------------------------------------
// MENUBAR READY
// -----------------------------------------
mb.on("ready", () => {
  console.log("App ready!");

  mb.window.webContents.on("did-finish-load", () => {
    refreshUI();
  });
});

// -----------------------------------------
// IPC HANDLERS
// -----------------------------------------
ipcMain.on("add-task", (event, title) => {
  tasks.push({
    title,
    done: false,
    createdAt: Date.now()
  });

  refreshUI();
});

ipcMain.on("toggle-task", (event, index) => {
  if (!tasks[index]) return;

  tasks[index].done = true;
  tasks[index].doneAt = Date.now();

  scheduleRemoval(index);  // delete after 20 minutes
  refreshUI();
});

ipcMain.on("delete-task", (event, index) => {
  tasks.splice(index, 1);
  refreshUI();
});