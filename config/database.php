<?php

// MongoDB configuration
$mongoClient = new MongoDB\Client("mongodb://localhost:27017");
$mongoDB = $mongoClient->selectDatabase('shopvv');

// Redis configuration
$redis = new Redis();
$redis->connect('localhost', 6379);

// Database connection settings
return [
    'mongodb' => [
        'host' => 'localhost',
        'port' => 27017,
        'database' => 'shopvv'
    ],
    
    'redis' => [
        'host' => 'localhost', 
        'port' => 6379,
        'password' => null
    ]
];