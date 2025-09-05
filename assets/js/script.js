// Product Data
const featuredProducts = [
  {
    id: 1,
    title: "Burnikk",
    shortDesc: "Sexbomb",
    img: "./assets/imgs/tshirt.png",
    price: 250,
  },
  {
    id: 2,
    title: "Kibal Batal",
    shortDesc: "Kibal Black",
    img: "./assets/imgs/tshirt1.png",
    price: 380,
  },
  {
    id: 3,
    title: "Very Nice",
    shortDesc: "Salt maaalat",
    img: "./assets/imgs/tshirt2.png",
    price: 720,
  },
  {
    id: 4,
    title: "Buldit",
    shortDesc: "Salt Maalat",
    img: "./assets/imgs/tshirt3.png",
    price: 260,
  },
  {
    id: 5,
    title: "Balakubak",
    shortDesc: "Betsin Maalat",
    img: "./assets/imgs/tshirt4.png",
    price: 130,
  },
  {
    id: 6,
    title: "Kutu",
    shortDesc: "Sexbomb",
    img: "./assets/imgs/tshirt5.png",
    price: 310,
  },
  {
    id: 7,
    title: "Tiktilaok Manok",
    shortDesc: "Sexbomb",
    img: "./assets/imgs/tshirt6.png",
    price: 100,
  },
  {
    id: 8,
    title: "Quake Overload",
    shortDesc: "Yezyow",
    img: "./assets/imgs/tshirt7.png",
    price: 155,
  },
];

// DOM Elements
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelector(sel);
const container = $("products");
const searchInput = $$(".search-box input");
const cartCount = $("cart-count");

// Cart State
let cartProducts = JSON.parse(localStorage.getItem("cartProducts")) || [];

// Cart Functions
const saveCart = () =>
  localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
const updateCartCount = () =>
  (cartCount.textContent = cartProducts.reduce(
    (sum, item) => sum + item.quantity,
    0
  ));

const addToCart = (id) => {
  const existing = cartProducts.find((c) => c.product.id === id);
  if (existing) existing.quantity++;
  else {
    const product = featuredProducts.find((p) => p.id === id);
    if (product) cartProducts.push({ product, quantity: 1 });
  }
  saveCart();
  refreshCartUI();
};

const removeFromCart = (id) => {
  cartProducts = cartProducts.filter((c) => c.product.id !== id);
  saveCart();
  refreshCartUI();
};

const changeQuantity = (id, delta) => {
  const item = cartProducts.find((c) => c.product.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else {
      saveCart();
      refreshCartUI();
    }
  }
};

// Cart UI
const renderCartItems = () => {
  const cartItemsContainer = $("cart-items");
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cartProducts.forEach(({ product, quantity }) => {
    const subtotal = product.price * quantity;
    total += subtotal;
    const item = document.createElement("div");
    item.classList.add("cart-item");
    item.innerHTML = `
      <img src="${product.img}" alt="${product.title}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${product.title}</h4>
        <p>${product.shortDesc}</p>
        <p>Price: $${product.price}</p>
        <p>Subtotal: $${subtotal}</p>
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">${quantity}</span>
          <button class="increase">+</button>
        </div>
        <button class="remove-item">Remove</button>
      </div>
    `;
    item.querySelector(".increase").onclick = () =>
      changeQuantity(product.id, 1);
    item.querySelector(".decrease").onclick = () =>
      changeQuantity(product.id, -1);
    item.querySelector(".remove-item").onclick = () =>
      removeFromCart(product.id);
    cartItemsContainer.appendChild(item);
  });
  $("cart-total").textContent = `Total: $${total}`;
};

const refreshCartUI = () => {
  updateCartCount();
  renderCartItems();
};

// Product Rendering
const renderProducts = (products) => {
  container.innerHTML =
    products.length === 0 ? '<p class="empty-list">No products found.</p>' : "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${product.img}" alt="${product.title}">
      <div class="card-body">
        <h3>${product.title}</h3>
        <p>${product.shortDesc}</p>
        <p>Price: $${product.price}</p>
      </div>
      <button>Add to Cart</button>
    `;
    card.onclick = (e) => {
      if (!e.target.matches("button")) showProductPopup(product);
    };
    card.querySelector("button").onclick = (e) => {
      e.stopPropagation();
      addToCart(product.id);
    };
    container.appendChild(card);
  });
};

// Product Popup
const showProductPopup = (product) => {
  $("popup-img").src = product.img;
  $("popup-title").textContent = product.title;
  $("popup-desc").textContent = product.shortDesc;
  $("popup-price").textContent = product.price;
  $("popup-add-cart").onclick = () => {
    addToCart(product.id);
    hideProductPopup();
  };
  $("product-popup").classList.add("show");
};

const hideProductPopup = () => $("product-popup").classList.remove("show");

// Create Cart Sidebar
const createCartSidebar = () => {
  const cartSidebar = document.createElement("div");
  cartSidebar.id = "cart-sidebar";
  cartSidebar.innerHTML = `
    <header><h2>My Cart</h2><span id="close-cart">&times;</span></header>
    <div id="cart-items"></div>
    <div id="cart-total" class="cart-total">Total: $0</div>
    <button id="clear-cart" class="clear-cart">Clear Cart</button>
  `;
  document.body.appendChild(cartSidebar);
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  createCartSidebar();

  // Cart Events
  $$(".cart-icon-container").onclick = () =>
    $("cart-sidebar").classList.add("open");
  $("close-cart").onclick = () => $("cart-sidebar").classList.remove("open");
  $("clear-cart").onclick = () => {
    if (confirm("Clear entire cart?")) {
      cartProducts = [];
      saveCart();
      refreshCartUI();
    }
  };

  // Popup Events
  $$(".popup-close").onclick = hideProductPopup;
  $("product-popup").onclick = (e) => {
    if (e.target.id === "product-popup") hideProductPopup();
  };

  // Search
  searchInput.oninput = (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = featuredProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.shortDesc.toLowerCase().includes(keyword)
    );
    renderProducts(filtered);
  };

  // Burger Menu
  $$(".burger-menu-btn").onclick = () =>
    $$(".nav-links").classList.toggle("show");

  // Dark Mode
  const darkModeToggle = $$(".dark-mode-toggle i");
  $$(".dark-mode-toggle").onclick = () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.classList.toggle("fa-moon");
    darkModeToggle.classList.toggle("fa-sun");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  };

  // Initialize
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    darkModeToggle.classList.replace("fa-moon", "fa-sun");
  }
  renderProducts(featuredProducts);
  refreshCartUI();
});

// Add New Product Function
function addNewProduct() {
  const title = $("product-title").value;
  const shortDesc = $("product-short-desc").value;
  const price = parseFloat($("product-price").value);
  const img = $("product-img").value;

  if (!title || !shortDesc || !price || !img) {
    alert("Please fill in all fields.");
    return;
  }

  featuredProducts.push({
    id: featuredProducts.length + 1,
    title,
    shortDesc,
    price,
    img,
  });

  renderProducts(featuredProducts);
  $("add-product-form").reset();
}
