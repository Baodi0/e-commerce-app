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

function renderOrders(orders) {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = '';
    orders.forEach(order => {
      const tr = document.createElement('tr');
      let  detail = `<a href="/e-commerce-app/public/tracking" class="order-btn">Xem</a>`;
      let review = '';
      if (order.status === 'Đã giao') {
        review = `<a href="/e-commerce-app/public/review" class="order-btn">Đánh giá</a>`;
      }
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>${order.status}</td>
        <td>${formatCurrency(order.total)}</td>
        <td>${detail}</td>
        <td>${review}</td>
      `;
      tbody.appendChild(tr);
    });
}

async function loadOrders() {
    try {
        const response = await axios.get('/api/orders');
        renderOrders(response.data);
    } catch (error) {
        console.log('Error loading orders, using sample data:', error);
        renderOrders(sampleOrders);
    }
}

loadOrders();
