// =====================================================
// user.js - Patient module
// search (state, location, disease, budget), compare hospitals, doctors,
// treatment details, booking, feedback, prescriptions, reminders,
// emergency help, voice search and printing
// =====================================================

var session = requireRole("user");

var lastSearch = null;        // { state, location, disease, budget, sort }
var selectedHospital = null;
var selectedDoctor = null;
var bookingDoctor = null;
var compareIds = [];
var feedbackAppointment = null;
var feedbackStars = 0;

var stateSelect = document.getElementById("stateSelect");
var locationSelect = document.getElementById("locationSelect");
var diseaseInput = document.getElementById("diseaseInput");
var budgetInput = document.getElementById("budgetInput");
var sortSelect = document.getElementById("sortSelect");
var searchMessage = document.getElementById("searchMessage");
var hospitalListDiv = document.getElementById("hospitalList");
var doctorListDiv = document.getElementById("doctorList");
var resultsSection = document.getElementById("resultsSection");
var compareSection = document.getElementById("compareSection");
var doctorSection = document.getElementById("doctorSection");
var treatmentSection = document.getElementById("treatmentSection");
var bookingModal = document.getElementById("bookingModal");
var bookingMessage = document.getElementById("bookingMessage");
var bookingDate = document.getElementById("bookingDate");
var bookingTime = document.getElementById("bookingTime");
var printArea = document.getElementById("printArea");

if (session) {
  buildLangSwitcher("langSlot");
  applyTranslations();
  updateWelcome();
  fillStates("");
  fillLocations("");
  renderAppointments();
  renderPrescriptions();
  renderReminders();
  document.getElementById("remStart").value = todayString();
  setupVoice();
  checkReminders(new Date());
  setInterval(function () {
    checkReminders(new Date());
  }, 15000);
}

document.getElementById("logoutBtn").addEventListener("click", logout);

function updateWelcome() {
  if (session) {
    document.getElementById("welcomeText").textContent = t("nav.hello") + ", " + session.name;
  }
}

// Called by i18n.js after the language is changed: redraw everything that is built by script
window.onLanguageChange = function () {
  updateWelcome();
  fillStates(stateSelect.value);
  fillLocations(locationSelect.value);
  if (lastSearch) {
    renderResults();
  }
  if (selectedHospital) {
    showDoctors(true);
  }
  if (selectedDoctor) {
    showTreatment(true);
  }
  if (!compareSection.classList.contains("hidden")) {
    showCompare(true);
  }
  renderAppointments();
  renderPrescriptions();
  renderReminders();
  renderDueBanner();
  if (document.getElementById("emergencyModal").classList.contains("show")) {
    fillEmergencyStates(document.getElementById("emState").value);
    fillEmergencyCities(document.getElementById("emCity").value);
    renderEmergency();
  }
  if (document.getElementById("feedbackModal").classList.contains("show")) {
    drawStars();
  }
};

// ---------- Step indicator ----------
function setStep(number) {
  for (var i = 1; i <= 4; i++) {
    var el = document.getElementById("step" + i);
    if (i <= number) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  }
}

// ---------- Messages ----------
function showSearchMessage(text, type) {
  searchMessage.textContent = text;
  searchMessage.className = "message " + (type || "error");
}

function clearSearchMessage() {
  searchMessage.textContent = "";
  searchMessage.className = "message";
}

function showCompareMessage(text) {
  var box = document.getElementById("compareMessage");
  box.textContent = text;
  box.className = "message error";
}

function clearCompareMessage() {
  var box = document.getElementById("compareMessage");
  box.textContent = "";
  box.className = "message";
}

function formatNumber(n) {
  return Number(n).toLocaleString("en-IN");
}

// ---------- State -> Location -> Disease suggestions ----------
function addUnique(list, value) {
  if (list.indexOf(value) === -1) {
    list.push(value);
  }
}

function fillStates(keep) {
  var hospitals = getData("hms_hospitals", []);
  var states = [];
  for (var i = 0; i < hospitals.length; i++) {
    addUnique(states, hospitals[i].state || "Not specified");
  }
  states.sort();

  var html = '<option value="">' + escapeHtml(t("search.selectState")) + "</option>";
  for (var j = 0; j < states.length; j++) {
    html += '<option value="' + escapeHtml(states[j]) + '">' + escapeHtml(states[j]) + "</option>";
  }
  stateSelect.innerHTML = html;
  stateSelect.value = keep;
}

// Locations (cities) that have hospitals in the chosen state
function fillLocations(keep) {
  var state = stateSelect.value;

  if (state === "") {
    locationSelect.innerHTML = '<option value="">' + escapeHtml(t("search.selectStateFirst")) + "</option>";
    locationSelect.disabled = true;
    fillDiseaseSuggestions("", "");
    return;
  }

  var hospitals = getData("hms_hospitals", []);
  var cities = [];
  for (var i = 0; i < hospitals.length; i++) {
    if ((hospitals[i].state || "Not specified") === state) {
      addUnique(cities, hospitals[i].location);
    }
  }
  cities.sort();

  var html = '<option value="">' + escapeHtml(t("search.selectLocation")) + "</option>";
  for (var j = 0; j < cities.length; j++) {
    html += '<option value="' + escapeHtml(cities[j]) + '">' + escapeHtml(cities[j]) + "</option>";
  }
  locationSelect.innerHTML = html;
  locationSelect.disabled = false;
  locationSelect.value = keep;
  if (locationSelect.value !== keep) {
    locationSelect.value = "";
  }
  fillDiseaseSuggestions(state, locationSelect.value);
}

function fillDiseaseSuggestions(state, city) {
  var hospitals = getData("hms_hospitals", []);
  var diseases = [];
  for (var i = 0; i < hospitals.length; i++) {
    var h = hospitals[i];
    if (state !== "" && (h.state || "Not specified") !== state) {
      continue;
    }
    if (city !== "" && h.location !== city) {
      continue;
    }
    for (var j = 0; j < h.diseases.length; j++) {
      addUnique(diseases, h.diseases[j]);
    }
  }
  diseases.sort();

  var html = "";
  for (var k = 0; k < diseases.length; k++) {
    html += '<option value="' + escapeHtml(diseaseLabel(diseases[k])) + '">';
  }
  document.getElementById("diseaseList").innerHTML = html;
}

stateSelect.addEventListener("change", function () {
  fillLocations("");
});

locationSelect.addEventListener("change", function () {
  fillDiseaseSuggestions(stateSelect.value, locationSelect.value);
});

// ---------- Matching, cost, sorting ----------
function matchesDisease(hospital, query) {
  for (var i = 0; i < hospital.diseases.length; i++) {
    var d = hospital.diseases[i].toLowerCase();
    if (d.indexOf(query) !== -1 || query.indexOf(d) !== -1) {
      return true;
    }
  }
  return false;
}

