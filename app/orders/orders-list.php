<?php $title = 'Danh sách đơn hàng'; ?>

<div class="container orders-list">
    <h1>Đơn hàng của tôi</h1>
    
    <?php if (empty($orders)): ?>
        <div class="empty-orders">
            <p>Bạn chưa có đơn hàng nào.</p>
            <a href="index.php" class="btn btn-primary">Tiếp tục mua sắm</a>
        </div>
    <?php else: ?>
        <div class="orders-grid">
            <?php foreach($orders as $order): ?>
                <div class="order-card">
                    <div class="order-header">
                        <h3>Đơn hàng #<?php echo $order->ma_don_hang; ?></h3>
                        <span class="order-date"><?php echo date('d/m/Y', strtotime($order->created_at)); ?></span>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-<?php echo strtolower($order->trang_thai); ?>">
                            <?php echo $order->trang_thai; ?>
                        </span>
                    </div>
                    <div class="order-summary">
                        <p>Tổng tiền: <?php echo number_format($order->tong_tien); ?>đ</p>
                        <p>Số sản phẩm: <?php echo count($order->items); ?></p>
                    </div>
                    <div class="order-actions">
                        <a href="index.php?page=tracking&id=<?php echo $order->id; ?>" class="btn btn-outline">
                            Theo dõi đơn hàng
                        </a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>