// Sample fallback data in case API fails
const sampleProducts = [
    {
        id: 1,
        name: "Điện thoại iPhone 13",
        price: 20990000,
        image: "/images/products/iphone13.jpg",
        rating: 4.5,
        description: "iPhone 13 với camera siêu đẳng cấp"
    },
    {
        id: 2,
        name: "Laptop Dell XPS 13",
        price: 29990000,
        image: "/images/products/dell-xps.jpg",
        rating: 4.8,
        description: "Laptop cao cấp cho doanh nhân"
    }
];

let currentProducts = [];

async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';

    try {
        const response = await fetch('http://localhost:8080/products');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        if (Array.isArray(data)) {
            currentProducts = data; 
            displayProducts(data);
        } else {
            throw new Error('Invalid data format');
        }
    } catch (error) {
        console.error('Error fetching products, using sample data:', error);
        currentProducts = sampleProducts;
        displayProducts(sampleProducts);
    } finally {
        loadingEl.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);

function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image || '/images/default.jpg'}" alt="${product.tenSanPham}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.tenSanPham}</h3>
                <p class="price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}</p>
                <p class="description">${product.moTa}</p>
                <button class="btn btn-primary" onclick="addToCart('${product.id}')">Thêm vào giỏ</button>
            </div>
        </div>
    `).join('');
}

function setView(viewType) {
    const productsGrid = document.getElementById('productsGrid');
    const buttons = document.querySelectorAll('.view-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    productsGrid.className = viewType === 'grid' ? 'products-grid' : 'products-list';
}

function sortProducts() {
    const sortType = document.getElementById('sortSelect').value;
    const sortedProducts = [...currentProducts];

    switch (sortType) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.gia - b.gia);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.gia - a.gia);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
            break;
        default: // 'popular'
            sortedProducts.sort((a, b) => b.luotXem - a.luotXem);
    }

    displayProducts(sortedProducts);
}

function filterByPrice() {
    const priceRange = document.getElementById('priceFilter').value;
    if (priceRange === 'all') {
        displayProducts(currentProducts);
        return;
    }

    const [min, max] = priceRange.split('-').map(Number);
    const filteredProducts = currentProducts.filter(product => 
        product.gia >= min && product.gia <= max
    );

    displayProducts(filteredProducts);
}

async function showCategory(category) {
    const heroElement = document.querySelector('.hero');
    const categoriesElement = document.querySelector('.categories');
    
    if (heroElement) heroElement.style.display = 'none';
    if (categoriesElement) categoriesElement.style.display = 'none';
    
    try {
        const response = await fetch(`http://localhost:8080/products/?category=${category}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (Array.isArray(data)) {
            currentProducts = data;
            displayProducts(data);
        }
    } catch (error) {
        console.error('Error fetching category products:', error);
        displayProducts([]);
    }
}

function showPage(page) {
    if (page === 'home') {
        document.querySelector('.hero').style.display = 'block';
        document.querySelector('.categories').style.display = 'block';
        loadProducts();
    }
}

async function searchProducts() {
    const query = document.getElementById('searchInput').value;
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';
    if (query.trim() === '') {
        displayProducts(currentProducts);
        loadingEl.style.display = 'none';
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/products/?keyword=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (Array.isArray(data)) {
            currentProducts = data;
            displayProducts(data);
        }
    } catch (error) {
        console.error('Error searching products:', error);
        displayProducts([]);
    } finally {
        loadingEl.style.display = 'none';
    }
    
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.categories').style.display = 'none';
}

function addToCart(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm sản phẩm vào giỏ hàng!');
    }
}

function showProductDetail(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
        alert(`Chi tiết sản phẩm: ${product.tenSanPham}\nGiá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.gia)}\nMô tả: ${product.moTa}`);
    }
}

function addToCart(productId) {
    const product = this.model.getProductById(productId);
    if (product) {
        this.cartModel.addItem(product);
        this.updateCartDisplay();
        this.showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
    }
}

function removeFromCart(productId) {
    this.cartModel.removeItem(productId);
    this.updateCartDisplay();
}

function updateCartQuantity(productId, quantity) {
    this.cartModel.updateQuantity(productId, quantity);
    this.updateCartDisplay();
}

function updateCartDisplay() {
    const items = this.cartModel.getItems();
    const totalItems = this.cartModel.getTotalItems();
    
    this.view.renderCartItems(items);
    this.view.updateCartCount(totalItems);
}

function checkout() {
    const items = this.cartModel.getItems();
    if (items.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    const total = this.cartModel.getTotalPrice() + 30000; // shipping
    const confirmation = confirm(`Xác nhận thanh toán ${this.view.formatPrice(total)}?`);
    
    if (confirmation) {
        this.cartModel.clear();
        this.updateCartDisplay();
        this.toggleCart();
        this.showNotification('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function showNotification(message) {
    // Simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function setView(viewType) {
    this.view.setView(viewType);
}

