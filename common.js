// =====================================================
// common.js - shared helpers + sample data (Local Storage)
// =====================================================

var DATA_VERSION = 4;

var INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry"
];

// ---------- Local Storage helpers ----------
function getData(key, fallback) {
  var raw = localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix) {
  return prefix + Date.now() + Math.floor(Math.random() * 1000);
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(String(text)));
  return div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// ---------- Date helpers (local time, not UTC) ----------
var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dateToString(d) {
  var month = d.getMonth() + 1;
  var day = d.getDate();
  return d.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
}

function todayString() {
  return dateToString(new Date());
}

function parseDateString(str) {
  var p = str.split("-");
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

// 2026-10-08  ->  08 Oct 2026
function formatDate(dateStr) {
  if (!dateStr) {
    return "-";
  }
  var p = dateStr.split("-");
  if (p.length !== 3) {
    return dateStr;
  }
  return p[2] + " " + MONTH_NAMES[Number(p[1]) - 1] + " " + p[0];
}

// ---------- Doctor timings -> appointment slots ----------
// Timings text looks like: "Mon-Sat, 10 AM - 2 PM"  or  "Daily, 9 AM - 12 PM"
var TIME_RANGE_REGEX = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i;
var DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isValidTimings(timings) {
  return TIME_RANGE_REGEX.test(timings || "");
}

function hourTo24(hour, ampm) {
  var h = Number(hour) % 12;
  if (ampm.toUpperCase() === "PM") {
    h = h + 12;
  }
  return h;
}

function minutesToLabel(total) {
  var h = Math.floor(total / 60);
  var m = total % 60;
  var ampm = h >= 12 ? "PM" : "AM";
  var h12 = h % 12;
  if (h12 === 0) {
    h12 = 12;
  }
  return h12 + ":" + (m < 10 ? "0" + m : m) + " " + ampm;
}

// Returns { start, end } in minutes from midnight. Falls back to 9 AM - 5 PM.
function parseTimeRange(timings) {
  var match = TIME_RANGE_REGEX.exec(timings || "");
  if (!match) {
    return { start: 9 * 60, end: 17 * 60 };
  }
  var start = hourTo24(match[1], match[3]) * 60 + Number(match[2] || 0);
  var end = hourTo24(match[4], match[6]) * 60 + Number(match[5] || 0);
  if (end <= start) {
    return { start: 9 * 60, end: 17 * 60 };
  }
  return { start: start, end: end };
}

// 30 minute slots, as minutes from midnight
function getSlots(timings) {
  var range = parseTimeRange(timings);
  var slots = [];
  for (var t = range.start; t + 30 <= range.end; t += 30) {
    slots.push(t);
  }
  return slots;
}

// dayIndex: 0 = Sunday ... 6 = Saturday
function worksOnDay(timings, dayIndex) {
  var text = timings || "";
  if (/daily|everyday/i.test(text)) {
    return true;
  }
  var match = /(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\w*\s*-\s*(Sun|Mon|Tue|Wed|Thu|Fri|Sat)/i.exec(text);
  if (!match) {
    return true;
  }
  var from = DAY_SHORT.indexOf(match[1].charAt(0).toUpperCase() + match[1].slice(1, 3).toLowerCase());
  var to = DAY_SHORT.indexOf(match[2].charAt(0).toUpperCase() + match[2].slice(1, 3).toLowerCase());
  var i = from;
  while (true) {
    if (i === dayIndex) {
      return true;
    }
    if (i === to) {
      break;
    }
    i = (i + 1) % 7;
  }
  return false;
}

// ---------- Hospital address helpers ----------
function fullAddress(hospital) {
  var parts = [hospital.address];
  if (hospital.address.toLowerCase().indexOf(hospital.location.toLowerCase()) === -1) {
    parts.push(hospital.location);
  }
  if (hospital.state) {
    parts.push(hospital.state);
  }
  return parts.join(", ");
}

function mapLink(hospital) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(hospital.name + ", " + fullAddress(hospital));
}

// ---------- Treatment information (sample estimates) ----------
// Base cost range (in rupees) for the initial course of treatment, typical duration
// and example medicines. Each hospital multiplies the cost by its own costFactor.
var DISEASE_INFO = {
  "Fever": { costMin: 1500, costMax: 4000, duration: "3 - 5 days", medicines: ["Paracetamol", "Oral rehydration salts (ORS)", "Multivitamin"] },
  "Diabetes": { costMin: 4000, costMax: 12000, duration: "Long-term, first review in 3 months", medicines: ["Metformin", "Glimepiride", "Insulin (if advised)"] },
  "Hypertension": { costMin: 3000, costMax: 9000, duration: "Long-term, review every 1 - 3 months", medicines: ["Amlodipine", "Telmisartan"] },
  "Heart Disease": { costMin: 25000, costMax: 150000, duration: "2 - 6 weeks, then long-term follow-up", medicines: ["Aspirin", "Atorvastatin", "Metoprolol", "Clopidogrel"] },
  "Typhoid": { costMin: 4000, costMax: 12000, duration: "10 - 14 days", medicines: ["Azithromycin", "Cefixime", "Paracetamol", "Oral rehydration salts (ORS)"] },
  "Dengue": { costMin: 6000, costMax: 25000, duration: "7 - 10 days", medicines: ["Paracetamol", "Oral rehydration salts (ORS)", "IV fluids (if needed)"] },
  "Asthma": { costMin: 3000, costMax: 10000, duration: "Long-term, review every 3 months", medicines: ["Salbutamol inhaler", "Budesonide inhaler", "Montelukast"] },
  "Kidney Stones": { costMin: 15000, costMax: 80000, duration: "1 - 4 weeks, depends on stone size", medicines: ["Tamsulosin", "Potassium citrate", "Pain relievers (as advised)"] },
  "Skin Allergy": { costMin: 1500, costMax: 5000, duration: "1 - 3 weeks", medicines: ["Cetirizine", "Hydrocortisone cream", "Calamine lotion"] },
  "Cancer": { costMin: 150000, costMax: 800000, duration: "Several months, depends on type and stage", medicines: ["Chemotherapy drugs (as per protocol)", "Ondansetron", "Pain management drugs"] },
  "Fracture": { costMin: 20000, costMax: 120000, duration: "6 - 12 weeks", medicines: ["Calcium", "Vitamin D3", "Paracetamol"] },
  "Arthritis": { costMin: 5000, costMax: 25000, duration: "Long-term, review every 3 months", medicines: ["Naproxen", "Calcium and Vitamin D3", "Glucosamine"] },
  "Migraine": { costMin: 2500, costMax: 9000, duration: "2 - 4 weeks, then follow-up", medicines: ["Sumatriptan", "Propranolol", "Naproxen"] },
  "Eye Infection": { costMin: 1000, costMax: 4000, duration: "5 - 7 days", medicines: ["Moxifloxacin eye drops", "Lubricating eye drops"] },
  "Pregnancy Care": { costMin: 20000, costMax: 90000, duration: "9 months with regular check-ups", medicines: ["Folic acid", "Iron and calcium supplements", "Prenatal vitamins"] }
};

// 5200 -> "&#8377;5,200" (use inside innerHTML)
function formatRupees(amount) {
  return "&#8377;" + Number(amount).toLocaleString("en-IN");
}

// Returns { costMin, costMax, duration, medicines } for this hospital, or null if unknown
function getTreatmentInfo(hospital, diseaseName) {
  var key = null;
  for (var name in DISEASE_INFO) {
    if (name.toLowerCase() === String(diseaseName).toLowerCase()) {
      key = name;
    }
  }
  if (key === null) {
    return null;
  }
  var base = DISEASE_INFO[key];
  var factor = hospital.costFactor || 1;
  return {
    costMin: Math.round(base.costMin * factor / 100) * 100,
    costMax: Math.round(base.costMax * factor / 100) * 100,
    duration: base.duration,
    medicines: base.medicines
  };
}

// ---------- Disease names in Telugu and Hindi (for search and display) ----------
// The first name in each list is the one shown on screen.
var DISEASE_ALIASES = {
  "Fever": { te: ["జ్వరం", "ఫీవర్"], hi: ["बुखार", "फीवर"] },
  "Diabetes": { te: ["మధుమేహం", "డయాబెటిస్", "షుగర్"], hi: ["मधुमेह", "डायबिटीज", "शुगर"] },
  "Hypertension": { te: ["అధిక రక్తపోటు", "బీపీ"], hi: ["उच्च रक्तचाप", "हाई ब्लड प्रेशर", "ब्लड प्रेशर"] },
  "Heart Disease": { te: ["గుండె జబ్బు", "గుండె వ్యాధి"], hi: ["हृदय रोग", "दिल की बीमारी"] },
  "Typhoid": { te: ["టైఫాయిడ్"], hi: ["टाइफाइड"] },
  "Dengue": { te: ["డెంగ్యూ"], hi: ["डेंगू"] },
  "Asthma": { te: ["ఆస్తమా", "ఉబ్బసం"], hi: ["अस्थमा", "दमा"] },
  "Kidney Stones": { te: ["కిడ్నీ రాళ్లు", "మూత్రపిండాల్లో రాళ్లు"], hi: ["गुर्दे की पथरी", "किडनी स्टोन"] },
  "Skin Allergy": { te: ["చర్మ అలెర్జీ", "చర్మ అలర్జీ"], hi: ["त्वचा एलर्जी", "स्किन एलर्जी"] },
  "Cancer": { te: ["క్యాన్సర్"], hi: ["कैंसर"] },
  "Fracture": { te: ["ఎముక విరుపు", "ఫ్రాక్చర్"], hi: ["हड्डी टूटना", "फ्रैक्चर"] },
  "Arthritis": { te: ["కీళ్ల నొప్పులు", "ఆర్థరైటిస్"], hi: ["गठिया", "आर्थराइटिस"] },
  "Migraine": { te: ["మైగ్రేన్", "పార్శ్వ తలనొప్పి"], hi: ["माइग्रेन", "आधासीसी"] },
  "Eye Infection": { te: ["కంటి ఇన్ఫెక్షన్"], hi: ["आँखों का संक्रमण", "आंख का संक्रमण"] },
  "Pregnancy Care": { te: ["గర్భధారణ సంరక్షణ"], hi: ["गर्भावस्था देखभाल"] }
};

// Name of a disease in the language chosen on the page (English names stay as they are)
function diseaseLabel(name) {
  var lang = getLang();
  if (lang === "en") {
    return name;
  }
  var entry = DISEASE_ALIASES[name];
  if (entry && entry[lang] && entry[lang].length > 0) {
    return entry[lang][0];
  }
  return name;
}

// Turns what the patient typed or said (English, Telugu or Hindi) into the English disease name.
// Unknown text is returned unchanged.
function canonicalDisease(typed) {
  var text = String(typed).trim();
  var q = text.toLowerCase();
  if (q === "") {
    return "";
  }
  var langs = ["te", "hi"];
  for (var name in DISEASE_ALIASES) {
    if (name.toLowerCase() === q) {
      return name;
    }
    for (var l = 0; l < langs.length; l++) {
      var list = DISEASE_ALIASES[name][langs[l]];
      for (var i = 0; i < list.length; i++) {
        if (q.indexOf(list[i].toLowerCase()) !== -1) {
          return name;
        }
      }
    }
  }
  return text;
}

// ---------- Hospital helpers: treatment cost, statistics, ratings ----------
// Finds the treatment information of the first disease of this hospital that matches the
// search text. Returns { disease, info } (info is null when no cost data exists).
function bestTreatmentFor(hospital, query) {
  var firstName = "";
  for (var i = 0; i < hospital.diseases.length; i++) {
    var d = hospital.diseases[i];
    var low = d.toLowerCase();
    if (low.indexOf(query) !== -1 || query.indexOf(low) !== -1) {
      if (firstName === "") {
        firstName = d;
      }
      var info = getTreatmentInfo(hospital, d);
      if (info !== null) {
        return { disease: d, info: info };
      }
    }
  }
  return { disease: firstName, info: null };
}

function hospitalStats(hospital) {
  var available = 0;
  var topSuccess = 0;
  var topExperience = 0;
  var topDoctor = "";
  var total = 0;
  for (var i = 0; i < hospital.doctors.length; i++) {
    var d = hospital.doctors[i];
    total += d.successRate;
    if (d.available) {
      available++;
    }
    if (d.successRate > topSuccess) {
      topSuccess = d.successRate;
    }
    if (d.experience > topExperience) {
      topExperience = d.experience;
      topDoctor = d.name;
    }
  }
  var count = hospital.doctors.length;
  return {
    doctorCount: count,
    availableCount: available,
    topSuccess: topSuccess,
    avgSuccess: count > 0 ? Math.round(total / count) : 0,
    topExperience: topExperience,
    topDoctor: topDoctor
  };
}

// The starting rating counts as 10 patient votes; every real review is one more vote.
function computeRating(hospital) {
  var seed = typeof hospital.seedRating === "number" ? hospital.seedRating : hospital.rating;
  var count = hospital.reviewCount || 0;
  var sum = hospital.reviewSum || 0;
  return Math.round(((seed * 10 + sum) / (10 + count)) * 10) / 10;
}

// Adds a patient review (1-5 stars) to a hospital and refreshes its rating
function addHospitalReview(hospitalId, stars) {
  var hospitals = getData("hms_hospitals", []);
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].id === hospitalId) {
      var h = hospitals[i];
      if (typeof h.seedRating !== "number") {
        h.seedRating = h.rating;
      }
      h.reviewCount = (h.reviewCount || 0) + 1;
      h.reviewSum = (h.reviewSum || 0) + stars;
      h.rating = computeRating(h);
      setData("hms_hospitals", hospitals);
      return true;
    }
  }
  return false;
}

