const todoList = document.getElementById("todolist-container");
const input = document.getElementById("textarea");
const btnAdd = document.querySelector("button[type='submit']");
const btnClear = document.querySelector("button[type='reset']");
const itemList = document.querySelector(".list-item");

// Lấy tasks từ localStorage
let savedTask = JSON.parse(localStorage.getItem("note") || "[]");

// Hàm render lại toàn bộ danh sách
const renderTasks = () => {
  itemList.innerHTML = "";

  savedTask.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "item";
    li.setAttribute("data-index", index);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
      span.style.fontStyle = "italic";
    }

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✏️";
    editBtn.disabled = task.done;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "x";

    // Checkbox event
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      localStorage.setItem("note", JSON.stringify(savedTask));
      renderTasks();
    });

    // Edit event
    editBtn.addEventListener("click", () => {
      span.contentEditable = true;
      span.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(span);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    });

    span.addEventListener("blur", () => {
      span.contentEditable = false;
      const newText = span.textContent.trim();
      if (newText === "") {
        savedTask.splice(index, 1);
      } else {
        savedTask[index].text = newText;
      }
      localStorage.setItem("note", JSON.stringify(savedTask));
      renderTasks();
    });

    // Delete event
    deleteBtn.addEventListener("click", () => {
      savedTask.splice(index, 1);
      localStorage.setItem("note", JSON.stringify(savedTask));
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
  });
};

// Thêm task mới
btnAdd.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  savedTask.push({ text, done: false });
  localStorage.setItem("note", JSON.stringify(savedTask));
  input.value = "";
  renderTasks();
});

// Clear all
btnClear.addEventListener("click", () => {
  savedTask = [];
  localStorage.removeItem("note");
  renderTasks();
});

// Render lần đầu khi load
window.onload = () => {
  renderTasks();
};

// Mission:
// vao web van luu task da tao | ok
// loc task da hoan thanh
//button tick all va bo tick all
// button dropdown cac task da hoan thanh click vao hien cac task hoan thanh
// neu hoan thanh se day xuong cuoi
// dark mode
