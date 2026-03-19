// ══════════════════════════════════════════════
//  CAMPUS CANTEEN — ADMIN LOGIC
// ══════════════════════════════════════════════

const admins = [
    { username: "mrcadmin",    password: "123", canteen: "MRC"    },
    { username: "khuksiadmin", password: "123", canteen: "Khuksi" }
];

// ── AUTH ──────────────────────────────────────
function doAdminLogin(username, password) {
    const match = admins.find(a => a.username === username && a.password === password);
    if (match) {
        localStorage.setItem("adminCanteen", match.canteen);
        window.location.href = "admin-dashboard.html";
        return true;
    }
    return false;
}

function requireAuth() {
    const canteen = localStorage.getItem("adminCanteen");
    if (!canteen) { window.location.href = "admin-login.html"; return null; }
    return canteen;
}

function getAdminCanteen() {
    return localStorage.getItem("adminCanteen");
}

function adminLogout() {
    localStorage.removeItem("adminCanteen");
    window.location.href = "admin-login.html";
}

// ── ORDERS — filtered by canteen ─────────────
function getAllOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function getMyOrders() {
    const adminCanteen = getAdminCanteen();
    const allOrders = getAllOrders();
    return allOrders.filter(order => order.canteen === adminCanteen);
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

function updateOrderStatus(orderID, newStatus) {
    const adminCanteen = getAdminCanteen();
    const allOrders = getAllOrders();
    const idx = allOrders.findIndex(o => o.orderID === orderID && o.canteen === adminCanteen);
    if (idx !== -1) {
        // Strict one-way progression: Pending → Preparing → Ready → Picked Up
        const progression = ["Pending", "Preparing", "Ready", "Picked Up"];
        const currentStep = progression.indexOf(allOrders[idx].orderStatus);
        const newStep     = progression.indexOf(newStatus);
        if (newStep !== currentStep + 1) return; // must move exactly one step forward
        allOrders[idx].orderStatus = newStatus;
        // Stamp pickup time so student gets review reminder after 5 mins
        if (newStatus === "Picked Up") {
            allOrders[idx].pickedUpAt = Date.now();
        }
        if (newStatus === "Ready") {
            const key = `serving_${adminCanteen}`;
            const cur = parseInt(localStorage.getItem(key) || "0");
            if (allOrders[idx].tokenNumber > cur) {
                localStorage.setItem(key, allOrders[idx].tokenNumber);
            }
        }
        saveOrders(allOrders);
    }
}

// ── MENU — filtered by canteen ────────────────
function getMenuItems(canteen) {
    const stored = localStorage.getItem(`menu_${canteen}`);
    // Use stored only if it has category data (not old simple menu)
    if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0 && parsed.some(i => i.category)) return parsed;
    }
    // Full Amity canteen menu as default for MRC
    const AMITY_MENU = [{"id": 101, "name": "Tea", "price": 10, "emoji": "☕", "category": "Hot Beverages", "inStock": true}, {"id": 102, "name": "Coffee", "price": 15, "emoji": "☕", "category": "Hot Beverages", "inStock": true}, {"id": 103, "name": "Haldi Milk", "price": 15, "emoji": "🥛", "category": "Hot Beverages", "inStock": true}, {"id": 104, "name": "Bournvita / Boost / Horlicks", "price": 25, "emoji": "🥤", "category": "Hot Beverages", "inStock": true}, {"id": 201, "name": "Idli Vada Sambar", "price": 50, "emoji": "🫓", "category": "Breakfast & Snacks", "inStock": true}, {"id": 202, "name": "Bisibelebath", "price": 40, "emoji": "🍲", "category": "Breakfast & Snacks", "inStock": true}, {"id": 203, "name": "Chow Chow Bath", "price": 40, "emoji": "🍛", "category": "Breakfast & Snacks", "inStock": true}, {"id": 204, "name": "Idli Sambar", "price": 40, "emoji": "🫓", "category": "Breakfast & Snacks", "inStock": true}, {"id": 205, "name": "Rice Bath", "price": 40, "emoji": "🍚", "category": "Breakfast & Snacks", "inStock": true}, {"id": 206, "name": "Puliydbare Rice", "price": 40, "emoji": "🍚", "category": "Breakfast & Snacks", "inStock": true}, {"id": 207, "name": "Veg Pulav", "price": 40, "emoji": "🍛", "category": "Breakfast & Snacks", "inStock": true}, {"id": 208, "name": "Chitranna", "price": 40, "emoji": "🍋", "category": "Breakfast & Snacks", "inStock": true}, {"id": 209, "name": "Mangalore Buns", "price": 40, "emoji": "🥐", "category": "Breakfast & Snacks", "inStock": true}, {"id": 210, "name": "Goli Bhaje", "price": 40, "emoji": "🟤", "category": "Breakfast & Snacks", "inStock": true}, {"id": 211, "name": "Pudina Rice", "price": 40, "emoji": "🌿", "category": "Breakfast & Snacks", "inStock": true}, {"id": 212, "name": "Tomato Bath", "price": 40, "emoji": "🍅", "category": "Breakfast & Snacks", "inStock": true}, {"id": 213, "name": "Avalakki Uppit", "price": 40, "emoji": "🌾", "category": "Breakfast & Snacks", "inStock": true}, {"id": 214, "name": "Puri Bhaji", "price": 40, "emoji": "🫓", "category": "Breakfast & Snacks", "inStock": true}, {"id": 215, "name": "Mirchi Bhajji", "price": 40, "emoji": "🌶️", "category": "Breakfast & Snacks", "inStock": true}, {"id": 216, "name": "Egg Omlet Bread", "price": 40, "emoji": "🍳", "category": "Breakfast & Snacks", "inStock": true}, {"id": 217, "name": "Egg Bhurji Bread", "price": 50, "emoji": "🍞", "category": "Breakfast & Snacks", "inStock": true}, {"id": 218, "name": "Boiled Egg", "price": 20, "emoji": "🥚", "category": "Breakfast & Snacks", "inStock": true}, {"id": 301, "name": "Jeera Rice", "price": 65, "emoji": "🍚", "category": "Rice Items", "inStock": true}, {"id": 302, "name": "Lemon Rice", "price": 65, "emoji": "🍋", "category": "Rice Items", "inStock": true}, {"id": 303, "name": "Curd Rice", "price": 65, "emoji": "🍚", "category": "Rice Items", "inStock": true}, {"id": 304, "name": "Curd Rice (Tadka)", "price": 70, "emoji": "🍚", "category": "Rice Items", "inStock": true}, {"id": 305, "name": "Dal Khichidi", "price": 70, "emoji": "🥘", "category": "Rice Items", "inStock": true}, {"id": 306, "name": "Masala Rice", "price": 65, "emoji": "🍛", "category": "Rice Items", "inStock": true}, {"id": 307, "name": "Egg Bhurji Rice", "price": 70, "emoji": "🍳", "category": "Rice Items", "inStock": true}, {"id": 308, "name": "Veg Pulao Raita", "price": 80, "emoji": "🍛", "category": "Rice Items", "inStock": true}, {"id": 309, "name": "Green Peas Pulao", "price": 70, "emoji": "🟢", "category": "Rice Items", "inStock": true}, {"id": 310, "name": "Paneer Pulao", "price": 90, "emoji": "🍛", "category": "Rice Items", "inStock": true}, {"id": 311, "name": "Veg Biryani", "price": 80, "emoji": "🍛", "category": "Rice Items", "inStock": true, "isSpecial": true}, {"id": 312, "name": "Egg Biryani", "price": 80, "emoji": "🍳", "category": "Rice Items", "inStock": true}, {"id": 313, "name": "Paneer Biryani", "price": 80, "emoji": "🍛", "category": "Rice Items", "inStock": true}, {"id": 314, "name": "Half Rice", "price": 20, "emoji": "🍚", "category": "Rice Items", "inStock": true}, {"id": 315, "name": "Full Rice", "price": 30, "emoji": "🍚", "category": "Rice Items", "inStock": true}, {"id": 401, "name": "Plain Dosa", "price": 40, "emoji": "🥞", "category": "Dosa", "inStock": true}, {"id": 402, "name": "Cheese Plain Dosa", "price": 40, "emoji": "🧀", "category": "Dosa", "inStock": true}, {"id": 403, "name": "Butter Plain Dosa", "price": 55, "emoji": "🧈", "category": "Dosa", "inStock": true}, {"id": 404, "name": "Masala Dosa", "price": 50, "emoji": "🥞", "category": "Dosa", "inStock": true}, {"id": 405, "name": "Butter Masala Dosa", "price": 60, "emoji": "🧈", "category": "Dosa", "inStock": true}, {"id": 406, "name": "Cheese Masala Dosa", "price": 65, "emoji": "🧀", "category": "Dosa", "inStock": true}, {"id": 407, "name": "Mysore Plain Dosa", "price": 65, "emoji": "🥞", "category": "Dosa", "inStock": true}, {"id": 408, "name": "Mysore Masala Dosa", "price": 59, "emoji": "🥞", "category": "Dosa", "inStock": true}, {"id": 409, "name": "Schezwan Plain Dosa", "price": 65, "emoji": "🌶️", "category": "Dosa", "inStock": true}, {"id": 410, "name": "Schezwan Masala Dosa", "price": 95, "emoji": "🌶️", "category": "Dosa", "inStock": true}, {"id": 411, "name": "Cheese Schezwan Plain Dosa", "price": 60, "emoji": "🧀", "category": "Dosa", "inStock": true}, {"id": 412, "name": "Cheese Schezwan Masala Dosa", "price": 75, "emoji": "🧀", "category": "Dosa", "inStock": true}, {"id": 501, "name": "Plain Uttappam", "price": 40, "emoji": "🥞", "category": "Uttappam", "inStock": true}, {"id": 502, "name": "Onion Uttappam", "price": 55, "emoji": "🧅", "category": "Uttappam", "inStock": true}, {"id": 503, "name": "Tomato Uttappam", "price": 55, "emoji": "🍅", "category": "Uttappam", "inStock": true}, {"id": 504, "name": "Tomato Onion Uttappam", "price": 60, "emoji": "🥞", "category": "Uttappam", "inStock": true}, {"id": 505, "name": "Masala Uttappam", "price": 60, "emoji": "🌶️", "category": "Uttappam", "inStock": true}, {"id": 601, "name": "Veg Fried Rice", "price": 75, "emoji": "🍚", "category": "Chinese", "inStock": true}, {"id": 602, "name": "Veg Sez Fried Rice", "price": 85, "emoji": "🌶️", "category": "Chinese", "inStock": true}, {"id": 603, "name": "Egg Fried Rice", "price": 85, "emoji": "🍳", "category": "Chinese", "inStock": true}, {"id": 604, "name": "Egg Sez Fried Rice", "price": 90, "emoji": "🌶️", "category": "Chinese", "inStock": true}, {"id": 605, "name": "Paneer Fried Rice", "price": 85, "emoji": "🧀", "category": "Chinese", "inStock": true}, {"id": 606, "name": "Paneer Sez Fried Rice", "price": 90, "emoji": "🌶️", "category": "Chinese", "inStock": true}, {"id": 607, "name": "Mushroom Fried Rice", "price": 85, "emoji": "🍄", "category": "Chinese", "inStock": true}, {"id": 608, "name": "Veg Hakka Noodles", "price": 75, "emoji": "🍜", "category": "Chinese", "inStock": true}, {"id": 609, "name": "Veg Sez Noodles", "price": 80, "emoji": "🌶️", "category": "Chinese", "inStock": true}, {"id": 610, "name": "Egg Noodles", "price": 85, "emoji": "🍳", "category": "Chinese", "inStock": true}, {"id": 611, "name": "Egg Sez Noodles", "price": 90, "emoji": "🌶️", "category": "Chinese", "inStock": true}, {"id": 612, "name": "Garlic Fried Rice", "price": 85, "emoji": "🧄", "category": "Chinese", "inStock": true}, {"id": 613, "name": "Paneer Chilli", "price": 75, "emoji": "🌶️", "category": "Chinese", "inStock": true}, {"id": 614, "name": "Veg Manchurian", "price": 70, "emoji": "🥬", "category": "Chinese", "inStock": true}, {"id": 701, "name": "Dal Fry", "price": 40, "emoji": "🫕", "category": "Curry", "inStock": true}, {"id": 702, "name": "Dal Butter Fry", "price": 45, "emoji": "🧈", "category": "Curry", "inStock": true}, {"id": 703, "name": "Dal Tarka", "price": 45, "emoji": "🫕", "category": "Curry", "inStock": true}, {"id": 704, "name": "Chana Masala", "price": 60, "emoji": "🟤", "category": "Curry", "inStock": true}, {"id": 705, "name": "Aloo Mutter", "price": 55, "emoji": "🥔", "category": "Curry", "inStock": true}, {"id": 706, "name": "Aloo Shimla", "price": 55, "emoji": "🫑", "category": "Curry", "inStock": true}, {"id": 707, "name": "Aloo Jeera", "price": 55, "emoji": "🥔", "category": "Curry", "inStock": true}, {"id": 708, "name": "Aloo Palak", "price": 55, "emoji": "🥬", "category": "Curry", "inStock": true}, {"id": 709, "name": "Aloo Gobi", "price": 55, "emoji": "🥦", "category": "Curry", "inStock": true}, {"id": 710, "name": "Mutter Paneer", "price": 70, "emoji": "🧀", "category": "Curry", "inStock": true}, {"id": 711, "name": "Paneer Masala", "price": 80, "emoji": "🧀", "category": "Curry", "inStock": true}, {"id": 712, "name": "Paneer Butter Masala", "price": 65, "emoji": "🧈", "category": "Curry", "inStock": true}, {"id": 713, "name": "Palak Paneer", "price": 70, "emoji": "🥬", "category": "Curry", "inStock": true}, {"id": 714, "name": "Mushroom Masala", "price": 80, "emoji": "🍄", "category": "Curry", "inStock": true}, {"id": 715, "name": "Egg Masala", "price": 65, "emoji": "🍳", "category": "Curry", "inStock": true}, {"id": 716, "name": "Egg Butter Masala", "price": 75, "emoji": "🧈", "category": "Curry", "inStock": true}, {"id": 717, "name": "Paneer Burji", "price": 80, "emoji": "🧀", "category": "Curry", "inStock": true}, {"id": 718, "name": "Paneer Kolhapuri", "price": 70, "emoji": "🌶️", "category": "Curry", "inStock": true}, {"id": 719, "name": "Lasooni Paneer", "price": 80, "emoji": "🧄", "category": "Curry", "inStock": true}];
    const defaults = {
        MRC: AMITY_MENU,
        Khuksi: [
            { id: 4, name: "Fried Rice",   price: 70, emoji: "🍚", category: "Chinese",             inStock: true },
            { id: 5, name: "Maggie",       price: 40, emoji: "🍜", category: "Chinese",             inStock: true },
            { id: 6, name: "Egg Puff",     price: 25, emoji: "🥐", category: "Breakfast & Snacks",  inStock: true }
        ]
    };
    // Auto-seed localStorage so admin edits work immediately
    const menu = defaults[canteen] || [];
    if (menu.length > 0) localStorage.setItem(`menu_${canteen}`, JSON.stringify(menu));
    return menu;
}

