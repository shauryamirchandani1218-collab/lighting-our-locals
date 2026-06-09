function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.add("hidden");
  });

  document.getElementById(pageId).classList.remove("hidden");

  if (pageId === "reportsPage") renderReports();
  if (pageId === "adminPage") renderAdmin();
}

let reports = JSON.parse(localStorage.getItem("projectLOLReports")) || [];

function saveReports() {
  localStorage.setItem("projectLOLReports", JSON.stringify(reports));
}

function submitReport() {
  const imageInput = document.getElementById("imageUpload");
  const file = imageInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function(event) {
      saveReport(event.target.result);
    };

    reader.readAsDataURL(file);
  } else {
    saveReport("");
  }
}

function saveReport(imageData) {
  const report = {
    id: Date.now(),
    location: document.getElementById("location").value,
    issue: document.getElementById("issueType").value,
    safety: document.getElementById("safetyLevel").value,
    description: document.getElementById("description").value,
    image: imageData,
    status: "Submitted"
  };

  reports.push(report);
  saveReports();

  document.getElementById("location").value = "";
  document.getElementById("description").value = "";
  document.getElementById("imageUpload").value = "";

  alert("Report submitted!");
  showPage("reportsPage");
}

function getStatusClass(status) {
  if (status === "Resolved") return "resolved";
  if (status === "In Progress") return "progress";
  return "submitted";
}

function renderReports() {
  const container = document.getElementById("reportContainer");
  container.innerHTML = "";

  if (reports.length === 0) {
    container.innerHTML = "<p>No reports submitted yet.</p>";
    return;
  }

  reports.forEach(report => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.style.cursor = "pointer";

    const stars = "⭐".repeat(parseInt(report.safety || "3"));

    card.innerHTML =
      (report.image ? "<img src='" + report.image + "' class='report-image'>" : "") +
      "<h3>" + report.issue + "</h3>" +
      "<span class='status-badge " + getStatusClass(report.status) + "'>" + report.status + "</span>" +
      "<p><strong>Location:</strong> " + report.location + "</p>" +
      "<p><strong>Safety:</strong> " + stars + "</p>" +
      "<p>" + report.description + "</p>";

    card.onclick = function () {
      showReportDetails(report.id);
    };

    container.appendChild(card);
  });
}

function showReportDetails(id) {
  const report = reports.find(r => r.id === id);

  if (!report) return;

  const container = document.getElementById("detailsContainer");
  const stars = "⭐".repeat(parseInt(report.safety || "3"));

  container.innerHTML =
    (report.image ? "<img src='" + report.image + "' class='report-image'>" : "") +
    "<div class='report-card'>" +
    "<h2>" + report.issue + "</h2>" +
    "<span class='status-badge " + getStatusClass(report.status) + "'>" + report.status + "</span>" +
    "<p><strong>Location:</strong> " + report.location + "</p>" +
    "<p><strong>Safety:</strong> " + stars + "</p>" +
    "<p><strong>Description:</strong> " + report.description + "</p>" +
    "<hr><br>" +
    "<h3>Status Timeline</h3>" +
    "<p>🔵 Submitted — Report was created.</p>" +
    (report.status === "In Progress" || report.status === "Resolved"
      ? "<p>🟡 In Progress — Report is being reviewed.</p>"
      : "") +
    (report.status === "Resolved"
      ? "<p>🟢 Resolved — Report has been marked resolved.</p>"
      : "") +
    "<br><button onclick=\"showPage('reportsPage')\">Back to Reports</button>" +
    "</div>";

  showPage("detailsPage");
}

function adminLogin() {
  const password = prompt("Enter Admin Password");

  if (password === "projectlol") {
    showPage("adminPage");
    renderAdmin();
  } else {
    alert("Incorrect Password");
  }
}

function renderAdminStats() {
  const stats = document.getElementById("adminStats");

  const total = reports.length;
  const submitted = reports.filter(r => r.status === "Submitted").length;
  const progress = reports.filter(r => r.status === "In Progress").length;
  const resolved = reports.filter(r => r.status === "Resolved").length;

  stats.innerHTML =
    "<div class='stats-grid'>" +
    "<div class='stat-box'><h2>" + total + "</h2><p>Total Reports</p></div>" +
    "<div class='stat-box'><h2>" + submitted + "</h2><p>Submitted</p></div>" +
    "<div class='stat-box'><h2>" + progress + "</h2><p>In Progress</p></div>" +
    "<div class='stat-box'><h2>" + resolved + "</h2><p>Resolved</p></div>" +
    "</div>";
}

function renderAdmin() {
  renderAdminStats();

  const container = document.getElementById("adminContainer");
  container.innerHTML = "";

  if (reports.length === 0) {
    container.innerHTML = "<p>No reports submitted yet.</p>";
    return;
  }

  reports.forEach(report => {
    const card = document.createElement("div");
    card.className = "report-card";

    const stars = "⭐".repeat(parseInt(report.safety || "3"));

    card.innerHTML =
      (report.image ? "<img src='" + report.image + "' class='report-image'>" : "") +
      "<h3>" + report.issue + "</h3>" +
      "<span class='status-badge " + getStatusClass(report.status) + "'>" + report.status + "</span>" +
      "<p><strong>Location:</strong> " + report.location + "</p>" +
      "<p><strong>Safety:</strong> " + stars + "</p>" +
      "<p>" + report.description + "</p>" +
      "<button onclick='updateStatus(" + report.id + ", \"Submitted\")'>Submitted</button> " +
      "<button onclick='updateStatus(" + report.id + ", \"In Progress\")'>In Progress</button> " +
      "<button onclick='updateStatus(" + report.id + ", \"Resolved\")'>Resolved</button> " +
      "<button onclick='deleteReport(" + report.id + ")'>Delete</button>";

    container.appendChild(card);
  });
}

function updateStatus(id, status) {
  const report = reports.find(r => r.id === id);

  if (!report) return;

  report.status = status;
  saveReports();

  renderReports();
  renderAdmin();
}

function deleteReport(id) {
  reports = reports.filter(r => r.id !== id);
  saveReports();

  renderReports();
  renderAdmin();
}

renderReports();