# Hospital Management System (SDC Project)

A front-end only Hospital Management System built with **HTML, CSS and JavaScript** (no frameworks, no backend).
Data is stored in the browser's **Local Storage**.

## Modules

**User (Patient) module** - `user.html`
1. Login / Signup (with Forgot Password)
2. Select a **state**, then a **location**, then type or **speak** (voice search) a disease name
3. Optional **maximum budget** and **sort** (best match, lowest cost, highest rating, most experienced doctor, best success rate)
4. See all matching hospitals with estimated cost, duration, rating and a 24x7 emergency badge
5. **Compare** up to 3 hospitals side by side (cost, duration, rating, doctors, best success rate, emergency)
6. Click a hospital to see its location (address, map link, ambulance number) and its doctors
7. Choose a doctor to see **treatment details** (cost, duration, medicines - sample values)
8. Book an appointment by **date and time slot**; cancel; print an **appointment slip**
9. After a visit is Completed: **rate the treatment** (1-5 stars); ratings update the hospital rating
10. **My Prescriptions**: see and print prescriptions written by the doctor
11. **Medicine reminders**: daily reminders shown on the page (and as browser notifications if allowed) while the page is open
12. **Emergency** button: national numbers (112 / 108) and emergency hospitals by state / city
13. **Language**: English, Telugu or Hindi (switcher in the top bar)

**Doctor module** - `doctor.html`
- Sees only their own appointments (filter by status)
- Opens a consultation: patient history of earlier visits and prescriptions
- Writes a prescription (diagnosis, medicines with dosage and duration, follow-up date, notes); the appointment becomes Completed

**Admin module** - `admin.html`
- Dashboard counts
- Add / delete hospitals (state, cost level, 24x7 emergency, ambulance number) and doctors; toggle availability
- **Create doctor logins** (links a login to a doctor)
- View all appointments and update status; view registered users (Admin / Doctor / Patient)
- **Analytics**: appointments per hospital, most searched diseases, appointments by status, hospital ratings and patient feedback (canvas charts, no libraries). "Add sample activity" fills the charts for a demo and can be removed again.

## Demo logins

| Role  | Email          | Password   |
|-------|----------------|------------|
| Admin | admin@hms.com  | admin123   |
| Patient (demo) | patient@hms.com | patient123 |
| Doctor (demo) | doctor@hms.com | doctor123 |
| New user | Sign up on the login page | your choice |

Demo accounts are created automatically whenever they are missing from the browser's storage.
To sign up as an admin, choose "Hospital Admin" and enter the access code `ADMIN2026`.

## Forgot password

On the login form click **Forgot password?**, enter the registered email and the full name used at signup,
then choose a new password. (A front-end only project cannot send emails, so the name is used to verify the user.)

## Appointment time slots

- Slots are 30 minutes long and are generated from the doctor's timings, e.g. `Mon-Fri, 10 AM - 2 PM`.
- Days outside the doctor's working days, times already passed today, and slots already booked are not available.
- When adding a doctor in the admin panel, enter timings in the same format (`Mon-Fri, 10 AM - 2 PM` or `Daily, 9 AM - 12 PM`).

## Files

| File          | Purpose                                          |
|---------------|--------------------------------------------------|
| `index.html`  | Login / Signup / Forgot password page            |
| `auth.js`     | Signup, login, password reset, redirection by role |
| `common.js`   | Local Storage helpers, slot helpers, sample hospital data |
| `i18n.js`     | English / Telugu / Hindi text and language switcher |
| `user.html` / `user.js`   | User module                          |
| `doctor.html` / `doctor.js` | Doctor module                      |
| `admin.html` / `admin.js` | Admin module                         |
| `style.css`   | Styling (CSS Grid + Flexbox)                     |

## How to run

Open `index.html` in a browser. No installation needed.

## Push to GitHub

```bash
git init
git add .
git commit -m "Hospital Management System - SDC Review 1"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Local Storage keys

`hms_users`, `hms_hospitals`, `hms_appointments`, `hms_session`, `hms_version`, `hms_prescriptions`,
`hms_feedback`, `hms_reminders`, `hms_searches`, `hms_lang`.

## Limits to know

- Costs, durations, medicines and ambulance numbers are **sample data**; 112 and 108 are the real national numbers.
- Voice search needs Chrome or Edge and microphone permission.
- Reminders only fire while the page is open.
- Telugu / Hindi cover the login and patient pages; the Admin and Doctor panels are in English. Translations should be checked by a native speaker.

## Note

Passwords are stored in plain text in Local Storage because this is a learning project with no server.
A real system would hash passwords and use a backend.