function findHospitalById(id) {
  var hospitals = getData("hms_hospitals", []);
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].id === id) {
      return hospitals[i];
    }
  }
  return null;
}

function findHospitalByName(name) {
  var hospitals = getData("hms_hospitals", []);
  for (var i = 0; i < hospitals.length; i++) {
    if (hospitals[i].name === name) {
      return hospitals[i];
    }
  }
  return null;
}

// Returns { doctor, hospital } for a doctor id, or null
function findDoctor(doctorId) {
  var hospitals = getData("hms_hospitals", []);
  for (var i = 0; i < hospitals.length; i++) {
    for (var j = 0; j < hospitals[i].doctors.length; j++) {
      if (hospitals[i].doctors[j].id === doctorId) {
        return { doctor: hospitals[i].doctors[j], hospital: hospitals[i] };
      }
    }
  }
  return null;
}

// Short appointment number printed on slips, e.g. HMS-4F2A9C
function slipNumber(id) {
  return "HMS-" + String(id).slice(-6).toUpperCase();
}

function twoDigits(n) {
  return n < 10 ? "0" + n : String(n);
}

// ---------- Sample data ----------
function baseHospitals() {
  return [
    {
      id: "h1",
      costFactor: 1.0,
      name: "City Care Multispeciality Hospital",
      location: "Vijayawada",
      state: "Andhra Pradesh",
      address: "MG Road, Vijayawada",
      rating: 4.6,
      diseases: ["Fever", "Diabetes", "Hypertension", "Heart Disease", "Typhoid", "Dengue"],
      doctors: [
        { id: "d1", name: "Dr. Ramesh Kumar", designation: "Senior Cardiologist", experience: 18, successRate: 96, timings: "Mon-Sat, 10 AM - 2 PM", available: true },
        { id: "d2", name: "Dr. Anitha Reddy", designation: "General Physician", experience: 9, successRate: 92, timings: "Mon-Fri, 9 AM - 1 PM", available: true },
        { id: "d3", name: "Dr. Suresh Babu", designation: "Diabetologist", experience: 14, successRate: 94, timings: "Tue-Sat, 4 PM - 7 PM", available: false }
      ]
    },
    {
      id: "h2",
      costFactor: 1.1,
      name: "Sunrise Heart & Care Centre",
      location: "Vijayawada",
      state: "Andhra Pradesh",
      address: "Benz Circle, Vijayawada",
      rating: 4.4,
      diseases: ["Heart Disease", "Hypertension", "Asthma", "Fever"],
      doctors: [
        { id: "d4", name: "Dr. Lakshmi Prasanna", designation: "Interventional Cardiologist", experience: 16, successRate: 95, timings: "Mon-Fri, 11 AM - 3 PM", available: true },
        { id: "d5", name: "Dr. Kiran Varma", designation: "Pulmonologist", experience: 11, successRate: 91, timings: "Mon-Sat, 5 PM - 8 PM", available: true }
      ]
    },
    {
      id: "h3",
      costFactor: 0.9,
      name: "Lifeline Medical Institute",
      location: "Guntur",
      state: "Andhra Pradesh",
      address: "Brodipet, Guntur",
      rating: 4.3,
      diseases: ["Fever", "Typhoid", "Dengue", "Kidney Stones", "Skin Allergy"],
      doctors: [
        { id: "d6", name: "Dr. Venkat Rao", designation: "Nephrologist", experience: 20, successRate: 93, timings: "Mon-Fri, 10 AM - 1 PM", available: true },
        { id: "d7", name: "Dr. Swathi Devi", designation: "Dermatologist", experience: 8, successRate: 90, timings: "Mon-Sat, 3 PM - 6 PM", available: true },
        { id: "d8", name: "Dr. Mohan Krishna", designation: "General Physician", experience: 12, successRate: 91, timings: "Daily, 9 AM - 12 PM", available: false }
      ]
    },
    {
      id: "h4",
      costFactor: 1.4,
      name: "Apollo Greenfield Hospital",
      location: "Visakhapatnam",
      state: "Andhra Pradesh",
      address: "Beach Road, Visakhapatnam",
      rating: 4.8,
      diseases: ["Cancer", "Heart Disease", "Diabetes", "Fracture", "Arthritis", "Migraine"],
      doctors: [
        { id: "d9", name: "Dr. Narasimha Murthy", designation: "Oncologist", experience: 22, successRate: 89, timings: "Mon-Fri, 10 AM - 4 PM", available: true },
        { id: "d10", name: "Dr. Priya Sharma", designation: "Orthopedic Surgeon", experience: 13, successRate: 95, timings: "Mon-Sat, 9 AM - 12 PM", available: true },
        { id: "d11", name: "Dr. Rajesh Naidu", designation: "Neurologist", experience: 15, successRate: 92, timings: "Tue-Sat, 2 PM - 5 PM", available: true }
      ]
    },
    {
      id: "h5",
      costFactor: 1.1,
      name: "Venkateswara Super Speciality Hospital",
      location: "Tirupati",
      state: "Andhra Pradesh",
      address: "Tilak Road, Tirupati",
      rating: 4.5,
      diseases: ["Fever", "Asthma", "Eye Infection", "Pregnancy Care", "Migraine", "Skin Allergy"],
      doctors: [
        { id: "d12", name: "Dr. Padmavathi", designation: "Gynecologist", experience: 17, successRate: 97, timings: "Mon-Sat, 10 AM - 1 PM", available: true },
        { id: "d13", name: "Dr. Harish Chandra", designation: "Ophthalmologist", experience: 10, successRate: 94, timings: "Mon-Fri, 4 PM - 7 PM", available: false },
        { id: "d14", name: "Dr. Sandhya Rani", designation: "Pulmonologist", experience: 7, successRate: 90, timings: "Mon-Sat, 9 AM - 12 PM", available: true }
      ]
    },
    {
      id: "h6",
      costFactor: 1.3,
      name: "Metro Health Hospital",
      location: "Hyderabad",
      state: "Telangana",
      address: "Banjara Hills, Hyderabad",
      rating: 4.7,
      diseases: ["Cancer", "Diabetes", "Kidney Stones", "Fracture", "Heart Disease", "Arthritis", "Dengue"],
      doctors: [
        { id: "d15", name: "Dr. Imran Khan", designation: "Urologist", experience: 19, successRate: 96, timings: "Mon-Fri, 11 AM - 3 PM", available: true },
        { id: "d16", name: "Dr. Meera Iyer", designation: "Endocrinologist", experience: 12, successRate: 93, timings: "Mon-Sat, 10 AM - 1 PM", available: true },
        { id: "d17", name: "Dr. Vikram Singh", designation: "Orthopedic Surgeon", experience: 21, successRate: 94, timings: "Tue-Sat, 5 PM - 8 PM", available: true }
      ]
    },
    {
      id: "h7",
      costFactor: 1.0,
      name: "Marina Care Hospital",
      location: "Chennai",
      state: "Tamil Nadu",
      address: "Anna Salai, Chennai",
      rating: 4.5,
      diseases: ["Fever", "Diabetes", "Heart Disease", "Dengue", "Asthma"],
      doctors: [
        { id: "d18", name: "Dr. Karthik Subramanian", designation: "Cardiologist", experience: 15, successRate: 94, timings: "Mon-Sat, 10 AM - 1 PM", available: true },
        { id: "d19", name: "Dr. Revathi Nair", designation: "Pulmonologist", experience: 10, successRate: 92, timings: "Mon-Fri, 3 PM - 6 PM", available: true }
      ]
    },
    {
      id: "h8",
      costFactor: 1.2,
      name: "Garden City Medical Centre",
      location: "Bengaluru",
      state: "Karnataka",
      address: "MG Road, Bengaluru",
      rating: 4.6,
      diseases: ["Migraine", "Arthritis", "Cancer", "Diabetes", "Skin Allergy"],
      doctors: [
        { id: "d20", name: "Dr. Anil Gowda", designation: "Neurologist", experience: 14, successRate: 93, timings: "Mon-Fri, 11 AM - 3 PM", available: true },
        { id: "d21", name: "Dr. Shalini Rao", designation: "Rheumatologist", experience: 11, successRate: 91, timings: "Tue-Sat, 9 AM - 12 PM", available: false },
        { id: "d22", name: "Dr. Deepak Hegde", designation: "Oncologist", experience: 19, successRate: 90, timings: "Mon-Sat, 2 PM - 6 PM", available: true }
      ]
    },
    {
      id: "h9",
      costFactor: 0.8,
      name: "Charminar Community Hospital",
      location: "Hyderabad",
      state: "Telangana",
      address: "Old City, Hyderabad",
      rating: 4.2,
      diseases: ["Fever", "Typhoid", "Dengue", "Pregnancy Care", "Asthma"],
      doctors: [
        { id: "d23", name: "Dr. Farah Siddiqui", designation: "Gynecologist", experience: 13, successRate: 95, timings: "Mon-Sat, 10 AM - 2 PM", available: true },
        { id: "d24", name: "Dr. Ashok Reddy", designation: "General Physician", experience: 9, successRate: 91, timings: "Daily, 9 AM - 1 PM", available: true }
      ]
    }
  ];
}

