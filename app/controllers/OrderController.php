<?php

class OrderController {
    private $orderModel;
    private $cartModel;
    private $productModel;

    public function __construct($orderModel, $cartModel, $productModel) {
        $this->orderModel = $orderModel;
        $this->cartModel = $cartModel;
        $this->productModel = $productModel;
    }

    public function list() {
        $userId = $_SESSION['user_id'];
        $orders = $this->getUserOrders($userId);
        
        View::render('order/list', [
            'title' => 'Đơn hàng của tôi',
            'orders' => $orders
        ]);
    }

    public function detail($orderId) {
        $order = $this->orderModel->findById($orderId);
        if (!$order) {
            throw new NotFoundException("Order not found");
        }

        View::render('order/detail', [
            'title' => 'Chi tiết đơn hàng #' . $orderId,
            'order' => $order
        ]);
    }

    public function checkout() {
        $userId = $_SESSION['user_id'];
        $cart = $this->cartModel->getByUserId($userId);

        View::render('order/checkout', [
            'title' => 'Thanh toán',
            'cart' => $cart
        ]);
    }

    public function createOrder($userId, $cartId, $shippingAddress, $paymentMethod) {
        try {
            $cart = $this->cartModel->getById($cartId);
            if (!$cart || empty($cart['san_pham'])) {
                throw new ValidationException("Cart is empty");
            }

            // Validate stock and calculate total
            $total = 0;
            foreach ($cart['san_pham'] as $item) {
                $product = $this->productModel->findById($item['product_id']);
                if ($product['ton_kho'] < $item['so_luong']) {
                    throw new ValidationException("Not enough stock for " . $product['ten']);
                }
                $total += $item['gia'] * $item['so_luong'];
            }

            // Create order
            $orderId = $this->orderModel->create([
                'user_id' => $userId,
                'items' => $cart['san_pham'],
                'total' => $total,
                'shipping_address' => $shippingAddress,
                'payment_method' => $paymentMethod,
                'status' => 'pending'
            ]);

            // Update stock
            foreach ($cart['san_pham'] as $item) {
                $this->productModel->decreaseStock($item['product_id'], $item['so_luong']);
            }

            // Clear cart
            $this->cartModel->clear($cartId);

            View::renderJson([
                'success' => true,
                'order_id' => $orderId
            ]);
        } catch (Exception $e) {
            View::renderJson([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    private function getUserOrders($userId, $page = 1, $limit = 10) {
        return $this->orderModel->findByUserId($userId, [
            'page' => $page,
            'limit' => $limit,
            'sort' => ['-ngay_dat'],
            'with' => ['items', 'shipping_info']
        ]);
    }
}