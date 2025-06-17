// Sample fallback data in case API fails
function generateSampleProducts() {
    const products = [];
    const categories = [
        { id: 'dien-thoai', name: 'Điện Thoại', icon: '📱' },
        { id: 'laptop', name: 'Laptop', icon: '💻' },
        { id: 'thoi-trang', name: 'Thời Trang', icon: '👔' },
        { id: 'gia-dung', name: 'Gia Dụng', icon: '🏠' },
        { id: 'the-thao', name: 'Thể Thao', icon: '⚽' },
        { id: 'sach', name: 'Sách', icon: '📚' }
    ];

    const productNames = {
        'dien-thoai': ['iPhone 15 Pro Max', 'Samsung Galaxy S24', 'Xiaomi 14 Pro', 'OPPO Find X7', 'Vivo X100'],
        'laptop': ['MacBook Pro M3', 'Dell XPS 13', 'HP Pavilion', 'Asus ZenBook', 'Lenovo ThinkPad'],
        'thoi-trang': ['Áo Sơ Mi Nam', 'Váy Dự Tiệc', 'Quần Jeans', 'Giày Sneaker', 'Túi Xách Nữ'],
        'gia-dung': ['Nồi Cơm Điện', 'Máy Giặt', 'Tủ Lạnh', 'Máy Lọc Nước', 'Bếp Từ'],
        'the-thao': ['Giày Chạy Bộ', 'Áo Thể Thao', 'Bóng Đá', 'Vợt Cầu Lông', 'Găng Tay Boxing'],
        'sach': ['Sách Kinh Tế', 'Tiểu Thuyết', 'Sách Thiếu Nhi', 'Học Ngoại Ngữ', 'Sách Kỹ Năng']
    };

    let id = 1;
    categories.forEach(category => {
        const names = productNames[category.id];
        names.forEach(name => {
            const basePrice = Math.floor(Math.random() * 5000000) + 100000;
            const discount = Math.floor(Math.random() * 50) + 10;
            const originalPrice = Math.floor(basePrice * (100 + discount) / 100);
            
            products.push({
                id: id++,
                name: name,
                category: category.id,
                categoryName: category.name,
                price: basePrice,
                originalPrice: originalPrice,
                discount: discount,
                rating: (Math.random() * 2 + 3).toFixed(1),
                sold: Math.floor(Math.random() * 1000) + 10,
                stock: Math.floor(Math.random() * 100) + 1,
                image: `product-${id}.jpg`,
                description: `Mô tả chi tiết về ${name}`,
                brand: ['Apple', 'Samsung', 'Xiaomi', 'Dell', 'HP', 'Nike', 'Adidas'][Math.floor(Math.random() * 7)],
                isNew: Math.random() > 0.7,
                isSale: Math.random() > 0.6
            });
        });
    });

    return products;
}

let currentProducts = [];

async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';

    try {
        const response = await axios.get('http://localhost:8080/products');
        currentProducts = response.data;
        displayProducts(currentProducts);
    } catch (error) {
        console.error('Error fetching products, using sample data:', error);
        currentProducts = generateSampleProducts();
        displayProducts(currentProducts);
    } finally {
        loadingEl.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);

function displayProducts(products) {
    const container = document.getElementById('productsGrid');
                
                if (products.length === 0) {
                    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Không tìm thấy sản phẩm nào</div>';
                    return;
                }

                container.innerHTML = products.map(product => this.createProductCard(product)).join('');
            }

function renderProducts(products) {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Không tìm thấy sản phẩm nào</div>';
        return;
    }

    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const formattedPrice = formatPrice(product.price);
    const formattedOriginalPrice = formatPrice(product.originalPrice);
    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
    
    const badge = product.isNew ? '<div class="product-badge">Mới</div>' : 
                 product.isSale ? '<div class="product-badge">Giảm giá</div>' : '';

    return `
        <div class="product-card">
            <a href="/e-commerce-app/public/product-detail" class="link-wrapper">
                <div class="product-image">
                    ${badge}
                    Hình ảnh sản phẩm
                </div>
            </a>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">${formattedPrice}</span>
                    <span class="original-price">${formattedOriginalPrice}</span>
                </div>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${product.rating} (${product.sold} đã bán)</span>
                </div>
            </div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                Thêm Vào Giỏ
            </button>
        </div>
    `;
}


function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            sortedProducts.sort((a, b) => b.sold - a.sold);
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
        product.price >= min && product.price <= max
    );

    displayProducts(filteredProducts);
}

async function showCategory(category) {
    const heroElement = document.querySelector('.hero');
    const categoriesElement = document.querySelector('.categories');
    
    if (heroElement) heroElement.style.display = 'none';
    if (categoriesElement) categoriesElement.style.display = 'none';
    
    try {
        const response = await axios.get(`http://localhost:8080/products/?category=${category}`);
        currentProducts = response.data;
        displayProducts(currentProducts);
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
        updateCartDisplay();
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
        const response = await axios.get(`http://localhost:8080/products/?keyword=${encodeURIComponent(query)}`);
        currentProducts = response.data;
        displayProducts(currentProducts);
    } catch (error) {
        console.error('Error searching products:', error);
        displayProducts([]);
    } finally {
        loadingEl.style.display = 'none';
    }
    
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.categories').style.display = 'none';
}

function showProductDetail(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (product) {
        alert(`Chi tiết sản phẩm: ${product.name}\nGiá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}\nMô tả: ${product.description}`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartDisplay();
});

