<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Initialize session
session_start();

// Basic routing
$request = $_GET['page'] ?? 'home';


switch ($request) {
    case 'home':
        require __DIR__ . '/../app/home.php';
        break;
    default:
        require __DIR__ . '/../app/404.php';
        break;
}
