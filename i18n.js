// i18n.js - English / Telugu / Hindi text for the patient pages and login page.
// Use t("key") in JavaScript and data-i18n="key" in HTML.

var I18N = {
  en: {
    "app.title": "Hospital Management System",
    "nav.hello": "Hello", "nav.logout": "Logout", "nav.emergency": "🚑 Emergency",

    "step.1": "1. State, Location & Disease", "step.2": "2. Choose Hospital",
    "step.3": "3. Choose Doctor", "step.4": "4. Treatment Details",

    "search.title": "Find a Hospital", "search.state": "State", "search.location": "Location",
    "search.disease": "Disease Name", "search.diseasePh": "e.g. Diabetes",
    "search.budget": "Maximum budget (₹, optional)", "search.budgetPh": "e.g. 20000",
    "search.sort": "Sort by", "search.btn": "Search Hospitals", "search.voice": "Speak the disease name",
    "search.selectState": "Select state", "search.selectLocation": "Select location",
    "search.selectStateFirst": "Select a state first",
    "sort.relevance": "Best match", "sort.cost": "Lowest cost", "sort.rating": "Highest rating",
    "sort.experience": "Most experienced doctor", "sort.success": "Best success rate",

    "results.title": "{n} hospital(s) for {disease} in {location}, {state}",
    "results.hidden": "{n} hidden (above {budget})",
    "results.none": "No hospital found for this disease in this location. Try another location or disease.",
    "results.noneBudget": "No hospital fits your budget. Try a higher budget.",

    "card.click": "Click to see doctors and treatment details",
    "card.compare": "Compare", "card.costUnknown": "Cost details not available for this disease.",
    "card.doctors": "Doctors", "card.emergency": "24x7 Emergency", "card.rating": "Rating",
    "card.reviews": "{n} reviews",

    "compare.title": "Hospital Comparison", "compare.btn": "Compare selected", "compare.clear": "Clear",
    "compare.count": "{n} selected", "compare.for": "Comparison for: {disease}",
    "compare.min": "Select at least 2 hospitals to compare.", "compare.max": "You can compare up to 3 hospitals.",
    "compare.cost": "Estimated cost", "compare.duration": "Duration", "compare.rating": "Rating",
    "compare.location": "Location", "compare.doctors": "Doctors", "compare.availableNow": "available",
    "compare.topExperience": "Most experienced doctor", "compare.topSuccess": "Best success rate",
    "compare.emergency": "24x7 Emergency", "compare.view": "View doctors",
    "badge.cheapest": "Lowest cost", "badge.bestRated": "Best rated", "badge.bestSuccess": "Best success rate",
    "common.yes": "Yes", "common.no": "No", "common.cancel": "Cancel", "common.close": "Close", "common.confirm": "Confirm",

    "doc.titleAt": "Doctors at {name}", "doc.experience": "Experience", "doc.years": "years",
    "doc.success": "Success rate", "doc.timings": "Timings", "doc.available": "Available",
    "doc.notAvailable": "Not available", "doc.book": "Book Appointment",
    "doc.viewTreatment": "View treatment details", "doc.none": "No doctors found for this hospital.",

    "loc.title": "Hospital Location", "loc.location": "Location", "loc.state": "State",
    "loc.map": "Open in Google Maps", "loc.emergency": "24x7 Emergency", "loc.ambulance": "Ambulance",

    "treat.title": "Treatment Details", "treat.cost": "Estimated cost", "treat.duration": "Treatment duration",
    "treat.medicines": "Common medicines", "treat.book": "Book appointment with {name}",
    "treat.confirm": "Please confirm your choice by booking with a doctor.",
    "treat.notAvail": "This doctor is not available now",
    "treat.note": "Costs, durations and medicines are sample values for demonstration only. The doctor decides the actual treatment.",

    "book.title": "Book Appointment", "book.date": "Choose a date", "book.time": "Choose a time slot",
    "book.chooseDateFirst": "Choose a date first", "book.noSlots": "No slots on this date", "book.booked": "booked",
    "book.pickDate": "Please choose a date.", "book.pickTime": "Please choose a time slot.",
    "book.past": "Please choose today or a future date.", "book.noFree": "No free slots on this date.",
    "book.duplicate": "You already have an appointment with this doctor at this time.",
    "book.slotGone": "Sorry, this slot was just taken. Please choose another one.",
    "book.notOnDay": "{name} does not work on {day}. Timings: {timings}",
    "book.done": "Appointment booked with {name} on {date} at {time}.",

    "appt.title": "My Appointments", "appt.date": "Date", "appt.time": "Time", "appt.hospital": "Hospital",
    "appt.doctor": "Doctor", "appt.disease": "Disease", "appt.status": "Status",
    "appt.none": "You have not booked any appointment yet.",
    "btn.cancel": "Cancel", "btn.delete": "Delete", "btn.prescription": "Prescription",
    "btn.rate": "Rate", "btn.slip": "Print slip",
    "status.Booked": "Booked", "status.Completed": "Completed", "status.Cancelled": "Cancelled",
    "day.0": "Sunday", "day.1": "Monday", "day.2": "Tuesday", "day.3": "Wednesday",
    "day.4": "Thursday", "day.5": "Friday", "day.6": "Saturday",

    "fb.title": "Rate your treatment", "fb.comment": "Comment (optional)", "fb.submit": "Submit",
    "fb.pickStars": "Please choose a star rating.", "fb.thanks": "Thank you for your feedback!", "fb.rated": "Rated {n}/5",

    "rx.title": "My Prescriptions", "rx.none": "No prescriptions yet. They appear here after a doctor completes your visit.",
    "rx.diagnosis": "Diagnosis", "rx.medicine": "Medicine", "rx.dosage": "Dosage", "rx.duration": "Duration",
    "rx.followUp": "Follow-up", "rx.notes": "Notes", "rx.print": "Print", "rx.printTitle": "Prescription",
    "rx.addReminder": "Add reminder",

    "rem.title": "Medicine Reminders", "rem.help": "Reminders appear on this page at the chosen time while it is open in your browser.",
    "rem.medicine": "Medicine", "rem.time": "Time every day", "rem.timeShort": "Time", "rem.start": "Start date",
    "rem.end": "End date (optional)", "rem.add": "Add Reminder", "rem.enable": "Enable browser notifications",
    "rem.dates": "Dates", "rem.today": "Today", "rem.none": "No reminders yet.",
    "rem.added": "Reminder added.", "rem.badDates": "End date cannot be before the start date.",
    "rem.dismiss": "Dismiss", "rem.taken": "Taken", "rem.pause": "Pause", "rem.resume": "Resume",
    "rem.doneToday": "Taken today", "rem.dueNow": "Due now", "rem.paused": "Paused", "rem.upcoming": "Upcoming",
    "rem.dueTitle": "Time for your medicine",
    "rem.notifyOn": "Browser notifications are on.", "rem.notifyBlocked": "Notifications are blocked in your browser settings.",
    "rem.notifyUnsupported": "This browser does not support notifications.",

    "em.title": "🚑 Emergency help", "em.national": "National numbers:", "em.ambulance": "(ambulance)",
    "em.allEmergencies": "(all emergencies)", "em.allCities": "All cities", "em.call": "Call",
    "em.nearby": "Showing emergency hospitals near {city}, {state}", "em.noNumber": "No number listed",
    "em.none": "No emergency hospital found for this selection.",

    "slip.title": "Appointment Slip", "slip.number": "Slip number", "slip.patient": "Patient",
    "slip.hospital": "Hospital", "slip.address": "Address", "slip.doctor": "Doctor", "slip.disease": "Disease",
    "slip.date": "Date", "slip.time": "Time", "slip.status": "Status",
    "slip.note": "Please arrive 15 minutes early and carry this slip.",

    "voice.listening": "Listening... speak the disease name.", "voice.heard": "Heard: {text}",
    "voice.denied": "Microphone permission was denied.", "voice.error": "Could not understand. Please try again or type the name.",

    "msg.selectState": "Please select a state.", "msg.selectLocation": "Please select a location in {state}.",
    "msg.badCode": "Wrong admin access code.", "msg.created": "Account created. You can login now.",
    "msg.emailExists": "This email is already registered.", "msg.enterName": "Please enter your name.",
    "msg.newPass6": "New password must be at least 6 characters.", "msg.pass6": "Password must be at least 6 characters.",
    "msg.passMatch": "Passwords do not match.", "msg.resetOk": "Password changed. You can login now.",
    "msg.verifyFail": "Email and name do not match any account.", "msg.wrongLogin": "Wrong email or password.",

    "auth.tagline": "Find the right hospital and doctor for your health problem, close to where you are.",
    "auth.point1": "Search hospitals by state, location and disease",
    "auth.point2": "Compare hospitals by treatment cost, rating and doctors",
    "auth.point3": "Book appointments with a date and time slot",
    "auth.point4": "Patients, doctors and admins each have their own panel",
    "auth.login": "Login", "auth.signup": "Sign Up", "auth.email": "Email", "auth.password": "Password",
    "auth.enterPassword": "Enter password", "auth.loginBtn": "Login", "auth.forgot": "Forgot password?",
    "auth.doctorNote": "Doctors: your hospital admin creates your login.",
    "auth.resetTitle": "Reset your password", "auth.resetHelp": "Enter the email and full name you used to sign up, then choose a new password.",
    "auth.regEmail": "Registered Email", "auth.regName": "Registered Full Name", "auth.nameUsed": "Name used at signup",
    "auth.newPassword": "New Password", "auth.min6": "At least 6 characters", "auth.confirmNew": "Confirm New Password",
    "auth.reenterNew": "Re-enter new password", "auth.resetBtn": "Reset Password", "auth.back": "Back to login",
    "auth.fullName": "Full Name", "auth.yourName": "Your name", "auth.confirmPassword": "Confirm Password",
    "auth.reenter": "Re-enter password", "auth.registerAs": "Register as", "auth.rolePatient": "Patient (User)",
    "auth.roleAdmin": "Hospital Admin", "auth.adminCode": "Admin Access Code", "auth.enterCode": "Enter admin code",
    "auth.createBtn": "Create Account"
  },

  te: {
    "app.title": "ఆసుపత్రి నిర్వహణ వ్యవస్థ",
    "nav.hello": "నమస్కారం", "nav.logout": "లాగౌట్", "nav.emergency": "🚑 అత్యవసరం",

    "step.1": "1. రాష్ట్రం, ప్రాంతం & వ్యాధి", "step.2": "2. ఆసుపత్రిని ఎంచుకోండి",
    "step.3": "3. డాక్టర్‌ను ఎంచుకోండి", "step.4": "4. చికిత్స వివరాలు",

    "search.title": "ఆసుపత్రిని కనుగొనండి", "search.state": "రాష్ట్రం", "search.location": "ప్రాంతం",
    "search.disease": "వ్యాధి పేరు", "search.diseasePh": "ఉదా. మధుమేహం",
    "search.budget": "గరిష్ట బడ్జెట్ (₹, ఐచ్ఛికం)", "search.budgetPh": "ఉదా. 20000",
    "search.sort": "క్రమబద్ధీకరణ", "search.btn": "ఆసుపత్రులను వెతకండి", "search.voice": "వ్యాధి పేరు చెప్పండి",
    "search.selectState": "రాష్ట్రాన్ని ఎంచుకోండి", "search.selectLocation": "ప్రాంతాన్ని ఎంచుకోండి",
    "search.selectStateFirst": "ముందు రాష్ట్రాన్ని ఎంచుకోండి",
    "sort.relevance": "ఉత్తమ సరిపోలిక", "sort.cost": "తక్కువ ఖర్చు", "sort.rating": "ఎక్కువ రేటింగ్",
    "sort.experience": "అత్యధిక అనుభవం గల డాక్టర్", "sort.success": "ఉత్తమ విజయ శాతం",

    "results.title": "{location}, {state}లో {disease} కోసం {n} ఆసుపత్రులు",
    "results.hidden": "{n} దాచబడ్డాయి ({budget} కంటే ఎక్కువ)",
    "results.none": "ఈ ప్రాంతంలో ఈ వ్యాధికి ఆసుపత్రి దొరకలేదు. వేరే ప్రాంతం లేదా వ్యాధిని ప్రయత్నించండి.",
    "results.noneBudget": "మీ బడ్జెట్‌కు సరిపోయే ఆసుపత్రి లేదు. ఎక్కువ బడ్జెట్ ప్రయత్నించండి.",

    "card.click": "డాక్టర్లు, చికిత్స వివరాల కోసం క్లిక్ చేయండి",
    "card.compare": "పోల్చండి", "card.costUnknown": "ఈ వ్యాధికి ఖర్చు వివరాలు అందుబాటులో లేవు.",
    "card.doctors": "డాక్టర్లు", "card.emergency": "24x7 అత్యవసర సేవ", "card.rating": "రేటింగ్",
    "card.reviews": "{n} సమీక్షలు",

    "compare.title": "ఆసుపత్రుల పోలిక", "compare.btn": "ఎంచుకున్నవి పోల్చండి", "compare.clear": "క్లియర్",
    "compare.count": "{n} ఎంచుకున్నారు", "compare.for": "పోలిక: {disease}",
    "compare.min": "పోల్చడానికి కనీసం 2 ఆసుపత్రులను ఎంచుకోండి.", "compare.max": "గరిష్టంగా 3 ఆసుపత్రులను పోల్చవచ్చు.",
    "compare.cost": "అంచనా ఖర్చు", "compare.duration": "వ్యవధి", "compare.rating": "రేటింగ్",
    "compare.location": "ప్రాంతం", "compare.doctors": "డాక్టర్లు", "compare.availableNow": "అందుబాటులో",
    "compare.topExperience": "అత్యధిక అనుభవం గల డాక్టర్", "compare.topSuccess": "ఉత్తమ విజయ శాతం",
    "compare.emergency": "24x7 అత్యవసర సేవ", "compare.view": "డాక్టర్లను చూడండి",
    "badge.cheapest": "తక్కువ ఖర్చు", "badge.bestRated": "ఉత్తమ రేటింగ్", "badge.bestSuccess": "ఉత్తమ విజయ శాతం",
    "common.yes": "అవును", "common.no": "కాదు", "common.cancel": "రద్దు", "common.close": "మూసివేయి", "common.confirm": "నిర్ధారించు",

    "doc.titleAt": "{name} లోని డాక్టర్లు", "doc.experience": "అనుభవం", "doc.years": "సంవత్సరాలు",
    "doc.success": "విజయ శాతం", "doc.timings": "సమయాలు", "doc.available": "అందుబాటులో ఉన్నారు",
    "doc.notAvailable": "అందుబాటులో లేరు", "doc.book": "అపాయింట్‌మెంట్ బుక్ చేయండి",
    "doc.viewTreatment": "చికిత్స వివరాలు చూడండి", "doc.none": "ఈ ఆసుపత్రిలో డాక్టర్లు లేరు.",

    "loc.title": "ఆసుపత్రి స్థానం", "loc.location": "ప్రాంతం", "loc.state": "రాష్ట్రం",
    "loc.map": "గూగుల్ మ్యాప్స్‌లో తెరవండి", "loc.emergency": "24x7 అత్యవసర సేవ", "loc.ambulance": "అంబులెన్స్",

    "treat.title": "చికిత్స వివరాలు", "treat.cost": "అంచనా ఖర్చు", "treat.duration": "చికిత్స వ్యవధి",
    "treat.medicines": "సాధారణ మందులు", "treat.book": "{name} తో అపాయింట్‌మెంట్ బుక్ చేయండి",
    "treat.confirm": "డాక్టర్‌తో బుక్ చేసి మీ ఎంపికను నిర్ధారించండి.",
    "treat.notAvail": "ఈ డాక్టర్ ప్రస్తుతం అందుబాటులో లేరు",
    "treat.note": "ఖర్చులు, వ్యవధులు, మందులు ప్రదర్శన కోసం నమూనా విలువలు మాత్రమే. అసలు చికిత్సను డాక్టర్ నిర్ణయిస్తారు.",

    "book.title": "అపాయింట్‌మెంట్ బుక్ చేయండి", "book.date": "తేదీని ఎంచుకోండి", "book.time": "సమయాన్ని ఎంచుకోండి",
    "book.chooseDateFirst": "ముందు తేదీని ఎంచుకోండి", "book.noSlots": "ఈ తేదీన స్లాట్లు లేవు", "book.booked": "బుక్ అయింది",
    "book.pickDate": "దయచేసి తేదీని ఎంచుకోండి.", "book.pickTime": "దయచేసి సమయాన్ని ఎంచుకోండి.",
    "book.past": "దయచేసి ఈరోజు లేదా భవిష్యత్ తేదీని ఎంచుకోండి.", "book.noFree": "ఈ తేదీన ఖాళీ స్లాట్లు లేవు.",
    "book.duplicate": "ఈ సమయంలో ఈ డాక్టర్‌తో మీకు ఇప్పటికే అపాయింట్‌మెంట్ ఉంది.",
    "book.slotGone": "క్షమించండి, ఈ స్లాట్ ఇప్పుడే బుక్ అయింది. వేరొకటి ఎంచుకోండి.",
    "book.notOnDay": "{name} {day} నాడు పనిచేయరు. సమయాలు: {timings}",
    "book.done": "{name} తో {date} న {time} కు అపాయింట్‌మెంట్ బుక్ అయింది.",

    "appt.title": "నా అపాయింట్‌మెంట్లు", "appt.date": "తేదీ", "appt.time": "సమయం", "appt.hospital": "ఆసుపత్రి",
    "appt.doctor": "డాక్టర్", "appt.disease": "వ్యాధి", "appt.status": "స్థితి",
    "appt.none": "మీరు ఇంకా ఏ అపాయింట్‌మెంట్ బుక్ చేయలేదు.",
    "btn.cancel": "రద్దు చేయి", "btn.delete": "తొలగించు", "btn.prescription": "ప్రిస్క్రిప్షన్",
    "btn.rate": "రేట్ చేయండి", "btn.slip": "స్లిప్ ప్రింట్",
    "status.Booked": "బుక్ అయింది", "status.Completed": "పూర్తయింది", "status.Cancelled": "రద్దయింది",
    "day.0": "ఆదివారం", "day.1": "సోమవారం", "day.2": "మంగళవారం", "day.3": "బుధవారం",
    "day.4": "గురువారం", "day.5": "శుక్రవారం", "day.6": "శనివారం",

    "fb.title": "మీ చికిత్సకు రేటింగ్ ఇవ్వండి", "fb.comment": "వ్యాఖ్య (ఐచ్ఛికం)", "fb.submit": "సమర్పించు",
    "fb.pickStars": "దయచేసి స్టార్ రేటింగ్ ఎంచుకోండి.", "fb.thanks": "మీ అభిప్రాయానికి ధన్యవాదాలు!", "fb.rated": "రేటింగ్ {n}/5",

    "rx.title": "నా ప్రిస్క్రిప్షన్లు", "rx.none": "ప్రిస్క్రిప్షన్లు ఇంకా లేవు. డాక్టర్ మీ సందర్శనను పూర్తి చేసిన తర్వాత ఇక్కడ కనిపిస్తాయి.",
    "rx.diagnosis": "నిర్ధారణ", "rx.medicine": "మందు", "rx.dosage": "మోతాదు", "rx.duration": "వ్యవధి",
    "rx.followUp": "తదుపరి సందర్శన", "rx.notes": "గమనికలు", "rx.print": "ప్రింట్", "rx.printTitle": "ప్రిస్క్రిప్షన్",
    "rx.addReminder": "రిమైండర్ జోడించు",

    "rem.title": "మందుల రిమైండర్లు", "rem.help": "మీ బ్రౌజర్‌లో ఈ పేజీ తెరిచి ఉన్నప్పుడు, ఎంచుకున్న సమయానికి రిమైండర్లు ఇక్కడ కనిపిస్తాయి.",
    "rem.medicine": "మందు", "rem.time": "ప్రతిరోజూ సమయం", "rem.timeShort": "సమయం", "rem.start": "ప్రారంభ తేదీ",
    "rem.end": "ముగింపు తేదీ (ఐచ్ఛికం)", "rem.add": "రిమైండర్ జోడించు", "rem.enable": "బ్రౌజర్ నోటిఫికేషన్లు ఆన్ చేయండి",
    "rem.dates": "తేదీలు", "rem.today": "ఈరోజు", "rem.none": "రిమైండర్లు ఇంకా లేవు.",
    "rem.added": "రిమైండర్ జోడించబడింది.", "rem.badDates": "ముగింపు తేదీ ప్రారంభ తేదీ కంటే ముందు ఉండకూడదు.",
    "rem.dismiss": "మూసివేయి", "rem.taken": "వేసుకున్నాను", "rem.pause": "ఆపు", "rem.resume": "కొనసాగించు",
    "rem.doneToday": "ఈరోజు వేసుకున్నారు", "rem.dueNow": "ఇప్పుడు వేసుకోవాలి", "rem.paused": "ఆపబడింది", "rem.upcoming": "రాబోయేది",
    "rem.dueTitle": "మందు వేసుకునే సమయం",
    "rem.notifyOn": "బ్రౌజర్ నోటిఫికేషన్లు ఆన్‌లో ఉన్నాయి.", "rem.notifyBlocked": "మీ బ్రౌజర్ సెట్టింగ్స్‌లో నోటిఫికేషన్లు నిరోధించబడ్డాయి.",
    "rem.notifyUnsupported": "ఈ బ్రౌజర్ నోటిఫికేషన్లకు మద్దతు ఇవ్వదు.",

    "em.title": "🚑 అత్యవసర సహాయం", "em.national": "జాతీయ నంబర్లు:", "em.ambulance": "(అంబులెన్స్)",
    "em.allEmergencies": "(అన్ని అత్యవసరాలు)", "em.allCities": "అన్ని నగరాలు", "em.call": "కాల్ చేయండి",
    "em.nearby": "{city}, {state} సమీపంలోని అత్యవసర ఆసుపత్రులు", "em.noNumber": "నంబర్ లేదు",
    "em.none": "ఈ ఎంపికకు అత్యవసర ఆసుపత్రి దొరకలేదు.",

    "slip.title": "అపాయింట్‌మెంట్ స్లిప్", "slip.number": "స్లిప్ నంబర్", "slip.patient": "రోగి",
    "slip.hospital": "ఆసుపత్రి", "slip.address": "చిరునామా", "slip.doctor": "డాక్టర్", "slip.disease": "వ్యాధి",
    "slip.date": "తేదీ", "slip.time": "సమయం", "slip.status": "స్థితి",
    "slip.note": "దయచేసి 15 నిమిషాల ముందు వచ్చి ఈ స్లిప్ తీసుకురండి.",

    "voice.listening": "వింటున్నాను... వ్యాధి పేరు చెప్పండి.", "voice.heard": "విన్నది: {text}",
    "voice.denied": "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది.", "voice.error": "అర్థం కాలేదు. మళ్ళీ ప్రయత్నించండి లేదా పేరు టైప్ చేయండి.",

    "msg.selectState": "దయచేసి రాష్ట్రాన్ని ఎంచుకోండి.", "msg.selectLocation": "దయచేసి {state}లో ప్రాంతాన్ని ఎంచుకోండి.",
    "msg.badCode": "అడ్మిన్ యాక్సెస్ కోడ్ తప్పు.", "msg.created": "ఖాతా సృష్టించబడింది. ఇప్పుడు లాగిన్ చేయవచ్చు.",
    "msg.emailExists": "ఈ ఇమెయిల్ ఇప్పటికే నమోదై ఉంది.", "msg.enterName": "దయచేసి మీ పేరు నమోదు చేయండి.",
    "msg.newPass6": "కొత్త పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.", "msg.pass6": "పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.",
    "msg.passMatch": "పాస్‌వర్డ్‌లు సరిపోలలేదు.", "msg.resetOk": "పాస్‌వర్డ్ మార్చబడింది. ఇప్పుడు లాగిన్ చేయవచ్చు.",
    "msg.verifyFail": "ఇమెయిల్, పేరు ఏ ఖాతాతోనూ సరిపోలలేదు.", "msg.wrongLogin": "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు.",

    "auth.tagline": "మీ ఆరోగ్య సమస్యకు, మీకు దగ్గరలో సరైన ఆసుపత్రి, డాక్టర్‌ను కనుగొనండి.",
    "auth.point1": "రాష్ట్రం, ప్రాంతం, వ్యాధి ఆధారంగా ఆసుపత్రులను వెతకండి",
    "auth.point2": "చికిత్స ఖర్చు, రేటింగ్, డాక్టర్ల ఆధారంగా ఆసుపత్రులను పోల్చండి",
    "auth.point3": "తేదీ, సమయంతో అపాయింట్‌మెంట్లు బుక్ చేయండి",
    "auth.point4": "రోగులు, డాక్టర్లు, అడ్మిన్లకు ఒక్కొక్కరికి వేర్వేరు ప్యానెల్",
    "auth.login": "లాగిన్", "auth.signup": "సైన్ అప్", "auth.email": "ఇమెయిల్", "auth.password": "పాస్‌వర్డ్",
    "auth.enterPassword": "పాస్‌వర్డ్ నమోదు చేయండి", "auth.loginBtn": "లాగిన్", "auth.forgot": "పాస్‌వర్డ్ మర్చిపోయారా?",
    "auth.doctorNote": "డాక్టర్లు: మీ ఆసుపత్రి అడ్మిన్ మీకు లాగిన్ సృష్టిస్తారు.",
    "auth.resetTitle": "మీ పాస్‌వర్డ్ రీసెట్ చేయండి", "auth.resetHelp": "సైన్ అప్ సమయంలో ఉపయోగించిన ఇమెయిల్, పూర్తి పేరు నమోదు చేసి, కొత్త పాస్‌వర్డ్ ఎంచుకోండి.",
    "auth.regEmail": "నమోదైన ఇమెయిల్", "auth.regName": "నమోదైన పూర్తి పేరు", "auth.nameUsed": "సైన్ అప్‌లో ఉపయోగించిన పేరు",
    "auth.newPassword": "కొత్త పాస్‌వర్డ్", "auth.min6": "కనీసం 6 అక్షరాలు", "auth.confirmNew": "కొత్త పాస్‌వర్డ్ నిర్ధారించండి",
    "auth.reenterNew": "కొత్త పాస్‌వర్డ్ మళ్ళీ నమోదు చేయండి", "auth.resetBtn": "పాస్‌వర్డ్ రీసెట్ చేయి", "auth.back": "లాగిన్‌కు తిరిగి వెళ్ళు",
    "auth.fullName": "పూర్తి పేరు", "auth.yourName": "మీ పేరు", "auth.confirmPassword": "పాస్‌వర్డ్ నిర్ధారించండి",
    "auth.reenter": "పాస్‌వర్డ్ మళ్ళీ నమోదు చేయండి", "auth.registerAs": "నమోదు రకం", "auth.rolePatient": "రోగి (వినియోగదారు)",
    "auth.roleAdmin": "ఆసుపత్రి అడ్మిన్", "auth.adminCode": "అడ్మిన్ యాక్సెస్ కోడ్", "auth.enterCode": "అడ్మిన్ కోడ్ నమోదు చేయండి",
    "auth.createBtn": "ఖాతా సృష్టించు"
  },

  hi: {
    "app.title": "अस्पताल प्रबंधन प्रणाली",
    "nav.hello": "नमस्ते", "nav.logout": "लॉगआउट", "nav.emergency": "🚑 आपातकाल",

    "step.1": "1. राज्य, स्थान और बीमारी", "step.2": "2. अस्पताल चुनें",
    "step.3": "3. डॉक्टर चुनें", "step.4": "4. इलाज का विवरण",

    "search.title": "अस्पताल खोजें", "search.state": "राज्य", "search.location": "स्थान",
    "search.disease": "बीमारी का नाम", "search.diseasePh": "जैसे मधुमेह",
    "search.budget": "अधिकतम बजट (₹, वैकल्पिक)", "search.budgetPh": "जैसे 20000",
    "search.sort": "क्रमबद्ध करें", "search.btn": "अस्पताल खोजें", "search.voice": "बीमारी का नाम बोलें",
    "search.selectState": "राज्य चुनें", "search.selectLocation": "स्थान चुनें",
    "search.selectStateFirst": "पहले राज्य चुनें",
    "sort.relevance": "सबसे उपयुक्त", "sort.cost": "सबसे कम खर्च", "sort.rating": "सबसे अधिक रेटिंग",
    "sort.experience": "सबसे अनुभवी डॉक्टर", "sort.success": "सर्वश्रेष्ठ सफलता दर",

    "results.title": "{location}, {state} में {disease} के लिए {n} अस्पताल",
    "results.hidden": "{n} छिपे हैं ({budget} से अधिक)",
    "results.none": "इस स्थान पर इस बीमारी के लिए कोई अस्पताल नहीं मिला। कोई और स्थान या बीमारी आज़माएँ।",
    "results.noneBudget": "आपके बजट में कोई अस्पताल नहीं है। अधिक बजट आज़माएँ।",

    "card.click": "डॉक्टर और इलाज का विवरण देखने के लिए क्लिक करें",
    "card.compare": "तुलना करें", "card.costUnknown": "इस बीमारी के लिए खर्च का विवरण उपलब्ध नहीं है।",
    "card.doctors": "डॉक्टर", "card.emergency": "24x7 आपातकालीन सेवा", "card.rating": "रेटिंग",
    "card.reviews": "{n} समीक्षाएँ",

    "compare.title": "अस्पतालों की तुलना", "compare.btn": "चुने हुए की तुलना करें", "compare.clear": "साफ़ करें",
    "compare.count": "{n} चुने गए", "compare.for": "तुलना: {disease}",
    "compare.min": "तुलना के लिए कम से कम 2 अस्पताल चुनें।", "compare.max": "अधिकतम 3 अस्पतालों की तुलना कर सकते हैं।",
    "compare.cost": "अनुमानित खर्च", "compare.duration": "अवधि", "compare.rating": "रेटिंग",
    "compare.location": "स्थान", "compare.doctors": "डॉक्टर", "compare.availableNow": "उपलब्ध",
    "compare.topExperience": "सबसे अनुभवी डॉक्टर", "compare.topSuccess": "सर्वश्रेष्ठ सफलता दर",
    "compare.emergency": "24x7 आपातकालीन सेवा", "compare.view": "डॉक्टर देखें",
    "badge.cheapest": "सबसे कम खर्च", "badge.bestRated": "सर्वश्रेष्ठ रेटिंग", "badge.bestSuccess": "सर्वश्रेष्ठ सफलता दर",
    "common.yes": "हाँ", "common.no": "नहीं", "common.cancel": "रद्द करें", "common.close": "बंद करें", "common.confirm": "पुष्टि करें",

    "doc.titleAt": "{name} के डॉक्टर", "doc.experience": "अनुभव", "doc.years": "वर्ष",
    "doc.success": "सफलता दर", "doc.timings": "समय", "doc.available": "उपलब्ध",
    "doc.notAvailable": "उपलब्ध नहीं", "doc.book": "अपॉइंटमेंट बुक करें",
    "doc.viewTreatment": "इलाज का विवरण देखें", "doc.none": "इस अस्पताल में कोई डॉक्टर नहीं मिला।",

    "loc.title": "अस्पताल का स्थान", "loc.location": "स्थान", "loc.state": "राज्य",
    "loc.map": "गूगल मैप्स में खोलें", "loc.emergency": "24x7 आपातकालीन सेवा", "loc.ambulance": "एम्बुलेंस",

    "treat.title": "इलाज का विवरण", "treat.cost": "अनुमानित खर्च", "treat.duration": "इलाज की अवधि",
    "treat.medicines": "सामान्य दवाइयाँ", "treat.book": "{name} के साथ अपॉइंटमेंट बुक करें",
    "treat.confirm": "कृपया डॉक्टर के साथ बुक करके अपनी पसंद की पुष्टि करें।",
    "treat.notAvail": "यह डॉक्टर अभी उपलब्ध नहीं हैं",
    "treat.note": "खर्च, अवधि और दवाइयाँ केवल प्रदर्शन के लिए नमूना मान हैं। असली इलाज डॉक्टर तय करते हैं।",

    "book.title": "अपॉइंटमेंट बुक करें", "book.date": "तारीख चुनें", "book.time": "समय चुनें",
    "book.chooseDateFirst": "पहले तारीख चुनें", "book.noSlots": "इस तारीख पर कोई स्लॉट नहीं", "book.booked": "बुक है",
    "book.pickDate": "कृपया तारीख चुनें।", "book.pickTime": "कृपया समय चुनें।",
    "book.past": "कृपया आज या भविष्य की तारीख चुनें।", "book.noFree": "इस तारीख पर कोई खाली स्लॉट नहीं है।",
    "book.duplicate": "इस समय इस डॉक्टर के साथ आपका पहले से अपॉइंटमेंट है।",
    "book.slotGone": "क्षमा करें, यह स्लॉट अभी बुक हो गया। कृपया दूसरा चुनें।",
    "book.notOnDay": "{name} {day} को नहीं बैठते। समय: {timings}",
    "book.done": "{name} के साथ {date} को {time} बजे अपॉइंटमेंट बुक हो गया।",

    "appt.title": "मेरे अपॉइंटमेंट", "appt.date": "तारीख", "appt.time": "समय", "appt.hospital": "अस्पताल",
    "appt.doctor": "डॉक्टर", "appt.disease": "बीमारी", "appt.status": "स्थिति",
    "appt.none": "आपने अभी तक कोई अपॉइंटमेंट बुक नहीं किया है।",
    "btn.cancel": "रद्द करें", "btn.delete": "हटाएँ", "btn.prescription": "पर्चा",
    "btn.rate": "रेटिंग दें", "btn.slip": "पर्ची प्रिंट करें",
    "status.Booked": "बुक है", "status.Completed": "पूरा हुआ", "status.Cancelled": "रद्द",
    "day.0": "रविवार", "day.1": "सोमवार", "day.2": "मंगलवार", "day.3": "बुधवार",
    "day.4": "गुरुवार", "day.5": "शुक्रवार", "day.6": "शनिवार",

    "fb.title": "अपने इलाज को रेटिंग दें", "fb.comment": "टिप्पणी (वैकल्पिक)", "fb.submit": "जमा करें",
    "fb.pickStars": "कृपया स्टार रेटिंग चुनें।", "fb.thanks": "आपकी प्रतिक्रिया के लिए धन्यवाद!", "fb.rated": "रेटिंग {n}/5",

    "rx.title": "मेरे पर्चे", "rx.none": "अभी कोई पर्चा नहीं है। डॉक्टर द्वारा विज़िट पूरी करने के बाद यहाँ दिखेगा।",
    "rx.diagnosis": "निदान", "rx.medicine": "दवा", "rx.dosage": "खुराक", "rx.duration": "अवधि",
    "rx.followUp": "अगली जाँच", "rx.notes": "टिप्पणियाँ", "rx.print": "प्रिंट करें", "rx.printTitle": "पर्चा",
    "rx.addReminder": "रिमाइंडर जोड़ें",

    "rem.title": "दवा रिमाइंडर", "rem.help": "आपके ब्राउज़र में यह पेज खुला रहने पर चुने हुए समय पर रिमाइंडर यहाँ दिखेंगे।",
    "rem.medicine": "दवा", "rem.time": "हर दिन का समय", "rem.timeShort": "समय", "rem.start": "शुरू होने की तारीख",
    "rem.end": "समाप्ति की तारीख (वैकल्पिक)", "rem.add": "रिमाइंडर जोड़ें", "rem.enable": "ब्राउज़र सूचनाएँ चालू करें",
    "rem.dates": "तारीखें", "rem.today": "आज", "rem.none": "अभी कोई रिमाइंडर नहीं है।",
    "rem.added": "रिमाइंडर जोड़ा गया।", "rem.badDates": "समाप्ति की तारीख शुरू होने की तारीख से पहले नहीं हो सकती।",
    "rem.dismiss": "बंद करें", "rem.taken": "ले ली", "rem.pause": "रोकें", "rem.resume": "फिर शुरू करें",
    "rem.doneToday": "आज ले ली", "rem.dueNow": "अभी लेनी है", "rem.paused": "रुका हुआ", "rem.upcoming": "आने वाली",
    "rem.dueTitle": "दवा लेने का समय",
    "rem.notifyOn": "ब्राउज़र सूचनाएँ चालू हैं।", "rem.notifyBlocked": "आपकी ब्राउज़र सेटिंग में सूचनाएँ रोकी गई हैं।",
    "rem.notifyUnsupported": "यह ब्राउज़र सूचनाओं का समर्थन नहीं करता।",

    "em.title": "🚑 आपातकालीन सहायता", "em.national": "राष्ट्रीय नंबर:", "em.ambulance": "(एम्बुलेंस)",
    "em.allEmergencies": "(सभी आपात स्थितियाँ)", "em.allCities": "सभी शहर", "em.call": "कॉल करें",
    "em.nearby": "{city}, {state} के पास के आपातकालीन अस्पताल", "em.noNumber": "नंबर उपलब्ध नहीं",
    "em.none": "इस चयन के लिए कोई आपातकालीन अस्पताल नहीं मिला।",

    "slip.title": "अपॉइंटमेंट पर्ची", "slip.number": "पर्ची संख्या", "slip.patient": "मरीज़",
    "slip.hospital": "अस्पताल", "slip.address": "पता", "slip.doctor": "डॉक्टर", "slip.disease": "बीमारी",
    "slip.date": "तारीख", "slip.time": "समय", "slip.status": "स्थिति",
    "slip.note": "कृपया 15 मिनट पहले पहुँचें और यह पर्ची साथ लाएँ।",

    "voice.listening": "सुन रहा हूँ... बीमारी का नाम बोलें।", "voice.heard": "सुना: {text}",
    "voice.denied": "माइक्रोफ़ोन की अनुमति अस्वीकार कर दी गई।", "voice.error": "समझ नहीं आया। फिर कोशिश करें या नाम टाइप करें।",

    "msg.selectState": "कृपया राज्य चुनें।", "msg.selectLocation": "कृपया {state} में स्थान चुनें।",
    "msg.badCode": "एडमिन एक्सेस कोड गलत है।", "msg.created": "खाता बन गया। अब आप लॉगिन कर सकते हैं।",
    "msg.emailExists": "यह ईमेल पहले से पंजीकृत है।", "msg.enterName": "कृपया अपना नाम दर्ज करें।",
    "msg.newPass6": "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।", "msg.pass6": "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    "msg.passMatch": "पासवर्ड मेल नहीं खाते।", "msg.resetOk": "पासवर्ड बदल दिया गया। अब आप लॉगिन कर सकते हैं।",
    "msg.verifyFail": "ईमेल और नाम किसी खाते से मेल नहीं खाते।", "msg.wrongLogin": "ईमेल या पासवर्ड गलत है।",

    "auth.tagline": "अपनी स्वास्थ्य समस्या के लिए अपने पास सही अस्पताल और डॉक्टर खोजें।",
    "auth.point1": "राज्य, स्थान और बीमारी के अनुसार अस्पताल खोजें",
    "auth.point2": "इलाज के खर्च, रेटिंग और डॉक्टरों के आधार पर अस्पतालों की तुलना करें",
    "auth.point3": "तारीख और समय स्लॉट के साथ अपॉइंटमेंट बुक करें",
    "auth.point4": "मरीज़, डॉक्टर और एडमिन के लिए अलग-अलग पैनल",
    "auth.login": "लॉगिन", "auth.signup": "साइन अप", "auth.email": "ईमेल", "auth.password": "पासवर्ड",
    "auth.enterPassword": "पासवर्ड दर्ज करें", "auth.loginBtn": "लॉगिन", "auth.forgot": "पासवर्ड भूल गए?",
    "auth.doctorNote": "डॉक्टर: आपका लॉगिन अस्पताल एडमिन बनाएगा।",
    "auth.resetTitle": "अपना पासवर्ड रीसेट करें", "auth.resetHelp": "साइन अप में इस्तेमाल किया गया ईमेल और पूरा नाम दर्ज करें, फिर नया पासवर्ड चुनें।",
    "auth.regEmail": "पंजीकृत ईमेल", "auth.regName": "पंजीकृत पूरा नाम", "auth.nameUsed": "साइन अप में इस्तेमाल किया गया नाम",
    "auth.newPassword": "नया पासवर्ड", "auth.min6": "कम से कम 6 अक्षर", "auth.confirmNew": "नए पासवर्ड की पुष्टि करें",
    "auth.reenterNew": "नया पासवर्ड दोबारा दर्ज करें", "auth.resetBtn": "पासवर्ड रीसेट करें", "auth.back": "लॉगिन पर वापस जाएँ",
    "auth.fullName": "पूरा नाम", "auth.yourName": "आपका नाम", "auth.confirmPassword": "पासवर्ड की पुष्टि करें",
    "auth.reenter": "पासवर्ड दोबारा दर्ज करें", "auth.registerAs": "पंजीकरण का प्रकार", "auth.rolePatient": "मरीज़ (उपयोगकर्ता)",
    "auth.roleAdmin": "अस्पताल एडमिन", "auth.adminCode": "एडमिन एक्सेस कोड", "auth.enterCode": "एडमिन कोड दर्ज करें",
    "auth.createBtn": "खाता बनाएँ"
  }
};

