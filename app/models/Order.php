<?php
namespace App\Models;

class Order {
    private $mongoDB;
    private $collection;

    public function __construct() {
        $this->mongoDB = (new \MongoDB\Client("mongodb://localhost:27017"))->selectDatabase('shopvv');
        $this->collection = $this->mongoDB->orders;
    }

    public function create($userId, $items, $shippingAddress, $paymentMethod) {
        $orderData = [
            'user_id' => new \MongoDB\BSON\ObjectId($userId),
            'items' => $items,
            'shipping_address' => $shippingAddress,
            'payment_method' => $paymentMethod,
            'status' => 'pending',
            'total_amount' => $this->calculateTotal($items),
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        return $this->collection->insertOne($orderData);
    }

    public function getUserOrders($userId) {
        return $this->collection->find(
            ['user_id' => new \MongoDB\BSON\ObjectId($userId)],
            ['sort' => ['created_at' => -1]]
        )->toArray();
    }

    public function updateStatus($orderId, $status) {
        return $this->collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($orderId)],
            [
                '$set' => [
                    'status' => $status,
                    'updated_at' => new \MongoDB\BSON\UTCDateTime()
                ]
            ]
        );
    }

    public function getOrderById($orderId) {
        return $this->collection->findOne(['_id' => new \MongoDB\BSON\ObjectId($orderId)]);
    }

    private function calculateTotal($items) {
        return array_reduce($items, function($total, $item) {
            return $total + ($item['price'] * $item['quantity']);
        }, 0);
    }
}