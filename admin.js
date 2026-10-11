// =====================================================
// admin.js - Admin module: hospitals, doctors, bookings, users, analytics
// =====================================================

var session = requireRole("admin");

if (session) {
  document.getElementById("welcomeText").textContent = "Admin: " + session.name;
  fillStateSelect();
  renderAll();
}

document.getElementById("logoutBtn").addEventListener("click", logout);

// ---------- Tabs ----------
var tabButtons = document.querySelectorAll(".admin-tabs button");
var tabNames = ["hospitals", "doctors", "appointments", "users", "analytics"];

for (var t = 0; t < tabButtons.length; t++) {
  tabButtons[t].addEventListener("click", function () {
    var chosen = this.getAttribute("data-tab");
    for (var i = 0; i < tabNames.length; i++) {
      var section = document.getElementById("tab-" + tabNames[i]);
      if (tabNames[i] === chosen) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    }
    for (var j = 0; j < tabButtons.length; j++) {
      tabButtons[j].classList.remove("active");
    }
    this.classList.add("active");
    if (chosen === "analytics") {
      renderAnalytics();
    }
  });
}

window.addEventListener("resize", function () {
  if (!document.getElementById("tab-analytics").classList.contains("hidden")) {
    renderCharts();
  }
});

// ---------- Render everything ----------
function renderAll() {
  renderStats();
  renderHospitals();
  renderDoctors();
  renderAppointments();
  renderUsers();
  fillHospitalSelect();
  fillLoginDoctorSelect();
  if (!document.getElementById("tab-analytics").classList.contains("hidden")) {
    renderAnalytics();
  }
}

function countDoctors(hospitals) {
  var total = 0;
  for (var i = 0; i < hospitals.length; i++) {
    total += hospitals[i].doctors.length;
  }
  return total;
}

function renderStats() {
  var hospitals = getData("hms_hospitals", []);
  var users = getData("hms_users", []);
  var appointments = getData("hms_appointments", []);

  var patients = 0;
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === "user") {
      patients++;
    }
  }

  document.getElementById("stats").innerHTML =
    '<div class="stat"><div class="num">' + hospitals.length + '</div>Hospitals</div>' +
    '<div class="stat"><div class="num">' + countDoctors(hospitals) + '</div>Doctors</div>' +
    '<div class="stat"><div class="num">' + patients + '</div>Patients</div>' +
    '<div class="stat"><div class="num">' + appointments.length + '</div>Appointments</div>';
}

// Removes the login accounts of doctors that were deleted
function removeDoctorLogins(doctorIds) {
  var users = getData("hms_users", []);
  var kept = [];
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === "doctor" && doctorIds.indexOf(users[i].doctorId) !== -1) {
      continue;
    }
    kept.push(users[i]);
  }
  setData("hms_users", kept);
}

