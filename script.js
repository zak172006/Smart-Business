// SMART BUSINESS - AUTH
async function hashPassword(password, salt) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: enc.encode(salt), iterations: 150000, hash: "SHA-256" },
        key, 256
    );
    return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function showError(msg) {
    const box = document.getElementById("formError");
    if (box) { box.textContent = msg; box.hidden = false; }
    else alert(msg);
}

function togglePassword(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

async function registerUser(event) {
    event.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;
    const businessName = document.getElementById("businessName").value.trim();
    const businessType = document.getElementById("businessType").value;

    if (!fullName || !email || !password || !businessName || !businessType) return showError("Please complete all fields.");
    if (password.length < 8) return showError("Password must contain at least 8 characters.");
    if (password !== confirm) return showError("Passwords do not match.");

    try {
        const users = JSON.parse(localStorage.getItem("smartBusinessUsers") || "[]");
        if (users.some(u => u.email === email)) return showError("This email is already registered. Please login.");

        const salt = crypto.randomUUID();
        users.push({ fullName, email, passwordHash: await hashPassword(password, salt), salt, businessName, businessType });
        localStorage.setItem("smartBusinessUsers", JSON.stringify(users));
        window.location.href = "login.html";
    } catch (e) {
        console.error(e);
        showError("Something went wrong. Please try again.");
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // Simple lockout: 5 wrong attempts = 1 minute
    const lock = Number(localStorage.getItem("sbLockUntil") || 0);
    if (Date.now() < lock) return showError("Too many attempts. Try again in a minute.");

    try {
        const users = JSON.parse(localStorage.getItem("smartBusinessUsers") || "[]");
        const user = users.find(u => u.email === email);
        const ok = user && (await hashPassword(password, user.salt)) === user.passwordHash;

        if (!ok) {
            const tries = Number(localStorage.getItem("sbTries") || 0) + 1;
            localStorage.setItem("sbTries", tries);
            if (tries >= 5) {
                localStorage.setItem("sbLockUntil", Date.now() + 60000);
                localStorage.setItem("sbTries", 0);
            }
            return showError("Incorrect email or password.");
        }

        localStorage.setItem("sbTries", 0);
        localStorage.setItem("smartBusinessCurrentUser", user.email);
        window.location.href = "dashboard.html";
    } catch (e) {
        console.error(e);
        showError("Login failed. Please try again.");
    }
}