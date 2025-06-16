<?php

class CartController {
    private $cartModel;
    private $productModel;
    private $redisClient;

    public function __construct($cartModel, $productModel, $redisClient) {
        $this->cartModel = $cartModel;
        $this->productModel = $productModel;
        $this->redisClient = $redisClient;
    }

    public function viewCart($userId) {
        $cart = $this->getCart($userId);
        $summary = $this->getCartSummary($userId);
        
        View::render('cart/index', [
            'title' => 'Giỏ hàng',
            'cart' => $cart,
            'summary' => $summary
        ]);
    }

    public function addItem($userId, $productId, $quantity) {
        try {
            $product = $this->productModel->findById($productId);
            if (!$product) {
                throw new NotFoundException("Product not found");
            }

            if ($product['ton_kho'] < $quantity) {
                throw new ValidationException("Not enough stock");
            }

            $cartItem = $this->cartModel->addProduct($userId, $productId, $quantity, $product['gia']);
            $this->updateCartCache($userId);
            
            View::renderJson([
                'success' => true,
                'cart' => $this->getCartSummary($userId)
            ]);
        } catch (Exception $e) {
            View::renderJson([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function removeItem($userId, $productId) {
        $result = $this->cartModel->removeProduct($userId, $productId);
        $this->updateCartCache($userId);
        return $result;
    }

    public function updateQuantity($userId, $productId, $quantity) {
        try {
            if ($quantity < 1) {
                throw new ValidationException("Quantity must be at least 1");
            }
            
            $product = $this->productModel->findById($productId);
            if ($product['ton_kho'] < $quantity) {
                throw new ValidationException("Not enough stock available");
            }
            
            $result = $this->cartModel->updateQuantity($userId, $productId, $quantity);
            $this->updateCartCache($userId);
            
            View::renderJson([
                'success' => true,
                'cart' => $this->getCartSummary($userId)
            ]);
        } catch (Exception $e) {
            View::renderJson([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    private function getCart($userId) {
        $cacheKey = "user:$userId:cart";
        
        if ($cachedCart = $this->redisClient->get($cacheKey)) {
            return json_decode($cachedCart, true);
        }

        $cart = $this->cartModel->getByUserId($userId);
        $this->redisClient->setex($cacheKey, 3600, json_encode($cart));
        
        return $cart;
    }

    private function getCartSummary($userId) {
        $cart = $this->getCart($userId);
        
        return [
            'items' => $cart['san_pham'],
            'total_items' => count($cart['san_pham']),
            'subtotal' => $cart['tong_tien'],
            'shipping' => $this->calculateShipping($cart),
            'total' => $cart['tong_tien'] + $this->calculateShipping($cart)
        ];
    }

    private function updateCartCache($userId) {
        $cacheKey = "user:$userId:cart";
        $cart = $this->cartModel->getByUserId($userId);
        $this->redisClient->setex($cacheKey, 3600, json_encode($cart));
    }
}