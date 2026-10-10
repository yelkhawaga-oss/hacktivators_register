// ==========================================
// HACKTIVATORS - MASTER JAVASCRIPT LOGIC
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyBOun36sO0FR2Tk9Vz-WD4_VuOyEwqdQJQ",
  authDomain: "hacktivators.firebaseapp.com",
  projectId: "hacktivators",
  storageBucket: "hacktivators.firebasestorage.app",
  messagingSenderId: "384549852638",
  appId: "1:384549852638:web:76717d7992130a7508794f",
  measurementId: "G-KMEYBBL5PT"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let currentLang = 'en';

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

function listenToCounter() {
  db.collection("students").onSnapshot((snapshot) => {
    const counterElement = document.getElementById("student-counter");
    if(counterElement) {
      counterElement.textContent = snapshot.size;
    }
  }, (err) => {
    console.error("Firestore Counter Sync Error: ", err);
  });
}

function generateStudentCode() {
  return "HT-" + Math.floor(1000 + Math.random() * 9000);
}

function handleRegistration(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'en' ? "Registering..." : "جاري التسجيل...";

  const name = document.getElementById('studentName').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const phone = document.getElementById('studentPhone').value.trim();
  const parentPhone = document.getElementById('parentPhone').value.trim();
  const studentCode = generateStudentCode();

  db.collection("students").add({
    studentCode: studentCode,
    fullName: name,
    email: email,
    studentPhone: phone,
    parentPhone: parentPhone,
    registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
    attended: false
  }).then((docRef) => {
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
    console.error("Firestore Write Error: ", error);
    alert(currentLang === 'en' ? "Registration Failed. Please try again." : "حدث خطأ أثناء التسجيل، يجدر المحاولة مجدداً.");
    submitBtn.disabled = false;
    submitBtn.textContent = currentLang === 'en' ? "Register Now" : "سجّل الآن";
  });
}

function goToDashboard() {
  window.location.href = "https://yelkhawaga-oss.github.io/hacktivators-dashboard/";
}

window.onload = function() {
  listenToCounter();
};
