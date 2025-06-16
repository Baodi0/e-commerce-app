<?php
namespace App\Models;

class Review {
    private $mongoDB;
    private $collection;

    public function __construct() {
        $this->mongoDB = (new \MongoDB\Client("mongodb://localhost:27017"))->selectDatabase('shopvv');
        $this->collection = $this->mongoDB->reviews;
    }

    public function create($userId, $productId, $rating, $comment) {
        $reviewData = [
            'user_id' => new \MongoDB\BSON\ObjectId($userId),
            'product_id' => new \MongoDB\BSON\ObjectId($productId),
            'rating' => (int) $rating,
            'comment' => $comment,
            'created_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $result = $this->collection->insertOne($reviewData);
        $this->updateProductRating($productId);
        return $result;
    }

    public function getProductReviews($productId) {
        return $this->collection->find(
            ['product_id' => new \MongoDB\BSON\ObjectId($productId)],
            ['sort' => ['created_at' => -1]]
        )->toArray();
    }

    public function getUserReviews($userId) {
        return $this->collection->find(
            ['user_id' => new \MongoDB\BSON\ObjectId($userId)],
            ['sort' => ['created_at' => -1]]
        )->toArray();
    }

    private function updateProductRating($productId) {
        $pipeline = [
            ['$match' => ['product_id' => new \MongoDB\BSON\ObjectId($productId)]],
            ['$group' => [
                '_id' => '$product_id',
                'avgRating' => ['$avg' => '$rating'],
                'totalReviews' => ['$sum' => 1]
            ]]
        ];
        
        $result = $this->collection->aggregate($pipeline)->toArray();
        
        if (!empty($result)) {
            $products = $this->mongoDB->products;
            $products->updateOne(
                ['_id' => new \MongoDB\BSON\ObjectId($productId)],
                ['$set' => [
                    'rating' => $result[0]['avgRating'],
                    'review_count' => $result[0]['totalReviews']
                ]]
            );
        }
    }

    public function delete($reviewId) {
        $review = $this->collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($reviewId)]);
        if ($review) {
            $result = $this->collection->deleteOne(['_id' => new \MongoDB\BSON\ObjectId($reviewId)]);
            $this->updateProductRating($review['product_id']);
            return $result;
        }
        return false;
    }
}