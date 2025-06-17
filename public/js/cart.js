function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}
function addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({
            ...product,
            quantity: quantity
        });
    }
    
    this.saveToStorage();
    return this.items;
}

function removeItem(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.saveToStorage();
    return this.items;
}

function updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            this.removeItem(productId);
        } else {
            item.quantity = quantity;
            this.saveToStorage();
        }
    }
    return this.items;
}

function getItems() {
    return this.items;
}

function getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
}

function tTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clear() {
    this.items = [];
    this.saveToStorage();
}

function saveToStorage() {
    // Simulate localStorage (since it's not available in artifacts)
    window.cartData = JSON.stringify(this.items);
}

function loadFromStorage() {
    // Simulate localStorage loading
    if (window.cartData) {
        try {
            this.items = JSON.parse(window.cartData) || [];
        } catch (e) {
            this.items = [];
        }
    }
}

// Cart helper functions
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartDisplay();
    showNotification('Đã thêm sản phẩm vào giỏ hàng');
    return cart;
}

function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    updateCartDisplay();
    return updatedCart;
}

function updateCartQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = newQuantity;
        saveCart(cart);
        updateCartDisplay();
    }
    return cart;
}

function clearCart() {
    saveCart([]);
    updateCartDisplay();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function updateCartDisplay() {
    const cart = getCart();
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = getCartCount();
    }
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Giỏ hàng trống</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.quantity} x ${formatPrice(item.price)}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button onclick="removeFromCart(${item.id})">Xóa</button>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) {
        cartTotal.textContent = formatPrice(getCartTotal());
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}
