<?php $title = $product->ten; ?>

<div class="container product-detail">
    <div class="product-gallery">
        <div class="main-image">
            <img src="<?php echo $product->hinh_anh[0]; ?>" alt="<?php echo $product->ten; ?>">
        </div>
        <div class="thumbnail-list">
            <?php foreach($product->hinh_anh as $image): ?>
                <img src="<?php echo $image; ?>" alt="<?php echo $product->ten; ?>">
            <?php endforeach; ?>
        </div>
    </div>

    <div class="product-info">
        <h1><?php echo $product->ten; ?></h1>
        <div class="rating">
            <?php for($i = 1; $i <= 5; $i++): ?>
                <span class="star <?php echo $i <= $product->diem_danh_gia ? 'filled' : ''; ?>">★</span>
            <?php endfor; ?>
            <span>(<?php echo $product->so_danh_gia; ?> đánh giá)</span>
        </div>

        <div class="price">
            <?php if($product->gia_giam): ?>
                <span class="original-price"><?php echo number_format($product->gia); ?>đ</span>
                <span class="sale-price"><?php echo number_format($product->gia_giam); ?>đ</span>
            <?php else: ?>
                <span class="regular-price"><?php echo number_format($product->gia); ?>đ</span>
            <?php endif; ?>
        </div>

        <?php if($product->ton_kho > 0): ?>
            <form class="add-to-cart" action="/cart/add" method="POST">
                <input type="hidden" name="product_id" value="<?php echo $product->id; ?>">
                <input type="number" name="quantity" value="1" min="1" max="<?php echo $product->ton_kho; ?>">
                <button type="submit">Thêm vào giỏ hàng</button>
            </form>
        <?php endif; ?>
    </div>
</div>