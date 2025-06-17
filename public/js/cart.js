function renderCartItems(items) {
    const container = document.getElementById('cartItems');
    const totalSection = document.getElementById('cartTotalSection');
    
    try {
        if (!Array.isArray(items)) {
            throw new Error('Items must be an array');
        }

        if (items.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Giỏ hàng trống</p>';
            totalSection.style.display = 'none';
            return;
        }

        container.innerHTML = items.map(item => createCartItem(item)).join('');
        totalSection.style.display = 'block';
        updateCartTotal(items);
    } catch (error) {
        console.error('Error rendering cart:', error);
        showNotification('Có lỗi xảy ra khi hiển thị giỏ hàng', 'error');
    }
}

function createCartItem(item) {
    try {
        if (!item || !item.id || !item.name || typeof item.price !== 'number') {
            throw new Error('Invalid item data');
        }

        const formattedPrice = formatPrice(item.price);
        const totalPrice = formatPrice(item.price * item.quantity);

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || 'default-product.jpg'}" alt="${item.name}" />
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formattedPrice} x ${item.quantity} = ${totalPrice}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; color: red;">🗑</button>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating cart item:', error);
        return '';
    }
}

function updateCartTotal(items) {
    try {
        const subtotal = items.reduce((total, item) => {
            if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                throw new Error('Invalid item data in cart');
            }
            return total + (item.price * item.quantity);
        }, 0);

        const shipping = calculateShipping(subtotal);
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('shipping').textContent = formatPrice(shipping);
        document.getElementById('total').textContent = formatPrice(total);
    } catch (error) {
        console.error('Error updating cart total:', error);
        showNotification('Có lỗi xảy ra khi tính tổng giỏ hàng', 'error');
    }
}

function addToCart(productId) {
    try {
        const product = currentProducts.find(p => p.id === productId);
        if (!product) {
            showNotification('lỗi', 'error');
            throw new Error('Sản phẩm không tồn tại');
        }

        const cartItems = getCartItems();
        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification(`Đã thêm ${product.name} vào giỏ hàng!`, 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Không thể thêm sản phẩm vào giỏ hàng', 'error');
    }
}

function removeFromCart(productId) {
    try {
        let cartItems = getCartItems();
        cartItems = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification('Không thể xóa sản phẩm khỏi giỏ hàng', 'error');
    }
}

function updateCartQuantity(productId, quantity) {
    try {
        if (quantity < 0) return;
        
        let cartItems = getCartItems();
        const itemIndex = cartItems.findIndex(item => item.id === productId);
        
        if (itemIndex === -1) {
            throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
        }

        if (quantity === 0) {
            removeFromCart(productId);
            return;
        }

        cartItems[itemIndex].quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Không thể cập nhật số lượng sản phẩm', 'error');
    }
}

// Helper functions
function calculateShipping(subtotal) {
    return subtotal > 0 ? 30000 : 0;
}

function formatPrice(price) {
    try {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    } catch (error) {
        console.error('Error formatting price:', error);
        return '0 ₫';
    }
}

function getCartItems() {
    try {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error('Error getting cart items:', error);
        return [];
    }
}

function getTotalCartItems() {
    try {
        const items = getCartItems();
        return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error calculating total items:', error);
        return 0;
    }
}

function getCartTotalPrice() {
    try {
        const items = getCartItems();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
        console.error('Error calculating total price:', error);
        return 0;
    }
}

function checkout() {
    try {
        const items = getCartItems();
        if (items.length === 0) {
            showNotification('Giỏ hàng trống!', 'warning');
            return;
        }

        const total = getCartTotalPrice() + calculateShipping(getCartTotalPrice());
        const confirmation = confirm(`Xác nhận thanh toán ${formatPrice(total)}?`);
        
        if (confirmation) {
            localStorage.removeItem('cartItems');
            updateCartDisplay();
            toggleCart();
            showNotification('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        showNotification('Có lỗi xảy ra trong quá trình thanh toán', 'error');
    }
}

function ensureNotificationContainer() {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 10000;
        `;
        document.body.appendChild(container);
    }
    return container;
}

function showNotification(message, type = 'info') {
    const container = ensureNotificationContainer();

    const notification = document.createElement('div');
    const backgroundColor = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    }[type];

    notification.style.cssText = `
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease forwards;
        opacity: 1;
    `;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 1000);
}


function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
    
    if (cartSidebar.classList.contains('open')) {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const items = getCartItems();
    renderCartItems(items);
    
    // Update cart count badge
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = getTotalCartItems();
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
    
    // Update mobile cart count if exists
    const mobileCartCount = document.getElementById('mobileCartCount');
    if (mobileCartCount) {
        const totalItems = getTotalCartItems();
        mobileCartCount.textContent = totalItems;
        mobileCartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

document.addEventListener('click', function(e) {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartIcon = document.querySelector('.cart-icon');
            
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('open')) {
                cartSidebar.classList.remove('open');
            }
        });

        