
<header>
    <div class="header-container">
        <a href="index.php?page=home" class="logo">ShopOnline</a>
        
        <div class="search-container">
            <input type="text" class="search-input" placeholder="Tìm kiếm sản phẩm..." id="searchInput">
            <button class="search-btn" onclick="searchProducts()">
                <span>🔍</span>
            </button>
        </div>
        
        <div class="header-actions">
            <div class="cart-icon" onclick="toggleCart()">
                <span>🛒</span>
                <div class="cart-count" id="cartCount">0</div>
            </div>
              <div class="auth-buttons">
                <a href="index.php?page=login" class="btn btn-outline">Đăng Nhập</a>
                <a href="index.php?page=register" class="btn btn-primary">Đăng Ký</a>
            </div>
        </div>
    </div>
</header>

<!-- Navigation -->
<nav>
    <div class="nav-container">        
        <ul class="nav-menu">
            <li><a href="#" onclick="showPage('home')">Trang Chủ</a></li>
            <li><a href="#" onclick="showCategory('Điện thoại')">Điện Thoại</a></li>
            <li><a href="#" onclick="showCategory('Laptop')">Laptop</a></li>
            <li><a href="#" onclick="showCategory('Thời trang')">Thời Trang</a></li>
            <li><a href="#" onclick="showCategory('Gia dụng')">Gia Dụng</a></li>
            <li><a href="#" onclick="showCategory('Thể thao')">Thể Thao</a></li>
        </ul>        <ul class="nav-menu">
            <li><a href="index.php?page=tracking">Đơn hàng</a></li>
        </ul>
    </div>
</nav>

<!-- Cart Sidebar -->
<div class="cart-overlay" onclick="toggleCart()"></div>
<?php include __DIR__ . '/../carts/cart-sidebar.php'; ?>

<script>
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}
</script>