// Finds the hospitals for a search and adds cost and statistics to each one
function computeResults(search) {
  var query = search.disease.toLowerCase();
  var hospitals = getData("hms_hospitals", []);
  var list = [];
  var hidden = 0;

  for (var i = 0; i < hospitals.length; i++) {
    var h = hospitals[i];
    if ((h.state || "Not specified") !== search.state || h.location !== search.location) {
      continue;
    }
    if (!matchesDisease(h, query)) {
      continue;
    }
    var treatment = bestTreatmentFor(h, query);
    if (search.budget > 0 && (treatment.info === null || treatment.info.costMin > search.budget)) {
      hidden++;
      continue;
    }
    list.push({ hospital: h, disease: treatment.disease, treatment: treatment.info, stats: hospitalStats(h) });
  }

  list.sort(function (a, b) {
    if (search.sort === "cost") {
      var ca = a.treatment ? a.treatment.costMin : 99999999;
      var cb = b.treatment ? b.treatment.costMin : 99999999;
      return ca - cb;
    }
    if (search.sort === "rating") {
      return b.hospital.rating - a.hospital.rating;
    }
    if (search.sort === "experience") {
      return b.stats.topExperience - a.stats.topExperience;
    }
    if (search.sort === "success") {
      return b.stats.topSuccess - a.stats.topSuccess;
    }
    return 0;
  });

  return { list: list, hidden: hidden };
}

// ---------- Step 1 -> 2: search ----------
document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var state = stateSelect.value;
  var location = locationSelect.value;
  var typed = diseaseInput.value.trim();

  if (state === "") {
    showSearchMessage(t("msg.selectState"));
    return;
  }
  if (location === "") {
    showSearchMessage(t("msg.selectLocation", { state: state }));
    return;
  }
  clearSearchMessage();

  var disease = canonicalDisease(typed);
  var budget = Number(budgetInput.value) || 0;
  if (budget < 0) {
    budget = 0;
  }

  lastSearch = { state: state, location: location, disease: disease, budget: budget, sort: sortSelect.value };

  // Remember what was searched (used by the admin analytics)
  var searches = getData("hms_searches", []);
  searches.push({ id: makeId("s"), disease: disease, state: state, location: location, date: todayString(), userEmail: session.email });
  setData("hms_searches", searches);

  selectedHospital = null;
  selectedDoctor = null;
  compareIds = [];
  treatmentSection.classList.add("hidden");
  doctorSection.classList.add("hidden");
  compareSection.classList.add("hidden");
  renderResults();
});

function renderResults() {
  var res = computeResults(lastSearch);
  var list = res.list;

  resultsSection.classList.remove("hidden");

  var title = t("results.title", {
    n: list.length,
    disease: diseaseLabel(lastSearch.disease),
    location: lastSearch.location,
    state: lastSearch.state
  });
  if (res.hidden > 0) {
    title += " - " + t("results.hidden", { n: res.hidden, budget: "₹" + formatNumber(lastSearch.budget) });
  }
  document.getElementById("resultsTitle").textContent = title;

  if (list.length === 0) {
    var emptyKey = res.hidden > 0 ? "results.noneBudget" : "results.none";
    hospitalListDiv.innerHTML = '<div class="empty">' + escapeHtml(t(emptyKey)) + "</div>";
    setStep(1);
    updateCompareBar();
    return;
  }

  var html = "";
  for (var k = 0; k < list.length; k++) {
    var r = list[k].hospital;
    var tr = list[k].treatment;

    var tags = "";
    for (var i = 0; i < r.diseases.length; i++) {
      tags += '<span class="tag">' + escapeHtml(diseaseLabel(r.diseases[i])) + "</span>";
    }

    var costLine = tr
      ? '<p class="cost-line">&#8377;' + formatNumber(tr.costMin) + " - &#8377;" + formatNumber(tr.costMax) + " &middot; " + escapeHtml(durationLabel(tr.duration)) + "</p>"
      : '<p class="muted">' + escapeHtml(t("card.costUnknown")) + "</p>";

    var reviews = r.reviewCount > 0 ? " (" + t("card.reviews", { n: r.reviewCount }) + ")" : "";
    var emergency = r.emergency ? ' <span class="badge no">' + escapeHtml(t("card.emergency")) + "</span>" : "";
    var checked = compareIds.indexOf(r.id) !== -1 ? " checked" : "";
    var selected = selectedHospital && selectedHospital.id === r.id ? " selected" : "";

    html +=
      '<div class="hospital-card' + selected + '" data-id="' + escapeHtml(r.id) + '">' +
      "<h3>" + escapeHtml(r.name) + "</h3>" +
      "<p>" + emergency + "</p>" +
      '<p class="muted">&#128205; ' + escapeHtml(fullAddress(r)) + "</p>" +
      '<p class="muted">&#11088; ' + escapeHtml(t("card.rating")) + ": " + r.rating + escapeHtml(reviews) +
      " &nbsp;|&nbsp; " + escapeHtml(t("card.doctors")) + ": " + r.doctors.length + "</p>" +
      costLine +
      "<div>" + tags + "</div>" +
      '<label class="compare-box"><input type="checkbox" class="compare-check" data-id="' + escapeHtml(r.id) + '"' + checked + "> " +
      escapeHtml(t("card.compare")) + "</label>" +
      '<p class="muted" style="margin-top:8px;">' + escapeHtml(t("card.click")) + "</p>" +
      "</div>";
  }
  hospitalListDiv.innerHTML = html;
  if (!selectedHospital) {
    setStep(2);
  }
  updateCompareBar();
}

// ---------- Compare hospitals ----------
function updateCompareBar() {
  var bar = document.getElementById("compareBar");
  if (compareIds.length === 0) {
    bar.classList.add("hidden");
    return;
  }
  bar.classList.remove("hidden");
  document.getElementById("compareCount").textContent = t("compare.count", { n: compareIds.length });
  document.getElementById("compareBtn").disabled = compareIds.length < 2;
}

hospitalListDiv.addEventListener("change", function (event) {
  var box = event.target;
  if (!box.classList.contains("compare-check")) {
    return;
  }
  var id = box.getAttribute("data-id");
  if (box.checked) {
    if (compareIds.length >= 3) {
      box.checked = false;
      showCompareMessage(t("compare.max"));
      return;
    }
    compareIds.push(id);
  } else {
    var kept = [];
    for (var i = 0; i < compareIds.length; i++) {
      if (compareIds[i] !== id) {
        kept.push(compareIds[i]);
      }
    }
    compareIds = kept;
  }
  clearCompareMessage();
  updateCompareBar();
});

document.getElementById("clearCompare").addEventListener("click", function () {
  compareIds = [];
  clearCompareMessage();
  var boxes = hospitalListDiv.querySelectorAll(".compare-check");
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = false;
  }
  updateCompareBar();
  compareSection.classList.add("hidden");
});

document.getElementById("compareBtn").addEventListener("click", function () {
  if (compareIds.length < 2) {
    showCompareMessage(t("compare.min"));
    return;
  }
  showCompare(false);
});

