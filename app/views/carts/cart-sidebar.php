
<head>
    <link rel="stylesheet" href="./css/cart-sidebar.css">
</head>
<div class="cart-sidebar" id="cartSidebar">
        <div class="cart-header">
            <h3>Giỏ Hàng</h3>
            <span class="close" onclick="toggleCart()">&times;</span>
        </div>
        <div class="cart-items" id="cartItems">
            <p style="text-align: center; color: #999; padding: 20px;">Giỏ hàng trống</p>
        </div>
        <div class="cart-total" id="cartTotalSection" style="display: none;">
            <div class="total-row">
                <span>Tạm tính:</span>
                <span id="subtotal">0₫</span>
            </div>
            <div class="total-row">
                <span>Phí vận chuyển:</span>
                <span id="shipping">30,000₫</span>
            </div>
            <div class="total-row total-final">
                <span>Tổng cộng:</span>
                <span id="total">0₫</span>
            </div>
            <button class="checkout-btn" onclick="checkout()">Thanh Toán</button>
        </div>
    </div>