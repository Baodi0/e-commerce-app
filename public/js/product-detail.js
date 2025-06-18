const product = {
    tenSanPham: "Sách Lịch Sử Việt Nam",
    moTa: "Tài liệu chi tiết về lịch sử Việt Nam qua các thời kỳ",
    gia: 120000,
    soLuong: 300,
    hinhAnh: ["sp1021_1.jpg", "sp1021_2.jpg"],
    danhMuc: "Sách",
    diemDanhGia: 4.8,
    thuocTinh: {
    theLoai: ["Lịch sử"],
    ngonNgu: ["Tiếng Việt"]
    },
    danhGia: [
        { sao: 5, noiDung: "Rất hữu ích và dễ hiểu. Phù hợp cho học sinh và người yêu lịch sử." },
        { sao: 4, noiDung: "Sách trình bày đẹp, nội dung khá phong phú." },
        { sao: 3, noiDung: "Tạm ổn, mong lần sau in giấy dày hơn." }
    ]
};

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function loadProductDetail() {
    try {
        const productId = getProductIdFromUrl();
        if (!productId) throw new Error('Product ID not found in URL');

        const res = await axios.get(`http://localhost:8080/products/${productId}`);
        if (!res.data) throw new Error('Không tìm thấy sản phẩm');
        
        const product = res.data;
        renderProductDetail(product);
        
        // Update add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-product-id', productId);
            addToCartBtn.textContent = 'Thêm vào giỏ hàng';
        }
    } catch (err) {
        console.warn('Sử dụng dữ liệu mẫu:', err);
        renderProductDetail(product);
    }
}



function formatCurrency(vnd) {
    return vnd.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function loadProductDetail(data) {      
    document.getElementById('productTitle').textContent = data.tenSanPham;
    document.getElementById('productDesc').textContent = data.moTa;      
    document.getElementById('productPrice').textContent = formatCurrency(data.gia);
    
    const rating = Math.floor(data.diemDanhGia);
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    document.getElementById('productRating').textContent = stars;
    document.getElementById('productRatingInt').textContent = `(${data.diemDanhGia})`;
    document.getElementById('productCategory').textContent = data.danhMuc;
    document.getElementById('productGenre').textContent = data.thuocTinh.theLoai.join(', ');
    document.getElementById('productLang').textContent = data.thuocTinh.ngonNgu.join(', ');
    document.getElementById('productQty').textContent = data.soLuong;

    const thumbs = document.getElementById('thumbsContainer');
    thumbs.innerHTML = '';
    data.hinhAnh.forEach((img, index) => {
    const thumb = document.createElement('img');
    thumb.src = img;
    thumb.alt = `Ảnh ${index + 1}`;
    thumb.onclick = () => changeImage(img);
    thumbs.appendChild(thumb);
    });

    changeImage(data.hinhAnh[0]);
    
    const reviewList = document.getElementById('reviews');
    reviewList.innerHTML = '';
    data.danhGia.forEach(r => {
    const div = document.createElement('div');
    div.className = 'review';
    div.innerHTML = `<div class="stars">${'★'.repeat(r.sao)}${'☆'.repeat(5 - r.sao)}</div><div class="text">${r.noiDung}</div>`;
    reviewList.appendChild(div);
    });

    document.querySelector('.add-to-cart').setAttribute('data-product-id', data.id);

}

function changeImage(src) {
    document.getElementById('mainProductImage').src = src;
}

document.addEventListener('DOMContentLoaded', function () {
    loadProductDetail(product);
});