// ---------- Hospitals ----------
function renderHospitals() {
  var hospitals = getData("hms_hospitals", []);
  var box = document.getElementById("hospitalTable");

  if (hospitals.length === 0) {
    box.innerHTML = '<div class="empty">No hospitals added yet.</div>';
    return;
  }

  var html =
    "<table><thead><tr><th>Name</th><th>Location</th><th>Diseases</th><th>Doctors</th><th>Rating</th><th>Emergency</th><th></th></tr></thead><tbody>";
  for (var i = 0; i < hospitals.length; i++) {
    var h = hospitals[i];
    var reviews = h.reviewCount > 0 ? " (" + h.reviewCount + " reviews)" : "";
    var emergency = h.emergency
      ? '<span class="badge no">24x7</span>' + (h.ambulance ? "<br>" + escapeHtml(h.ambulance) : "")
      : "No";
    html +=
      "<tr><td>" + escapeHtml(h.name) + "</td><td>" + escapeHtml(h.location + (h.state ? ", " + h.state : "")) + "</td><td>" +
      escapeHtml(h.diseases.join(", ")) + "</td><td>" + h.doctors.length + "</td><td>" + h.rating + escapeHtml(reviews) + "</td><td>" +
      emergency + '</td><td><button class="btn btn-danger btn-small delete-hospital" data-id="' + escapeHtml(h.id) + '">Delete</button></td></tr>';
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

function fillStateSelect() {
  var html = '<option value="">-- Select state --</option>';
  for (var i = 0; i < INDIAN_STATES.length; i++) {
    html += '<option value="' + INDIAN_STATES[i] + '">' + INDIAN_STATES[i] + "</option>";
  }
  document.getElementById("hState").innerHTML = html;
}

document.getElementById("hospitalForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var diseaseText = document.getElementById("hDiseases").value;
  var parts = diseaseText.split(",");
  var diseases = [];
  for (var i = 0; i < parts.length; i++) {
    var d = parts[i].trim();
    if (d !== "") {
      diseases.push(d);
    }
  }

  var rating = Number(document.getElementById("hRating").value) || 4;
  var emergency = document.getElementById("hEmergency").value === "yes";

  var hospitals = getData("hms_hospitals", []);
  hospitals.push({
    id: makeId("h"),
    name: document.getElementById("hName").value.trim(),
    location: document.getElementById("hLocation").value.trim(),
    state: document.getElementById("hState").value,
    address: document.getElementById("hAddress").value.trim(),
    rating: rating,
    seedRating: rating,
    reviewSum: 0,
    reviewCount: 0,
    costFactor: Number(document.getElementById("hCost").value) || 1,
    emergency: emergency,
    ambulance: emergency ? document.getElementById("hAmbulance").value.trim() : "",
    diseases: diseases,
    doctors: []
  });
  setData("hms_hospitals", hospitals);

  document.getElementById("hospitalForm").reset();
  document.getElementById("hRating").value = 4;
  renderAll();
});

document.getElementById("hospitalTable").addEventListener("click", function (event) {
  var btn = event.target.closest(".delete-hospital");
  if (!btn) {
    return;
  }
  if (!confirm("Delete this hospital and all its doctors?")) {
    return;
  }
  var id = btn.getAttribute("data-id");
  var hospitals = getData("hms_hospitals", []);
  var remaining = [];
  var removedDoctorIds = [];
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].id !== id) {
      remaining.push(hospitals[i]);
    } else {
      for (var j = 0; j < hospitals[i].doctors.length; j++) {
        removedDoctorIds.push(hospitals[i].doctors[j].id);
      }
    }
  }
  setData("hms_hospitals", remaining);
  removeDoctorLogins(removedDoctorIds);
  renderAll();
});

// ---------- Doctors ----------
function fillHospitalSelect() {
  var hospitals = getData("hms_hospitals", []);
  var select = document.getElementById("dHospital");
  var html = "";
  for (var i = 0; i < hospitals.length; i++) {
    html += '<option value="' + escapeHtml(hospitals[i].id) + '">' + escapeHtml(hospitals[i].name) + "</option>";
  }
  select.innerHTML = html;
}

// email of the login account of a doctor, or "" when the doctor has none
function loginEmailOf(doctorId) {
  var users = getData("hms_users", []);
  for (var i = 0; i < users.length; i++) {
    if (users[i].role === "doctor" && users[i].doctorId === doctorId) {
      return users[i].email;
    }
  }
  return "";
}

function renderDoctors() {
  var hospitals = getData("hms_hospitals", []);
  var box = document.getElementById("doctorTable");

  var rows = "";
  for (var i = 0; i < hospitals.length; i++) {
    var h = hospitals[i];
    for (var j = 0; j < h.doctors.length; j++) {
      var d = h.doctors[j];
      var status = d.available
        ? '<span class="badge ok">Available</span>'
        : '<span class="badge no">Not Available</span>';
      var login = loginEmailOf(d.id);
      rows +=
        "<tr><td>" + escapeHtml(d.name) + "</td><td>" + escapeHtml(d.designation) + "</td><td>" +
        escapeHtml(h.name) + "</td><td>" + d.experience + " yrs</td><td>" + d.successRate + "%</td><td>" +
        escapeHtml(d.timings) + "</td><td>" + (login !== "" ? escapeHtml(login) : "-") + "</td><td>" +
        '<button class="btn btn-light btn-small toggle-doctor" style="border:1px solid #e2e8f0;" data-hospital="' + escapeHtml(h.id) +
        '" data-id="' + escapeHtml(d.id) + '">' + (d.available ? "Mark Unavailable" : "Mark Available") + "</button> " +
        status +
        '</td><td><button class="btn btn-danger btn-small delete-doctor" data-hospital="' + escapeHtml(h.id) +
        '" data-id="' + escapeHtml(d.id) + '">Delete</button></td></tr>';
    }
  }

  if (rows === "") {
    box.innerHTML = '<div class="empty">No doctors added yet.</div>';
    return;
  }

  box.innerHTML =
    "<table><thead><tr><th>Name</th><th>Designation</th><th>Hospital</th><th>Experience</th><th>Success</th><th>Timings</th><th>Login</th><th>Availability</th><th></th></tr></thead><tbody>" +
    rows + "</tbody></table>";
}

