import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc } from "./firebase.js";

const ERRORS = {
  "auth/email-already-in-use": "This email is already registered. Please log in.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "No connection. Check your internet."
};

function showError(msg) {
  const box = document.getElementById("formError");
  if (box) { box.textContent = msg; box.hidden = false; } else alert(msg);
}

window.togglePassword = id => {
  const i = document.getElementById(id);
  i.type = i.type === "password" ? "text" : "password";
};

window.registerUser = async e => {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const fullName = v("fullName"), email = v("registerEmail").toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("confirmPassword").value;
  const businessName = v("businessName"), businessType = v("businessType");

  if (!fullName || !email || !password || !businessName || !businessType) return showError("Please complete all fields.");
  if (password.length < 8) return showError("Password must contain at least 8 characters.");
  if (password !== confirm) return showError("Passwords do not match.");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), { profile: { fullName, email, businessName, businessType } }, { merge: true });
    location.href = "dashboard.html";
  } catch (err) {
    showError(ERRORS[err.code] || "Something went wrong. Please try again.");
  }
};

window.handleLogin = async e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    location.href = "dashboard.html";
  } catch (err) {
    showError(ERRORS[err.code] || "Login failed. Please try again.");
  }
};