function showCompare(noScroll) {
  if (!lastSearch) {
    return;
  }
  var all = computeResults(lastSearch).list;
  var items = [];
  for (var i = 0; i < all.length; i++) {
    if (compareIds.indexOf(all[i].hospital.id) !== -1) {
      items.push(all[i]);
    }
  }
  if (items.length < 2) {
    compareSection.classList.add("hidden");
    return;
  }

  // Find the best value of each measure, to give badges
  var cheapest = 99999999;
  var bestRating = 0;
  var bestSuccess = 0;
  for (var a = 0; a < items.length; a++) {
    if (items[a].treatment && items[a].treatment.costMin < cheapest) {
      cheapest = items[a].treatment.costMin;
    }
    if (items[a].hospital.rating > bestRating) {
      bestRating = items[a].hospital.rating;
    }
    if (items[a].stats.topSuccess > bestSuccess) {
      bestSuccess = items[a].stats.topSuccess;
    }
  }

  var head = "<tr><th></th>";
  var rows = {
    location: "<tr><th>" + escapeHtml(t("compare.location")) + "</th>",
    rating: "<tr><th>" + escapeHtml(t("compare.rating")) + "</th>",
    cost: "<tr><th>" + escapeHtml(t("compare.cost")) + "</th>",
    duration: "<tr><th>" + escapeHtml(t("compare.duration")) + "</th>",
    doctors: "<tr><th>" + escapeHtml(t("compare.doctors")) + "</th>",
    success: "<tr><th>" + escapeHtml(t("compare.topSuccess")) + "</th>",
    experience: "<tr><th>" + escapeHtml(t("compare.topExperience")) + "</th>",
    emergency: "<tr><th>" + escapeHtml(t("compare.emergency")) + "</th>"
  };

  for (var k = 0; k < items.length; k++) {
    var h = items[k].hospital;
    var tr = items[k].treatment;
    var st = items[k].stats;

    var badges = "";
    if (tr && tr.costMin === cheapest) {
      badges += '<span class="badge ok">' + escapeHtml(t("badge.cheapest")) + "</span> ";
    }
    if (h.rating === bestRating) {
      badges += '<span class="badge ok">' + escapeHtml(t("badge.bestRated")) + "</span> ";
    }
    if (st.topSuccess === bestSuccess) {
      badges += '<span class="badge ok">' + escapeHtml(t("badge.bestSuccess")) + "</span>";
    }

    head += "<th><div>" + escapeHtml(h.name) + "</div><div class=\"badge-row\">" + badges + "</div>" +
      '<button class="btn btn-small view-hospital" data-id="' + escapeHtml(h.id) + '">' + escapeHtml(t("compare.view")) + "</button></th>";

    rows.location += "<td>" + escapeHtml(fullAddress(h)) + "</td>";
    rows.rating += "<td>" + h.rating + (h.reviewCount > 0 ? " (" + escapeHtml(t("card.reviews", { n: h.reviewCount })) + ")" : "") + "</td>";
    rows.cost += "<td>" + (tr ? "&#8377;" + formatNumber(tr.costMin) + " - &#8377;" + formatNumber(tr.costMax) : escapeHtml(t("card.costUnknown"))) + "</td>";
    rows.duration += "<td>" + (tr ? escapeHtml(durationLabel(tr.duration)) : "-") + "</td>";
    rows.doctors += "<td>" + st.doctorCount + " (" + st.availableCount + " " + escapeHtml(t("compare.availableNow")) + ")</td>";
    rows.success += "<td>" + st.topSuccess + "%</td>";
    rows.experience += "<td>" + st.topExperience + " " + escapeHtml(t("doc.years")) + (st.topDoctor ? " - " + escapeHtml(st.topDoctor) : "") + "</td>";
    rows.emergency += "<td>" + escapeHtml(h.emergency ? t("common.yes") : t("common.no")) + "</td>";
  }

  var html = '<p class="muted">' + escapeHtml(t("compare.for", { disease: diseaseLabel(lastSearch.disease) })) + "</p>" +
    "<table class=\"compare-table\"><thead>" + head + "</tr></thead><tbody>" +
    rows.location + "</tr>" + rows.rating + "</tr>" + rows.cost + "</tr>" + rows.duration + "</tr>" +
    rows.doctors + "</tr>" + rows.success + "</tr>" + rows.experience + "</tr>" + rows.emergency + "</tr></tbody></table>";

  document.getElementById("compareTable").innerHTML = html;
  compareSection.classList.remove("hidden");
  if (!noScroll) {
    compareSection.scrollIntoView({ behavior: "smooth" });
  }
}

document.getElementById("compareTable").addEventListener("click", function (event) {
  var btn = event.target.closest(".view-hospital");
  if (!btn) {
    return;
  }
  chooseHospital(btn.getAttribute("data-id"));
});

// ---------- Step 2 -> 3: click a hospital ----------
hospitalListDiv.addEventListener("click", function (event) {
  if (event.target.closest(".compare-box")) {
    return;
  }
  var card = event.target.closest(".hospital-card");
  if (!card) {
    return;
  }
  chooseHospital(card.getAttribute("data-id"));
});

function chooseHospital(id) {
  var hospitals = getData("hms_hospitals", []);
  selectedHospital = null;
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].id === id) {
      selectedHospital = hospitals[i];
    }
  }
  if (!selectedHospital) {
    return;
  }

  var allCards = hospitalListDiv.querySelectorAll(".hospital-card");
  for (var c = 0; c < allCards.length; c++) {
    if (allCards[c].getAttribute("data-id") === id) {
      allCards[c].classList.add("selected");
    } else {
      allCards[c].classList.remove("selected");
    }
  }

  showDoctors(false);
}

function showDoctors(noScroll) {
  var h = selectedHospital;
  if (!noScroll) {
    selectedDoctor = null;
    treatmentSection.classList.add("hidden");
  }
  document.getElementById("doctorTitle").textContent = t("doc.titleAt", { name: h.name });

  var emergencyLine = "";
  if (h.emergency) {
    emergencyLine = '<p><span class="badge no">' + escapeHtml(t("loc.emergency")) + "</span>" +
      (h.ambulance ? ' &nbsp;<a class="map-link" href="tel:' + escapeHtml(h.ambulance.replace(/\s/g, "")) + '">&#128222; ' +
        escapeHtml(t("loc.ambulance")) + ": " + escapeHtml(h.ambulance) + "</a>" : "") + "</p>";
  }

  // Hospital location
  document.getElementById("hospitalInfo").innerHTML =
    '<div class="location-title">&#128205; ' + escapeHtml(t("loc.title")) + "</div>" +
    "<p><strong>" + escapeHtml(h.name) + "</strong></p>" +
    "<p>" + escapeHtml(fullAddress(h)) + "</p>" +
    '<p class="muted">' + escapeHtml(t("loc.location")) + ": " + escapeHtml(h.location) + " &nbsp;|&nbsp; " +
    escapeHtml(t("loc.state")) + ": " + escapeHtml(h.state || "Not specified") + "</p>" +
    emergencyLine +
    '<a class="map-link" href="' + mapLink(h) + '" target="_blank" rel="noopener">' + escapeHtml(t("loc.map")) + "</a>";

  if (h.doctors.length === 0) {
    doctorListDiv.innerHTML = '<div class="empty">' + escapeHtml(t("doc.none")) + "</div>";
  } else {
    var html = "";
    for (var i = 0; i < h.doctors.length; i++) {
      var d = h.doctors[i];
      var badge = d.available
        ? '<span class="badge ok">' + escapeHtml(t("doc.available")) + "</span>"
        : '<span class="badge no">' + escapeHtml(t("doc.notAvailable")) + "</span>";
      var button = d.available
        ? '<button class="btn btn-small book-btn" data-id="' + escapeHtml(d.id) + '">' + escapeHtml(t("doc.book")) + "</button>"
        : '<button class="btn btn-small" disabled>' + escapeHtml(t("doc.notAvailable")) + "</button>";
      var sel = selectedDoctor && selectedDoctor.id === d.id ? " selected" : "";

      html +=
        '<div class="doctor-card' + sel + '" data-id="' + escapeHtml(d.id) + '">' +
        "<h3>" + escapeHtml(d.name) + "</h3>" +
        '<p class="muted">' + escapeHtml(d.designation) + "</p>" +
        "<p><strong>" + escapeHtml(t("doc.experience")) + ":</strong> " + d.experience + " " + escapeHtml(t("doc.years")) + "</p>" +
        "<p><strong>" + escapeHtml(t("doc.success")) + ":</strong> " + d.successRate + "%</p>" +
        '<div class="bar"><div class="bar-fill" style="width:' + d.successRate + '%"></div></div>' +
        "<p><strong>" + escapeHtml(t("doc.timings")) + ":</strong> " + escapeHtml(d.timings) + "</p>" +
        "<p>" + badge + "</p>" +
        '<button class="btn btn-light btn-small treat-btn" style="border:1px solid #e2e8f0;" data-id="' + escapeHtml(d.id) + '">' +
        escapeHtml(t("doc.viewTreatment")) + "</button>" +
        button +
        "</div>";
    }
    doctorListDiv.innerHTML = html;
  }

  doctorSection.classList.remove("hidden");
  if (!noScroll) {
    setStep(3);
    doctorSection.scrollIntoView({ behavior: "smooth" });
  }
}

