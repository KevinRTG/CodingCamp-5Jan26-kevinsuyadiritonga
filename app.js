const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const filterBtn = document.getElementById("filterBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const taskTable = document.getElementById("taskTable");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterStatus = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskTable.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (filterStatus === "active") return !task.completed;
    if (filterStatus === "completed") return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    taskTable.innerHTML = `<tr><td colspan="4" class="empty">No task found</td></tr>`;
    return;
  }

  filtered.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${task.text}</td>
    <td>${task.date || "-"}</td>
    <td>${task.completed ? "✅ Completed" : "⏳ Active"}</td>
    <td>
      <button class="task-action-btn" onclick="toggleStatus(${index})">Toggle</button>
      <button class="task-action-btn" onclick="deleteTask(${index})">Delete</button>
    </td>
  `;

    taskTable.appendChild(row);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const date = dateInput.value;
  if (!text) return;

  tasks.push({ text, date, completed: false });
  taskInput.value = "";
  dateInput.value = "";
  saveTasks();
}

function toggleStatus(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

function deleteAll() {
  if (confirm("Hapus semua tugas?")) {
    tasks = [];
    saveTasks();
  }
}

function toggleFilter() {
  filterStatus = filterStatus === "all" ? "active" : filterStatus === "active" ? "completed" : "all";
  filterBtn.textContent = `FILTER (${filterStatus.toUpperCase()})`;
  renderTasks();
}

addBtn.addEventListener("click", addTask);
deleteAllBtn.addEventListener("click", deleteAll);
filterBtn.addEventListener("click", toggleFilter);

renderTasks();
