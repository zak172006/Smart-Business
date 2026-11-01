
// ======================================
// SMART BUSINESS
// MAIN JAVASCRIPT SYSTEM
// ======================================

console.log("Smart Business is Ready!");

// ======================================
// NAVIGATION
// ======================================

function getStarted() {
    window.location.href = "register.html";
}

function logout() {
    localStorage.removeItem("smartBusinessCurrentUser");
    window.location.href = "login.html";
}

// ======================================
// PASSWORD SECURITY
// ======================================

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

// ======================================
// REGISTER NEW USER
// ======================================

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

        const users = JSON.parse(
            localStorage.getItem("smartBusinessUsers") || "[]"
        );

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

        localStorage.setItem(
            "smartBusinessUsers",
            JSON.stringify(users)
        );

        alert("Account created successfully! Please login.");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);
        alert("Something went wrong. Please try again using HTTPS.");
    }
}

// ======================================
// LOGIN
// ======================================

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

// ======================================
// SHOW / HIDE PASSWORD
// ======================================

function togglePassword() {

    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// ======================================
// PRODUCT MANAGEMENT
// ======================================

function getUserProducts() {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) return [];

    const key = "smartBusinessProducts_" + email;

    return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveUserProducts(products) {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) return;

    const key = "smartBusinessProducts_" + email;

    localStorage.setItem(key, JSON.stringify(products));
}

// ADD PRODUCT

function addProduct(event) {

    event.preventDefault();

    const name = document.getElementById("productName").value.trim();

    const price = Number(document.getElementById("productPrice").value);

    const quantity = Number(document.getElementById("productQuantity").value);

    if (
        !name ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        alert("Please enter valid product information.");
        return;
    }

    const products = getUserProducts();

    products.push({
        id: crypto.randomUUID(),
        name,
        price,
        quantity
    });

    saveUserProducts(products);

    document.getElementById("productForm").reset();

    loadProducts();

    alert("Product added successfully!");
}

// DISPLAY PRODUCTS

function loadProducts() {

    const products = getUserProducts();

    const list = document.getElementById("productsList");
    const table = document.getElementById("productsTable");
    const emptyMessage = document.getElementById("emptyProducts");
    const count = document.getElementById("productCount");

    if (!list || !table || !emptyMessage || !count) return;

    list.replaceChildren();

    count.textContent = products.length + " Products";

    if (products.length === 0) {

        table.style.display = "none";
        emptyMessage.style.display = "block";

        updateDashboardStats();

        return;
    }

    table.style.display = "table";
    emptyMessage.style.display = "none";

    products.forEach(product => {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = Number(product.price).toFixed(2);

        const quantityCell = document.createElement("td");
        quantityCell.textContent = product.quantity;

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.type = "button";
        editButton.onclick = () => editProduct(product.id);

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.onclick = () => deleteProduct(product.id);

        actionsCell.append(editButton, deleteButton);

        row.append(
            nameCell,
            priceCell,
            quantityCell,
            actionsCell
        );

        list.appendChild(row);
    });

    updateDashboardStats();
}

// EDIT PRODUCT

function editProduct(id) {

    const products = getUserProducts();

    const product = products.find(item => item.id === id);

    if (!product) return;

    const newName = prompt("Enter new product name:", product.name);

    if (newName === null) return;

    const newPrice = prompt("Enter new price:", product.price);

    if (newPrice === null) return;

    const newQuantity = prompt("Enter new quantity:", product.quantity);

    if (newQuantity === null) return;

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

    refreshOrderOptions();

    alert("Product updated successfully!");
}

// DELETE PRODUCT

function deleteProduct(id) {

    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) return;

    const products = getUserProducts();

    const updatedProducts = products.filter(
        product => product.id !== id
    );

    saveUserProducts(updatedProducts);

    loadProducts();

    refreshOrderOptions();

    alert("Product deleted successfully!");
}

// ======================================
// CUSTOMER MANAGEMENT
// ======================================

function getCustomers() {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) return [];

    return JSON.parse(
        localStorage.getItem("smartBusinessCustomers_" + email) || "[]"
    );
}

function saveCustomers(customers) {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) return;

    localStorage.setItem(
        "smartBusinessCustomers_" + email,
        JSON.stringify(customers)
    );
}