function getMyMenuItems() {
    return getMenuItems(getAdminCanteen());
}

function saveMenuItems(items) {
    localStorage.setItem(`menu_${getAdminCanteen()}`, JSON.stringify(items));
}

// ── NOTIFICATIONS — filtered by canteen ───────
function sendNotification(msg) {
    const canteen = getAdminCanteen();
    // Canteen-specific log (for admin view)
    const myNotifs = JSON.parse(localStorage.getItem(`notifications_${canteen}`)) || [];
    myNotifs.unshift({ msg, time: new Date().toLocaleTimeString(), id: Date.now() });
    localStorage.setItem(`notifications_${canteen}`, JSON.stringify(myNotifs.slice(0, 20)));
    // Shared student-facing notifications
    const shared = JSON.parse(localStorage.getItem("notifications")) || [];
    shared.unshift({ msg: `[${canteen}] ${msg}`, time: new Date().toLocaleTimeString(), id: Date.now() });
    localStorage.setItem("notifications", JSON.stringify(shared.slice(0, 20)));
}

function getMyNotifications() {
    return JSON.parse(localStorage.getItem(`notifications_${getAdminCanteen()}`)) || [];
}

// ── BRANDING — update UI labels ────────────────
function applyBranding() {
    const canteen = getAdminCanteen();
    if (!canteen) return;
    const labels = { MRC: "🏫 MRC Canteen", Khuksi: "🍜 Khuksi Corner" };
    const label  = labels[canteen] || canteen;

    const badge = document.getElementById("canteenBadge");
    if (badge) badge.textContent = label;

    const adminName = document.querySelector(".admin-name");
    if (adminName) adminName.textContent = canteen + " Admin";

    const logoName = document.querySelector(".logo-name");
    if (logoName) logoName.textContent = canteen === "MRC" ? "MRC Canteen" : "Khuksi Corner";

    const logoIcon = document.querySelector(".logo-circle");
    if (logoIcon) logoIcon.textContent = canteen === "MRC" ? "🏫" : "🍜";
}