document.getElementById("doctorForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var hospitalId = document.getElementById("dHospital").value;
  var timingsText = document.getElementById("dTimings").value.trim();
  if (!isValidTimings(timingsText)) {
    alert("Please enter timings like: Mon-Fri, 10 AM - 2 PM");
    return;
  }
  var hospitals = getData("hms_hospitals", []);

  var doctor = {
    id: makeId("d"),
    name: document.getElementById("dName").value.trim(),
    designation: document.getElementById("dDesignation").value.trim(),
    experience: Number(document.getElementById("dExperience").value),
    successRate: Number(document.getElementById("dSuccess").value),
    timings: timingsText,
    available: document.getElementById("dAvailable").value === "yes"
  };

  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].id === hospitalId) {
      hospitals[i].doctors.push(doctor);
    }
  }
  setData("hms_hospitals", hospitals);

  document.getElementById("doctorForm").reset();
  renderAll();
});

document.getElementById("doctorTable").addEventListener("click", function (event) {
  var toggleBtn = event.target.closest(".toggle-doctor");
  var deleteBtn = event.target.closest(".delete-doctor");
  var btn = toggleBtn || deleteBtn;
  if (!btn) {
    return;
  }

  var hospitalId = btn.getAttribute("data-hospital");
  var doctorId = btn.getAttribute("data-id");
  var hospitals = getData("hms_hospitals", []);

  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].id !== hospitalId) {
      continue;
    }
    if (toggleBtn) {
      for (var j = 0; j < hospitals[i].doctors.length; j++) {
        if (hospitals[i].doctors[j].id === doctorId) {
          hospitals[i].doctors[j].available = !hospitals[i].doctors[j].available;
        }
      }
    } else {
      if (!confirm("Delete this doctor?")) {
        return;
      }
      var kept = [];
      for (var k = 0; k < hospitals[i].doctors.length; k++) {
        if (hospitals[i].doctors[k].id !== doctorId) {
          kept.push(hospitals[i].doctors[k]);
        }
      }
      hospitals[i].doctors = kept;
      removeDoctorLogins([doctorId]);
    }
  }

  setData("hms_hospitals", hospitals);
  renderAll();
});

// ---------- Doctor logins ----------
function fillLoginDoctorSelect() {
  var hospitals = getData("hms_hospitals", []);
  var select = document.getElementById("lDoctor");
  var html = "";
  for (var i = 0; i < hospitals.length; i++) {
    for (var j = 0; j < hospitals[i].doctors.length; j++) {
      var d = hospitals[i].doctors[j];
      if (loginEmailOf(d.id) === "") {
        html += '<option value="' + escapeHtml(d.id) + '">' + escapeHtml(d.name + " - " + hospitals[i].name) + "</option>";
      }
    }
  }
  if (html === "") {
    html = '<option value="">All doctors already have a login</option>';
  }
  select.innerHTML = html;
}

function showLoginMessage(text, type) {
  var box = document.getElementById("loginMessage");
  box.textContent = text;
  box.className = "message " + type;
}

document.getElementById("doctorLoginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var doctorId = document.getElementById("lDoctor").value;
  var email = document.getElementById("lEmail").value.trim().toLowerCase();
  var password = document.getElementById("lPassword").value;

  var found = doctorId === "" ? null : findDoctor(doctorId);
  if (!found) {
    showLoginMessage("Please choose a doctor.", "error");
    return;
  }
  if (password.length < 6) {
    showLoginMessage("Password must be at least 6 characters.", "error");
    return;
  }

  var users = getData("hms_users", []);
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      showLoginMessage("An account with this email already exists.", "error");
      return;
    }
  }

  users.push({ name: found.doctor.name, email: email, password: password, role: "doctor", doctorId: doctorId });
  setData("hms_users", users);

  document.getElementById("doctorLoginForm").reset();
  renderAll();
  showLoginMessage("Login created for " + found.doctor.name + ". They can log in with " + email + ".", "success");
});

