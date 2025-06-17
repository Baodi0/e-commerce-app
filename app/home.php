<?php
$pageTitle = "ShopOnline - Trang Chủ";
require_once __DIR__ . '/./layouts/header.php';
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle; ?></title>        <link rel="stylesheet" href="./css/home.css">

    <link rel="stylesheet" href="./css/layouts/header.css">
    <link rel="stylesheet" href="./css/layouts/footer.css">
    <link rel="stylesheet" href="./css/products/products.css">
    <link rel="stylesheet" href="./css/carts/cart-sidebar.css">
    <script src="./js/cart.js" defer></script>  
    <script src="./js/home.js"></script>
</head>
<body>
    <!-- Main Content -->
    <main id="mainContent">
        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <h1>Chào Mừng Đến ShopOnline</h1>
                <p>Khám phá hàng ngàn sản phẩm chất lượng với giá tốt nhất</p>
                <a href="#products" class="btn btn-primary">Mua Sắm Ngay</a>
            </div>
        </section>

        <!-- Products Section -->
        <section class="products" id="products">
            <div class="container">
                <div class="products-header">
                    <h2 class="section-title">Sản Phẩm Nổi Bật</h2>
                    
                    <div class="filter-sort">
                        <select class="filter-select" id="sortSelect" onchange="sortProducts()">
                            <option value="popular">Phổ Biến</option>
                            <option value="price-asc">Giá Thấp → Cao</option>
                            <option value="price-desc">Giá Cao → Thấp</option>
                            <option value="rating">Đánh Giá Cao</option>
                            <option value="newest">Mới Nhất</option>
                        </select>
                        
                        <select class="filter-select" id="priceFilter" onchange="filterByPrice()">
                            <option value="all">Tất Cả Giá</option>
                            <option value="0-500000">Dưới 500K</option>
                            <option value="500000-2000000">500K - 2TR</option>
                            <option value="2000000-5000000">2TR - 5TR</option>
                            <option value="5000000-99999999">Trên 5TR</option>
                        </select>
                        
                        <div class="view-toggle">
                            <button class="view-btn active" onclick="setView('grid')">⊞</button>
                            <button class="view-btn" onclick="setView('list')">☰</button>
                        </div>
                    </div>
                </div>

                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>Đang tải sản phẩm...</p>
                </div>

                <div class="products-grid" id="productsGrid">
                    <!-- Products will be loaded here -->
                     
                </div>
            </div>
        </section>
    </main>  
</body>
</html>

<?php require_once __DIR__ . '/./layouts/footer.php'; ?>