// Treatment durations (stored in English in common.js)
var DURATION_TEXT = {
  te: {
    "1 - 3 weeks": "1 - 3 వారాలు",
    "1 - 4 weeks, depends on stone size": "1 - 4 వారాలు, రాయి పరిమాణాన్ని బట్టి",
    "10 - 14 days": "10 - 14 రోజులు",
    "2 - 4 weeks, then follow-up": "2 - 4 వారాలు, తర్వాత ఫాలో-అప్",
    "2 - 6 weeks, then long-term follow-up": "2 - 6 వారాలు, తర్వాత దీర్ఘకాల ఫాలో-అప్",
    "3 - 5 days": "3 - 5 రోజులు",
    "5 - 7 days": "5 - 7 రోజులు",
    "6 - 12 weeks": "6 - 12 వారాలు",
    "7 - 10 days": "7 - 10 రోజులు",
    "9 months with regular check-ups": "9 నెలలు, క్రమం తప్పని పరీక్షలతో",
    "Long-term, first review in 3 months": "దీర్ఘకాలం, మొదటి సమీక్ష 3 నెలల్లో",
    "Long-term, review every 1 - 3 months": "దీర్ఘకాలం, ప్రతి 1 - 3 నెలలకు సమీక్ష",
    "Long-term, review every 3 months": "దీర్ఘకాలం, ప్రతి 3 నెలలకు సమీక్ష",
    "Several months, depends on type and stage": "అనేక నెలలు, రకం మరియు దశను బట్టి"
  },
  hi: {
    "1 - 3 weeks": "1 - 3 सप्ताह",
    "1 - 4 weeks, depends on stone size": "1 - 4 सप्ताह, पथरी के आकार पर निर्भर",
    "10 - 14 days": "10 - 14 दिन",
    "2 - 4 weeks, then follow-up": "2 - 4 सप्ताह, फिर फॉलो-अप",
    "2 - 6 weeks, then long-term follow-up": "2 - 6 सप्ताह, फिर लंबे समय तक फॉलो-अप",
    "3 - 5 days": "3 - 5 दिन",
    "5 - 7 days": "5 - 7 दिन",
    "6 - 12 weeks": "6 - 12 सप्ताह",
    "7 - 10 days": "7 - 10 दिन",
    "9 months with regular check-ups": "9 महीने, नियमित जाँच के साथ",
    "Long-term, first review in 3 months": "लंबे समय तक, पहली समीक्षा 3 महीने में",
    "Long-term, review every 1 - 3 months": "लंबे समय तक, हर 1 - 3 महीने में समीक्षा",
    "Long-term, review every 3 months": "लंबे समय तक, हर 3 महीने में समीक्षा",
    "Several months, depends on type and stage": "कई महीने, प्रकार और चरण पर निर्भर"
  }
};

