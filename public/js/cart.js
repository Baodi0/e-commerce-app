async function renderCartItems(items) {
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

        const htmlList = await Promise.all(items.map(item => createCartItem(item)));
        container.innerHTML = htmlList.join('');
        totalSection.style.display = 'block';
        const totalPrice = getCartTotalPrice();
        updateCartTotal(items);
    } catch (error) {
        console.error('Error rendering cart:', error);
        showNotification('Có lỗi xảy ra khi hiển thị giỏ hàng', 'error');
    }
}


async function loadProductsById(productId) {
    try {
        const response = await axios.get(`http://localhost:8081/api/sanpham/${productId}`);

        const product = response.data ;
        if (!product) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        return product;
    } catch (error) {   
        console.error('Error loading product by ID:', error);
        return null;
    }
}

async function createCartItem(item) {
    try {
        const product = await loadProductsById(item.id); 

        const formattedPrice = formatPrice(product.gia);
        const totalPrice = formatPrice(product.gia * item.soLuong);

        return `
            <div class="cart-item" data-id="${item.giaLucThem}">
                <div class="cart-item-image">
                    <img src="${product.hinhAnh || 'default-product.jpg'}" alt="${product.tenSanPham}" />
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.tenSanPham}</div>
                    <div class="cart-item-price">${formattedPrice} x ${item.soLuong} = ${totalPrice}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateCartQuantity('${product.id}', ${item.soLuong - 1})" ${item.soLuong <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity">${item.soLuong}</span>
                        <button class="qty-btn" onclick="updateCartQuantity('${product.id}', ${item.soLuong + 1})">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${product.id}')" style="margin-left: 10px; color: red;">🗑</button>
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
        const subtotal = items.reduce((total, sanpham) => {
            return total + (sanpham.giaLucThem * sanpham.soLuong);
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


async function loadCart(userId) {
    try {
        const response = await axios.get(`http://localhost:8082/api/giohang/userId/${userId}`);

        const items = response.data.sanpham || [];
        localStorage.setItem('sanpham', JSON.stringify(items));
        updateCartDisplay();

    } catch (error) {
        console.error('Error loading cart:', error);
        showNotification(error.message || 'Có lỗi xảy ra khi tải giỏ hàng', 'error');
    }
}

async function addToCart(productId) {
    const product = await loadProductsById(productId);
    try{
        const response = await axios.put('http://localhost:8082/api/giohang/addSanPham/user_001', {
            "id": product.id,
            "soLuong": 1,
            "giaLucThem": product.gia,
        });

        let cartItems = getCartItems();
        const existingItem = cartItems.find(item => item.id === parseInt(productId));
        if( existingItem) {
            existingItem.soLuong += 1;
        }
        else {
            cartItems.push({
                id: product.id,
                tenSanPham: product.tenSanPham,
                giaLucThem: product.gia,
                soLuong: 1,
                hinhAnh: product.hinhAnh
            });
        }
        localStorage.setItem('sanpham', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification('Sản phẩm đã được thêm vào giỏ hàng!', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification(error.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng', 'error');
    }
}


async function removeFromCart(productId) {
    try {
        const response = await axios.delete(`http://localhost:8082/api/giohang/removeSanPham?userId=user_001&productId=${productId}`);

        let cartItems = getCartItems();
        cartItems = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('sanpham', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');

    } catch (error) {
        console.error('Error removing from cart:', error);
        showNotification(error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng', 'error');
    }
}

async function updateCartQuantity(productId, quantity) {
    try {
        if (quantity < 0) return;

        if (quantity === 0) {
            await removeFromCart(productId);
            return;
        }
        const product = await loadProductsById(productId);

        const response = await axios.put('http://localhost:8082/api/giohang/addSanPham/user_001', {
            "id": product.id,
            "soLuong": quantity,
        });

        let cartItems = getCartItems();
        const itemIndex = cartItems.findIndex(item => item.id === productId);
        
        cartItems[itemIndex].soLuong = quantity;
        localStorage.setItem('sanpham', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification('Số lượng sản phẩm đã được cập nhật!', 'success');
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification(error.response?.data?.message || 'Không thể cập nhật số lượng sản phẩm', 'error');
    }
}

// Helper functions
function calculateShipping(subtotal) {
    // Nếu tổng đơn hàng lớn hơn 1.000.000 VNĐ, miễn phí vận chuyển
    if (subtotal > 1000000) {
        return 0;
    }
    // Nếu có tổng tiền > 0, tính phí vận chuyển là 30.000 VNĐ
    if (subtotal > 0) {
        return 30000;
    }
    return 0;
}


function getCartItems() {
    try {
        const items = JSON.parse(localStorage.getItem('sanpham'));
        if (!Array.isArray(items)) return [];

        const grouped = {};
        items.forEach(item => {
            if (grouped[item.id]) {
                grouped[item.id].soLuong += item.soLuong;
            } else {
                grouped[item.id] = { ...item };
            }
        });

        return Object.values(grouped);
    } catch (error) {
        console.error('Error parsing cart items:', error);
        return [];
    }
}


function getTotalCartItems() {
    try {
        const items = getCartItems();
        return items.reduce((total, item) => {
            const qty = parseInt(item.soLuong) || 0;
            return total + qty;
        }, 0);
    } catch (error) {
        console.error('Lỗi tính tổng số lượng sản phẩm:', error);
        return 0;
    }
}
function getCartTotalPrice() {
    try {
        const items = getCartItems();
        return items.reduce((total, item) => {
            const rawPrice = item?.giaLucThem || 0;
            const rawQty = item?.soLuong || 0;

            const price = parseFloat(rawPrice);
            const qty = parseInt(rawQty);
            return (total + price * qty);
        }, 0);
    } catch (error) {
        console.error('Lỗi tính tổng giá trị giỏ hàng:', error);
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
            localStorage.removeItem('sanpham');
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

async function updateCartDisplay() {
    try {
        const items = getCartItems();
        await renderCartItems(items); 
       
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = getTotalCartItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }

        const totalPriceElement = document.getElementById('subtotal');
        if (totalPriceElement) {
           const total = getCartTotalPrice();
            totalPriceElement.textContent = !isNaN(total)
                ? total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                : '0 ₫';
        }

    } catch (error) {
        console.error('Lỗi cập nhật hiển thị giỏ hàng:', error);
        showNotification('Không thể cập nhật giỏ hàng', 'error');
    }
}


document.addEventListener('click', function(e) {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartIcon = document.querySelector('.cart-icon');
            
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('open')) {
                cartSidebar.classList.remove('open');
            }
        });

