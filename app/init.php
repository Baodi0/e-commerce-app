<?php
// Start session
session_start();

// Define constants
define('ROOT_PATH', dirname(__DIR__));
define('APP_PATH', ROOT_PATH . '/app');
define('PUBLIC_PATH', ROOT_PATH . '/public');

// Autoload classes
spl_autoload_register(function($className) {
    // Convert namespace separators to directory separators
    $className = str_replace('\\', DIRECTORY_SEPARATOR, $className);
    
    // Check different directories
    $directories = [
        APP_PATH . '/controllers/',
        APP_PATH . '/models/',
        APP_PATH . '/core/'
    ];
    
    foreach($directories as $directory) {
        $file = $directory . $className . '.php';
        if(file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// Database configuration
$config = [
    'host' => 'localhost',
    'dbname' => 'ecommerce',
    'user' => 'root',
    'pass' => ''
];

// Create core classes
require_once APP_PATH . '/core/Database.php';
require_once APP_PATH . '/core/Router.php';
require_once APP_PATH . '/core/View.php';

// Initialize database connection
Database::init($config);