// Emergency service and ambulance numbers (sample numbers, not real ones)
var HOSPITAL_EXTRAS = {
  h1: { emergency: true, ambulance: "+91 98000 10001" },
  h2: { emergency: true, ambulance: "+91 98000 10002" },
  h3: { emergency: false, ambulance: "" },
  h4: { emergency: true, ambulance: "+91 98000 10004" },
  h5: { emergency: true, ambulance: "+91 98000 10005" },
  h6: { emergency: true, ambulance: "+91 98000 10006" },
  h7: { emergency: true, ambulance: "+91 98000 10007" },
  h8: { emergency: false, ambulance: "" },
  h9: { emergency: true, ambulance: "+91 98000 10009" }
};

function defaultHospitals() {
  var list = baseHospitals();
  for (var i = 0; i < list.length; i++) {
    var extra = HOSPITAL_EXTRAS[list[i].id] || {};
    list[i].emergency = !!extra.emergency;
    list[i].ambulance = extra.ambulance || "";
    list[i].seedRating = list[i].rating;
    list[i].reviewSum = 0;
    list[i].reviewCount = 0;
  }
  return list;
}

// Demo logins that always exist, so the project can be shown on any computer
function ensureDemoUsers() {
  var demo = [
    { name: "Administrator", email: "admin@hms.com", password: "admin123", role: "admin" },
    { name: "Demo Patient", email: "patient@hms.com", password: "patient123", role: "user" },
    { name: "Dr. Ramesh Kumar", email: "doctor@hms.com", password: "doctor123", role: "doctor", doctorId: "d1" }
  ];
  var users = getData("hms_users", []);
  var changed = false;
  for (var i = 0; i < demo.length; i++) {
    var found = false;
    for (var j = 0; j < users.length; j++) {
      if (users[j].email === demo[i].email) {
        found = true;
      }
    }
    if (!found) {
      users.push(demo[i]);
      changed = true;
    }
  }
  if (changed) {
    setData("hms_users", users);
  }
}