// ---------- Treatment details (shown after choosing hospital and doctor) ----------
function matchedDiseases(hospital, query) {
  var list = [];
  for (var i = 0; i < hospital.diseases.length; i++) {
    var d = hospital.diseases[i].toLowerCase();
    if (d.indexOf(query) !== -1 || query.indexOf(d) !== -1) {
      list.push(hospital.diseases[i]);
    }
  }
  return list;
}

doctorListDiv.addEventListener("click", function (event) {
  var btn = event.target.closest(".treat-btn");
  if (!btn) {
    return;
  }
  var id = btn.getAttribute("data-id");
  for (var i = 0; i < selectedHospital.doctors.length; i++) {
    if (selectedHospital.doctors[i].id === id) {
      selectedDoctor = selectedHospital.doctors[i];
    }
  }

  var allCards = doctorListDiv.querySelectorAll(".doctor-card");
  for (var c = 0; c < allCards.length; c++) {
    allCards[c].classList.remove("selected");
  }
  btn.closest(".doctor-card").classList.add("selected");

  showTreatment(false);
});

function showTreatment(noScroll) {
  var h = selectedHospital;
  var d = selectedDoctor;
  var names = matchedDiseases(h, lastSearch ? lastSearch.disease.toLowerCase() : "");

  var html =
    '<p class="muted"><strong>' + escapeHtml(d.name) + "</strong> (" + escapeHtml(d.designation) + ") - " +
    escapeHtml(h.name) + ", " + escapeHtml(h.location) + "</p><br>";

  for (var i = 0; i < names.length; i++) {
    var info = getTreatmentInfo(h, names[i]);
    html += '<div class="treatment-block"><h3>' + escapeHtml(diseaseLabel(names[i])) + "</h3>";
    if (info === null) {
      html += '<p class="muted">' + escapeHtml(t("treat.confirm")) + "</p>";
    } else {
      var meds = "";
      for (var m = 0; m < info.medicines.length; m++) {
        meds += '<span class="tag">' + escapeHtml(info.medicines[m]) + "</span>";
      }
      html +=
        '<div class="info-grid">' +
        '<div class="info-tile"><div class="info-label">' + escapeHtml(t("treat.cost")) + '</div><div class="info-value">' +
        formatRupees(info.costMin) + " - " + formatRupees(info.costMax) + "</div></div>" +
        '<div class="info-tile"><div class="info-label">' + escapeHtml(t("treat.duration")) + '</div><div class="info-value">' +
        escapeHtml(durationLabel(info.duration)) + "</div></div>" +
        '<div class="info-tile wide"><div class="info-label">' + escapeHtml(t("treat.medicines")) + "</div><div>" + meds + "</div></div>" +
        "</div>";
    }
    html += "</div>";
  }

  html += '<p class="note">' + escapeHtml(t("treat.note")) + "</p>";

  if (d.available) {
    html += '<button class="btn book-btn" data-id="' + escapeHtml(d.id) + '">' + escapeHtml(t("treat.book", { name: d.name })) + "</button>";
  } else {
    html += '<span class="badge no">' + escapeHtml(t("treat.notAvail")) + "</span>";
  }

  document.getElementById("treatmentContent").innerHTML = html;
  treatmentSection.classList.remove("hidden");
  if (!noScroll) {
    setStep(4);
    treatmentSection.scrollIntoView({ behavior: "smooth" });
  }
}

// ---------- Time slots ----------
// Time labels already booked (and not cancelled) for a doctor on a date
function takenTimes(doctorId, dateStr) {
  var all = getData("hms_appointments", []);
  var taken = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].doctorId === doctorId && all[i].date === dateStr && all[i].status !== "Cancelled" && all[i].time) {
      taken.push(all[i].time);
    }
  }
  return taken;
}

// Returns null when the doctor does not work that weekday,
// otherwise a list of { label, taken } for that date.
function getSlotsForDate(doctor, dateStr) {
  var day = parseDateString(dateStr);
  if (!worksOnDay(doctor.timings, day.getDay())) {
    return null;
  }

  var now = new Date();
  var isToday = dateStr === todayString();
  var nowMinutes = now.getHours() * 60 + now.getMinutes();
  var taken = takenTimes(doctor.id, dateStr);

  var slots = getSlots(doctor.timings);
  var result = [];
  for (var i = 0; i < slots.length; i++) {
    if (isToday && slots[i] <= nowMinutes) {
      continue; // time already passed today
    }
    var label = minutesToLabel(slots[i]);
    result.push({ label: label, taken: taken.indexOf(label) !== -1 });
  }
  return result;
}

function hasFreeSlot(slots) {
  for (var i = 0; i < slots.length; i++) {
    if (!slots[i].taken) {
      return true;
    }
  }
  return false;
}

// First date (from today) when the doctor works and has a free slot
function firstBookableDate(doctor) {
  var now = new Date();
  for (var i = 0; i < 30; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    var dateStr = dateToString(d);
    var slots = getSlotsForDate(doctor, dateStr);
    if (slots !== null && hasFreeSlot(slots)) {
      return dateStr;
    }
  }
  return todayString();
}

function showBookingError(text) {
  bookingMessage.textContent = text;
  bookingMessage.className = "message error";
}

function clearBookingMessage() {
  bookingMessage.textContent = "";
  bookingMessage.className = "message";
}

function refreshSlots() {
  clearBookingMessage();
  var date = bookingDate.value;

  if (!date) {
    bookingTime.innerHTML = '<option value="">' + escapeHtml(t("book.chooseDateFirst")) + "</option>";
    return;
  }

  var slots = getSlotsForDate(bookingDoctor, date);
  if (slots === null) {
    var dayName = t("day." + parseDateString(date).getDay());
    bookingTime.innerHTML = '<option value="">' + escapeHtml(t("book.noSlots")) + "</option>";
    showBookingError(t("book.notOnDay", { name: bookingDoctor.name, day: dayName, timings: bookingDoctor.timings }));
    return;
  }

  var html = "";
  var firstFree = "";
  for (var i = 0; i < slots.length; i++) {
    html += '<option value="' + slots[i].label + '"' + (slots[i].taken ? " disabled" : "") + ">" +
      slots[i].label + (slots[i].taken ? " (" + escapeHtml(t("book.booked")) + ")" : "") + "</option>";
    if (!slots[i].taken && firstFree === "") {
      firstFree = slots[i].label;
    }
  }

  if (firstFree === "") {
    bookingTime.innerHTML = '<option value="">' + escapeHtml(t("book.noSlots")) + "</option>";
    showBookingError(t("book.noFree"));
    return;
  }

  bookingTime.innerHTML = html;
  bookingTime.value = firstFree;
}

