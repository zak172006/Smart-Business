
// SMART BUSINESS

console.log("Smart Business is Ready!");

// Get Started
function getStarted() {
    window.location.href = "register.html";
}

// Password hashing for local development demo
async function hashPassword(password, salt) {
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 150000,
            hash: "SHA-256"
        },
        key,
        256
    );

    return Array.from(new Uint8Array(bits))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Register New User
async function registerUser(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;
    const businessName = document.getElementById("businessName").value.trim();
    const businessType = document.getElementById("businessType").value;

    if (!fullName || !email || !password || !businessName || !businessType) {
        alert("Please complete all fields.");
        return;
    }

    if (password.length < 8) {
        alert("Password must contain at least 8 characters.");
        return;
    }

    try {
        const users = JSON.parse(localStorage.getItem("smartBusinessUsers") || "[]");

        if (users.some(user => user.email === email)) {
            alert("This email is already registered. Please login.");
            return;
        }

        const salt = crypto.randomUUID();
        const passwordHash = await hashPassword(password, salt);

        const newUser = {
            fullName,
            email,
            passwordHash,
            salt,
            businessName,
            businessType
        };

        users.push(newUser);

        localStorage.setItem("smartBusinessUsers", JSON.stringify(users));

        alert("Account created successfully! Please login.");

        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again using HTTPS.");
    }
}
