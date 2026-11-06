
const products = [
  {id:1,name:"Smartphone",category:"Electronics",price:45000,image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",description:"Modern smartphone with beautiful display, camera and fast performance."},
  {id:2,name:"Laptop",category:"Electronics",price:95000,image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",description:"Powerful laptop for work, study and entertainment."},
  {id:3,name:"Headphones",category:"Electronics",price:5500,image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",description:"Comfortable wireless headphones with great sound."},
  {id:4,name:"Smart Watch",category:"Electronics",price:6500,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",description:"Stylish smart watch for everyday use."},
  {id:5,name:"T-Shirt",category:"Clothing",price:1500,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",description:"Comfortable casual cotton T-shirt."},
  {id:6,name:"Jacket",category:"Clothing",price:4500,image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",description:"Fashionable jacket for your wardrobe."},
  {id:7,name:"Running Shoes",category:"Shoes",price:5500,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",description:"Comfortable shoes for running and walking."},
  {id:8,name:"Sneakers",category:"Shoes",price:4000,image:"https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",description:"Trendy sneakers for everyday style."},
  {id:9,name:"Sofa",category:"Furniture",price:45000,image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",description:"Modern comfortable sofa for your living room."},
  {id:10,name:"Office Chair",category:"Furniture",price:12000,image:"https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500",description:"Comfortable chair for your office."},
  {id:11,name:"Table Lamp",category:"Home",price:2500,image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",description:"Beautiful lamp for your bedroom or desk."},
  {id:12,name:"Wall Clock",category:"Home",price:1800,image:"https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500",description:"Decorative clock for your home."},
  {id:13,name:"Watch",category:"Accessories",price:3500,image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",description:"Classic wrist watch with elegant design."},
  {id:14,name:"Sunglasses",category:"Accessories",price:2200,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",description:"Stylish sunglasses for everyday use."}
];

let cart = JSON.parse(localStorage.getItem("shopzone-cart")) || [];
let currentCategory = "All";

const money = n => n.toLocaleString("en-PK");

function displayProducts() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(p =>
    (currentCategory === "All" || p.category === currentCategory) &&
    p.name.toLowerCase().includes(search)
  );

  const list = document.getElementById("product-list");
  list.innerHTML = "";

  if (!filtered.length) {
    list.innerHTML = "<p>No products found.</p>";
    return;
  }

  filtered.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" onclick="showDetails(${p.id})">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${p.category}</p>
          <p class="price">Rs. ${money(p.price)}</p>
          <button class="add-btn" onclick="showDetails(${p.id})">
            View Details
          </button>
        </div>
      </div>`;
  });
}

function filterProducts(category, button) {
  currentCategory = category;

  document.querySelectorAll(".categories button")
    .forEach(b => b.classList.remove("active"));

  button.classList.add("active");
  displayProducts();
}

document.getElementById("search").addEventListener("input", displayProducts);

// Product Details
function showDetails(id) {
  const p = products.find(item => item.id === id);

  document.getElementById("product-details").innerHTML = `
    <div class="detail-info">
      <img class="detail-image" src="${p.image}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>Category: ${p.category}</p>
      <h2 class="price">Rs. ${money(p.price)}</h2>
      <p>${p.description}</p>
      <button class="add-btn" onclick="addToCart(${p.id})">
        Add To Cart
      </button>
      <br><br>
      <button class="checkout-btn" onclick="buyNow(${p.id})">
        Buy Now
      </button>
    </div>`;

  document.getElementById("product-modal").classList.add("show");
}

function closeModal() {
  document.getElementById("product-modal").classList.remove("show");
}

// Cart
function saveCart() {
  localStorage.setItem("shopzone-cart", JSON.stringify(cart));
}

function addToCart(id) {
  const p = products.find(item => item.id === id);
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({...p, quantity:1});
  }

  saveCart();
  updateCart();
  alert(p.name + " added to cart!");
}

function buyNow(id) {
  addToCart(id);
  closeModal();
  toggleCart();
}

function updateCart() {
  const container = document.getElementById("cart-items");
  let total = 0;
  let count = 0;

  container.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    container.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>Rs. ${money(item.price)}</p>
          <div class="quantity">
            <button onclick="changeQuantity(${item.id},-1)">−</button>
            ${item.quantity}
            <button onclick="changeQuantity(${item.id},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id})">
          Remove
        </button>
      </div>`;
  });

  if (!cart.length) {
    container.innerHTML = "<p>Your cart is empty!</p>";
  }

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(total);
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeItem(id);
    return;
  }

  saveCart();
  updateCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

function toggleCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("cart-overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("show");
}

// Checkout
function openCheckout() {
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  closeCart();

  const total = cart.reduce(
    (sum,item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("checkout-total").textContent =
    "Total Amount: Rs. " + money(total);

  document.getElementById("checkout-modal").classList.add("show");
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.remove("show");
}

// Payment instructions
document.getElementById("payment-method").addEventListener("change", function() {
  const info = document.getElementById("payment-info");

  const instructions = {
    "Cash on Delivery":
      "You can pay cash to the delivery person when your order arrives.",
    "JazzCash":
      "Demo: Enter the merchant JazzCash account details here after setting up your verified merchant account.",
    "Easypaisa":
      "Demo: Enter the merchant Easypaisa account details here after setting up your verified merchant account.",
    "Bank Transfer":
      "Demo: Enter your business bank account details here after setting up your payment arrangement."
  };

  info.textContent = instructions[this.value] || "Select a payment method.";
});

// Place Order - Demo
document.getElementById("checkout-form").addEventListener("submit", function(e) {
  e.preventDefault();

  if (!cart.length) {
    alert("Your cart is empty!");
    closeCheckout();
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const payment = document.getElementById("payment-method").value;

  if (!name || !phone || !address || !payment) {
    alert("Please fill all details.");
    return;
  }

  const total = cart.reduce(
    (sum,item) => sum + item.price * item.quantity, 0
  );

  const order = {
    customer: name,
    phone: phone,
    address: address,
    payment: payment,
    products: cart,
    total: total,
    date: new Date().toLocaleString()
  };

  // Demo only: saves order in this browser
  const orders = JSON.parse(localStorage.getItem("shopzone-orders")) || [];
  orders.push(order);
  localStorage.setItem("shopzone-orders", JSON.stringify(orders));

  alert(
    "Demo order created successfully!\n" +
    "Customer: " + name +
    "\nTotal: Rs. " + money(total) +
    "\nPayment: " + payment +
    "\nNo real payment has been processed."
  );

  cart = [];
  saveCart();
  updateCart();
  this.reset();
  closeCheckout();
});

displayProducts();
updateCart();

