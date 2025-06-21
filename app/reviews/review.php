<?php
$pageTitle = "ShopOnline - Đánh Giá Sản Phẩm";
require_once __DIR__ . '..\..\layouts\header.php';
?> 
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Đánh Giá Sản Phẩm</title>
  <link rel="stylesheet" href="./css/reviews/review.css" />
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="./js/review.js" defer></script>
</head>
<body>
  <div class="page-wrapper">
    <div id="product-detail"></div>
    <div class="container">
      <h2>Đánh Giá Sản Phẩm</h2>
      <form onsubmit="submitReview(event)">
        <label>Số sao:</label>
        <select id="rating" required>
          <option value="">-- Chọn số sao --</option>
          <option value="5">★★★★★ - Rất tốt</option>
          <option value="4">★★★★☆ - Tốt</option>
          <option value="3">★★★☆☆ - Trung bình</option>
          <option value="2">★★☆☆☆ - Kém</option>
          <option value="1">★☆☆☆☆ - Rất tệ</option>
        </select>

        <label for="comment">Nội dung đánh giá:</label>
        <textarea id="comment" rows="5" required placeholder="Chia sẻ trải nghiệm của bạn..."></textarea>

        <button class = "review-button" type="submit">Gửi đánh giá</button>
      </form>
    </div>
  </div>
</body>
<?php
require_once __DIR__ . '..\..\layouts\footer.php';
?>  