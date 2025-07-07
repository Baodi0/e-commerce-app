# Cài đặt XAMPP và pull code từ Git repository về thư mục `C:\xampp\htdocs\e-commerece-app` để chạy dự án trên XAMPP.

## Yêu Cầu

- **XAMPP**: Phải cài đặt XAMPP để chạy Apache và MySQL.
- **Git**: Đã cài đặt trên máy tính.
- Quyền truy cập vào repository Git của dự án `e-commerece-app`.

## Các Bước Thực Hiện

1. **Cài đặt XAMPP**:

   - Tải XAMPP từ trang chính thức: https://www.apachefriends.org/index.html.
   - Cài đặt XAMPP vào thư mục mặc định (`C:\xampp` trên Windows).
   - Sau khi cài đặt, mở XAMPP Control Panel và khởi động các module **Apache** và **MySQL**.

2. **Mở Command Prompt hoặc Terminal**:

   - Nhấn `Win + R`, gõ `cmd` và nhấn Enter (Windows).
   - Hoặc sử dụng PowerShell, Git Bash, hoặc bất kỳ terminal nào hỗ trợ Git.

3. **Di chuyển đến thư mục đích**:

   - Gõ lệnh sau để chuyển đến thư mục `C:\xampp\htdocs`:

     ```bash
     cd C:\xampp\htdocs
     ```

4. **Clone repository**:

   - Nếu thư mục `e-commerece-app` chưa tồn tại, chạy lệnh sau để clone repository:

     ```bash
     git clone https://github.com/Baodi0/e-commerce-app.git
     ```


   - Nếu thư mục `e-commerece-app` đã tồn tại và đã có repository, di chuyển vào thư mục:

     ```bash
     cd udpt_php
     ```

     Sau đó, pull code mới nhất:

     ```bash
     git pull origin hp
     ```


5. **Kiểm tra cấu hình XAMPP**:

   - Đảm bảo Apache và MySQL đang chạy trong XAMPP Control Panel.
   - Import file SQL vào phpMyAdmin.

6. **Chạy dự án**:

   - Mở trình duyệt và truy cập:

     ```
     http://localhost/e-commerce-app/public/
     ```

