// Logic Toggle Sáng/Tối
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const body = document.body;

// Kiểm tra xem người dùng đã từng chọn Dark Mode chưa
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeIcon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  // Nếu đang là Dark Mode -> Chuyển icon thành Mặt trời, lưu 'dark'
  if (body.classList.contains("dark-mode")) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  }
  // Nếu đang là Light Mode -> Chuyển icon thành Mặt trăng, lưu 'light'
  else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// --- PHẦN DƯỚI ĐÂY ĐÃ BỊ XÓA VÌ BOOTSTRAP ĐÃ TỰ LÀM RỒI ---
// const menuToggle = document.getElementById("menu-toggle"); ... (Xóa đoạn này đi)
