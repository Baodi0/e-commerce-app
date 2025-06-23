const sampleOrders = [
    {
        id: 'DH1001',
        date: '2025-06-15',
        status: 'Đang xử lý',
        total: 420000
    },
    {
        id: 'DH1002',
        date: '2025-06-12', 
        status: 'Đang giao',
        total: 315000
    },
    {
        id: 'DH0999',
        date: '2025-06-05',
        status: 'Đã giao', 
        total: 199000
    }
];

function formatCurrency(vnd) {
    return vnd.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function formatDateTime(isoString) {
    const date = new Date(isoString);

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    const dd = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0'); 
    const yyyy = date.getFullYear();

    return `${hh}:${mm}:${ss} <br> ${dd}-${MM}-${yyyy}`;
}


function renderOrders(orders) {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = '';
    
    const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(order => {
       loadOrderDetail(order.iddonhang);
    }
)};

function renderOrderDetail(order, orderDetailList,products) {
    const tbody = document.getElementById('orderTableBody');
    orderDetailList.forEach(detail => {
        const tr = document.createElement('tr');
        
        const product = products.find(p => p.id === detail.key.productId);

        let actionHTML = '';

        if (order.status === 'Đã giao') {
            actionHTML = `<a href="/e-commerce-app/public/review?productId=${detail.key.productId}" class="order-btn" style="white-space: nowrap;">Đánh Giá</a>`;
        } else if (order.status === 'Chờ xác nhận') {
            actionHTML = `<button onclick="removeOrder('${order.iddonhang}')" class="order-btn" style="background-color: #e53e3e;">Hủy</button>`;
        }
        tr.innerHTML = `
            <td>${detail.key.id}</td>
            <td>${product.tenSanPham}</td>
            <td style="white-space: nowrap;">${formatDateTime(order.date)}</td>
            <td>${order.address}</td>
            <td>${order.status}</td>
            <td style="white-space: nowrap;">${formatCurrency(product.gia)}</td>
            <td>${detail.quantity}</td>
            <td>${order.payment || '---'}</td>
            <td>${actionHTML}</td>
        `;

        tbody.appendChild(tr);
    });
}


async function loadOrderDetail(orderId) {
    try {
        const response = await axios.get(`http://localhost:8084/api/donhang/userId/user_001`);
        const orders = response.data.find(p => p.iddonhang === orderId);

        const order = await axios.get(`http://localhost:8084/api/donhang/chitietdonhang/${orderId}`);
        const products = await axios.get('http://localhost:8081/api/sanpham');

        renderOrderDetail(orders,order.data,products.data);
    } catch (error) {
        console.log('Error loading orders, using sample data:', error);
    }
}

async function loadOrders() {
    try {
        const response = await axios.get(`http://localhost:8084/api/donhang/userId/user_001`);
        renderOrders(response.data);
    } catch (error) {
        console.log('Error loading orders, using sample data:', error);
        renderOrders(sampleOrders);
    }
}

async function submitOrder(userId) {
    const cartItems = getCartItems(); 


    const donHangDTO = {
        userId: userId,
        shopId: 'shop_128',
        date: new Date().toISOString(),
        totalPrice: calculateTotalPrice(cartItems),
        status: 'Chờ xác nhận',
        address: '123 Đường ABC, Quận 1',
        payment: 'Thanh toán khi nhận hàng',
        productList: cartItems.map(item => ({
            productId: item.id,
            quantity: item.soLuong,
            price: item.giaLucThem
        }))
    };

    try {
        const response = await axios.post('http://localhost:8084/api/donhang', donHangDTO);
        showNotification('Đặt hàng thành công!', 'success');
        localStorage.removeItem('sanpham'); // Xóa giỏ hàng sau khi đặt hàng
        updateCartDisplay();
    } catch (error) {
        console.error('Lỗi khi đặt hàng:', error);
        showNotification('Lỗi khi đặt hàng. Vui lòng thử lại.', 'error');
    }
}

async function removeOrder(orderId) {''
    const confirmDelete = confirm('Bạn có chắc muốn hủy đơn hàng này?');
    if (!confirmDelete) return;

    try {
        await axios.delete(`http://localhost:8084/api/donhang/${orderId}`);
        showNotification('Đơn hàng đã được hủy thành công', 'success');
        loadOrders(); 
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        showNotification('Không thể hủy đơn hàng. Vui lòng thử lại.', 'error');
    }
}




document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    loadOrders();

});