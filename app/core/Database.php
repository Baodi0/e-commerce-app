<?php
class Database {
    private static $instance = null;
    private $connection;
    private $database;

    private function __construct() {
        try {
            $this->connection = new MongoDB\Client("mongodb://localhost:27017");
            $this->database = $this->connection->shopee_db;
        } catch (Exception $e) {
            die('Database connection failed: ' . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function collection($name) {
        return $this->database->$name;
    }

    public function query($collection, $filter = [], $options = []) {
        return $this->database->$collection->find($filter, $options)->toArray();
    }

    public function queryOne($collection, $filter = []) {
        return $this->database->$collection->findOne($filter);
    }

    public function insert($collection, $document) {
        return $this->database->$collection->insertOne($document);
    }

    public function update($collection, $filter, $update) {
        return $this->database->$collection->updateOne($filter, ['$set' => $update]);
    }

    public function delete($collection, $filter) {
        return $this->database->$collection->deleteOne($filter);
    }
}