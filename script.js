const todoList = document.getElementById("todolist-container");
const input = document.getElementById("textarea");
const btn_act = document.querySelector("button[type='submit']");
// lay item
const itemList = document.querySelector(".list-item");
btn_act.addEventListener("click", () => {
  const task = document.createElement("li");
  if (input.value.trim() === "") return;

  const savedText = input.value.trim();

  const savedTask = JSON.parse(localStorage.getItem("note") || "[]");
  savedTask.push(savedText);
  localStorage.setItem("note", JSON.stringify(savedTask));
  task.className = "item";
  task.setAttribute("data-index", savedTask.length - 1); // gắn index
  task.innerHTML = `
    <input type="checkbox">
    <span>${input.value}</span>
    <button class="edit-btn">✏️</button>
    <button class="delete-btn">x</button>
  `;
  itemList.appendChild(task);
  input.value = "";
});

// xoa task theo target
itemList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    // xoa trong local
    const list = e.target.parentElement;
    const taskContent = list.querySelector("span").textContent.trim();
    // lay local va loc nhung local da bi xoa
    let savedTask = JSON.parse(localStorage.getItem("note") || "[]");
    savedTask = savedTask.filter((task) => task.trim() !== taskContent.trim());
    localStorage.setItem("note", JSON.stringify(savedTask));
    list.remove();
  }
  // checked thi gach ngang

  if (e.target.type === "checkbox") {
    const TextContent = e.target.nextElementSibling;
    const Notedit = e.target.parentElement.querySelector(".edit-btn");
    if (e.target.checked) {
      TextContent.style.textDecoration = "line-through";
      TextContent.style.opacity = "0.5";
      TextContent.style.fontStyle = "italic";
      Notedit.disabled = true;
    } else {
      TextContent.style.textDecoration = "none";
      TextContent.style.opacity = "1";
      TextContent.style.fontStyle = "normal";
      Notedit.disabled = false;
    }
  }

  // edit task
  if (e.target.classList.contains("edit-btn")) {
    const edit = e.target.previousElementSibling;
    edit.contentEditable = true; // bật chỉnh sửa trực tiếp
    edit.focus();

    // đặt cursor cuối text
    const range = document.createRange(); //Tạo một Range (một đoạn chọn trong DOM).

    const sel = window.getSelection(); //Lấy Selection hiện tại (nơi con trỏ đang đứng).
    range.selectNodeContents(edit); //Chọn toàn bộ nội dung trong thẻ edit (task đang edit).
    range.collapse(false); //Thu range lại vào cuối nội dung (false = cuối, true = đầu).\
    // Xóa mọi selection trước đó và đặt con trỏ vào vị trí range vừa tạo, tức là cuối text.
    sel.removeAllRanges();
    sel.addRange(range);
    // Kết quả: khi nhấn edit, text sẵn sàng sửa, con trỏ nháy ngay cuối text, không bị nhảy lên đầu.

    edit.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        edit.contentEditable = false;
      } else {
        edit.contentEditable = true;
      }
    });

    edit.addEventListener("blur", () => {
      edit.contentEditable = false;
      const newText = edit.textContent.trim();

      let savedTask = JSON.parse(localStorage.getItem("note") || "[]");
      const index = edit.parentElement.getAttribute("data-index");
      if (index !== null) {
        if (newText === "") {
          // xóa task nếu rong
          savedTask.splice(index, 1);
          // Đúng rồi, savedTask.splice(index, 1) xóa luôn phần tử ở vị trí index trong mảng savedTask.
          //splice cắt bỏ phần tử ở vị trí index trong mảng savedTask.

          // Mảng lúc này ngắn lại, các phần tử phía sau index sẽ dời lên 1 vị trí.

          // Sau đó, nếu bạn gọi localStorage.setItem("note", JSON.stringify(savedTask)), dữ liệu trong localStorage cũng được cập nhật theo.

          // splice chỉ thao tác trên mảng, nó không tự động xóa <li> trong DOM. Để xóa task trên giao diện, bạn vẫn cần:

          // splice(index, 1) → xóa trong mảng/localStorage.

          // element.remove() → xóa trong DOM.

          edit.parentElement.remove();
        } else {
          // update text mới
          savedTask[index] = newText;
        }
        localStorage.setItem("note", JSON.stringify(savedTask));
      }
    });
  }
});

// xu ly clear all
const Clear = document.querySelector("button[type = 'reset']");

Clear.addEventListener("click", () => {
  //   Nếu itemList.children.length === 0 → nghĩa là không có task nào trong list (list trống).
  // Nếu itemList.children.length > 0 → list đang có task, có thể thực hiện clear hoặc thao tác khác.
  // itemList.children chỉ trả về các phần tử con trực tiếp (thẳng hàng với itemList), không đếm text node hay comment.
  // itemList.children chỉ đếm các element con trực tiếp, không tính các text node, comment, hay element lồng sâu.

  // itemList.children.length → số lượng thằng con trực tiếp.

  if (itemList.children.length === 0) {
    setTimeout(() => {
      itemList.innerHTML = "Task is Empty Can't Clear All";
      btn_act.disabled = true;
    }, 100);
    setTimeout(() => {
      itemList.innerHTML = "";
      btn_act.disabled = false;
    }, 1000);
    return;
  }
  itemList.innerHTML = "";

  setTimeout(() => {
    itemList.innerHTML = "Clear all task done!";
    localStorage.removeItem("note");
    btn_act.disabled = true;
  }, 100);
  setTimeout(() => {
    itemList.innerHTML = "";
    btn_act.disabled = false;
  }, 1000);
});

// Mission:

// vao web van luu task da tao
// loc task da hoan thanh
//button tick all va bo tick all
// button dropdown cac task da hoan thanh click vao hien cac task hoan thanh
// neu hoan thanh se day xuong cuoi
// dark mode
