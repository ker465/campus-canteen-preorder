const menuItems = [
    { id: 1, name: "Veg Biryani", price: 80 },
    { id: 2, name: "Chicken Roll", price: 60 },
    { id: 3, name: "Samosa", price: 15 }
];

let cart = [];
let total = 0;

const menuDiv = document.getElementById("menu");
const cartDiv = document.getElementById("cart");
const totalSpan = document.getElementById("total");

// Display menu
menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
        <span>${item.name} - ₹${item.price}</span>
        <button onclick="addToCart(${item.id})">Add</button>
    `;
    menuDiv.appendChild(div);
});

function addToCart(id) {
    const item = menuItems.find(i => i.id === id);
    cart.push(item);
    total += item.price;
    updateCart();
}

function updateCart() {
    cartDiv.innerHTML = "";
    cart.forEach(item => {
        cartDiv.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
    });
    totalSpan.innerText = total;
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const slot = document.getElementById("slot").value;

    alert(`Order placed for ${slot}.\nTotal: ₹${total}\n(Next step: Payment Integration)`);

    cart = [];
    total = 0;
    updateCart();
}