function seedData() {
  ensureDemoUsers();
  if (!localStorage.getItem("hms_hospitals")) {
    setData("hms_hospitals", defaultHospitals());
    setData("hms_version", DATA_VERSION);
  }
  if (!localStorage.getItem("hms_appointments")) {
    setData("hms_appointments", []);
  }
  migrateData();
}

// Upgrades data saved by earlier versions of the project
function migrateData() {
  var version = getData("hms_version", 1);
  if (version >= DATA_VERSION) {
    return;
  }

  var hospitals = getData("hms_hospitals", []);
  var defaults = defaultHospitals();

  // Version 1 -> 2: hospitals get a state, and three new sample hospitals are added
  if (version < 2) {
    var cityState = {
      "Vijayawada": "Andhra Pradesh", "Guntur": "Andhra Pradesh", "Visakhapatnam": "Andhra Pradesh",
      "Tirupati": "Andhra Pradesh", "Hyderabad": "Telangana", "Chennai": "Tamil Nadu",
      "Bengaluru": "Karnataka"
    };
    var newHospitalIds = ["h7", "h8", "h9"];
    var existingIds = {};
    for (var i = 0; i < hospitals.length; i++) {
      if (!hospitals[i].state) {
        hospitals[i].state = cityState[hospitals[i].location] || "Not specified";
      }
      existingIds[hospitals[i].id] = true;
    }
    for (var j = 0; j < defaults.length; j++) {
      if (newHospitalIds.indexOf(defaults[j].id) !== -1 && !existingIds[defaults[j].id]) {
        hospitals.push(defaults[j]);
      }
    }
  }

  // Version 2 -> 3: hospitals get a treatment cost level
  for (var k = 0; k < hospitals.length; k++) {
    if (!hospitals[k].costFactor) {
      hospitals[k].costFactor = 1;
      for (var m = 0; m < defaults.length; m++) {
        if (defaults[m].id === hospitals[k].id) {
          hospitals[k].costFactor = defaults[m].costFactor;
        }
      }
    }
  }

  // Version 3 -> 4: emergency service, ambulance number and review fields
  for (var n = 0; n < hospitals.length; n++) {
    var h = hospitals[n];
    if (typeof h.emergency !== "boolean") {
      var extra = HOSPITAL_EXTRAS[h.id] || {};
      h.emergency = !!extra.emergency;
      h.ambulance = extra.ambulance || "";
    }
    if (typeof h.seedRating !== "number") {
      h.seedRating = h.rating;
      h.reviewSum = 0;
      h.reviewCount = 0;
    }
  }

  setData("hms_hospitals", hospitals);
  setData("hms_version", DATA_VERSION);
}

// ---------- Session / navigation ----------
function getSession() {
  return getData("hms_session", null);
}

function pageForRole(role) {
  if (role === "admin") {
    return "admin.html";
  }
  if (role === "doctor") {
    return "doctor.html";
  }
  return "user.html";
}

// Call at the top of a protected page. Redirects if not allowed.
function requireRole(role) {
  var session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  if (session.role !== role) {
    window.location.href = pageForRole(session.role);
    return null;
  }
  return session;
}

function logout() {
  localStorage.removeItem("hms_session");
  window.location.href = "index.html";
}

seedData();
