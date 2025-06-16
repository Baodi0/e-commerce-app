<?php

class ReviewController {
    private $reviewModel;
    private $productModel;
    private $userModel;
    private $redisClient;

    public function __construct($reviewModel, $productModel, $userModel, $redisClient) {
        $this->reviewModel = $reviewModel;
        $this->productModel = $productModel;
        $this->userModel = $userModel;
        $this->redisClient = $redisClient;
    }

    public function submitReview($productId, $userId, $rating, $comment, $images = []) {
        // Validate review
        $this->validateReview($rating, $comment);
        
        // Check if user purchased product
        if (!$this->userModel->hasPurchased($userId, $productId)) {
            throw new ValidationException("Can only review purchased products");
        }

        // Create review
        $reviewId = $this->reviewModel->create([
            'product_id' => $productId,
            'user_id' => $userId,
            'rating' => $rating,
            'comment' => $comment,
            'images' => $this->uploadImages($images),
            'created_at' => new DateTime()
        ]);

        // Update product rating
        $this->updateProductRating($productId);
        
        return $reviewId;
    }

    public function getProductReviews($productId, $page = 1, $limit = 10) {
        return $this->reviewModel->findByProductId($productId, [
            'page' => $page,
            'limit' => $limit,
            'sort' => '-created_at'
        ]);
    }

    public function likeReview($reviewId, $userId) {
        // Check if already liked
        if ($this->reviewModel->hasLiked($reviewId, $userId)) {
            throw new ValidationException("Already liked this review");
        }

        return $this->reviewModel->addLike($reviewId, $userId);
    }

    public function dislikeReview($reviewId, $userId) {
        // Check if already disliked
        if ($this->reviewModel->hasDisliked($reviewId, $userId)) {
            throw new ValidationException("Already disliked this review");
        }

        return $this->reviewModel->addDislike($reviewId, $userId);
    }

    public function reportReview($reviewId, $userId, $reason) {
        // Validate reason
        if (empty($reason)) {
            throw new ValidationException("Report reason is required");
        }

        return $this->reviewModel->addReport([
            'review_id' => $reviewId,
            'user_id' => $userId,
            'reason' => $reason,
            'status' => 'pending',
            'created_at' => new DateTime()
        ]);
    }

    public function canReview($userId, $productId) {
        // Check if user has purchased and received the product
        $order = $this->orderModel->findCompletedOrderWithProduct($userId, $productId);
        if (!$order) {
            return false;
        }
        
        // Check if user has already reviewed
        $existingReview = $this->reviewModel->findByUserAndProduct($userId, $productId);
        return !$existingReview;
    }

    private function validateReview($rating, $comment) {
        if ($rating < 1 || $rating > 5) {
            throw new ValidationException("Rating must be between 1 and 5");
        }

        if (empty($comment)) {
            throw new ValidationException("Review comment is required");
        }
    }

    private function uploadImages($images) {
        // Image upload logic here
        return []; // Return array of uploaded image URLs
    }

    private function updateProductRating($productId) {
        $avgRating = $this->reviewModel->calculateAverageRating($productId);
        $this->productModel->updateRating($productId, $avgRating);
        
        // Clear product cache
        $this->redisClient->del("product:$productId");
    }
}