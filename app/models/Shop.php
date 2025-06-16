<?php

class Shop {
    private $shopId;
    private $name;
    private $description;

    public function __construct($shopId, $name, $description) {
        $this->shopId = $shopId;
        $this->name = $name;
        $this->description = $description;
    }

    public function getShopId() {
        return $this->shopId;
    }

    public function getName() {
        return $this->name;
    }

    public function getDescription() {
        return $this->description;
    }

    public function setName($name) {
        $this->name = $name;
    }

    public function setDescription($description) {
        $this->description = $description;
    }

    public function getShopDetails() {
        return [
            'shopId' => $this->shopId,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}