// ---------- Booking ----------
function openBooking(doctorId) {
  for (var i = 0; i < selectedHospital.doctors.length; i++) {
    if (selectedHospital.doctors[i].id === doctorId) {
      bookingDoctor = selectedHospital.doctors[i];
    }
  }

  document.getElementById("bookingInfo").innerHTML =
    "<strong>" + escapeHtml(bookingDoctor.name) + "</strong> (" + escapeHtml(bookingDoctor.designation) + ")<br>" +
    escapeHtml(selectedHospital.name) + "<br>" +
    "&#128205; " + escapeHtml(fullAddress(selectedHospital)) + "<br>" +
    escapeHtml(t("doc.timings")) + ": " + escapeHtml(bookingDoctor.timings);

  bookingDate.min = todayString();
  bookingDate.value = firstBookableDate(bookingDoctor);
  refreshSlots();
  bookingModal.classList.add("show");
}

doctorListDiv.addEventListener("click", function (event) {
  var btn = event.target.closest(".book-btn");
  if (btn) {
    openBooking(btn.getAttribute("data-id"));
  }
});

document.getElementById("treatmentContent").addEventListener("click", function (event) {
  var btn = event.target.closest(".book-btn");
  if (btn) {
    openBooking(btn.getAttribute("data-id"));
  }
});

bookingDate.addEventListener("change", refreshSlots);

document.getElementById("cancelBooking").addEventListener("click", function () {
  bookingModal.classList.remove("show");
});

document.getElementById("confirmBooking").addEventListener("click", function () {
  var date = bookingDate.value;
  var time = bookingTime.value;

  if (!date) {
    showBookingError(t("book.pickDate"));
    return;
  }
  if (date < todayString()) {
    showBookingError(t("book.past"));
    return;
  }

  var slots = getSlotsForDate(bookingDoctor, date);
  if (slots === null) {
    refreshSlots();
    return;
  }
  if (time === "") {
    showBookingError(t("book.pickTime"));
    return;
  }

  var slotOk = false;
  for (var s = 0; s < slots.length; s++) {
    if (slots[s].label === time && !slots[s].taken) {
      slotOk = true;
    }
  }
  if (!slotOk) {
    refreshSlots();
    showBookingError(t("book.slotGone"));
    return;
  }

  var appointments = getData("hms_appointments", []);
  for (var i = 0; i < appointments.length; i++) {
    var a = appointments[i];
    if (a.userEmail === session.email && a.doctorId === bookingDoctor.id &&
        a.date === date && a.status !== "Cancelled") {
      showBookingError(t("book.duplicate"));
      return;
    }
  }

  appointments.push({
    id: makeId("a"),
    userEmail: session.email,
    userName: session.name,
    hospitalId: selectedHospital.id,
    hospitalName: selectedHospital.name,
    hospitalLocation: fullAddress(selectedHospital),
    doctorId: bookingDoctor.id,
    doctorName: bookingDoctor.name,
    doctorDesignation: bookingDoctor.designation,
    disease: lastSearch ? lastSearch.disease : diseaseInput.value.trim(),
    date: date,
    time: time,
    status: "Booked"
  });
  setData("hms_appointments", appointments);

  bookingModal.classList.remove("show");
  renderAppointments();

  var box = document.getElementById("appointmentMessage");
  box.textContent = t("book.done", { name: bookingDoctor.name, date: formatDate(date), time: time });
  box.className = "message success";
  document.getElementById("appointmentSection").scrollIntoView({ behavior: "smooth" });
});

// ---------- My appointments ----------
function myAppointments() {
  var all = getData("hms_appointments", []);
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].userEmail === session.email) {
      mine.push(all[i]);
    }
  }
  return mine;
}

function feedbackFor(appointmentId) {
  var all = getData("hms_feedback", []);
  for (var i = 0; i < all.length; i++) {
    if (all[i].appointmentId === appointmentId) {
      return all[i];
    }
  }
  return null;
}

function prescriptionForAppointment(appointmentId) {
  var all = getData("hms_prescriptions", []);
  for (var i = 0; i < all.length; i++) {
    if (all[i].appointmentId === appointmentId) {
      return all[i];
    }
  }
  return null;
}

function renderAppointments() {
  var mine = myAppointments();
  var box = document.getElementById("appointmentTable");

  if (mine.length === 0) {
    box.innerHTML = '<div class="empty">' + escapeHtml(t("appt.none")) + "</div>";
    return;
  }

  var html =
    "<table><thead><tr><th>" + escapeHtml(t("appt.date")) + "</th><th>" + escapeHtml(t("appt.time")) + "</th><th>" +
    escapeHtml(t("appt.hospital")) + "</th><th>" + escapeHtml(t("appt.doctor")) + "</th><th>" + escapeHtml(t("appt.disease")) +
    "</th><th>" + escapeHtml(t("appt.status")) + "</th><th></th></tr></thead><tbody>";
  for (var k = 0; k < mine.length; k++) {
    var m = mine[k];
    var cls = "ok";
    if (m.status === "Cancelled") {
      cls = "no";
    } else if (m.status === "Booked") {
      cls = "warn";
    }

    var actions = "";
    if (m.status === "Booked") {
      actions += '<button class="btn btn-danger btn-small cancel-appt" data-id="' + escapeHtml(m.id) + '">' + escapeHtml(t("btn.cancel")) + "</button> ";
    }
    if (m.status !== "Cancelled") {
      actions += '<button class="btn btn-light btn-small slip-btn" style="border:1px solid #e2e8f0;" data-id="' + escapeHtml(m.id) + '">' +
        escapeHtml(t("btn.slip")) + "</button> ";
    }
    if (prescriptionForAppointment(m.id)) {
      actions += '<button class="btn btn-light btn-small rx-link" style="border:1px solid #e2e8f0;" data-id="' + escapeHtml(m.id) + '">' +
        escapeHtml(t("btn.prescription")) + "</button> ";
    }
    if (m.status === "Completed") {
      var fb = feedbackFor(m.id);
      if (fb) {
        actions += '<span class="badge ok">' + escapeHtml(t("fb.rated", { n: fb.rating })) + "</span>";
      } else {
        actions += '<button class="btn btn-small rate-btn" data-id="' + escapeHtml(m.id) + '">' + escapeHtml(t("btn.rate")) + "</button>";
      }
    }

    var place = m.hospitalLocation
      ? '<br><span class="muted">&#128205; ' + escapeHtml(m.hospitalLocation) + "</span>"
      : "";
    html +=
      "<tr><td>" + escapeHtml(formatDate(m.date)) + "</td><td>" + escapeHtml(m.time || "-") + "</td><td>" +
      escapeHtml(m.hospitalName) + place + "</td><td>" +
      escapeHtml(m.doctorName) + "</td><td>" + escapeHtml(diseaseLabel(m.disease)) + '</td><td><span class="badge ' + cls + '">' +
      escapeHtml(t("status." + m.status)) + "</span></td><td>" + actions + "</td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

function findMyAppointment(id) {
  var mine = myAppointments();
  for (var i = 0; i < mine.length; i++) {
    if (mine[i].id === id) {
      return mine[i];
    }
  }
  return null;
}

document.getElementById("appointmentTable").addEventListener("click", function (event) {
  var cancelBtn = event.target.closest(".cancel-appt");
  var slipBtn = event.target.closest(".slip-btn");
  var rateBtn = event.target.closest(".rate-btn");
  var rxBtn = event.target.closest(".rx-link");

  if (cancelBtn) {
    var id = cancelBtn.getAttribute("data-id");
    var all = getData("hms_appointments", []);
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) {
        all[i].status = "Cancelled";
      }
    }
    setData("hms_appointments", all);
    renderAppointments();
    document.getElementById("appointmentMessage").className = "message";
  } else if (slipBtn) {
    printSlip(slipBtn.getAttribute("data-id"));
  } else if (rateBtn) {
    openFeedback(rateBtn.getAttribute("data-id"));
  } else if (rxBtn) {
    var card = document.getElementById("rx-" + rxBtn.getAttribute("data-id"));
    if (card) {
      card.scrollIntoView({ behavior: "smooth" });
      card.classList.add("flash");
      setTimeout(function () {
        card.classList.remove("flash");
      }, 1800);
    }
  }
});

