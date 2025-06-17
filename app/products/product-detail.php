<?php
$productId = $_GET['id'] ?? null;
?>

<link rel="stylesheet" href="./css/products/product-detail.css">
<div class="product-detail-container" id="productDetail">
    <div class="product-image" id="productImage">
        Đang tải hình ảnh...
    </div>
    <div class="product-info">
        <h2 id="productName">Đang tải...</h2>
        <div class="price" id="productPrice"></div>
        <div class="rating" id="productRating"></div>
        <p id="productDescription">Đang tải mô tả...</p>
        <p>Danh mục: <span id="productCategory"></span></p>
        <p>Số lượng còn: <span id="productStock"></span> sản phẩm</p>
        <div class="product-attributes">
            <div class="color-select">
                <p>Màu sắc:</p>
                <div id="colorOptions"></div>
            </div>
            <div class="size-select">
                <p>Kích cỡ:</p>
                <div id="sizeOptions"></div>
            </div>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(<?= json_encode($productId) ?>)">Thêm vào giỏ hàng</button>
    </div>
</div>
