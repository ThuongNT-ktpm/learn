const toggle = document.getElementById("menu-toggle");
const navUL = document.querySelector("#navbar ul");

toggle.addEventListener("click", () => {
  navUL.classList.toggle("show");
  toggle.classList.toggle("active");
});

const leafEmoji = "🍁";

for (let i = 0; i < 30; i++) {
  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.textContent = leafEmoji;

  // Random vị trí và style
  leaf.style.left = Math.random() * window.innerWidth + "px";
  leaf.style.fontSize = 20 + Math.random() * 30 + "px";
  leaf.style.animationDuration = 5 + Math.random() * 10 + "s";
  leaf.style.animationDelay = Math.random() * 5 + "s";

  document.body.appendChild(leaf);
}
