
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chi Tiết Sản Phẩm</title>
    <link rel="stylesheet" href="./css/products/product-detail.css"> 
    <script src="./js/product-detail.js"></script>

</head>
<body class="product-detail-page">
    <header>
        <button class="back-button" onclick="history.back()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
            </svg>
        </button>
        <span>ShopOnline - Chi Tiết Sản Phẩm</span>
        <span></span>
    </header>
  <main class="container">
    <div class="product-image">
      <div class="main-image" id="mainImg">
        <img id="mainProductImage" src="" alt="Ảnh sản phẩm" />
      </div>
      <div class="thumbs" id="thumbsContainer"></div>
    </div>
    <div class="product-info">
        <h1 class="product-title" id="productTitle"></h1>        <div class="product-rating-container">
          <div class="product-rating" id="productRating"></div>
          <div class="product-rating-int" id="productRatingInt"></div>
        </div>
        <div class="product-price" id="productPrice"></div>
        <p class="product-desc" id="productDesc"></p>
        <div class="product-meta">
        <p><strong>Danh mục:</strong> <span id="productCategory"></span></p>
        <p><strong>Thể loại:</strong> <span id="productGenre"></span></p>
        <p><strong>Ngôn ngữ:</strong> <span id="productLang"></span></p>
        <p><strong>Còn lại:</strong> <span id="productQty"></span></p>
      </div>
      <button class="add-to-cart">Thêm vào giỏ hàng</button>
    </div>
  </main>

</body>
</html>
