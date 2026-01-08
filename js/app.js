const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const filterBtn = document.getElementById("filterBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const taskTable = document.getElementById("taskTable");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filterStatus = "all";
let editIndex = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskTable.innerHTML = "";

  // Build list with original index for safe actions
  const filtered = tasks
    .map((task, i) => ({ task, i }))
    .filter(({ task }) => {
      if (filterStatus === "active") return !task.completed;
      if (filterStatus === "completed") return task.completed;
      return true;
    });

  if (filtered.length === 0) {
    taskTable.innerHTML = `<tr><td colspan="4" class="empty">No task found</td></tr>`;
    return;
  }

  filtered.forEach(({ task, i }) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.text}</td>
      <td>${task.date || "-"}</td>
      <td>${task.completed ? "️✅ Completed" : "🟦 Active"}</td>
      <td>
        <button class="task-action-btn" onclick="toggleStatus(${i})">Toggle</button>
        <button class="task-action-btn" onclick="editTask(${i})">Edit</button>
        <button class="task-action-btn" onclick="deleteTask(${i})">Delete</button>
      </td>
    `;

    taskTable.appendChild(row);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const date = dateInput.value.trim();

  if (!text || !date) {
    showToast("Please fill in all fields!");
    return;
  }

  if (editIndex !== null) {
    tasks[editIndex].text = text;
    tasks[editIndex].date = date;
    showToast("Task updated successfully!");
    editIndex = null;
    addBtn.textContent = "+ ADD";
  } else {
    tasks.push({ text, date, completed: false });
    showToast("Task added successfully!");
  }

  taskInput.value = "";
  dateInput.value = "";
  saveTasks();
}

function toggleStatus(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showToast(tasks[index].completed ? "Marked as completed" : "Marked as active");
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  showToast("Task deleted");
}

function deleteAll() {
  if (confirm("Hapus semua tugas?")) {
    tasks = [];
    saveTasks();
    showToast("All tasks deleted");
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

function editTask(index) {
  const task = tasks[index];
  taskInput.value = task.text;
  dateInput.value = task.date;
  editIndex = index;
  addBtn.textContent = "Update Task";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
