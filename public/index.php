<?php
$request = $_SERVER['REQUEST_URI'];

$basePath = '/e-commerce-app/public';
$path = str_replace($basePath, '', $request);

switch ($path) {
    case '/':
        require __DIR__ . '/../app/home.php';
        break;
    case '/product-detail':
        include __DIR__.'/../app/products/product-detail.php';
        break;
    default:
        require __DIR__ . '/../app/404.php';
        break;
}
