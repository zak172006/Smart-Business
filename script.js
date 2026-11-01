
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

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    try {
        const users = JSON.parse(
            localStorage.getItem("smartBusinessUsers") || "[]"
        );

        const user = users.find(user => user.email === email);

        if (!user) {
            alert("Account not found. Please create an account first.");
            return;
        }

        const passwordHash = await hashPassword(password, user.salt);

        if (passwordHash !== user.passwordHash) {
            alert("Incorrect password. Please try again.");
            return;
        }

        localStorage.setItem(
            "smartBusinessCurrentUser",
            user.email
        );

        alert("Login successful! Welcome " + user.fullName);

        window.location.href = "dashboard.html";

    } catch (error) {
        console.error(error);
        alert("Login failed. Please try again.");
    }
}


// SHOW / HIDE PASSWORD

function togglePassword() {
    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}
function logout() {
    localStorage.removeItem("smartBusinessCurrentUser");
    window.location.href = "login.html";
}

// ==================================
// SMART BUSINESS - PRODUCT SYSTEM
// ==================================

// Get products belonging to current user
function getUserProducts() {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) {
        return [];
    }

    const key = "smartBusinessProducts_" + email;

    return JSON.parse(localStorage.getItem(key) || "[]");
}


// Save products
function saveUserProducts(products) {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) {
        return;
    }

    const key = "smartBusinessProducts_" + email;

    localStorage.setItem(key, JSON.stringify(products));
}


// Add new product
function addProduct(event) {

    event.preventDefault();

    const name = document.getElementById("productName").value.trim();

    const price = Number(document.getElementById("productPrice").value);

    const quantity = Number(document.getElementById("productQuantity").value);

    if (!name || !Number.isFinite(price) || price <= 0 ||
        !Number.isInteger(quantity) || quantity < 0) {

        alert("Please enter valid product information.");
        return;
    }

    const products = getUserProducts();

    const newProduct = {
        id: crypto.randomUUID(),
        name: name,
        price: price,
        quantity: quantity
    };

    products.push(newProduct);

    saveUserProducts(products);

    document.getElementById("productForm").reset();

    loadProducts();

    alert("Product added successfully!");
}


// Display products
function loadProducts() {

    const products = getUserProducts();

    const list = document.getElementById("productsList");

    const table = document.getElementById("productsTable");

    const emptyMessage = document.getElementById("emptyProducts");

    const count = document.getElementById("productCount");

    if (!list || !table || !emptyMessage || !count) {
        return;
    }

    list.replaceChildren();

    count.textContent = products.length + " Products";

    if (products.length === 0) {
        table.style.display = "none";
        emptyMessage.style.display = "block";
        return;
    }

    table.style.display = "table";
    emptyMessage.style.display = "none";

    products.forEach(function(product) {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = product.price.toFixed(2);

        const quantityCell = document.createElement("td");
        quantityCell.textContent = product.quantity;

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = function() {
            editProduct(product.id);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = function() {
            deleteProduct(product.id);
        };

        actionsCell.append(editButton, deleteButton);

        row.append(
            nameCell,
            priceCell,
            quantityCell,
            actionsCell
        );

        list.appendChild(row);

    });
}


// Edit product
function editProduct(id) {

    const products = getUserProducts();

    const product = products.find(item => item.id === id);

    if (!product) {
        return;
    }

    const newName = prompt("Enter new product name:", product.name);

    if (newName === null) {
        return;
    }

    const newPrice = prompt("Enter new price:", product.price);

    if (newPrice === null) {
        return;
    }

    const newQuantity = prompt("Enter new quantity:", product.quantity);

    if (newQuantity === null) {
        return;
    }

    const price = Number(newPrice);
    const quantity = Number(newQuantity);

    if (
        !newName.trim() ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        alert("Invalid product information.");
        return;
    }

    product.name = newName.trim();
    product.price = price;
    product.quantity = quantity;

    saveUserProducts(products);

    loadProducts();

    alert("Product updated successfully!");
}


// Delete product
function deleteProduct(id) {

    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) {
        return;
    }

    const products = getUserProducts();

    const updatedProducts = products.filter(
        product => product.id !== id
    );

    saveUserProducts(updatedProducts);

    loadProducts();

    alert("Product deleted successfully!");
}
