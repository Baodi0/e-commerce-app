<?php
include_once __DIR__ . '/../../templates/header.php';
?>

<div class="container order-tracking">
    <h1>Theo dõi đơn hàng</h1>
    
    <div class="tracking-form">
        <form action="" method="POST">
            <div class="form-group">
                <label for="orderNumber">Mã đơn hàng:</label>
                <input type="text" id="orderNumber" name="orderNumber" required>
            </div>
            <button type="submit" class="btn btn-primary">Kiểm tra</button>
        </form>
    </div>

    <div class="tracking-result">
        <!-- Results will be displayed here -->
    </div>
</div>

<?php
include_once __DIR__ . '/../../templates/footer.php';
?>