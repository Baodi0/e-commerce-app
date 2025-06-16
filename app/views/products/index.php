<div class="container">
    <div class="product-filters">
        <div class="filter-group">
            <h3>Danh mục</h3>
            <ul>
                <?php foreach($categories as $category): ?>
                    <li>
                        <a href="?category=<?php echo $category->id; ?>" 
                           class="<?php echo isset($_GET['category']) && $_GET['category'] == $category->id ? 'active' : ''; ?>">
                            <?php echo $category->name; ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <div class="filter-group">
            <h3>Giá</h3>
            <form action="" method="GET">
                <div class="price-inputs">
                    <input type="number" name="price_min" placeholder="Từ" 
                           value="<?php echo $_GET['price_min'] ?? ''; ?>">
                    <span>-</span>
                    <input type="number" name="price_max" placeholder="Đến" 
                           value="<?php echo $_GET['price_max'] ?? ''; ?>">
                </div>
                <button type="submit">Lọc</button>
            </form>
        </div>
    </div>

    <div class="product-grid">
        <?php if(count($products) > 0): ?>
            <?php foreach($products as $product): ?>
                <div class="product-card">
                    <div class="product-image">
                        <img src="<?php echo $product->image; ?>" alt="<?php echo $product->name; ?>">
                        <?php if($product->discount > 0): ?>
                            <span class="discount-badge">-<?php echo $product->discount; ?>%</span>
                        <?php endif; ?>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">
                            <a href="/product/<?php echo $product->id; ?>"><?php echo $product->name; ?></a>
                        </h3>
                        <div class="product-price">
                            <?php if($product->discount_price): ?>
                                <span class="original-price"><?php echo number_format($product->price); ?>đ</span>
                                <span class="final-price"><?php echo number_format($product->discount_price); ?>đ</span>
                            <?php else: ?>
                                <span class="final-price"><?php echo number_format($product->price); ?>đ</span>
                            <?php endif; ?>
                        </div>
                        <div class="product-rating">
                            <?php for($i = 1; $i <= 5; $i++): ?>
                                <span class="star <?php echo $i <= $product->rating ? 'filled' : ''; ?>">★</span>
                            <?php endfor; ?>
                            <span class="rating-count">(<?php echo $product->review_count; ?>)</span>
                        </div>
                    </div>
                    <button class="add-to-cart" data-product-id="<?php echo $product->id; ?>">
                        Thêm vào giỏ
                    </button>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="no-products">
                <p>Không tìm thấy sản phẩm nào</p>
            </div>
        <?php endif; ?>
    </div>

    <?php if($totalPages > 1): ?>
        <div class="pagination">
            <?php for($i = 1; $i <= $totalPages; $i++): ?>
                <a href="?page=<?php echo $i; ?>" 
                   class="<?php echo ($currentPage == $i) ? 'active' : ''; ?>">
                    <?php echo $i; ?>
                </a>
            <?php endfor; ?>
        </div>
    <?php endif; ?>
</div>