<?php
namespace App\Models;

class Product {
    private $mongoDB;
    private $collection;

    public function __construct() {
        $config = require __DIR__ . '/../../config/database.php';
        $this->mongoDB = (new \MongoDB\Client("mongodb://localhost:27017"))->selectDatabase('shopee_db');
        $this->collection = $this->mongoDB->SanPham;
    }

    public function getAllProducts() {
        return $this->collection->find()->toArray();
    }

    public function getProductsByCategory($category) {
        return $this->collection->find(['category' => $category])->toArray();
    }

    public function searchProducts($query) {
        $filter = [
            '$or' => [
                ['name' => ['$regex' => $query, '$options' => 'i']],
                ['categoryName' => ['$regex' => $query, '$options' => 'i']],
                ['brand' => ['$regex' => $query, '$options' => 'i']]
            ]
        ];
        return $this->collection->find($filter)->toArray();
    }

    public function getProductById($id) {
        return $this->collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($id)]);
    }
}

