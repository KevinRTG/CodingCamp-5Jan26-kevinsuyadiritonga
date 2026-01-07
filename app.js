const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const filterBtn = document.getElementById("filterBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const taskTable = document.getElementById("taskTable");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterStatus = "all"; // all | active | completed

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
    taskTable.innerHTML = `<tr><td colspan="4" class="bg-gray-900 text-center text-lg text-purple-200 py-4">No task found</td></tr>`;
    return;
  }

  filtered.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="bg-gray-900 text-purple-200 px-4 py-2">${task.text}</td>
      <td class="bg-gray-900 text-purple-200 px-4 py-2">${task.date || "-"}</td>
      <td class="bg-gray-900 text-purple-200 px-4 py-2">${task.completed ? "✅ Completed" : "⏳ Active"}</td>
      <td class="bg-gray-900 px-4 py-2 space-x-2">
        <button class="text-gray-200 hover:underline" onclick="toggleStatus(${index})">Toggle</button>
        <button class="text-red-600 hover:underline" onclick="deleteTask(${index})">Delete</button>
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
