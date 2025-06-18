
<?php
$pageTitle = "ShopOnline - Theo Dõi Đơn Hàng";
require_once __DIR__ . '..\..\layouts\header.php';
?> 
<head>
  <meta charset="UTF-8" />
  <title>Theo Dõi Đơn Hàng</title>
  <link rel="stylesheet" href="./css/orders/tracking.css" />
</head>
<body>
  <div class="container">
    <div class="order-status">
      <div class="step active">
        <div class="step-line"></div>
        <div class="step-title">Đã Đặt Hàng</div>
      </div>
      <div class="step active">
        <div class="step-line"></div>
        <div class="step-title">Đang Xử Lý</div>
      </div>
      <div class="step">
        <div class="step-line"></div>
        <div class="step-title">Đang Giao</div>
      </div>
      <div class="step">
        <div class="step-title">Đã Giao</div>
      </div>
    </div>
    <div class="order-info">
      <h3>Chi Tiết Đơn Hàng</h3>
      <div class="info-row">
        <span>Mã đơn hàng:</span>
        <span>#DH1001</span>
      </div>
      <div class="info-row">
        <span>Ngày đặt:</span>
        <span>16/06/2025</span>
      </div>
      <div class="info-row">
        <span>Người nhận:</span>
        <span>Nguyễn Văn A</span>
      </div>
      <div class="info-row">
        <span>Địa chỉ:</span>
        <span>123 Đường ABC, TP.HCM</span>
      </div>
      <div class="info-row">
        <span>Phương thức thanh toán:</span>
        <span>COD</span>
      </div>
      <div class="info-row">
        <span>Tổng tiền:</span>
        <span>420.000₫</span>
      </div>
    </div>
  </div>
</body>
</html>
<?php
require_once __DIR__ . '..\..\layouts\footer.php';
?>