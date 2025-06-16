# e-commerce-app

## Overview
This is a complete e-commerce website project built using PHP 8+, following the MVC architecture. The application supports online shopping functionalities and integrates with MongoDB, Cassandra, and Redis for data management and caching.

## Features
- User registration and authentication
- Product search and filtering
- Shopping cart management
- Order creation and tracking
- Product reviews and ratings
- Shop management

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 8+
- **Database**:
  - MongoDB for product, cart, and user data
  - Cassandra for order management
  - Redis for caching

## Project Structure
```
e-commerce-app
├── app
│   ├── controllers
│   ├── models
│   └── views
├── config
├── public
├── tests
├── composer.json
└── README.md
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd e-commerce-app
   ```

2. Install dependencies using Composer:
   ```bash
   composer install
   ```

3. Configure the database settings in `config/database.php`.

4. Set up your web server (Apache/Nginx) to serve the `public` directory.

5. Access the application in your web browser at `http://localhost`.

## Usage
- Navigate to the homepage to browse products.
- Use the search bar to find specific items.
- Add products to your cart and proceed to checkout.
- Manage your orders and view order history in your user profile.

## Testing
Unit tests are provided for both models and controllers. To run the tests, use:
```bash
vendor/bin/phpunit
```

## License
This project is licensed under the MIT License.