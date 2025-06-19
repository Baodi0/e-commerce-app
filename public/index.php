<?php
$request = $_SERVER['REQUEST_URI'];
$basePath = '/e-commerce-app/public';

$path = parse_url($request, PHP_URL_PATH);
$path = str_replace($basePath, '', $path);


switch ($path) {
    case '/':
        require __DIR__ . '/../app/home.php';
        break;
    case '/product-detail':
        include __DIR__.'/../app/products/product-detail.php';
        break;
    case '/order-list':
        include __DIR__.'/../app/orders/order-list.php';
        break;
    case '/tracking':
        include __DIR__.'/../app/orders/tracking.php';
        break;
    case '/review':
        include __DIR__.'/../app/reviews/review.php';
        break;
    default:
        require __DIR__ . '/../app/404.php';
        break;
}
