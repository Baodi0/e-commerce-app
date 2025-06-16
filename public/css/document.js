document.addEventListener('DOMContentLoaded', function() {
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToCart(productId);
        });
    });

    async function addToCart(productId) {
        try {
            const response = await fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });

            const data = await response.json();
            if(data.success) {
                // Update cart count
                document.querySelector('.cart-count').textContent = data.cartCount;
                alert('Sản phẩm đã được thêm vào giỏ hàng');
            }
        } catch(error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    }
});