// ---------- Printable appointment slip ----------
function slipRow(label, value) {
  return "<tr><th>" + escapeHtml(label) + "</th><td>" + value + "</td></tr>";
}

function printSlip(appointmentId) {
  var a = findMyAppointment(appointmentId);
  if (!a) {
    return;
  }
  var found = findDoctor(a.doctorId);
  var hospital = a.hospitalId ? findHospitalById(a.hospitalId) : findHospitalByName(a.hospitalName);
  var designation = a.doctorDesignation || (found ? found.doctor.designation : "");
  var address = a.hospitalLocation || (hospital ? fullAddress(hospital) : "");

  printArea.innerHTML =
    '<div class="slip">' +
    "<h1>&#10010; " + escapeHtml(t("app.title")) + "</h1>" +
    "<h2>" + escapeHtml(t("slip.title")) + "</h2>" +
    '<table class="slip-table">' +
    slipRow(t("slip.number"), "<strong>" + escapeHtml(slipNumber(a.id)) + "</strong>") +
    slipRow(t("slip.patient"), escapeHtml(a.userName)) +
    slipRow(t("slip.hospital"), escapeHtml(a.hospitalName)) +
    slipRow(t("slip.address"), escapeHtml(address)) +
    slipRow(t("slip.doctor"), escapeHtml(a.doctorName) + (designation ? " (" + escapeHtml(designation) + ")" : "")) +
    slipRow(t("slip.date"), escapeHtml(formatDate(a.date))) +
    slipRow(t("slip.time"), escapeHtml(a.time || "-")) +
    slipRow(t("slip.disease"), escapeHtml(diseaseLabel(a.disease))) +
    slipRow(t("slip.status"), escapeHtml(t("status." + a.status))) +
    "</table>" +
    '<p class="slip-note">' + escapeHtml(t("slip.note")) + "</p>" +
    "</div>";
  window.print();
}

// ---------- Feedback after treatment ----------
function openFeedback(appointmentId) {
  feedbackAppointment = findMyAppointment(appointmentId);
  if (!feedbackAppointment) {
    return;
  }
  feedbackStars = 0;
  document.getElementById("feedbackComment").value = "";
  document.getElementById("feedbackMessage").className = "message";
  document.getElementById("feedbackInfo").textContent =
    feedbackAppointment.hospitalName + " - " + feedbackAppointment.doctorName + ", " + formatDate(feedbackAppointment.date);
  drawStars();
  document.getElementById("feedbackModal").classList.add("show");
}

function drawStars() {
  var html = "";
  for (var i = 1; i <= 5; i++) {
    html += '<button type="button" class="star' + (i <= feedbackStars ? " on" : "") + '" data-stars="' + i + '" aria-label="' + i + ' / 5">' +
      (i <= feedbackStars ? "★" : "☆") + "</button>";
  }
  document.getElementById("starRow").innerHTML = html;
}

document.getElementById("starRow").addEventListener("click", function (event) {
  var btn = event.target.closest(".star");
  if (!btn) {
    return;
  }
  feedbackStars = Number(btn.getAttribute("data-stars"));
  drawStars();
});

document.getElementById("cancelFeedback").addEventListener("click", function () {
  document.getElementById("feedbackModal").classList.remove("show");
});

document.getElementById("submitFeedback").addEventListener("click", function () {
  var box = document.getElementById("feedbackMessage");
  if (feedbackStars < 1) {
    box.textContent = t("fb.pickStars");
    box.className = "message error";
    return;
  }
  if (feedbackFor(feedbackAppointment.id)) {
    document.getElementById("feedbackModal").classList.remove("show");
    return;
  }

  var hospital = feedbackAppointment.hospitalId
    ? findHospitalById(feedbackAppointment.hospitalId)
    : findHospitalByName(feedbackAppointment.hospitalName);

  var all = getData("hms_feedback", []);
  all.push({
    id: makeId("f"),
    appointmentId: feedbackAppointment.id,
    hospitalId: hospital ? hospital.id : "",
    hospitalName: feedbackAppointment.hospitalName,
    doctorId: feedbackAppointment.doctorId,
    doctorName: feedbackAppointment.doctorName,
    userEmail: session.email,
    userName: session.name,
    rating: feedbackStars,
    comment: document.getElementById("feedbackComment").value.trim(),
    date: todayString()
  });
  setData("hms_feedback", all);

  if (hospital) {
    addHospitalReview(hospital.id, feedbackStars);
  }

  document.getElementById("feedbackModal").classList.remove("show");
  renderAppointments();
  if (lastSearch) {
    renderResults();
  }
  var msg = document.getElementById("appointmentMessage");
  msg.textContent = t("fb.thanks");
  msg.className = "message success";
});

// ---------- My prescriptions ----------
function myPrescriptions() {
  var all = getData("hms_prescriptions", []);
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].patientEmail === session.email) {
      mine.push(all[i]);
    }
  }
  mine.sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });
  return mine;
}

function renderPrescriptions() {
  var mine = myPrescriptions();
  var box = document.getElementById("prescriptionList");

  if (mine.length === 0) {
    box.innerHTML = '<div class="empty">' + escapeHtml(t("rx.none")) + "</div>";
    return;
  }

  var html = "";
  for (var i = 0; i < mine.length; i++) {
    var p = mine[i];
    var rows = "";
    for (var m = 0; m < p.medicines.length; m++) {
      rows += "<tr><td>" + escapeHtml(p.medicines[m].name) + "</td><td>" + escapeHtml(p.medicines[m].dosage) + "</td><td>" +
        escapeHtml(p.medicines[m].duration) + '</td><td><button class="btn btn-light btn-small add-reminder" style="border:1px solid #e2e8f0;" data-name="' +
        escapeHtml(p.medicines[m].name) + '">' + escapeHtml(t("rx.addReminder")) + "</button></td></tr>";
    }
    html +=
      '<div class="treatment-block" id="rx-' + escapeHtml(p.appointmentId) + '">' +
      "<h3>" + escapeHtml(p.doctorName) + " - " + escapeHtml(p.hospitalName) + "</h3>" +
      '<p class="muted">' + escapeHtml(formatDate(p.date)) + "</p>" +
      "<p><strong>" + escapeHtml(t("rx.diagnosis")) + ":</strong> " + escapeHtml(p.diagnosis) + "</p>" +
      '<div class="table-wrap"><table><thead><tr><th>' + escapeHtml(t("rx.medicine")) + "</th><th>" + escapeHtml(t("rx.dosage")) +
      "</th><th>" + escapeHtml(t("rx.duration")) + "</th><th></th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
      (p.notes ? "<p><strong>" + escapeHtml(t("rx.notes")) + ":</strong> " + escapeHtml(p.notes) + "</p>" : "") +
      (p.followUp ? "<p><strong>" + escapeHtml(t("rx.followUp")) + ":</strong> " + escapeHtml(formatDate(p.followUp)) + "</p>" : "") +
      '<button class="btn btn-light btn-small print-rx" style="border:1px solid #e2e8f0;margin-top:8px;" data-id="' + escapeHtml(p.id) + '">' +
      escapeHtml(t("rx.print")) + "</button>" +
      "</div>";
  }
  box.innerHTML = html;
}

