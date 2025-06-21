async function submitReview(e) {
  e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;
  const userId = 'user_001'; 

  if (!rating || !comment) {
    showNotification('Vui lòng nhập đầy đủ số sao và bình luận.', 'error');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8083/api/danhgia', {
      "userId": userId,
      "sanphamId": productId,
      "diem": rating,
      "binhLuan": comment
});

    showNotification('Cảm ơn bạn đã đánh giá sản phẩm!', 'success');
    location.href = "/e-commerce-app/public/order-list";
  } catch (error) {
    console.error('Error submitting review:', error);
    showNotification('Gửi đánh giá thất bại. Vui lòng thử lại.', 'error');
  }
}

async function productDetial(productId){
    const product = await loadDetail(productId);
    console.log(product);
    const formattedPrice = formatPrice(product.gia);
    const stars = '★'.repeat(Math.floor(product.diemDanhGia)) + '☆'.repeat(5 - Math.floor(product.diemDanhGia));
    
    return `
      <div class="product-card">
        <div class="product-image">
            Hình ảnh sản phẩm
        </div>
        <div class="product-info">
            <div class="product-name">${product.tenSanPham}</div>
            <div class="product-price">
                <span class="current-price">${formattedPrice}</span>
            </div>
            <div class="product-rating">
                <span class="stars">${stars}</span>
                <span class="rating-text">${product.diemDanhGia} (${product.soLuong} đã bán)</span>
            </div>
        </div>
      </div>
    `;
}

async function loadDetail(productId) {
    try {
        const response = await axios.get(`http://localhost:8081/api/sanpham/${productId}`);
        const product = response.data;
        return product;
    } catch (err) {
        console.warn('Sử dụng dữ liệu mẫu:', err);
        const response = await axios.get(`http://localhost:8081/api/sanpham/sp_1021`);
        const product = response.data;
        return product;
    }
}

async function loadProduct(productId) {
    const container = document.getElementById('product-detail'); 
    const html = await productDetial(productId); 
    container.innerHTML = html; 
    container.style.display = 'block';
}


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    loadProduct(productId);
    if (!productId){
        console.error('Không tìm thấy productId trên URL');
    }
});