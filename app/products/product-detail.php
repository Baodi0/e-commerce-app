<?php
$pageTitle = "ShopOnline - Chi Tiết Sản Phẩm";
require_once __DIR__ . '..\..\layouts\header.php';
?>
<head class="product-detail-head">
    <meta charset="UTF-8" />    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chi Tiết Sản Phẩm</title>   
    <link rel="stylesheet" href="./css/products/product-detail.css"> 
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="./js/product-detail.js"></script>
    <script src="./js/cart.js" defer></script>

</head>
<body class="product-detail-page">
  <main class="container">
    <div class="product-image">
      <div class="main-image" id="mainImg">
        <img id="mainProductImage" src="" alt="Ảnh sản phẩm" />
      </div>
      <div class="thumbs" id="thumbsContainer"></div>
    </div>
    <div class="product-info">
      <h1 class="product-title" id="productTitle"></h1>       
      <div class="product-rating-container">
        <div class="product-rating" id="productRating"></div>
        <div class="product-rating-int" id="productRatingInt"></div>
      </div>
      <div class="product-price" id="productPrice"></div>
        <p class="product-desc" id="productDesc"></p>
        <div class="product-meta">
        <p><strong>Danh mục:  </strong> <span id="productCategory"></span></p>
        <p><span id="productAttributes"></span></p>
        <p><strong>Số Lượng Bán:  </strong> <span id="productQty"></span></p>
      </div>
      <button class="add-to-cart" data-product-id="123" onclick="event.stopPropagation(); addToCart(this.dataset.productId)">Thêm giỏ hàng </button>
      <button class="add-to-cart" data-product-id="123" onclick="event.stopPropagation(); ">Mua hàng </button>

    </div>
    </main>

  <!-- Phần đánh giá -->
  <div class="user-review">
      <h4>Đánh giá gần nhất:</h4>
      <div id="review">
  </div>

</body>
</html>

<?php
require_once __DIR__ . '..\..\layouts\footer.php';
?>
