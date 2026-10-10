// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOun36sO0FR2Tk9Vz-WD4_VuOyEwqdQJQ",
  authDomain: "hacktivators.firebaseapp.com",
  projectId: "hacktivators",
  storageBucket: "hacktivators.firebasestorage.app",
  messagingSenderId: "384549852638",
  appId: "1:384549852638:web:76717d7992130a7508794f",
  measurementId: "G-KMEYBBL5PT"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let currentLang = 'en';

// Toggle Language (EN / AR)
function toggleLanguage() {
  const htmlTag = document.documentElement;
  const langBtn = document.getElementById('lang-toggle-btn');

  if (currentLang === 'en') {
    currentLang = 'ar';
    htmlTag.setAttribute('dir', 'rtl');
    htmlTag.setAttribute('lang', 'ar');
    langBtn.textContent = 'Switch to English 🇬🇧';
  } else {
    currentLang = 'en';
    htmlTag.setAttribute('dir', 'ltr');
    htmlTag.setAttribute('lang', 'en');
    langBtn.textContent = 'تغيير إلى العربية 🇪🇬';
  }

  const elements = document.querySelectorAll('[data-en][data-ar]');
  elements.forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
}

// Live Real-Time Student Counter
function listenToCounter() {
  db.collection("students").onSnapshot((snapshot) => {
    document.getElementById("student-counter").textContent = snapshot.size;
  }, (err) => {
    console.error("Counter listener error: ", err);
  });
}

// Generate Unique Student Code (Ex: #HT-4829)
function generateStudentCode() {
  return "HT-" + Math.floor(1000 + Math.random() * 9000);
}

// Registration Handler
function handleRegistration(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'en' ? "Registering..." : "جاري التسجيل...";

  const name = document.getElementById('studentName').value;
  const email = document.getElementById('studentEmail').value;
  const phone = document.getElementById('studentPhone').value;
  const parentPhone = document.getElementById('parentPhone').value;
  const studentCode = generateStudentCode();

  // Save to Firebase Firestore
  db.collection("students").add({
    studentCode: studentCode,
    fullName: name,
    email: email,
    studentPhone: phone,
    parentPhone: parentPhone,
    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
    attended: false
  }).then((docRef) => {
    // Save info in LocalStorage so Site 2 identifies the student automatically
    localStorage.setItem("hacktivators_student_id", docRef.id);
    localStorage.setItem("hacktivators_student_code", studentCode);
    localStorage.setItem("hacktivators_student_email", email);

    alert(currentLang === 'en' 
      ? `Registration Successful! Your Student Code is #${studentCode}` 
      : `تم التسجيل بنجاح! كود الطالب الخاص بك هو #${studentCode}`);

    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('timetable-section').classList.remove('hidden');
    document.getElementById('timetable-section').scrollIntoView({ behavior: 'smooth' });
  }).catch((error) => {
    console.error("Error saving student: ", error);
    alert(currentLang === 'en' ? "Registration Failed. Try again." : "حدث خطأ أثناء التسجيل، حاول مجدداً.");
    submitBtn.disabled = false;
  });
}

// Redirect to Site 2 (Student Dashboard)
function goToDashboard() {
  // هنعمل لينك الموقع التاني بعد ما ننشئه على GitHub Pages
  window.location.href = "https://your-username.github.io/hacktivators-dashboard/";
}

window.onload = function() {
  listenToCounter();
};
