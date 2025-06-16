<?php

class ProductController {
    private $productModel;
    private $redisClient;
    private $reviewModel;
    
    public function __construct($productModel, $redisClient, $reviewModel) {
        $this->productModel = $productModel;
        $this->redisClient = $redisClient;
        $this->reviewModel = $reviewModel;
    }

    public function index() {
        $products = $this->productModel->getAll();
        View::render('product/list', [
            'title' => 'Sản phẩm',
            'products' => $products
        ]);
    }

    public function detail($productId) {
        $product = $this->getProductDetail($productId);
        View::render('product/detail', [
            'title' => $product['ten'],
            'product' => $product
        ]);
    }

    public function search($query) {
        $results = $this->searchProducts($query);
        View::render('product/search', [
            'title' => 'Tìm kiếm',
            'products' => $results,
            'query' => $query
        ]);
    }

    private function searchProducts($query) {
        $cacheKey = "search:" . md5($query);
        if ($cachedResults = $this->redisClient->get($cacheKey)) {
            return json_decode($cachedResults, true);
        }

        $results = $this->productModel->search([
            'keywords' => $query['keywords'] ?? '',
            'category' => $query['category'] ?? '',
            'price_min' => $query['price_min'] ?? 0,
            'price_max' => $query['price_max'] ?? PHP_FLOAT_MAX,
            'sort' => $query['sort'] ?? 'popular',
            'page' => $query['page'] ?? 1,
            'limit' => $query['limit'] ?? 20
        ]);

        $this->redisClient->setex($cacheKey, 3600, json_encode($results));
        return $results;
    }

    private function getProductDetail($productId) {
        $cacheKey = "product:detail:{$productId}";
        
        if ($cachedProduct = $this->redisClient->get($cacheKey)) {
            return json_decode($cachedProduct, true);
        }
        
        $product = $this->productModel->findById($productId);
        if (!$product) {
            throw new NotFoundException("Product not found");
        }
        
        $product['reviews'] = $this->reviewModel->getTopReviews($productId, 5);
        $product['rating'] = $this->reviewModel->getAverageRating($productId);
        $product['related'] = $this->productModel->getRelatedProducts($productId, 4);
        
        $this->redisClient->setex($cacheKey, 3600, json_encode($product));
        
        return $product;
    }

    public function filter($criteria) {
        return $this->productModel->filter([
            'category' => $criteria['category'] ?? [],
            'price_range' => $criteria['price_range'] ?? [],
            'brands' => $criteria['brands'] ?? [],
            'ratings' => $criteria['ratings'] ?? [],
            'sort_by' => $criteria['sort_by'] ?? 'popular',
            'page' => $criteria['page'] ?? 1,
            'per_page' => $criteria['per_page'] ?? 20
        ]);
    }

    public function getRelatedProducts($productId, $limit = 5) {
        return $this->productModel->findRelated($productId, $limit);
    }

    public function searchSuggestions($keyword) {
        $cacheKey = "search:suggestions:{$keyword}";
        
        // Try cache first
        if ($suggestions = $this->redisClient->get($cacheKey)) {
            return json_decode($suggestions, true);
        }
        
        // Search in database
        $suggestions = $this->productModel->searchSuggestions($keyword, [
            'limit' => 10,
            'fields' => ['ten', 'danh_muc', 'thuong_hieu']
        ]);
        
        // Cache for 1 hour
        $this->redisClient->setex($cacheKey, 3600, json_encode($suggestions));
        
        return $suggestions;
    }

    public function advancedSearch($filters) {
        return $this->productModel->search([
            'keyword' => $filters['keyword'] ?? '',
            'category' => $filters['category'] ?? '',
            'price_range' => [
                'min' => $filters['price_min'] ?? 0,
                'max' => $filters['price_max'] ?? PHP_FLOAT_MAX
            ],
            'rating' => $filters['rating'] ?? 0,
            'brand' => $filters['brand'] ?? '',
            'in_stock' => $filters['in_stock'] ?? null,
            'sort_by' => $filters['sort_by'] ?? 'relevance',
            'page' => $filters['page'] ?? 1,
            'limit' => $filters['limit'] ?? 20
        ]);
    }
}