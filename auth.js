// =====================================================
// auth.js - Signup, Login and Forgot Password (Local Storage)
// =====================================================

var ADMIN_CODE = "ADMIN2026";

var loginTab = document.getElementById("loginTab");
var signupTab = document.getElementById("signupTab");
var loginForm = document.getElementById("loginForm");
var signupForm = document.getElementById("signupForm");
var forgotForm = document.getElementById("forgotForm");
var messageBox = document.getElementById("message");
var signupRole = document.getElementById("signupRole");
var adminCodeGroup = document.getElementById("adminCodeGroup");

// Language switcher (English / Telugu / Hindi)
buildLangSwitcher("langSlot");
applyTranslations();
window.onLanguageChange = function () {
  clearMessage();
};

// If already logged in, go straight to the right module
var existingSession = getSession();
if (existingSession) {
  window.location.href = pageForRole(existingSession.role);
}

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message";
}

function showLogin() {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  forgotForm.classList.add("hidden");
  clearMessage();
}

function showSignup() {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  forgotForm.classList.add("hidden");
  clearMessage();
}

function showForgot() {
  loginTab.classList.remove("active");
  signupTab.classList.remove("active");
  forgotForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  signupForm.classList.add("hidden");
  clearMessage();
}

loginTab.addEventListener("click", showLogin);
signupTab.addEventListener("click", showSignup);

document.getElementById("forgotLink").addEventListener("click", function (event) {
  event.preventDefault();
  showForgot();
});

document.getElementById("backToLogin").addEventListener("click", function (event) {
  event.preventDefault();
  showLogin();
});

signupRole.addEventListener("change", function () {
  if (signupRole.value === "admin") {
    adminCodeGroup.classList.remove("hidden");
  } else {
    adminCodeGroup.classList.add("hidden");
  }
});

// ---------- Signup ----------
signupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = document.getElementById("signupName").value.trim();
  var email = document.getElementById("signupEmail").value.trim().toLowerCase();
  var password = document.getElementById("signupPassword").value;
  var confirm = document.getElementById("signupConfirm").value;
  var role = signupRole.value;
  var code = document.getElementById("adminCode").value;

  if (name.length < 2) {
    showMessage(t("msg.enterName"), "error");
    return;
  }
  if (password.length < 6) {
    showMessage(t("msg.pass6"), "error");
    return;
  }
  if (password !== confirm) {
    showMessage(t("msg.passMatch"), "error");
    return;
  }
  if (role === "admin" && code !== ADMIN_CODE) {
    showMessage(t("msg.badCode"), "error");
    return;
  }

  var users = getData("hms_users", []);
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      showMessage(t("msg.emailExists"), "error");
      return;
    }
  }

  users.push({ name: name, email: email, password: password, role: role });
  setData("hms_users", users);

  signupForm.reset();
  adminCodeGroup.classList.add("hidden");
  showLogin();
  showMessage(t("msg.created"), "success");
});

// ---------- Login ----------
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var email = document.getElementById("loginEmail").value.trim().toLowerCase();
  var password = document.getElementById("loginPassword").value;

  var users = getData("hms_users", []);
  var found = null;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      found = users[i];
      break;
    }
  }

  if (found === null) {
    showMessage(t("msg.wrongLogin"), "error");
    return;
  }

  setData("hms_session", { name: found.name, email: found.email, role: found.role, doctorId: found.doctorId || "" });

  // Module-wise redirection
  window.location.href = pageForRole(found.role);
});

// ---------- Forgot password ----------
// There is no email server in a front-end only project, so the user proves who
// they are by giving the email AND the full name they registered with.
forgotForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var email = document.getElementById("forgotEmail").value.trim().toLowerCase();
  var name = document.getElementById("forgotName").value.trim().toLowerCase();
  var newPassword = document.getElementById("forgotPassword").value;
  var confirm = document.getElementById("forgotConfirm").value;

  var users = getData("hms_users", []);
  var index = -1;
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].name.trim().toLowerCase() === name) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    showMessage(t("msg.verifyFail"), "error");
    return;
  }
  if (newPassword.length < 6) {
    showMessage(t("msg.newPass6"), "error");
    return;
  }
  if (newPassword !== confirm) {
    showMessage(t("msg.passMatch"), "error");
    return;
  }

  users[index].password = newPassword;
  setData("hms_users", users);

  forgotForm.reset();
  showLogin();
  document.getElementById("loginEmail").value = email;
  showMessage(t("msg.resetOk"), "success");
});
