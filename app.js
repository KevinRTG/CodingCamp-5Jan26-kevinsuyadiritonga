// Ambil elemen
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

// Load data dari localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Render list
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // all
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "mr-2 h-4 w-4 text-blue-500";
    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
    });

    // Label
    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = task.completed ? "line-through text-gray-400 flex-1" : "flex-1";

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "ml-2 text-red-500 hover:text-red-700";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  taskCount.textContent = tasks.length;
}

// Event listener untuk filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    renderTasks();
  });
});

// Simpan ke localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Tambah task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
  }
});

// Enter key untuk tambah
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskBtn.click();
});

// Init
renderTasks();
