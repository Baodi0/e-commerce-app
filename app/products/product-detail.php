<?php
$productId = $_GET['id'] ?? null;
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Chi tiết sản phẩm</title>
    <link rel="stylesheet" href="/public/css/style.css">
    <style>
        .product-detail-container {
            max-width: 900px;
            margin: 40px auto;
            display: flex;
            gap: 30px;
            border: 1px solid #eee;
            padding: 20px;
            background: #fff;
        }
        .product-image {
            flex: 1;
            background: #f8f8f8;
            text-align: center;
            padding: 20px;
        }
        .product-info {
            flex: 2;
        }
        .product-info h2 {
            margin-top: 0;
        }
        .price {
            color: red;
            font-size: 1.5em;
        }
        .original-price {
            text-decoration: line-through;
            color: #999;
            margin-left: 10px;
        }
        .rating {
            margin: 10px 0;
        }
        .add-to-cart-btn {
            background: #f60;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="product-detail-container" id="productDetail">
    <div class="product-image" id="productImage">
        Đang tải hình ảnh...
    </div>
    <div class="product-info">
        <h2 id="productName">Đang tải...</h2>
        <div class="price" id="productPrice"></div>
        <div class="rating" id="productRating"></div>
        <p id="productDescription">Đang tải mô tả...</p>
        <p>Thương hiệu: <span id="productBrand"></span></p>
        <p>Kho: <span id="productStock"></span> sản phẩm</p>
        <button class="add-to-cart-btn" onclick="addToCart(<?= json_encode($productId) ?>)">Thêm vào giỏ hàng</button>
    </div>
</div>

<script>
const productId = <?= json_encode($productId) ?>;

async function loadProductDetail() {
    try {
        const res = await fetch(`http://localhost:8080/products/${productId}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        const product = await res.json();
        renderProductDetail(product);
    } catch (err) {
        document.getElementById('productDetail').innerHTML = '<p style="color:red; text-align:center">Không tìm thấy sản phẩm.</p>';
        console.error(err);
    }
}

function renderProductDetail(product) {
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').innerHTML = 
        `${formatPrice(product.price)} <span class="original-price">${formatPrice(product.originalPrice)}</span>`;
    document.getElementById('productRating').textContent = `⭐ ${product.rating} (${product.sold} đã bán)`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productStock').textContent = product.stock;
    document.getElementById('productImage').innerHTML = `<img src="/public/images/${product.image}" alt="${product.name}" width="250">`;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

loadProductDetail();
</script>

</body>
</html>
