<?php

class UserController {
    private $userModel;
    private $mailer;
    
    public function __construct($userModel, $mailer) {
        $this->userModel = $userModel;
        $this->mailer = $mailer;
    }

    public function register($data) {
        try {
            // Validate input
            $this->validateRegistrationData($data);
            
            if ($this->userModel->findByEmail($data['email'])) {
                throw new ValidationException("Email already registered");
            }

            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
            $userId = $this->userModel->create($data);
            $this->mailer->sendWelcomeEmail($data['email']);

            View::render('auth/register-success', [
                'title' => 'Đăng ký thành công'
            ]);
        } catch (Exception $e) {
            View::render('auth/register', [
                'title' => 'Đăng ký',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function showLoginForm() {
        View::render('auth/login', [
            'title' => 'Đăng nhập'
        ]);
    }

    public function login($email, $password) {
        try {
            $user = $this->userModel->findByEmail($email);
            
            if (!$user || !password_verify($password, $user['password'])) {
                throw new AuthenticationException("Invalid credentials");
            }

            $_SESSION['user_id'] = $user['_id'];
            $_SESSION['token'] = $this->generateSessionToken();

            View::redirect('/profile');
        } catch (Exception $e) {
            View::render('auth/login', [
                'title' => 'Đăng nhập',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function profile() {
        if (!isset($_SESSION['user_id'])) {
            View::redirect('/login');
            return;
        }

        $user = $this->userModel->findById($_SESSION['user_id']);
        View::render('user/profile', [
            'title' => 'Trang cá nhân',
            'user' => $user
        ]);
    }

    public function updateProfile($userId, $data) {
        try {
            $result = $this->userModel->update($userId, $data);
            View::renderJson([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);
        } catch (Exception $e) {
            View::renderJson([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function recoverPassword($email) {
        // Logic for password recovery
    }

    private function validateRegistrationData($data) {
        $required = ['email', 'password', 'name', 'phone'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new ValidationException("$field is required");
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException("Invalid email format");
        }

        if (strlen($data['password']) < 8) {
            throw new ValidationException("Password must be at least 8 characters");
        }
    }

    private function generateSessionToken() {
        return bin2hex(random_bytes(32));
    }
}