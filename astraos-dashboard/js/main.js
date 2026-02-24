// Hover states detection - purely for magnetic elements
let isHoveringBtn = false;
document
  .querySelectorAll(
    "a, button, .icon-btn, .task-item, .nav-item, .user-card, .vault-item, .card",
  )
  .forEach((el) => {
    el.addEventListener("mouseenter", () => (isHoveringBtn = true));
    el.addEventListener("mouseleave", () => {
      isHoveringBtn = false;
      // Magnetic Reset
      if (
        el.classList.contains("icon-btn") ||
        el.classList.contains("nav-item")
      ) {
        el.style.transform = "translate(0px, 0px)";
      }
    });

    // Magnetic Effect
    if (
      el.classList.contains("icon-btn") ||
      el.classList.contains("nav-item")
    ) {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dx = Math.max(-4, Math.min(4, x * 0.1));
        const dy = Math.max(-4, Math.min(4, y * 0.1));
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    }
  });

// Count up logic
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = parseFloat(el.getAttribute("data-count"));
  const duration = 1500;
  let startTime = null;
  const isFloat = target % 1 !== 0;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = ease * target;

    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
      el.style.textShadow = "0 0 10px rgba(6,182,212,0.5)";
      setTimeout(() => (el.style.textShadow = "none"), 500);
    }
  };
  requestAnimationFrame(step);
});

// Task toggle
function toggleTask(el) {
  el.classList.toggle("done");
  const icon = el.querySelector(".check-icon");
  const check = el.querySelector(".task-check");
  if (el.classList.contains("done")) {
    check.style.background = "var(--accent)";
    check.style.borderColor = "var(--accent)";
    icon.style.display = "block";
  } else {
    check.style.background = "";
    check.style.borderColor = "";
    icon.style.display = "none";
  }
}

// Date chip
const d = new Date();
document.getElementById("dateChip").textContent = d.toLocaleDateString(
  "en-US",
  { weekday: "short", month: "short", day: "numeric" },
);
