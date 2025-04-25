// Sample product data
const products = [
    {
        id: 1,
        name: "Fresh Apples",
        image: "https://via.placeholder.com/200",
        weight: "1kg",
        price: 120,
        category: "Fruits & Veg"
    },
    {
        id: 2,
        name: "Milk",
        image: "https://via.placeholder.com/200",
        weight: "1L",
        price: 60,
        category: "Dairy & Eggs"
    },
    {
        id: 3,
        name: "Whole Wheat Bread",
        image: "https://via.placeholder.com/200",
        weight: "500g",
        price: 45,
        category: "Groceries"
    },
    {
        id: 4,
        name: "Potato Chips",
        image: "https://via.placeholder.com/200",
        weight: "150g",
        price: 30,
        category: "Snacks"
    },
    {
        id: 5,
        name: "Mineral Water",
        image: "https://via.placeholder.com/200",
        weight: "1L",
        price: 20,
        category: "Beverages"
    },
    {
        id: 6,
        name: "Toothpaste",
        image: "https://via.placeholder.com/200",
        weight: "100g",
        price: 75,
        category: "Personal Care"
    },
    {
        id: 7,
        name: "Fresh Bananas",
        image: "https://via.placeholder.com/200",
        weight: "1 dozen",
        price: 50,
        category: "Fruits & Veg"
    },
    {
        id: 8,
        name: "Eggs",
        image: "https://via.placeholder.com/200",
        weight: "12 pieces",
        price: 80,
        category: "Dairy & Eggs"
    }
];

// DOM elements
const productsGrid = document.getElementById('products');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const totalAmount = document.querySelector('.total-amount');
const overlay = document.getElementById('overlay');
const closeCart = document.getElementById('closeCart');
const cartBtn = document.querySelector('.cart-btn');
const categories = document.querySelectorAll('.category');

// Cart state
let cart = [];

// Initialize the app
function init() {
    renderProducts();
    setupEventListeners();
}

// Render products to the page
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-weight">${product.weight}</p>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Quantity buttons
        if (e.target.classList.contains('quantity-btn')) {
            const cartItemId = parseInt(e.target.parentElement.getAttribute('data-id'));
            const isIncrease = e.target.textContent === '+';
            updateQuantity(cartItemId, isIncrease);
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item')) {
            const cartItemId = parseInt(e.target.parentElement.getAttribute('data-id'));
            removeFromCart(cartItemId);
        }
    });
    
    // Cart button
    cartBtn.addEventListener('click', toggleCart);
    
    // Close cart
    closeCart.addEventListener('click', toggleCart);
    
    // Overlay click
    overlay.addEventListener('click', toggleCart);
    
    // Category filters
    categories.forEach(category => {
        category.addEventListener('click', function() {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.textContent);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification();
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update product quantity in cart
function updateQuantity(productId, isIncrease) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (isIncrease) {
            item.quantity += 1;
        } else {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                removeFromCart(productId);
                return;
            }
        }
    }
    
    updateCart();
}

// Update cart UI
function updateCart() {
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-id', item.id);
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">₹${item.price}</p>
                    <div class="cart-item-actions">
                        <button class="quantity-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn">+</button>
                        <span class="remove-item">Remove</span>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = ₹${total};
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Toggle cart visibility
function toggleCart() {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Show add to cart notification
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = 'Item added to cart';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Filter products by category
function filterProducts(category) {
    if (category === 'All') {
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p>No products found in this category</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-weight">${product.weight}</p>
                <p class="product-price">₹${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadCart();
});
