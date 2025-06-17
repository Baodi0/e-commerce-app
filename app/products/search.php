<?php $title = 'Kết quả tìm kiếm'; ?>

<div class="container">
    <div class="search-filters">
        <form id="filter-form">
            <div class="filter-group">
                <h3>Giá</h3>
                <input type="number" name="price_min" placeholder="Từ">
                <input type="number" name="price_max" placeholder="Đến">
            </div>
            
            <div class="filter-group">
                <h3>Danh mục</h3>
                <?php foreach($categories as $category): ?>
                    <label>
                        <input type="checkbox" name="categories[]" value="<?php echo $category->id; ?>">
                        <?php echo $category->name; ?>
                    </label>
                <?php endforeach; ?>
            </div>

            <button type="submit">Lọc</button>
        </form>
    </div>

    <div class="product-grid">
        <?php if(count($products) > 0): ?>
            <?php foreach($products as $product): ?>
                <?php include 'products/partials/product-card.php'; ?>
            <?php endforeach; ?>
        <?php else: ?>
            <p>Không tìm thấy sản phẩm nào</p>
        <?php endif; ?>
    </div>

    <?php echo $pagination; // Assume you have a pagination function that returns HTML ?>
</div>