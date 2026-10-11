// =====================================================
// doctor.js - Doctor module: appointments, patient history, prescriptions
// =====================================================

var session = requireRole("doctor");

var currentAppointment = null;   // the appointment open in the consultation panel

if (session) {
  document.getElementById("welcomeText").textContent = "Dr. " + doctorName().replace(/^Dr\.?\s*/i, "");
  renderAll();
}

document.getElementById("logoutBtn").addEventListener("click", logout);

function doctorName() {
  var found = findDoctor(session.doctorId);
  return found ? found.doctor.name : session.name;
}

function showMessage(text, type) {
  var box = document.getElementById("rxMessage");
  box.textContent = text;
  box.className = "message " + type;
}

// ---------- Data helpers ----------
function myAppointments() {
  var all = getData("hms_appointments", []);
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].doctorId === session.doctorId) {
      mine.push(all[i]);
    }
  }
  // earliest date and time first
  mine.sort(function (a, b) {
    var ka = a.date + " " + timeKey(a.time);
    var kb = b.date + " " + timeKey(b.time);
    return ka < kb ? -1 : 1;
  });
  return mine;
}

// "9:30 AM" -> "09:30" so times sort correctly
function timeKey(label) {
  var m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(label || "");
  if (!m) {
    return "00:00";
  }
  return twoDigits(hourTo24(m[1], m[3])) + ":" + m[2];
}

function allPrescriptions() {
  return getData("hms_prescriptions", []);
}

function prescriptionFor(appointmentId) {
  var all = allPrescriptions();
  for (var i = 0; i < all.length; i++) {
    if (all[i].appointmentId === appointmentId) {
      return all[i];
    }
  }
  return null;
}

function medicinesText(list) {
  var parts = [];
  for (var i = 0; i < list.length; i++) {
    parts.push(list[i].name + " (" + list[i].dosage + ", " + list[i].duration + ")");
  }
  return parts.join("; ");
}

// ---------- Render ----------
function renderAll() {
  renderProfile();
  renderStats();
  renderAppointments();
  renderPrescriptionTable();
}

function renderProfile() {
  var found = findDoctor(session.doctorId);
  var box = document.getElementById("profileBox");
  if (!found) {
    box.innerHTML = "<p>Your doctor profile could not be found. Please ask the hospital admin to check your login.</p>";
    return;
  }
  var d = found.doctor;
  box.innerHTML =
    '<div class="location-title">' + escapeHtml(d.name) + " - " + escapeHtml(d.designation) + "</div>" +
    "<p>" + escapeHtml(found.hospital.name) + ", " + escapeHtml(fullAddress(found.hospital)) + "</p>" +
    '<p class="muted">Experience: ' + d.experience + " years | Success rate: " + d.successRate + "% | Timings: " + escapeHtml(d.timings) + "</p>";
}

function renderStats() {
  var mine = myAppointments();
  var today = todayString();
  var todayCount = 0;
  var waiting = 0;
  var done = 0;
  for (var i = 0; i < mine.length; i++) {
    if (mine[i].status === "Booked") {
      waiting++;
      if (mine[i].date === today) {
        todayCount++;
      }
    }
    if (mine[i].status === "Completed") {
      done++;
    }
  }
  var rx = 0;
  var all = allPrescriptions();
  for (var j = 0; j < all.length; j++) {
    if (all[j].doctorId === session.doctorId) {
      rx++;
    }
  }
  document.getElementById("stats").innerHTML =
    '<div class="stat"><div class="num">' + todayCount + '</div>Today</div>' +
    '<div class="stat"><div class="num">' + waiting + '</div>Waiting (booked)</div>' +
    '<div class="stat"><div class="num">' + done + '</div>Completed</div>' +
    '<div class="stat"><div class="num">' + rx + '</div>Prescriptions written</div>';
}

function renderAppointments() {
  var filter = document.getElementById("statusFilter").value;
  var mine = myAppointments();
  var box = document.getElementById("appointmentTable");

  var rows = "";
  for (var i = 0; i < mine.length; i++) {
    var a = mine[i];
    if (filter !== "all" && a.status !== filter) {
      continue;
    }
    var cls = a.status === "Completed" ? "ok" : (a.status === "Cancelled" ? "no" : "warn");
    var hasRx = prescriptionFor(a.id) !== null;
    var action = a.status === "Cancelled"
      ? ""
      : '<button class="btn btn-small open-consult" data-id="' + escapeHtml(a.id) + '">' + (hasRx ? "View / edit" : "Open") + "</button>";
    rows +=
      "<tr><td>" + escapeHtml(formatDate(a.date)) + "</td><td>" + escapeHtml(a.time || "-") + "</td><td>" + escapeHtml(a.userName) +
      "</td><td>" + escapeHtml(a.disease) + '</td><td><span class="badge ' + cls + '">' + escapeHtml(a.status) + "</span>" +
      (hasRx ? ' <span class="badge ok">Prescription</span>' : "") + "</td><td>" + action + "</td></tr>";
  }

  if (rows === "") {
    box.innerHTML = '<div class="empty">No appointments to show.</div>';
    return;
  }
  box.innerHTML =
    "<table><thead><tr><th>Date</th><th>Time</th><th>Patient</th><th>Disease</th><th>Status</th><th></th></tr></thead><tbody>" +
    rows + "</tbody></table>";
}

