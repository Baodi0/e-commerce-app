<?php
namespace App\Models;

class User {
    private $mongoDB;
    private $collection;

    public function __construct() {
        $this->mongoDB = (new \MongoDB\Client("mongodb://localhost:27017"))->selectDatabase('shopvv');
        $this->collection = $this->mongoDB->users;
    }

    public function create($userData) {
        $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        $userData['created_at'] = new \MongoDB\BSON\UTCDateTime();
        return $this->collection->insertOne($userData);
    }

    public function findByEmail($email) {
        return $this->collection->findOne(['email' => $email]);
    }

    public function updateProfile($userId, $data) {
        $updateData = ['$set' => $data];
        return $this->collection->updateOne(
            ['_id' => new \MongoDB\BSON\ObjectId($userId)],
            $updateData
        );
    }

    public function authenticate($email, $password) {
        $user = $this->findByEmail($email);
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return $user;
        }
        return false;
    }
}