document.getElementById("prescriptionList").addEventListener("click", function (event) {
  var remBtn = event.target.closest(".add-reminder");
  var printBtn = event.target.closest(".print-rx");

  if (remBtn) {
    document.getElementById("remMedicine").value = remBtn.getAttribute("data-name");
    document.getElementById("reminderSection").scrollIntoView({ behavior: "smooth" });
    document.getElementById("remTime").focus();
  } else if (printBtn) {
    printPrescription(printBtn.getAttribute("data-id"));
  }
});

function printPrescription(id) {
  var mine = myPrescriptions();
  var p = null;
  for (var i = 0; i < mine.length; i++) {
    if (mine[i].id === id) {
      p = mine[i];
    }
  }
  if (!p) {
    return;
  }

  var rows = "";
  for (var m = 0; m < p.medicines.length; m++) {
    rows += "<tr><td>" + escapeHtml(p.medicines[m].name) + "</td><td>" + escapeHtml(p.medicines[m].dosage) + "</td><td>" +
      escapeHtml(p.medicines[m].duration) + "</td></tr>";
  }

  printArea.innerHTML =
    '<div class="slip">' +
    "<h1>&#10010; " + escapeHtml(t("app.title")) + "</h1>" +
    "<h2>" + escapeHtml(t("rx.printTitle")) + "</h2>" +
    '<table class="slip-table">' +
    slipRow(t("slip.patient"), escapeHtml(p.patientName)) +
    slipRow(t("slip.doctor"), escapeHtml(p.doctorName)) +
    slipRow(t("slip.hospital"), escapeHtml(p.hospitalName)) +
    slipRow(t("slip.date"), escapeHtml(formatDate(p.date))) +
    slipRow(t("rx.diagnosis"), escapeHtml(p.diagnosis)) +
    "</table>" +
    '<table class="slip-table meds"><thead><tr><th>' + escapeHtml(t("rx.medicine")) + "</th><th>" + escapeHtml(t("rx.dosage")) +
    "</th><th>" + escapeHtml(t("rx.duration")) + "</th></tr></thead><tbody>" + rows + "</tbody></table>" +
    (p.notes ? "<p><strong>" + escapeHtml(t("rx.notes")) + ":</strong> " + escapeHtml(p.notes) + "</p>" : "") +
    (p.followUp ? "<p><strong>" + escapeHtml(t("rx.followUp")) + ":</strong> " + escapeHtml(formatDate(p.followUp)) + "</p>" : "") +
    "</div>";
  window.print();
}

// ---------- Medicine reminders ----------
function myReminders() {
  var all = getData("hms_reminders", []);
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].userEmail === session.email) {
      mine.push(all[i]);
    }
  }
  mine.sort(function (a, b) {
    return a.time < b.time ? -1 : 1;
  });
  return mine;
}

function showReminderMessage(text, type) {
  var box = document.getElementById("reminderMessage");
  box.textContent = text;
  box.className = "message " + type;
}

document.getElementById("reminderForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var medicine = document.getElementById("remMedicine").value.trim();
  var time = document.getElementById("remTime").value;
  var start = document.getElementById("remStart").value || todayString();
  var end = document.getElementById("remEnd").value;

  if (medicine === "" || time === "") {
    return;
  }
  if (end !== "" && end < start) {
    showReminderMessage(t("rem.badDates"), "error");
    return;
  }

  var all = getData("hms_reminders", []);
  all.push({
    id: makeId("r"),
    userEmail: session.email,
    medicine: medicine,
    time: time,
    startDate: start,
    endDate: end,
    active: true,
    lastFired: "",
    doneDate: ""
  });
  setData("hms_reminders", all);

  document.getElementById("reminderForm").reset();
  document.getElementById("remTime").value = "08:00";
  document.getElementById("remStart").value = todayString();
  showReminderMessage(t("rem.added"), "success");
  renderReminders();
  checkReminders(new Date());
});

function renderReminders() {
  var mine = myReminders();
  var box = document.getElementById("reminderTable");
  var today = todayString();

  if (mine.length === 0) {
    box.innerHTML = '<div class="empty">' + escapeHtml(t("rem.none")) + "</div>";
    return;
  }

  var html =
    "<table><thead><tr><th>" + escapeHtml(t("rem.medicine")) + "</th><th>" + escapeHtml(t("rem.timeShort")) + "</th><th>" +
    escapeHtml(t("rem.dates")) + "</th><th>" + escapeHtml(t("rem.today")) + "</th><th></th></tr></thead><tbody>";
  for (var i = 0; i < mine.length; i++) {
    var r = mine[i];
    var state = "";
    if (!r.active) {
      state = '<span class="badge no">' + escapeHtml(t("rem.paused")) + "</span>";
    } else if (r.doneDate === today) {
      state = '<span class="badge ok">' + escapeHtml(t("rem.doneToday")) + "</span>";
    } else if (r.lastFired === today) {
      state = '<span class="badge warn">' + escapeHtml(t("rem.dueNow")) + "</span>";
    } else {
      state = '<span class="muted">' + escapeHtml(t("rem.upcoming")) + "</span>";
    }
    var dates = formatDate(r.startDate) + (r.endDate ? " - " + formatDate(r.endDate) : " - ...");
    html +=
      "<tr><td>" + escapeHtml(r.medicine) + "</td><td>" + escapeHtml(r.time) + "</td><td>" + escapeHtml(dates) + "</td><td>" + state +
      '</td><td><button class="btn btn-light btn-small toggle-reminder" style="border:1px solid #e2e8f0;" data-id="' + escapeHtml(r.id) + '">' +
      escapeHtml(r.active ? t("rem.pause") : t("rem.resume")) + '</button> <button class="btn btn-danger btn-small delete-reminder" data-id="' +
      escapeHtml(r.id) + '">' + escapeHtml(t("btn.delete")) + "</button></td></tr>";
  }
  html += "</tbody></table>";
  box.innerHTML = html;
}

document.getElementById("reminderTable").addEventListener("click", function (event) {
  var toggleBtn = event.target.closest(".toggle-reminder");
  var deleteBtn = event.target.closest(".delete-reminder");
  var btn = toggleBtn || deleteBtn;
  if (!btn) {
    return;
  }
  var id = btn.getAttribute("data-id");
  var all = getData("hms_reminders", []);
  var kept = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      if (toggleBtn) {
        all[i].active = !all[i].active;
        kept.push(all[i]);
      }
    } else {
      kept.push(all[i]);
    }
  }
  setData("hms_reminders", kept);
  renderReminders();
  renderDueBanner();
});

// A reminder is due once its time has passed today. It stays on the banner until the patient answers.
function checkReminders(now) {
  var all = getData("hms_reminders", []);
  var today = dateToString(now);
  var hhmm = twoDigits(now.getHours()) + ":" + twoDigits(now.getMinutes());
  var changed = false;
  var newlyDue = [];

  for (var i = 0; i < all.length; i++) {
    var r = all[i];
    if (r.userEmail !== session.email || !r.active) {
      continue;
    }
    if (today < r.startDate || (r.endDate && today > r.endDate)) {
      continue;
    }
    if (r.lastFired === today) {
      continue;
    }
    if (r.time <= hhmm) {
      r.lastFired = today;
      changed = true;
      newlyDue.push(r);
    }
  }

  if (changed) {
    setData("hms_reminders", all);
    for (var n = 0; n < newlyDue.length; n++) {
      sendNotification(newlyDue[n]);
    }
    renderReminders();
  }
  renderDueBanner();
}