// ---------- Appointments ----------
function renderAppointments() {
  var appointments = getData("hms_appointments", []);
  var box = document.getElementById("appointmentTable");

  if (appointments.length === 0) {
    box.innerHTML = '<div class="empty">No appointments booked yet.</div>';
    return;
  }

  var statuses = ["Booked", "Completed", "Cancelled"];
  var html =
    "<table><thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Hospital</th><th>Doctor</th><th>Disease</th><th>Status</th></tr></thead><tbody>";
  for (var i = 0; i < appointments.length; i++) {
    var a = appointments[i];
    var options = "";
    for (var s = 0; s < statuses.length; s++) {
      var selected = statuses[s] === a.status ? " selected" : "";
      options += '<option value="' + statuses[s] + '"' + selected + ">" + statuses[s] + "</option>";
    }
    html +=
      "<tr><td>" + escapeHtml(formatDate(a.date)) + "</td><td>" + escapeHtml(a.time || "-") + "</td><td>" + escapeHtml(a.userName) + "</td><td>" +
      escapeHtml(a.hospitalName) + (a.hospitalLocation ? '<br><span class="muted">' + escapeHtml(a.hospitalLocation) + "</span>" : "") + "</td><td>" +
      escapeHtml(a.doctorName) + "</td><td>" +
      escapeHtml(a.disease) + '</td><td><select class="status-select" data-id="' + escapeHtml(a.id) + '">' + options +
      "</select></td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

document.getElementById("appointmentTable").addEventListener("change", function (event) {
  if (!event.target.classList.contains("status-select")) {
    return;
  }
  var id = event.target.getAttribute("data-id");
  var appointments = getData("hms_appointments", []);
  for (var i = 0; i < appointments.length; i++) {
    if (appointments[i].id === id) {
      appointments[i].status = event.target.value;
    }
  }
  setData("hms_appointments", appointments);
  renderStats();
});

// ---------- Users ----------
function renderUsers() {
  var users = getData("hms_users", []);
  var box = document.getElementById("userTable");

  var html = "<table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>";
  for (var i = 0; i < users.length; i++) {
    var role = "Patient";
    if (users[i].role === "admin") {
      role = "Admin";
    } else if (users[i].role === "doctor") {
      role = "Doctor";
    }
    html +=
      "<tr><td>" + escapeHtml(users[i].name) + "</td><td>" + escapeHtml(users[i].email) +
      "</td><td>" + role + "</td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

// ---------- Analytics ----------
var STATUS_COLORS = { Booked: "#d97706", Completed: "#16a34a", Cancelled: "#dc2626" };
var BAR_COLOR = "#0f766e";
var chartData = null;

// counts items by a key, highest first, keeps the first spelling seen
function countBy(list, getKey) {
  var counts = {};
  var names = {};
  for (var i = 0; i < list.length; i++) {
    var name = getKey(list[i]);
    if (!name) {
      continue;
    }
    var key = name.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
    if (!names[key]) {
      names[key] = name;
    }
  }
  var result = [];
  for (var k in counts) {
    result.push({ label: names[k], value: counts[k] });
  }
  result.sort(function (a, b) {
    return b.value - a.value;
  });
  return result;
}

function renderAnalytics() {
  var appointments = getData("hms_appointments", []);
  var searches = getData("hms_searches", []);

  var perHospital = countBy(appointments, function (a) {
    return a.hospitalName;
  }).slice(0, 8);
  var perDisease = countBy(searches, function (s) {
    return s.disease;
  }).slice(0, 8);

  var statusCounts = { Booked: 0, Completed: 0, Cancelled: 0 };
  for (var i = 0; i < appointments.length; i++) {
    if (statusCounts[appointments[i].status] !== undefined) {
      statusCounts[appointments[i].status]++;
    }
  }

  chartData = { hospitals: perHospital, diseases: perDisease, status: statusCounts };
  renderCharts();
  renderRatingTable();
  renderFeedbackTable();
}

function renderCharts() {
  if (!chartData) {
    return;
  }
  var hLabels = [];
  var hValues = [];
  var hColors = [];
  for (var i = 0; i < chartData.hospitals.length; i++) {
    hLabels.push(chartData.hospitals[i].label);
    hValues.push(chartData.hospitals[i].value);
    hColors.push(BAR_COLOR);
  }
  drawBarChart(document.getElementById("chartHospitals"), hLabels, hValues, hColors, "No appointments yet.");

  var dLabels = [];
  var dValues = [];
  var dColors = [];
  for (var j = 0; j < chartData.diseases.length; j++) {
    dLabels.push(chartData.diseases[j].label);
    dValues.push(chartData.diseases[j].value);
    dColors.push(BAR_COLOR);
  }
  drawBarChart(document.getElementById("chartDiseases"), dLabels, dValues, dColors, "No searches yet.");

  var sLabels = ["Booked", "Completed", "Cancelled"];
  var sValues = [chartData.status.Booked, chartData.status.Completed, chartData.status.Cancelled];
  var sColors = [STATUS_COLORS.Booked, STATUS_COLORS.Completed, STATUS_COLORS.Cancelled];
  var total = sValues[0] + sValues[1] + sValues[2];
  drawBarChart(document.getElementById("chartStatus"), total === 0 ? [] : sLabels, sValues, sColors, "No appointments yet.");

  setChartDescription("chartHospitals", "Appointments per hospital", hLabels, hValues);
  setChartDescription("chartDiseases", "Most searched diseases", dLabels, dValues);
  setChartDescription("chartStatus", "Appointments by status", total === 0 ? [] : sLabels, sValues);
}

// Text version of a chart for screen readers
function setChartDescription(id, title, labels, values) {
  var parts = [];
  for (var i = 0; i < labels.length; i++) {
    parts.push(labels[i] + " " + values[i]);
  }
  document.getElementById(id).setAttribute("aria-label", title + ": " + (parts.length > 0 ? parts.join(", ") : "no data"));
}

// shortens text with "..." so it fits the given width
function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) {
    return text;
  }
  var shortened = text;
  while (shortened.length > 1 && ctx.measureText(shortened + "...").width > maxWidth) {
    shortened = shortened.slice(0, -1);
  }
  return shortened + "...";
}

// bar with a flat start (at the baseline) and a rounded end
function barPath(ctx, x, y, w, h, r) {
  var radius = Math.min(r, w, h / 2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

function drawBarChart(canvas, labels, values, colors, emptyText) {
  var wrap = canvas.parentNode;
  var width = Math.max(wrap.clientWidth, 260);
  var rowHeight = 34;
  var height = Math.max(labels.length, 1) * rowHeight + 16;
  var ratio = window.devicePixelRatio || 1;

  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  var ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.font = "13px 'Segoe UI', Arial, sans-serif";
  ctx.textBaseline = "middle";

  if (labels.length === 0) {
    ctx.fillStyle = "#64748b";
    ctx.fillText(emptyText, 6, 26);
    return;
  }

  var labelWidth = Math.min(190, Math.round(width * 0.4));
  var maxValue = Math.max.apply(null, values);
  if (maxValue < 1) {
    maxValue = 1;
  }
  var barMax = width - labelWidth - 56;

  // faint baseline
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(labelWidth + 0.5, 4);
  ctx.lineTo(labelWidth + 0.5, height - 4);
  ctx.stroke();

  for (var i = 0; i < labels.length; i++) {
    var rowTop = 8 + i * rowHeight;
    var middle = rowTop + rowHeight / 2 - 2;

    ctx.fillStyle = "#1e293b";
    ctx.fillText(fitText(ctx, labels[i], labelWidth - 14), 4, middle);

    var barWidth = Math.round((values[i] / maxValue) * barMax);
    if (values[i] > 0 && barWidth < 4) {
      barWidth = 4;
    }
    if (barWidth > 0) {
      ctx.fillStyle = colors[i];
      barPath(ctx, labelWidth + 1, middle - 8, barWidth, 16, 4);
      ctx.fill();
    }

    ctx.fillStyle = "#1e293b";
    ctx.fillText(String(values[i]), labelWidth + barWidth + 10, middle);
  }
}

function renderRatingTable() {
  var hospitals = getData("hms_hospitals", []);
  var box = document.getElementById("ratingTable");
  var sorted = hospitals.slice();
  sorted.sort(function (a, b) {
    return b.rating - a.rating;
  });

  var html = "<table><thead><tr><th>Hospital</th><th>Location</th><th>Rating</th><th>Patient reviews</th></tr></thead><tbody>";
  for (var i = 0; i < sorted.length; i++) {
    html += "<tr><td>" + escapeHtml(sorted[i].name) + "</td><td>" + escapeHtml(sorted[i].location) + "</td><td>" +
      sorted[i].rating + "</td><td>" + (sorted[i].reviewCount || 0) + "</td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

function starText(n) {
  var text = "";
  for (var i = 1; i <= 5; i++) {
    text += i <= n ? "★" : "☆";
  }
  return text;
}

function renderFeedbackTable() {
  var all = getData("hms_feedback", []);
  var box = document.getElementById("feedbackTable");
  if (all.length === 0) {
    box.innerHTML = '<div class="empty">No feedback yet. Patients can rate a hospital after an appointment is marked Completed.</div>';
    return;
  }
  var sorted = all.slice();
  sorted.sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });
  var html = "<table><thead><tr><th>Date</th><th>Hospital</th><th>Doctor</th><th>Rating</th><th>Comment</th><th>Patient</th></tr></thead><tbody>";
  for (var i = 0; i < sorted.length && i < 15; i++) {
    var f = sorted[i];
    html += "<tr><td>" + escapeHtml(formatDate(f.date)) + "</td><td>" + escapeHtml(f.hospitalName) + "</td><td>" + escapeHtml(f.doctorName) +
      '</td><td><span class="stars-text">' + starText(f.rating) + "</span> " + f.rating + "/5</td><td>" + escapeHtml(f.comment || "-") +
      "</td><td>" + escapeHtml(f.userName) + "</td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

// ---------- Sample activity (for demonstrations) ----------
function showAnalyticsMessage(text, type) {
  var box = document.getElementById("analyticsMessage");
  box.textContent = text;
  box.className = "message " + type;
}

function daysAgo(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  return dateToString(d);
}

document.getElementById("addSample").addEventListener("click", function () {
  var appointments = getData("hms_appointments", []);
  for (var x = 0; x < appointments.length; x++) {
    if (appointments[x].demo) {
      showAnalyticsMessage("Sample activity is already added. Remove it first to add it again.", "error");
      return;
    }
  }

  var hospitals = getData("hms_hospitals", []);
  var statuses = ["Completed", "Completed", "Cancelled", "Completed"];
  var dayOffset = 1;

  for (var i = 0; i < hospitals.length; i++) {
    var h = hospitals[i];
    if (h.doctors.length === 0) {
      continue;
    }
    var howMany = (i % 4) + 2;
    for (var k = 0; k < howMany; k++) {
      var d = h.doctors[k % h.doctors.length];
      var slots = getSlots(d.timings);
      appointments.push({
        id: makeId("a") + "x" + i + k,
        userEmail: "sample@hms.com",
        userName: "Sample Patient",
        hospitalId: h.id,
        hospitalName: h.name,
        hospitalLocation: fullAddress(h),
        doctorId: d.id,
        doctorName: d.name,
        doctorDesignation: d.designation,
        disease: h.diseases[k % h.diseases.length],
        date: daysAgo(dayOffset + k),
        time: minutesToLabel(slots[k % slots.length]),
        status: statuses[(i + k) % statuses.length],
        demo: true
      });
    }
    dayOffset++;
  }
  setData("hms_appointments", appointments);

  var pool = ["Fever", "Fever", "Fever", "Fever", "Diabetes", "Diabetes", "Diabetes", "Heart Disease", "Heart Disease",
    "Dengue", "Asthma", "Migraine", "Typhoid", "Hypertension"];
  var searches = getData("hms_searches", []);
  for (var n = 0; n < pool.length; n++) {
    searches.push({ id: makeId("s") + "x" + n, disease: pool[n], state: "Andhra Pradesh", location: "Vijayawada",
      date: daysAgo(n % 6), userEmail: "sample@hms.com", demo: true });
  }
  setData("hms_searches", searches);

  renderAll();
  renderAnalytics();
  showAnalyticsMessage("Sample activity added. Remove it when you are done with the demonstration.", "success");
});

document.getElementById("removeSample").addEventListener("click", function () {
  var appointments = getData("hms_appointments", []);
  var keptAppointments = [];
  for (var i = 0; i < appointments.length; i++) {
    if (!appointments[i].demo) {
      keptAppointments.push(appointments[i]);
    }
  }
  setData("hms_appointments", keptAppointments);

  var searches = getData("hms_searches", []);
  var keptSearches = [];
  for (var j = 0; j < searches.length; j++) {
    if (!searches[j].demo) {
      keptSearches.push(searches[j]);
    }
  }
  setData("hms_searches", keptSearches);

  renderAll();
  renderAnalytics();
  showAnalyticsMessage("Sample activity removed.", "success");
});
