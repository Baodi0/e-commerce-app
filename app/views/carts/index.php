<?php $title = 'Giỏ hàng'; ?>

<div class="container cart-page">
    <?php if(count($cart->items) > 0): ?>
        <div class="cart-items">
            <?php foreach($cart->items as $item): ?>
                <div class="cart-item" data-id="<?php echo $item->product_id; ?>">
                    <img src="<?php echo $item->product->hinh_anh[0]; ?>" alt="<?php echo $item->product->ten; ?>">
                    <div class="item-info">
                        <h3><?php echo $item->product->ten; ?></h3>
                        <p class="price"><?php echo number_format($item->gia); ?>đ</p>
                    </div>
                    <div class="quantity-control">
                        <button class="decrease">-</button>
                        <input type="number" value="<?php echo $item->so_luong; ?>" min="1" max="<?php echo $item->product->ton_kho; ?>">
                        <button class="increase">+</button>
                    </div>
                    <button class="remove-item">×</button>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="cart-summary">
            <h3>Tổng cộng</h3>
            <div class="summary-row">
                <span>Tạm tính</span>
                <span><?php echo number_format($cart->subtotal); ?>đ</span>
            </div>
            <div class="summary-row">
                <span>Phí vận chuyển</span>
                <span><?php echo number_format($cart->shipping); ?>đ</span>
            </div>
            <div class="summary-row total">
                <span>Tổng cộng</span>
                <span><?php echo number_format($cart->total); ?>đ</span>
            </div>
            <a href="/checkout" class="checkout-button">Thanh toán</a>
        </div>
    <?php else: ?>
        <div class="empty-cart">
            <h2>Giỏ hàng trống</h2>
            <a href="/" class="continue-shopping">Tiếp tục mua sắm</a>
        </div>
    <?php endif; ?>
</div>