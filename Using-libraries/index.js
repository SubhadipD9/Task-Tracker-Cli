#!/usr/bin/env node

const { Command } = require("commander");
const program = new Command();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "taskStorage.json");

// -------------------------------------------------
// Helpers
// -------------------------------------------------
function loadTasks() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    const data = fs.readFileSync(filePath, "utf-8").trim();

    if (data === "") {
      fs.writeFileSync(filePath, "[]");
      return [];
    }

    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error reading taskStorage.json. It may be corrupted.");
    console.error("   Resetting file...");
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

// -------------------------------------------------
// CLI Setup
// -------------------------------------------------
program
  .name("Cli tracker app")
  .version("1.0.0")
  .description("Task tracker app using JS by https://github.com/SubhadipD9");

// -------------------------------------------------
// ADD TASK
// -------------------------------------------------
program
  .command("add <task...>")
  .description("Add a new task")
  .action((taskWords) => {
    const task = taskWords.join(" ");

    const tasks = loadTasks();
    const newTask = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      description: task,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`✅ Task added: "${task}", id: ${newTask.id}`);
  });

// -------------------------------------------------
// UPDATE TASK DESCRIPTION
// -------------------------------------------------
program
  .command("update <taskId> <updatedtask...>")
  .description("Edit any task by ID")
  .action((taskId, updatedWords) => {
    const newTask = updatedWords.join(" ");

    const tasks = loadTasks();
    const task = tasks.find((t) => t.id == taskId);

    if (!task) {
      console.log(`❌ No task found with ID ${taskId}`);
      return;
    }

    const oldTask = task.description;
    task.description = newTask;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);

    console.log(`✏️ Updated task #${taskId}`);
    console.log(`   "${oldTask}" → "${newTask}"`);
  });

// -------------------------------------------------
// LIST ALL TASKS
// -------------------------------------------------
program
  .command("list")
  .description("List all tasks")
  .action(() => {
    const tasks = loadTasks();

    if (tasks.length === 0) {
      console.log("📭 No tasks found.");
      return;
    }

    console.log("\n📌 Your Tasks:\n");
    tasks.forEach((t) => {
      const icon =
        t.status === "done" ? "✔️" : t.status === "inprogress" ? "🚧" : "⏳";

      console.log(`#${t.id} - ${t.description} [${icon} ${t.status}]`);
    });

    console.log();
  });

// -------------------------------------------------
// LIST COMPLETED TASKS
// -------------------------------------------------
program
  .command("done")
  .description("List all completed tasks")
  .action(() => {
    const tasks = loadTasks();
    const completed = tasks.filter((t) => t.status === "done");

    if (completed.length === 0) {
      console.log("📭 You haven't completed any tasks.");
      return;
    }

    console.log("\n✅ Completed Tasks:\n");
    completed.forEach((t) => {
      console.log(`#${t.id} - ${t.description}`);
    });
  });

// -------------------------------------------------
// LIST PENDING TASKS
// -------------------------------------------------
program
  .command("notdone")
  .description("List all tasks that are not done")
  .action(() => {
    const tasks = loadTasks();
    const pending = tasks.filter((t) => t.status === "pending");

    if (pending.length === 0) {
      console.log("🎉 You have no pending tasks!");
      return;
    }

    console.log("\n⏳ Pending Tasks:\n");
    pending.forEach((t) => {
      console.log(`#${t.id} - ${t.description}`);
    });
  });

// -------------------------------------------------
// LIST IN-PROGRESS TASKS
// -------------------------------------------------
program
  .command("in-progress")
  .description("List all tasks that are in-progress")
  .action(() => {
    const tasks = loadTasks();
    const inProgress = tasks.filter((t) => t.status === "inprogress");

    if (inProgress.length === 0) {
      console.log("📭 No in-progress tasks found.");
      return;
    }

    console.log("\n🚧 In-Progress Tasks:\n");
    inProgress.forEach((t) => {
      console.log(`#${t.id} - ${t.description}`);
    });
  });

// -------------------------------------------------
// UPDATE TASK STATUS
// -------------------------------------------------
program
  .command("status <id> <status>")
  .description("Update task status (done | inprogress | pending)")
  .action((taskId, updatedStatus) => {
    updatedStatus = updatedStatus.toLowerCase();

    const allowed = ["done", "pending", "inprogress"];
    if (!allowed.includes(updatedStatus)) {
      console.log("❌ Invalid status. Allowed: done, pending, inprogress");
      return;
    }

    const tasks = loadTasks();
    const task = tasks.find((t) => t.id == taskId);

    if (!task) {
      console.log(`❌ No task found with ID ${taskId}`);
      return;
    }

    task.status = updatedStatus;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);

    console.log(`🔄 Status updated for task #${taskId} → ${updatedStatus}`);
  });

// -------------------------------------------------
// DELETE TASK
// -------------------------------------------------
program
  .command("delete <id>")
  .description("Delete any task by its ID")
  .action((id) => {
    let tasks = loadTasks();
    const originalLength = tasks.length;

    tasks = tasks.filter((t) => t.id != id);
    saveTasks(tasks);

    if (tasks.length === originalLength) {
      console.log(`❌ Task with ID ${id} not found`);
      return;
    }

    console.log(`🗑️ Task #${id} deleted`);
  });

program.parse(process.argv);
