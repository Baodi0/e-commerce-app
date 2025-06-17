const mockProduct = {
    "_id": "sp_1022",
    "tenSanPham": "Áo sơ mi nam cao cấp",
    "moTa": "Thoáng mát, phù hợp công sở",
    "gia": 350000,
    "soLuong": 250,
    "hinhAnh": [
        "sp1022_1.jpg",
        "sp1022_2.jpg"
    ],
    "danhMuc": "Thời trang",
    "shopID": "shop_129",
    "diemDanhGia": 4.7,
    "thuocTinh": {
        "mauSac": [
            "trắng",
            "xanh nhạt"
        ],
        "kichCo": [
            "M",
            "L",
            "XL"
        ]
    }
};

async function loadProductDetail() {
    try {
        const res = await fetch(`http://localhost:8080/products/${productId}`);
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        const product = await res.json();
        renderProductDetail(product);
    } catch (err) {
        console.warn('Sử dụng dữ liệu mẫu:', err);
        renderProductDetail(mockProduct);
    }
}

function renderProductDetail(product) {
    document.getElementById('productName').textContent = product.tenSanPham;
    document.getElementById('productPrice').innerHTML = `${formatPrice(product.gia)}`;
    document.getElementById('productRating').textContent = `⭐ ${product.diemDanhGia}`;
    document.getElementById('productDescription').textContent = product.moTa;
    document.getElementById('productCategory').textContent = product.danhMuc;
    document.getElementById('productStock').textContent = product.soLuong;
    
    // Render multiple product images
    const imagesHTML = product.hinhAnh.map(img => 
        `<img src="/public/images/${img}" alt="${product.tenSanPham}" width="250">`
    ).join('');
    document.getElementById('productImage').innerHTML = imagesHTML;
    
    // Render color options
    const colorOptionsHTML = product.thuocTinh.mauSac.map(color =>
        `<button class="color-option" data-color="${color}">${color}</button>`
    ).join('');
    document.getElementById('colorOptions').innerHTML = colorOptionsHTML;
    
    // Render size options
    const sizeOptionsHTML = product.thuocTinh.kichCo.map(size =>
        `<button class="size-option" data-size="${size}">${size}</button>`
    ).join('');
    document.getElementById('sizeOptions').innerHTML = sizeOptionsHTML;
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

loadProductDetail();