document.getElementById("statusFilter").addEventListener("change", renderAppointments);

function renderPrescriptionTable() {
  var all = allPrescriptions();
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].doctorId === session.doctorId) {
      mine.push(all[i]);
    }
  }
  mine.sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });

  var box = document.getElementById("prescriptionTable");
  if (mine.length === 0) {
    box.innerHTML = '<div class="empty">You have not written any prescriptions yet.</div>';
    return;
  }
  var html = "<table><thead><tr><th>Date</th><th>Patient</th><th>Diagnosis</th><th>Medicines</th></tr></thead><tbody>";
  for (var k = 0; k < mine.length; k++) {
    html += "<tr><td>" + escapeHtml(formatDate(mine[k].date)) + "</td><td>" + escapeHtml(mine[k].patientName) + "</td><td>" +
      escapeHtml(mine[k].diagnosis) + "</td><td>" + escapeHtml(medicinesText(mine[k].medicines)) + "</td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

// ---------- Consultation ----------
document.getElementById("appointmentTable").addEventListener("click", function (event) {
  var btn = event.target.closest(".open-consult");
  if (!btn) {
    return;
  }
  openConsultation(btn.getAttribute("data-id"));
});

function findMyAppointment(id) {
  var mine = myAppointments();
  for (var i = 0; i < mine.length; i++) {
    if (mine[i].id === id) {
      return mine[i];
    }
  }
  return null;
}

function openConsultation(id) {
  currentAppointment = findMyAppointment(id);
  if (!currentAppointment) {
    return;
  }
  var a = currentAppointment;

  document.getElementById("consultInfo").innerHTML =
    '<div class="location-title">' + escapeHtml(a.userName) + "</div>" +
    "<p>" + escapeHtml(a.userEmail) + "</p>" +
    '<p class="muted">Appointment: ' + escapeHtml(formatDate(a.date)) + " at " + escapeHtml(a.time || "-") +
    " | Disease: " + escapeHtml(a.disease) + " | Status: " + escapeHtml(a.status) + "</p>";

  renderHistory(a);

  // load the existing prescription for editing, or start a blank one
  var existing = prescriptionFor(a.id);
  document.getElementById("rxMessage").className = "message";
  document.getElementById("medRows").innerHTML = "";
  if (existing) {
    document.getElementById("rxDiagnosis").value = existing.diagnosis;
    document.getElementById("rxFollowUp").value = existing.followUp || "";
    document.getElementById("rxNotes").value = existing.notes || "";
    for (var i = 0; i < existing.medicines.length; i++) {
      addMedicineRow(existing.medicines[i]);
    }
  } else {
    document.getElementById("rxDiagnosis").value = a.disease || "";
    document.getElementById("rxFollowUp").value = "";
    document.getElementById("rxNotes").value = "";
    addMedicineRow(null);
  }

  document.getElementById("consultCard").classList.remove("hidden");
  document.getElementById("consultCard").scrollIntoView({ behavior: "smooth" });
}

// Everything known about this patient: earlier visits and prescriptions
function renderHistory(a) {
  var allAppointments = getData("hms_appointments", []);
  var visits = [];
  for (var i = 0; i < allAppointments.length; i++) {
    if (allAppointments[i].userEmail === a.userEmail && allAppointments[i].id !== a.id) {
      visits.push(allAppointments[i]);
    }
  }
  visits.sort(function (x, y) {
    return x.date < y.date ? 1 : -1;
  });

  var prescriptions = [];
  var all = allPrescriptions();
  for (var j = 0; j < all.length; j++) {
    if (all[j].patientEmail === a.userEmail && all[j].appointmentId !== a.id) {
      prescriptions.push(all[j]);
    }
  }
  prescriptions.sort(function (x, y) {
    return x.date < y.date ? 1 : -1;
  });

  var html = "";
  if (visits.length === 0 && prescriptions.length === 0) {
    html = '<div class="empty">No earlier visits or prescriptions for this patient.</div>';
  } else {
    if (visits.length > 0) {
      html += "<h4>Earlier appointments</h4><div class=\"table-wrap\"><table><thead><tr><th>Date</th><th>Hospital</th><th>Doctor</th><th>Disease</th><th>Status</th></tr></thead><tbody>";
      for (var k = 0; k < visits.length; k++) {
        html += "<tr><td>" + escapeHtml(formatDate(visits[k].date)) + "</td><td>" + escapeHtml(visits[k].hospitalName) + "</td><td>" +
          escapeHtml(visits[k].doctorName) + "</td><td>" + escapeHtml(visits[k].disease) + "</td><td>" + escapeHtml(visits[k].status) + "</td></tr>";
      }
      html += "</tbody></table></div><br>";
    }
    if (prescriptions.length > 0) {
      html += "<h4>Earlier prescriptions</h4><div class=\"table-wrap\"><table><thead><tr><th>Date</th><th>Doctor</th><th>Diagnosis</th><th>Medicines</th></tr></thead><tbody>";
      for (var m = 0; m < prescriptions.length; m++) {
        html += "<tr><td>" + escapeHtml(formatDate(prescriptions[m].date)) + "</td><td>" + escapeHtml(prescriptions[m].doctorName) + "</td><td>" +
          escapeHtml(prescriptions[m].diagnosis) + "</td><td>" + escapeHtml(medicinesText(prescriptions[m].medicines)) + "</td></tr>";
      }
      html += "</tbody></table></div>";
    }
  }
  document.getElementById("historyBox").innerHTML = html;
}

// ---------- Medicine rows ----------
function addMedicineRow(medicine) {
  var row = document.createElement("div");
  row.className = "med-row";
  row.innerHTML =
    '<input type="text" class="med-name" placeholder="Medicine name">' +
    '<input type="text" class="med-dosage" placeholder="Dosage, e.g. 1-0-1 after food">' +
    '<input type="text" class="med-duration" placeholder="Duration, e.g. 5 days">' +
    '<button type="button" class="btn btn-danger btn-small remove-med">Remove</button>';
  if (medicine) {
    row.querySelector(".med-name").value = medicine.name;
    row.querySelector(".med-dosage").value = medicine.dosage;
    row.querySelector(".med-duration").value = medicine.duration;
  }
  document.getElementById("medRows").appendChild(row);
}

document.getElementById("addMedRow").addEventListener("click", function () {
  addMedicineRow(null);
});

document.getElementById("medRows").addEventListener("click", function (event) {
  var btn = event.target.closest(".remove-med");
  if (!btn) {
    return;
  }
  var row = btn.parentNode;
  row.parentNode.removeChild(row);
});

// ---------- Save prescription ----------
document.getElementById("rxForm").addEventListener("submit", function (event) {
  event.preventDefault();
  if (!currentAppointment) {
    return;
  }

  var medicines = [];
  var rows = document.querySelectorAll("#medRows .med-row");
  for (var i = 0; i < rows.length; i++) {
    var name = rows[i].querySelector(".med-name").value.trim();
    if (name === "") {
      continue;
    }
    medicines.push({
      name: name,
      dosage: rows[i].querySelector(".med-dosage").value.trim() || "-",
      duration: rows[i].querySelector(".med-duration").value.trim() || "-"
    });
  }
  if (medicines.length === 0) {
    showMessage("Please add at least one medicine.", "error");
    return;
  }

  var found = findDoctor(session.doctorId);
  var a = currentAppointment;
  var all = allPrescriptions();
  var existing = null;
  for (var k = 0; k < all.length; k++) {
    if (all[k].appointmentId === a.id) {
      existing = all[k];
    }
  }

  var data = {
    appointmentId: a.id,
    doctorId: session.doctorId,
    doctorName: doctorName(),
    hospitalName: found ? found.hospital.name : a.hospitalName,
    patientEmail: a.userEmail,
    patientName: a.userName,
    date: todayString(),
    diagnosis: document.getElementById("rxDiagnosis").value.trim(),
    medicines: medicines,
    notes: document.getElementById("rxNotes").value.trim(),
    followUp: document.getElementById("rxFollowUp").value
  };

  if (existing) {
    data.id = existing.id;
    for (var j = 0; j < all.length; j++) {
      if (all[j].id === existing.id) {
        all[j] = data;
      }
    }
  } else {
    data.id = makeId("rx");
    all.push(data);
  }
  setData("hms_prescriptions", all);

  // saving a prescription completes the visit
  var appointments = getData("hms_appointments", []);
  for (var n = 0; n < appointments.length; n++) {
    if (appointments[n].id === a.id) {
      appointments[n].status = "Completed";
    }
  }
  setData("hms_appointments", appointments);

  showMessage("Prescription saved. The patient can now see it, and the appointment is marked Completed.", "success");
  currentAppointment = findMyAppointment(a.id);
  renderAll();
  renderHistory(currentAppointment);
});
