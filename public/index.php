<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Initialize session
session_start();

// Basic routing
$request = $_SERVER['REQUEST_URI'];

switch ($request) {
    case '/': 
        require __DIR__ . '/../app/views/home.index.php';
        break;
    case '/profile':
        require __DIR__ . '/../app/controllers/UserController.php';
        $controller = new UserController();
        $controller->profile();
        break;
    case '/orders':
        require __DIR__ . '/../app/controllers/OrderController.php';
        $controller = new OrderController();
        $controller->list();
        break;
    default:
        require __DIR__ . '/../app/home.php';
        break;
}