<link rel="stylesheet" href="./css/carts/cart-sidebar.css">
<div class="cart-sidebar" id="cartSidebar">
    <div class="cart-header">
        <h3 class="cart-title">Giỏ Hàng</h3>
        <button class="close" onclick="toggleCart()">&times;</button>
    </div>
    <div class="cart-items" id="cartItems">
        <p style="text-align: center; color: #999; padding: 20px;">Giỏ hàng trống</p>
    </div>
    <div class="cart-total" id="cartTotalSection" style="display: none;">
         <div class="total-row">
            <span class="label-subtotal">Tạm tính:</span>
            <span class="value-subtotal" id="subtotal">0₫</span>
        </div>
        <div class="total-row">
            <span class="label-shipping">Phí vận chuyển:</span>
            <span class="value-shipping" id="shipping">30,000₫</span>
        </div>
        <div class="total-row total-final">
            <span class="label-total">Tổng cộng:</span>
            <span class="value-total" id="total">0₫</span>
        </div>
        <button class="checkout-btn" onclick="checkout()">Thanh Toán</button>
    </div>
</div>
