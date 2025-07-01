let currentPage = 1;
const productsPerPage = 8; 
let allProduct = [];


async function loadProducts() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.display = 'flex';

    try {
        const response = await axios.get('http://localhost:8081/api/sanpham');
        currentProducts = response.data || [];
        allProduct = currentProducts;
        displayProducts(currentProducts);
    } catch (error) {
        console.error('Error fetching products, using sample data:', error);
        displayProducts([]);
    } finally {
        loadingEl.style.display = 'none';
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsGrid');
                
        if (products.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Không tìm thấy sản phẩm nào</div>';
            return;
        }
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = products.slice(start, end);

        container.innerHTML = paginatedProducts.map(product => createProductCard(product)).join('');

        renderPagination(products.length);
    }

function renderProducts(products) {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">Không tìm thấy sản phẩm nào</div>';
        return;
    }

    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function renderPagination(totalProducts) {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button 
                class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                onclick="goToPage(${i})"
            >${i}</button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    displayProducts(currentProducts);
}


function createProductCard(product) {
    const formattedPrice = formatPrice(product.gia);
    const stars = '★'.repeat(Math.floor(product.diemDanhGia)) + '☆'.repeat(5 - Math.floor(product.diemDanhGia));
    
    return `
        <div class="product-card">
            <a href="/e-commerce-app/public/product-detail?productId=${product.id}" class="link-wrapper">
                <div class="product-image">
                    Hình ảnh sản phẩm
                </div>
            <div class="product-info">
                <div class="product-name">${product.tenSanPham}</div>
                <div class="product-price">
                    <span class="current-price">${formattedPrice}</span>
                </div>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${product.diemDanhGia} (${product.soLuong} đã bán)</span>
                </div>
            </div>
            </a>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">Thêm vào giỏ</button>

        </div>
    `;
}


function formatPrice(gia) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(gia);
}

function setView(viewType) {
    const productsGrid = document.getElementById('productsGrid');
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    productsGrid.className = viewType === 'grid' ? 'products-grid' : 'products-list';
}

function sortProducts() {
    currentPage = 1;
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
            sortedProducts.sort((a, b) => b.diemDanhGia - a.diemDanhGia);
            break;
        case 'newest':
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            sortedProducts.sort((a, b) => b.soLuong - a.soLuong);
    }
    currentProducts = sortedProducts;
    displayProducts(sortedProducts);
}

function filterByPrice() {
    currentPage = 1;
    currentProducts = allProduct;
    const priceRange = document.getElementById('priceFilter').value;
    if (priceRange === 'all') {
        displayProducts(currentProducts);
        return;
    }

    const [min, max] = priceRange.split('-').map(Number);
    const filteredProducts = currentProducts.filter(product => 
        product.gia >= min && product.gia <= max
    );
    currentProducts = filteredProducts;
    displayProducts(filteredProducts);
}


async function showCategory(category) {
    currentPage = 1;
    document.querySelectorAll('.nav-menu li a').forEach(a => {
        a.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const heroElement = document.querySelector('.hero');
    const categoriesElement = document.querySelector('.categories');
    
    if (heroElement) heroElement.style.display = 'none';
    if (categoriesElement) categoriesElement.style.display = 'none';
    
    try {
        const response = await axios.get(`http://localhost:8081/api/sanpham/filterByDanhMuc?danhMuc=${category}`);
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
        const response = await axios.get(`http://localhost:8081/api/sanpham/searchByTenSanPham?tenSanPham=${encodeURIComponent(query)}`);
        currentProducts = response.data;
        displayProducts(currentProducts);
    } catch (error) {
        console.error('Error searching products:', error);
        displayProducts([]);
    } finally {
        loadingEl.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    updateCartDisplay();
    loadCart('user_001');
});

  document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("searchInput");

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); 
        searchProducts();
      }
    });
  });
