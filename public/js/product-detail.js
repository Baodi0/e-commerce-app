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

async function loadProductDetail(productId) {
    try {
        const response = await axios.get(`http://localhost:8081/api/sanpham/${productId}`);
        const product = response.data;
        console.log('Sản phẩm:', product);
        renderProductDetail(product);
    } catch (err) {
        console.warn('Sử dụng dữ liệu mẫu:', err);
    }
}



function formatPrice(vnd) {
    return vnd.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function renderProductDetail(data) {      
    document.getElementById('productTitle').textContent = data.tenSanPham;
    document.getElementById('productDesc').textContent = data.moTa;      
    document.getElementById('productPrice').textContent = formatPrice(data.gia);
    
    const rating = Math.floor(data.diemDanhGia);
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    document.getElementById('productRatingInt').textContent = `(${data.diemDanhGia})`;
    document.getElementById('productCategory').textContent = data.danhMuc;
    renderProductAttributes(data.thuocTinh);
    document.getElementById('productQty').textContent = data.soLuong;    document.getElementById('productRating').textContent = stars;
    document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.dataset.productId = data.id;
    });

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

function renderProductAttributes(attributes) {
    const attributeMap = {
        mauSac: 'Màu sắc',
        kichCo: 'Kích cỡ',
        ngonNgu: 'Ngôn ngữ',
        theLoai: 'Thể loại',
        boNho: 'Bộ nhớ',
        ketNoi: 'Kết nối',
        chatLieu: 'Chất liệu',
        kichThuoc: 'Kích thước',
        cauHinh: 'Cấu hình',
    };

    const container = document.getElementById('productAttributes');
    if (!container) return;
    
    container.innerHTML = ''; 

    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            const displayName = attributeMap[key] || key;
            const values = Array.isArray(attributes[key]) ? attributes[key].join(', ') : attributes[key];

            const attrDiv = document.createElement('div');
            attrDiv.innerHTML = `<strong>${displayName}:</strong> ${values}`;
            container.appendChild(attrDiv);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        loadProductDetail(productId);
    } else {
        console.error('Không tìm thấy productId trên URL');
    }
});


