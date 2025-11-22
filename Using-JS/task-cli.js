#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "taskStorage.json");

// Helpers
function loadTasks() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    const data = fs.readFileSync(filePath, "utf-8").trim();

    if (!data) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading taskStorage.json. Resetting file...");
    fs.writeFileSync(filePath, "[]");
    return [];
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error("❌ Failed to save tasks:", err.message);
  }
}

function getTaskById(tasks, id) {
  if (isNaN(id)) {
    console.log("❌ Task ID must be a number.");
    return null;
  }

  const task = tasks.find((t) => t.id == id);
  if (!task) {
    console.log(`❌ No task found with ID ${id}.`);
    return null;
  }

  return task;
}

// CLI Argument Parsing
const args = process.argv.slice(2);
const command = args[0];

// CLI Commands
switch (command) {
  // ADD TASK
  case "add": {
    const taskWords = args.slice(1);
    if (taskWords.length === 0) return console.log("❌ Please provide a task.");

    const taskText = taskWords.join(" ");
    const tasks = loadTasks();

    const newTask = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      description: taskText,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    saveTasks(tasks);

    console.log(`✅ Task added (#${newTask.id}): "${taskText}"`);
    break;
  }

  // LIST ALL TASKS
  case "list": {
    const tasks = loadTasks();

    if (!tasks.length) {
      console.log("📭 No tasks found.");
      break;
    }

    console.log("\n📌 All Tasks:\n");
    tasks.forEach((t) => {
      const icon =
        t.status === "done" ? "✔️" : t.status === "inprogress" ? "🚧" : "⏳";
      console.log(`#${t.id} - ${t.description} [${icon} ${t.status}]`);
    });
    console.log();
    break;
  }

  // UPDATE TASK TEXT
  case "update": {
    const id = args[1];
    const newText = args.slice(2).join(" ");

    if (!id || !newText) {
      console.log("❌ Usage: update <id> <new task description>");
      break;
    }

    const tasks = loadTasks();
    const task = getTaskById(tasks, id);
    if (!task) break;

    const old = task.description;
    task.description = newText;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);
    console.log(`✏️ Task #${id} updated:\n   "${old}" → "${newText}"`);
    break;
  }

  // DELETE TASK
  case "delete": {
    const id = args[1];
    if (!id) return console.log("❌ Please provide task ID.");

    let tasks = loadTasks();
    const originalLength = tasks.length;

    tasks = tasks.filter((t) => t.id != id);
    saveTasks(tasks);

    if (tasks.length === originalLength) {
      console.log(`❌ Task with ID ${id} not found.`);
    } else {
      console.log(`🗑️ Task #${id} deleted.`);
    }
    break;
  }

  // UPDATE TASK STATUS
  case "status": {
    const id = args[1];
    let newStatus = args[2];

    if (!id || !newStatus) {
      console.log("❌ Usage: status <id> <done|pending|inprogress>");
      break;
    }

    newStatus = newStatus.toLowerCase();
    const allowed = ["done", "pending", "inprogress"];
    if (!allowed.includes(newStatus)) {
      console.log("❌ Invalid status. Allowed: done | pending | inprogress");
      break;
    }

    const tasks = loadTasks();
    const task = getTaskById(tasks, id);
    if (!task) break;

    task.status = newStatus;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);
    console.log(`🔄 Status updated for task #${id} → ${newStatus}`);
    break;
  }

  // LIST DONE TASKS
  case "done": {
    const tasks = loadTasks();
    const completed = tasks.filter((t) => t.status === "done");

    if (!completed.length) {
      console.log("📭 You haven't completed any tasks.");
      break;
    }

    console.log("\n✅ Completed Tasks:\n");
    completed.forEach((t) => console.log(`#${t.id} - ${t.description}`));
    break;
  }

  // LIST PENDING TASKS
  case "notdone": {
    const tasks = loadTasks();
    const pending = tasks.filter((t) => t.status === "pending");

    if (!pending.length) {
      console.log("🎉 You have no pending tasks!");
      break;
    }

    console.log("\n⏳ Pending Tasks:\n");
    pending.forEach((t) => console.log(`#${t.id} - ${t.description}`));
    break;
  }

  // LIST IN-PROGRESS TASKS
  case "in-progress": {
    const tasks = loadTasks();
    const inProgress = tasks.filter((t) => t.status === "inprogress");

    if (!inProgress.length) {
      console.log("📭 No in-progress tasks found.");
      break;
    }

    console.log("\n🚧 In-Progress Tasks:\n");
    inProgress.forEach((t) => console.log(`#${t.id} - ${t.description}`));
    break;
  }

  // DEFAULT HELP / UNKNOWN COMMAND
  default: {
    console.log(`
❓ Unknown or missing command: "${command || ""}"

Available commands:
  add <task...>        Add a new task
  list                 List all tasks
  update <id> <text>   Update task description
  delete <id>          Delete a task by ID
  status <id> <status> Update status (done | pending | inprogress)
  done                 List completed tasks
  notdone              List pending tasks
  in-progress          List in-progress tasks

Example:
  node task-cli.js add "Learn Node.js"
  node task-cli.js status 1 done
`);
  }
}