// ADD CUSTOMER

function addCustomer(event) {

    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();

    const email = document.getElementById("customerEmail").value.trim().toLowerCase();

    const phone = document.getElementById("customerPhone").value.trim();

    if (!name || !email || !phone) {
        alert("Please complete all customer fields.");
        return;
    }

    const customers = getCustomers();

    if (customers.some(customer => customer.email === email)) {
        alert("This customer email already exists.");
        return;
    }

    customers.push({
        id: crypto.randomUUID(),
        name,
        email,
        phone
    });

    saveCustomers(customers);

    document.getElementById("customerForm").reset();

    loadCustomers();

    alert("Customer added successfully!");
}

// DISPLAY CUSTOMERS

function loadCustomers() {

    const customers = getCustomers();

    const list = document.getElementById("customersList");
    const table = document.getElementById("customersTable");
    const empty = document.getElementById("emptyCustomers");

    if (!list || !table || !empty) return;

    list.replaceChildren();

    empty.style.display = customers.length ? "none" : "block";
    table.style.display = customers.length ? "table" : "none";

    customers.forEach(customer => {

        const row = document.createElement("tr");

        [customer.name, customer.email, customer.phone].forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.onclick = () => deleteCustomer(customer.id);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        list.appendChild(row);
    });

    refreshOrderOptions();

    updateDashboardStats();
}

// DELETE CUSTOMER

function deleteCustomer(id) {

    const relatedOrders = getOrders().some(
        order => order.customerId === id &&
        order.status !== "Cancelled"
    );

    if (relatedOrders) {
        alert("This customer has active orders. Cancel or delete them first.");
        return;
    }

    if (!confirm("Delete this customer?")) return;

    const customers = getCustomers().filter(
        customer => customer.id !== id
    );

    saveCustomers(customers);

    loadCustomers();
}

// ======================================
// ORDER MANAGEMENT
// ======================================

function getOrders() {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) return [];

    return JSON.parse(
        localStorage.getItem("smartBusinessOrders_" + email) || "[]"
    );
}

function saveOrders(orders) {

    const email = localStorage.getItem("smartBusinessCurrentUser");

    if (!email) return;

    localStorage.setItem(
        "smartBusinessOrders_" + email,
        JSON.stringify(orders)
    );
}

// REFRESH CUSTOMER AND PRODUCT OPTIONS

function refreshOrderOptions() {

    const customerSelect = document.getElementById("orderCustomer");
    const productSelect = document.getElementById("orderProduct");

    if (!customerSelect || !productSelect) return;

    customerSelect.replaceChildren();
    productSelect.replaceChildren();

    const customerDefault = document.createElement("option");

    customerDefault.value = "";
    customerDefault.textContent = "Choose Customer";

    customerSelect.appendChild(customerDefault);

    getCustomers().forEach(customer => {

        const option = document.createElement("option");

        option.value = customer.id;
        option.textContent = customer.name;

        customerSelect.appendChild(option);
    });

    const productDefault = document.createElement("option");

    productDefault.value = "";
    productDefault.textContent = "Choose Product";

    productSelect.appendChild(productDefault);

    getUserProducts().forEach(product => {

        const option = document.createElement("option");

        option.value = product.id;

        option.textContent =
            product.name + " - " + product.price + " EGP (Stock: " + product.quantity + ")";

        productSelect.appendChild(option);
    });
}

// ADD ORDER

function addOrder(event) {

    event.preventDefault();

    const customerId = document.getElementById("orderCustomer").value;

    const productId = document.getElementById("orderProduct").value;

    const quantity = Number(document.getElementById("orderQuantity").value);

    const customers = getCustomers();

    const products = getUserProducts();

    const customer = customers.find(item => item.id === customerId);

    const product = products.find(item => item.id === productId);

    if (!customer || !product) {
        alert("Please select a valid customer and product.");
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter a valid quantity.");
        return;
    }

    if (quantity > product.quantity) {
        alert("The requested quantity is greater than available stock.");
        return;
    }

    // Reduce product stock
    product.quantity -= quantity;

    saveUserProducts(products);

    const orders = getOrders();

    orders.push({

        id: crypto.randomUUID(),

        customerId: customer.id,

        customerName: customer.name,

        productId: product.id,

        productName: product.name,

        quantity: quantity,

        total: product.price * quantity,

        status: "Pending",

        createdAt: new Date().toISOString()
    });

    saveOrders(orders);

    document.getElementById("orderForm").reset();

    loadProducts();

    loadOrders();

    alert("Order created successfully!");
}