// ── TOAST ──────────────────────────────────────
function showToast(msg, success = true) {
    const toast = document.getElementById("adminToast");
    if (!toast) return;
    toast.querySelector("#toastMsg").textContent  = msg;
    toast.querySelector("#toastIcon").textContent = success ? "✅" : "❌";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── GLOBAL SIDEBAR PENDING BADGE ──────────────
// Runs on every admin page automatically since admin.js is loaded everywhere.
// Shows count of Pending + Preparing orders next to "Orders" in the sidebar.
function updateSidebarBadge() {
    var pb = document.getElementById("pendingBadge");
    if (!pb) return;
    var orders = (typeof getMyOrders === "function") ? getMyOrders() : [];
    var count  = orders.filter(function(o) {
        return o.orderStatus === "Pending" || o.orderStatus === "Preparing";
    }).length;
    if (count > 0) {
        pb.textContent   = count;
        pb.style.display = "";
    } else {
        pb.style.display = "none";
    }
}

// ── INIT ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
    applyBranding();

    // Set active nav link based on current page
    const page = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link[href]").forEach(function(link) {
        link.classList.toggle("active", link.getAttribute("href") === page);
    });

    // Run badge immediately + keep it live every 3 seconds on all pages
    updateSidebarBadge();
    setInterval(updateSidebarBadge, 3000);
});