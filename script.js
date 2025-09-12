// ============================
// LẤY PHẦN TỬ TRÊN DOM
// ============================
const todoList = document.querySelector(".todolist-ui"); // Container chính của todo list
const input = document.getElementById("textarea"); // Ô nhập nội dung task
const btnAdd = document.querySelector("button[type='submit']"); // Nút thêm task
const btnClear = document.querySelector("button[type='reset']"); // Nút xóa toàn bộ task
const itemList = document.querySelector(".list-item"); // UL/OL chứa danh sách task

// ============================
// LẤY DỮ LIỆU TỪ LOCALSTORAGE
// ============================
// Nếu có "note" trong localStorage thì parse ra object
// Nếu không có thì mặc định là []
let savedTask = JSON.parse(localStorage.getItem("note") || "[]");

// ============================
// HÀM RENDER LẠI DANH SÁCH
// ============================
const renderTasks = () => {
  itemList.innerHTML = ""; // Xóa danh sách cũ trước khi vẽ lại

  // Lặp qua toàn bộ tasks trong mảng
  savedTask.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "item";
    li.setAttribute("data-index", index); // Ghi nhớ vị trí trong mảng

    // ----- Checkbox (đánh dấu hoàn thành) -----
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done; // Nếu task.done = true thì đánh dấu

    // ----- Nội dung công việc -----
    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) {
      // Nếu đã hoàn thành → chỉnh style cho khác
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.5";
      span.style.fontStyle = "italic";
    }

    // ----- Nút Edit -----
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✏️";
    editBtn.disabled = task.done; // Nếu task đã done thì không cho sửa

    // ----- Nút Delete -----
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "❌";

    // ============================
    // SỰ KIỆN CHO CHECKBOX
    // ============================
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked; // Cập nhật trạng thái
      localStorage.setItem("note", JSON.stringify(savedTask)); // Lưu vào localStorage
      renderTasks(); // Vẽ lại UI
    });

    // ============================
    // SỰ KIỆN CHO EDIT
    // ============================
    editBtn.addEventListener("click", () => {
      span.contentEditable = true; // Cho phép sửa trực tiếp
      span.focus(); // Focus để con trỏ nháy

      // Đưa con trỏ về cuối text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(span);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    });

    // Khi bỏ focus khỏi span → lưu lại nội dung mới
    span.addEventListener("blur", () => {
      span.contentEditable = false; // Tắt chế độ edit
      const newText = span.textContent.trim();

      if (newText === "") {
        // Nếu để trống → xóa task
        savedTask.splice(index, 1);
      } else {
        // Ngược lại cập nhật lại text
        savedTask[index].text = newText;
      }

      localStorage.setItem("note", JSON.stringify(savedTask)); // Lưu vào localStorage
      renderTasks(); // Vẽ lại
    });

    // ============================
    // SỰ KIỆN CHO DELETE
    // ============================
    deleteBtn.addEventListener("click", () => {
      savedTask.splice(index, 1); // Xóa 1 phần tử khỏi mảng
      localStorage.setItem("note", JSON.stringify(savedTask));
      renderTasks();
    });

    // ============================
    // THÊM CÁC PHẦN TỬ VÀO LI
    // ============================
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    // Thêm li vào danh sách
    itemList.appendChild(li);
  });
};

// ============================
// THÊM TASK MỚI
// ============================
btnAdd.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return; // Nếu để trống thì không thêm

  // Push task mới vào mảng
  savedTask.push({ text, done: false });

  // Lưu lại vào localStorage
  localStorage.setItem("note", JSON.stringify(savedTask));

  // Xóa input sau khi thêm
  input.value = "";

  // Render lại danh sách
  renderTasks();
});

// CLEAR TOÀN BỘ DANH SÁCH
// ============================
btnClear.addEventListener("click", () => {
  const confirmDelete = confirm("Do you want clear all task?");
  if (confirmDelete) {
    savedTask = []; // Reset mảng rỗng
    localStorage.removeItem("note"); // Xóa trong localStorage
    renderTasks(); // Vẽ lại (ra trống)
  }
});
// ============================
// RENDER LẦN ĐẦU KHI LOAD WEB
// ============================
// ngon hon window onload
document.addEventListener("DOMContentLoaded", () => {
  renderTask();
});

// ===========================================================
// toggle menu
const btnNav = document.querySelector(".btn-nav");
btnNav.addEventListener("click", () => {
  const navBaba = btnNav.closest(".filter-btn");
  const Submenu = navBaba.querySelector(".filter-submenu");
  Submenu.classList.toggle("active");
  const span = btnNav.querySelector("span");
  span.classList.toggle("rotate");
});
// darkMode
const darkMode_btn = document.querySelector(".darkMode-btn");
const bodyDark = document.body;

darkMode_btn.addEventListener("click", () => {
  bodyDark.classList.toggle("darkMode-active");
  todoList.classList.toggle("darkMode-active");
});

// Completed
const completed_btn = document.querySelector(".completed-btn");
completed_btn.addEventListener("click", () => {
  const items = document.querySelectorAll(".item");
  let hasCompleted = false;

  items.forEach((li) => {
    const checkbox = li.querySelector("input[type='checkbox']");
    if (!checkbox.checked) {
      li.classList.add("hide");
    } else {
      li.classList.remove("hide");
      hasCompleted = true; // có ít nhất 1 task done
    }
  });

  // Nếu không có task nào hoàn thành → hiện thông báo
  let emptyMsg = document.querySelector(".empty-completed");
  if (!hasCompleted) {
    if (!emptyMsg) {
      emptyMsg = document.createElement("li");
      emptyMsg.className = "empty-completed";
      emptyMsg.textContent = "Task Completed Is Empty!";
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.fontSize = "30px";

      document.querySelector(".list-item").appendChild(emptyMsg);
    }
  } else {
    if (emptyMsg) emptyMsg.remove();
  }
});

// All Task
const all_btn = document.querySelector(".all-btn");
all_btn.addEventListener("click", () => {
  document.querySelectorAll(".item").forEach((li) => {
    li.classList.remove("hide");
  });
  let emptyMsg = document.querySelector(".empty-completed");
  if (emptyMsg) emptyMsg.remove();
});
// hom nay toi day thoi
const btnMusic = document.querySelector(".PlayMusic");
const audio = document.querySelector("audio");
const inner = btnMusic.querySelector(".PlayMusic__inner");

btnMusic.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    btnMusic.classList.add("MusicActive");
    inner.style.animationPlayState = "running"; // chạy tiếp
  } else {
    audio.pause();
    inner.style.animationPlayState = "paused"; // dừng xoay
  }
});

/* // Mission:
// vao web van luu task da tao | done

// dark mode | done

// loc task da hoan thanh | done

//button tick all va bo tick all | pending 

// button dropdown cac task da hoan thanh click vao hien cac task hoan thanh | pending

// neu hoan thanh se day xuong cuoi | pending

//  tick all va bo tick all | pending */

// dang cap nhat : login vao roi moi user co 1 data rieng khi login van con luu data cua user da login  va tao cac note truoc do ( cai nay kho ghe)