// DISPLAY ORDERS

function loadOrders() {

    const orders = getOrders();

    const list = document.getElementById("ordersList");
    const table = document.getElementById("ordersTable");
    const empty = document.getElementById("emptyOrders");

    if (!list || !table || !empty) return;

    list.replaceChildren();

    empty.style.display = orders.length ? "none" : "block";
    table.style.display = orders.length ? "table" : "none";

    orders.forEach(order => {

        const row = document.createElement("tr");

        const values = [

            order.customerName,

            order.productName,

            order.quantity,

            Number(order.total).toFixed(2) + " EGP"
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");

        const statusSelect = document.createElement("select");

        ["Pending", "Processing", "Completed", "Cancelled"].forEach(status => {

            const option = document.createElement("option");

            option.value = status;
            option.textContent = status;

            statusSelect.appendChild(option);
        });

        statusSelect.value = order.status;

        statusSelect.onchange = () => {

            updateOrderStatus(order.id, statusSelect.value);
        };

        statusCell.appendChild(statusSelect);

        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.onclick = () => deleteOrder(order.id);

        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        list.appendChild(row);
    });

    refreshOrderOptions();

    updateDashboardStats();
}

// UPDATE ORDER STATUS

function updateOrderStatus(id, status) {

    const allowed = [
        "Pending",
        "Processing",
        "Completed",
        "Cancelled"
    ];

    if (!allowed.includes(status)) return;

    const orders = getOrders();

    const order = orders.find(item => item.id === id);

    if (!order) return;

    const previousStatus = order.status;

    // Restore stock when cancelling
    if (previousStatus !== "Cancelled" && status === "Cancelled") {

        const products = getUserProducts();

        const product = products.find(
            item => item.id === order.productId
        );

        if (product) {

            product.quantity += order.quantity;

            saveUserProducts(products);
        }
    }

    // Deduct stock again when restoring a cancelled order
    if (previousStatus === "Cancelled" && status !== "Cancelled") {

        const products = getUserProducts();

        const product = products.find(
            item => item.id === order.productId
        );

        if (!product || product.quantity < order.quantity) {

            alert("Not enough stock to reactivate this order.");

            loadOrders();

            return;
        }

        product.quantity -= order.quantity;

        saveUserProducts(products);
    }

    order.status = status;

    saveOrders(orders);

    loadProducts();

    loadOrders();

    updateDashboardStats();
}

// DELETE ORDER

function deleteOrder(id) {

    if (!confirm("Delete this order?")) return;

    const orders = getOrders();

    const order = orders.find(item => item.id === id);

    if (!order) return;

    // Return stock if order was not cancelled
    if (order.status !== "Cancelled") {

        const products = getUserProducts();

        const product = products.find(
            item => item.id === order.productId
        );

        if (product) {

            product.quantity += order.quantity;

            saveUserProducts(products);
        }
    }

    const updatedOrders = orders.filter(
        item => item.id !== id
    );

    saveOrders(updatedOrders);

    loadProducts();

    loadOrders();

    updateDashboardStats();
}

// ======================================
// DASHBOARD STATISTICS
// ======================================

function updateDashboardStats() {

    const products = getUserProducts();

    const customers = getCustomers();

    const orders = getOrders();

    const productCount = document.getElementById("productCount");

    const customerCount = document.getElementById("customerCount");

    const orderCount = document.getElementById("orderCount");

    const salesCount = document.getElementById("salesCount");

    if (productCount) {
        productCount.textContent = products.length + " Products";
    }

    if (customerCount) {
        customerCount.textContent = customers.length + " Customers";
    }

    if (orderCount) {
        orderCount.textContent = orders.length + " Orders";
    }

    const totalSales = orders

        .filter(order => order.status === "Completed")

        .reduce((total, order) => {
            return total + Number(order.total || 0);
        }, 0);

    if (salesCount) {
        salesCount.textContent = totalSales.toFixed(2) + " EGP";
    }
}

// ======================================
// END OF SMART BUSINESS SYSTEM
// ======================================
