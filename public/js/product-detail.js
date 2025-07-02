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
    danhGia: {
        id: "dg_0009",
        userId: "user_009",
        sanphamId: null,
        diem: 5.0,
        binhLuan: "Sách rất hay, nội dung chi tiết và dễ hiểu.",
        hinhAnh: [
            "rv0009.jpg"
        ],
        video: [],
        thoiGian: "2025-04-09T11:40:00"
    }
};

async function loadProductDetail(productId) {
    try {
        const response = await axios.get(`http://localhost:8081/api/sanpham/${productId}`);
        const product = response.data;
        renderProductDetail(product);
    } catch (err) {
        console.warn('Sử dụng dữ liệu mẫu:', err);
    }
}



function formatPrice(vnd) {
    return vnd.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

async function renderProductDetail(data) {      
    document.getElementById('productTitle').textContent = data.tenSanPham;
    document.getElementById('productDesc').textContent = data.moTa;      
    document.getElementById('productPrice').textContent = formatPrice(data.gia);
    
    const rating = Math.floor(data.diemDanhGia);
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    document.getElementById('productRatingInt').textContent = `(${data.diemDanhGia})`;
    document.getElementById('productCategory').textContent = data.danhMuc;
    renderProductAttributes(data.thuocTinh);
    document.getElementById('productQty').textContent = data.soLuong;    
    document.getElementById('productRating').textContent = stars;
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

    await loadReview(data.id);

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
        soMon: 'Số món',
        loaiDa: 'Loại da',
        dungTich: 'Dung tích',
        dienTich: 'Diện tích',
        congSuat: 'Công suất',
        hamLuong: 'Hàm lượng',
        soVien: 'Số viên',
        apSuat: 'Áp suất',
        huongThom: 'Hương thơm',
        soLoi: 'Số lõi',
        DPI: 'DPI',
        SPF: 'SPF',
        loaiSwitch: 'Loại Switch',
        denLED: 'Đèn LED',
        loaiToc: 'Loại tóc',
        dungLuong: 'Dung lượng',
        loaiKinh: 'Loại kính',
        trongLuong: 'Trọng lượng',
        loaiGao: 'Loại gạo'
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

async function loadReview(productId) {
    try {
        const response = await axios.get(`http://localhost:8083/api/danhgia/${productId}`);

        const reviews = response.data || [];
        await renderReviews(reviews);

    } catch (error) {
        console.error('Error loading cart:', error);
        showNotification(error.message || 'Có lỗi xảy ra khi tải giỏ hàng', 'error');
    }
}

async function renderReviews(reviews) {
    const container = document.getElementById('review');
    
    try {
        if (!Array.isArray(reviews)) {
            throw new Error('Items must be an array');
        }

        if (reviews.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Không có đánh giá</p>';
            container.style.display = 'none';
            return;
        }

        const htmlList = await Promise.all(reviews.map(review => createReview(review)));
        container.innerHTML = htmlList.join('');
        container.style.display = 'block';
    } catch (error) {
        console.error('Error rendering cart:', error);
        showNotification('Có lỗi xảy ra khi hiển thị danh sách đánh giá', 'error');
    }
}

function formatDateTime(isoString) {
    const date = new Date(isoString);

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0'); 
    const yyyy = date.getFullYear();

    return `${hh}:${mm}:${ss} ${dd}-${MM}-${yyyy}`;
}

function createReview(review) {
    try {
        const stars = '★'.repeat(review.diem) + '☆'.repeat(5 - review.diem);
        const imageHtml = Array.isArray(review.hinhAnh) && review.hinhAnh.length > 0
            ? ` <div class="review-images">
                 ${review.hinhAnh.map(img => 
                   `<img src="${img}" alt="Ảnh đánh giá" width="150" style="margin-right:10px;" />`
                 ).join('')}
               </div>`
            : '';
        return `
        <div class= review-box>
          <p><strong>Người dùng:</strong> ${review.userId}</p>
          <div class="rating">
            <p ><strong>Điểm:</strong> </p>
            <div class="stars">${stars} </div>
          </div>
          <p><strong>Bình luận:</strong> ${review.binhLuan}</p>
          ${imageHtml}
          <p><small>Thời gian: ${formatDateTime(review.thoiGian)} </small></p>
        </div>`;
    } catch (error) {
        console.error('Error creating cart item:', error);
        return '';
    }
}

function getVietnamTimeISO() {
    const now = new Date();
    const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vietnamTime.toISOString();
}

async function buyNow(productId) {
    try {
        const userId = 'user_001'; 
        const product = await loadProductsById(productId);

        const donHangDTO = {
            userId: userId,
            shopId: product.shopId || 'shop_001', 
            date: getVietnamTimeISO(),
            totalPrice: product.gia,
            status: 'Chờ xác nhận',
            address: "780 Duong So 1, P1, Q1, TPHCM",
            payment: 'Thanh toán khi nhận hàng',
            productList: [
                {
                    productId: product.id,
                    quantity: 1,
                    price: product.gia
                }
            ]
        };

        console.log(getVietnamTimeISO());

        if (!donHangDTO.address || donHangDTO.address.trim() === '') {
            showNotification('Vui lòng nhập địa chỉ!', 'warning');
            return;
        }

        await axios.post('http://localhost:8084/api/donhang', donHangDTO);
        showNotification('Đặt hàng thành công! Bạn có thể theo dõi đơn hàng trong lịch sử.', 'success');
    } catch (error) {
        console.error("Lỗi mua ngay:", error);
        showNotification('Không thể đặt hàng. Vui lòng thử lại.', 'error');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    if (productId) {
        loadProductDetail(productId);
    } else {
        console.error('Không tìm thấy productId trên URL');
    }
});