function getLang() {
  var lang = "en";
  try { lang = localStorage.getItem("hms_lang") || "en"; } catch (e) { lang = "en"; }
  return I18N[lang] ? lang : "en";
}

function setLang(lang) {
  if (!I18N[lang]) { lang = "en"; }
  try { localStorage.setItem("hms_lang", lang); } catch (e) { /* storage blocked */ }
  document.documentElement.lang = lang;
}

// t("book.done", { name: "Dr. X" }) replaces {name} in the text.
function t(key, vars) {
  var text = I18N[getLang()][key];
  if (text === undefined) { text = I18N.en[key]; }
  if (text === undefined) { return key; }
  if (vars) {
    for (var name in vars) {
      text = text.split("{" + name + "}").join(String(vars[name]));
    }
  }
  return text;
}

function durationLabel(englishText) {
  var lang = getLang();
  if (lang !== "en" && DURATION_TEXT[lang] && DURATION_TEXT[lang][englishText]) {
    return DURATION_TEXT[lang][englishText];
  }
  return englishText;
}

function applyTranslations() {
  document.documentElement.lang = getLang();
  var items = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < items.length; i++) {
    items[i].textContent = t(items[i].getAttribute("data-i18n"));
  }
  items = document.querySelectorAll("[data-i18n-placeholder]");
  for (var j = 0; j < items.length; j++) {
    items[j].setAttribute("placeholder", t(items[j].getAttribute("data-i18n-placeholder")));
  }
  items = document.querySelectorAll("[data-i18n-title]");
  for (var k = 0; k < items.length; k++) {
    items[k].setAttribute("title", t(items[k].getAttribute("data-i18n-title")));
  }
}

function buildLangSwitcher(slotId) {
  var slot = document.getElementById(slotId);
  if (!slot) { return; }
  var select = document.createElement("select");
  select.className = "lang-select";
  select.setAttribute("aria-label", "Language");
  var options = [["en", "English"], ["te", "తెలుగు"], ["hi", "हिन्दी"]];
  for (var i = 0; i < options.length; i++) {
    var opt = document.createElement("option");
    opt.value = options[i][0];
    opt.textContent = options[i][1];
    select.appendChild(opt);
  }
  select.value = getLang();
  select.addEventListener("change", function () {
    setLang(select.value);
    applyTranslations();
    if (typeof window.onLanguageChange === "function") { window.onLanguageChange(); }
  });
  slot.innerHTML = "";
  slot.appendChild(select);
}
