<head>
<link rel="stylesheet" href="./css/carts/cart-sidebar.css">
<script src="./js/cart.js"></script>
</head>
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
        <div id="orderInfoForm" margin-top: 1rem;">
            <div style="margin-bottom: 0.5rem;">
                <label for="addressInput">Địa chỉ nhận hàng:</label>
                <input class="filter-select" type="text" id="addressInput" placeholder="Nhập địa chỉ..." style="width: 100%; padding: 6px;">
            </div>
            <div style="margin-bottom: 0.5rem;">
                <label for="paymentMethod">Hình thức thanh toán:</label>
                <select class="filter-select" id="paymentMethod" style="width: 100%; padding: 6px;">
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="BANK">Chuyển khoản ngân hàng</option>
                    <option value="MOMO">Ví MoMo</option>
                </select>
            </div>
        </div>
        <button class="checkout-btn" id="confirmCheckoutBtn" onclick="checkout()">Xác Nhận Đặt Hàng</button>
    </div>
</div>
