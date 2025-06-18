<?php
$pageTitle = "ShopOnline - Danh Sách Đơn Hàng";
require_once __DIR__ . '..\..\layouts\header.php';
?> 
<head>
  <meta charset="UTF-8">
  <title>Danh Sách Đơn Hàng</title>  
  <link rel="stylesheet" href="./css/orders/order-list.css">
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="./js/order.js" defer></script>
</head>
<body>
  <div class="container">
    <h2>Lịch sử đơn hàng</h2>
    <table>
      <thead>
        <tr>
          <th>Mã Đơn</th>
          <th>Ngày Đặt</th>
          <th>Trạng Thái</th>
          <th>Tổng Tiền</th>
          <th>Chi Tiết</th>
          <th>Đánh Giá</th>
        </tr>
      </thead>
      <tbody id="orderTableBody">
      </tbody>
    </table>
  </div>
</body>
</html>
<?php
require_once __DIR__ . '..\..\layouts\footer.php';
?>