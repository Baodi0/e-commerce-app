<?php

class ShopController {
    private $shopModel;
    private $productModel;
    private $redisClient;

    public function __construct($shopModel, $productModel, $redisClient) {
        $this->shopModel = $shopModel;
        $this->productModel = $productModel;
        $this->redisClient = $redisClient;
    }
    
    public function viewShopDetails($shopId) {
        $cacheKey = "shop:$shopId";
        
        // Check cache
        if ($cachedShop = $this->redisClient->get($cacheKey)) {
            return json_decode($cachedShop, true);
        }

        $shop = $this->shopModel->findById($shopId);
        if (!$shop) {
            throw new NotFoundException("Shop not found");
        }

        // Cache shop details
        $this->redisClient->setex($cacheKey, 3600, json_encode($shop));
        
        return $shop;
    }

    public function listProductsByShop($shopId, $page = 1, $limit = 20) {
        $products = $this->productModel->findByShopId($shopId, [
            'page' => $page,
            'limit' => $limit,
            'sort' => 'created_at'
        ]);
        
        return [
            'products' => $products,
            'page' => $page,
            'limit' => $limit,
            'total' => $this->productModel->countByShopId($shopId)
        ];
    }

    public function getShopAnalytics($shopId) {
        return [
            'total_products' => $this->productModel->countByShopId($shopId),
            'total_orders' => $this->shopModel->getOrderCount($shopId),
            'rating' => $this->shopModel->getAverageRating($shopId),
            'revenue' => $this->shopModel->calculateRevenue($shopId)
        ];
    }

    public function updateShopProfile($shopId, $data) {
        // Validate input
        $this->validateShopData($data);
        
        // Update shop
        $result = $this->shopModel->update($shopId, $data);
        
        // Clear cache
        $this->redisClient->del("shop:$shopId");
        
        return $result;
    }

    private function validateShopData($data) {
        $required = ['name', 'description', 'address', 'phone'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new ValidationException("$field is required");
            }
        }
    }
}