function sendNotification(reminder) {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(t("rem.dueTitle"), { body: reminder.medicine + " - " + reminder.time });
    } catch (e) {
      // some browsers do not allow notifications here; the banner is still shown
    }
  }
}

function renderDueBanner() {
  var box = document.getElementById("dueBanner");
  var today = todayString();
  var mine = myReminders();
  var html = "";

  for (var i = 0; i < mine.length; i++) {
    var r = mine[i];
    if (r.active && r.lastFired === today && r.doneDate !== today) {
      html +=
        '<div class="due-item"><span>&#128138; <strong>' + escapeHtml(t("rem.dueTitle")) + ":</strong> " +
        escapeHtml(r.medicine) + " (" + escapeHtml(r.time) + ')</span><span>' +
        '<button class="btn btn-small reminder-taken" data-id="' + escapeHtml(r.id) + '">' + escapeHtml(t("rem.taken")) + "</button> " +
        '<button class="btn btn-light btn-small reminder-dismiss" style="border:1px solid #e2e8f0;" data-id="' + escapeHtml(r.id) + '">' +
        escapeHtml(t("rem.dismiss")) + "</button></span></div>";
    }
  }
  box.innerHTML = html;
}

document.getElementById("dueBanner").addEventListener("click", function (event) {
  var btn = event.target.closest(".reminder-taken") || event.target.closest(".reminder-dismiss");
  if (!btn) {
    return;
  }
  var id = btn.getAttribute("data-id");
  var all = getData("hms_reminders", []);
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      all[i].doneDate = todayString();
    }
  }
  setData("hms_reminders", all);
  renderReminders();
  renderDueBanner();
});

document.getElementById("enableNotify").addEventListener("click", function () {
  if (!("Notification" in window)) {
    showReminderMessage(t("rem.notifyUnsupported"), "error");
    return;
  }
  Notification.requestPermission().then(function (result) {
    if (result === "granted") {
      showReminderMessage(t("rem.notifyOn"), "success");
    } else {
      showReminderMessage(t("rem.notifyBlocked"), "error");
    }
  });
});

// ---------- Emergency help ----------
var emergencyModal = document.getElementById("emergencyModal");
var emState = document.getElementById("emState");
var emCity = document.getElementById("emCity");

function fillEmergencyStates(keep) {
  var hospitals = getData("hms_hospitals", []);
  var states = [];
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].emergency) {
      addUnique(states, hospitals[i].state || "Not specified");
    }
  }
  states.sort();
  var html = "";
  for (var j = 0; j < states.length; j++) {
    html += '<option value="' + escapeHtml(states[j]) + '">' + escapeHtml(states[j]) + "</option>";
  }
  emState.innerHTML = html;
  if (keep && states.indexOf(keep) !== -1) {
    emState.value = keep;
  }
}

function fillEmergencyCities(keep) {
  var hospitals = getData("hms_hospitals", []);
  var cities = [];
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].emergency && (hospitals[i].state || "Not specified") === emState.value) {
      addUnique(cities, hospitals[i].location);
    }
  }
  cities.sort();
  var html = '<option value="">' + escapeHtml(t("em.allCities")) + "</option>";
  for (var j = 0; j < cities.length; j++) {
    html += '<option value="' + escapeHtml(cities[j]) + '">' + escapeHtml(cities[j]) + "</option>";
  }
  emCity.innerHTML = html;
  emCity.value = keep || "";
  if (emCity.value !== (keep || "")) {
    emCity.value = "";
  }
}

function renderEmergency() {
  var hospitals = getData("hms_hospitals", []);
  var state = emState.value;
  var city = emCity.value;
  var inState = [];
  var inCity = [];

  for (var i = 0; i < hospitals.length; i++) {
    var h = hospitals[i];
    if (h.emergency && (h.state || "Not specified") === state) {
      inState.push(h);
      if (city !== "" && h.location === city) {
        inCity.push(h);
      }
    }
  }

  var shown = inState;
  var note = "";
  if (city !== "") {
    if (inCity.length > 0) {
      shown = inCity;
    } else {
      note = '<p class="message error" style="display:block;">' + escapeHtml(t("em.nearby", { city: city, state: state })) + "</p>";
    }
  }
  shown.sort(function (a, b) {
    return b.rating - a.rating;
  });

  if (shown.length === 0) {
    document.getElementById("emergencyList").innerHTML = '<div class="empty">' + escapeHtml(t("em.none")) + "</div>";
    return;
  }

  var html = note;
  for (var k = 0; k < shown.length; k++) {
    var e = shown[k];
    var phone = e.ambulance
      ? '<a class="btn btn-emergency btn-small" href="tel:' + escapeHtml(e.ambulance.replace(/\s/g, "")) + '">&#128222; ' +
        escapeHtml(t("em.call")) + " " + escapeHtml(e.ambulance) + "</a>"
      : '<span class="muted">' + escapeHtml(t("em.noNumber")) + "</span>";
    html +=
      '<div class="treatment-block"><h3>' + escapeHtml(e.name) + "</h3>" +
      '<p class="muted">&#128205; ' + escapeHtml(fullAddress(e)) + " &nbsp;|&nbsp; &#11088; " + e.rating + "</p>" +
      "<p>" + phone + ' &nbsp; <a class="map-link" href="' + mapLink(e) + '" target="_blank" rel="noopener">' + escapeHtml(t("loc.map")) + "</a></p>" +
      "</div>";
  }
  document.getElementById("emergencyList").innerHTML = html;
}

document.getElementById("emergencyBtn").addEventListener("click", function () {
  fillEmergencyStates(stateSelect.value);
  fillEmergencyCities(locationSelect.value);
  renderEmergency();
  emergencyModal.classList.add("show");
});

emState.addEventListener("change", function () {
  fillEmergencyCities("");
  renderEmergency();
});

emCity.addEventListener("change", renderEmergency);

document.getElementById("closeEmergency").addEventListener("click", function () {
  emergencyModal.classList.remove("show");
});

// ---------- Voice search ----------
function setupVoice() {
  var micBtn = document.getElementById("micBtn");
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    micBtn.classList.add("hidden");
    return;
  }

  micBtn.addEventListener("click", function () {
    var recognition = new Recognition();
    var languages = { en: "en-IN", te: "te-IN", hi: "hi-IN" };
    recognition.lang = languages[getLang()] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    micBtn.classList.add("listening");
    showSearchMessage(t("voice.listening"), "success");

    recognition.onresult = function (event) {
      var heard = event.results[0][0].transcript;
      var canonical = canonicalDisease(heard);
      if (DISEASE_INFO[canonical]) {
        diseaseInput.value = diseaseLabel(canonical);
      } else {
        diseaseInput.value = heard;
      }
      showSearchMessage(t("voice.heard", { text: heard }), "success");
    };
    recognition.onerror = function (event) {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        showSearchMessage(t("voice.denied"), "error");
      } else {
        showSearchMessage(t("voice.error"), "error");
      }
    };
    recognition.onend = function () {
      micBtn.classList.remove("listening");
    };
    recognition.start();
  });
}
