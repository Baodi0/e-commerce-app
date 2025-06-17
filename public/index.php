<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Initialize session
session_start();

// Basic routing
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
$request = '/' . trim(str_replace($scriptName, '', $requestUri), '/');

switch ($request) {
    case '/':
        require __DIR__ . '/../app/home.php';
        break;
    default:
        require __DIR__ . '/../app/404.php';
        break;
}
