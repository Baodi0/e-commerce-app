<?php
namespace App\Models;

class Cart {
    private $redis;

    public function __construct() {
        $this->redis = new \Redis();
        $this->redis->connect('localhost', 6379);
    }

    public function addItem($userId, $product, $quantity = 1) {
        $cartKey = "cart:{$userId}";
        $productId = (string)$product['_id'];
        
        $cartItem = [
            'id' => $productId,
            'name' => $product['name'],
            'price' => $product['price'],
            'quantity' => $quantity
        ];
        
        $this->redis->hSet($cartKey, $productId, json_encode($cartItem));
        return $this->getItems($userId);
    }

    public function removeItem($userId, $productId) {
        $cartKey = "cart:{$userId}";
        $this->redis->hDel($cartKey, $productId);
        return $this->getItems($userId);
    }

    public function updateQuantity($userId, $productId, $quantity) {
        $cartKey = "cart:{$userId}";
        $item = json_decode($this->redis->hGet($cartKey, $productId), true);
        
        if ($item) {
            if ($quantity <= 0) {
                return $this->removeItem($userId, $productId);
            }
            $item['quantity'] = $quantity;
            $this->redis->hSet($cartKey, $productId, json_encode($item));
        }
        
        return $this->getItems($userId);
    }

    public function getItems($userId) {
        $cartKey = "cart:{$userId}";
        $items = $this->redis->hGetAll($cartKey);
        return array_map(function($item) {
            return json_decode($item, true);
        }, $items);
    }

    public function getTotalItems($userId) {
        $items = $this->getItems($userId);
        return array_reduce($items, function($total, $item) {
            return $total + $item['quantity'];
        }, 0);
    }

    public function clear($userId) {
        $cartKey = "cart:{$userId}";
        $this->redis->del($cartKey);
    }
}

