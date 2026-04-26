// ─────────────────────────────────────────────
//  STEP 1: Replace the values below with YOUR
//  Firebase project config (see SETUP GUIDE).
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyAIU-w2T-cz9vG1PoP6SMtaHL8w6zy1zcs",
  authDomain:        "bipolar-data-science-forum.firebaseapp.com",
  projectId:         "bipolar-data-science-forum",
  storageBucket:     "bipolar-data-science-forum.firebasestorage.app",
  messagingSenderId: "317355353505",
  appId:             "1:317355353505:web:e5311edf5736d3ec5417e0",
  measurementId:     "G-TQN4DKXSN5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Shorthand references used throughout the site
const auth = firebase.auth();
const db   = firebase.firestore();

// ─────────────────────────────────────────────
//  Global auth state listener
//  Updates nav profile area on every page
// ─────────────────────────────────────────────
auth.onAuthStateChanged(user => {
  const navUser    = document.getElementById("nav-user-area");
  const navSignin  = document.getElementById("nav-signin");
  if (!navUser || !navSignin) return;

  if (user) {
    navSignin.style.display = "none";
    navUser.style.display   = "flex";
    const initial = document.getElementById("nav-avatar-initial");
    const name    = document.getElementById("nav-display-name");
    if (initial) initial.textContent = (user.displayName || user.email || "?")[0].toUpperCase();
    if (name)    name.textContent    = user.displayName || user.email;
  } else {
    navSignin.style.display = "flex";
    navUser.style.display   = "none";
  }
});

// ─────────────────────────────────────────────
//  Helper: format a Firestore timestamp
// ─────────────────────────────────────────────
function timeAgo(ts) {
  if (!ts) return "";
  const now  = Date.now();
  const then = ts.toDate ? ts.toDate().getTime() : ts;
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60)   return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m ago";
  if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
  return Math.floor(diff / 86400) + "d ago";
}

// ─────────────────────────────────────────────
//  Helper: badge CSS class from type string
// ─────────────────────────────────────────────
function badgeClass(type) {
  const research = ["Psychiatrist","Researcher","Neuroscientist","Psychologist","Patient Advocate"];
  const ds       = ["Data Scientist","ML Engineer","Statistician"];
  const dx       = ["Diagnosed · BD I","Diagnosed · BD II"];
  const care     = ["Caregiver","Family Member"];
  if (research.includes(type)) return "badge-research";
  if (ds.includes(type))       return "badge-ds";
  if (dx.includes(type))       return "badge-dx";
  if (care.includes(type))     return "badge-care";
  return "badge-job";
}

// ─────────────────────────────────────────────
//  Helper: render badge HTML from array
// ─────────────────────────────────────────────
function renderBadges(badges = []) {
  return badges.map(b =>
    `<span class="badge ${badgeClass(b)}">${b}</span>`
  ).join("");
}
