
## Hệ thống xác thực với MFA (Multi-Factor Authentication)

### Tổng quan
Dự án là một hệ thống xác thực người dùng toàn diện, tích hợp xác thực hai yếu tố (MFA) sử dụng mã OTP. Hệ thống bao gồm:
- **Client**: Ứng dụng web React (TypeScript) với giao diện người dùng hiện đại
- **Server**: API RESTful xây dựng bằng Node.js/Express (TypeScript) kết nối MongoDB
- **Tính năng nổi bật**: Đăng ký, đăng nhập, quên mật khẩu, xác thực 2 lớp (MFA), quản lý phiên làm việc

### Tính năng chính
🔐 **Xác thực người dùng**
- Đăng ký/Đăng nhập với email và mật khẩu
- Quên mật khẩu và đặt lại mật khẩu qua email
- Quản lý phiên làm việc với JWT và refresh token
- Middleware xác thực tập trung

🔒 **Bảo mật nâng cao**
- Xác thực 2 yếu tố (MFA) sử dụng Google Authenticator/1Password
- QR Code và secret key để thiết lập MFA
- Thu hồi MFA khi cần thiết
- Hệ thống cookie an toàn với SameSite và HttpOnly

### Công nghệ sử dụng
| Client-side                     | Server-side                     |
|---------------------------------|---------------------------------|
| React + TypeScript              | Node.js + Express + TypeScript  |
| React Query + React Hook Form   | MongoDB + Mongoose              |
| Zod (Validation)                | JWT (JSON Web Tokens)           |
| Radix UI + Tailwind CSS         | Speakeasy (MFA) + QRCode        |
| React Router v6                 | Resend (Email API)              |
| Axios (HTTP Client)             | Helmet + CORS (Bảo mật)         |

### Cấu trúc thư mục
```
📁 client
├── components    # UI components tái sử dụng
├── context       # Auth/Theme providers
├── hooks         # Custom hooks
├── layouts       # App layouts
├── pages         # Route components
└── validations   # Zod schemas

📁 server
├── controllers   # Xử lý logic API
├── middlewares   # Auth/Error handlers
├── models        # MongoDB schemas
├── services      # Business logic
├── mailers       # Email templates
└── utils         # Helper functions
```

### Cài đặt và chạy
1. **Chuẩn bị môi trường**
```bash
# Client
cd client && npm install

# Server
cd server && npm install
```

2. **Biến môi trường (`.env`)**
```env
# Client
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Server
PORT=8000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/mern_db-practice
RESEND_API_KEY=your_resend_key

ACCESS_TOKEN_SECRET=""
REFRESH_TOKEN_SECRET=""

ACCESS_TOKEN_EXPIRY=""
REFRESH_TOKEN_EXPIRY=""

RESEND_API_KEY=""
MAILER_SENDER=""
```

3. **Khởi động**
```bash
# Client
npm run dev

# Server
npm start
```

### Đặc điểm kỹ thuật
- **Validation**: Zod cho cả client và server
- **Error Handling**: Hệ thống xử lý lỗi tập trung với HTTP status codes
- **Security**: 
  - Refresh token rotation
  - Rate limiting cho API quên mật khẩu
  - Hash mật khẩu với bcryptjs
- **UI/UX**: 
  - Loading states và skeleton UI
  - Toast notifications
  - Responsive sidebar với keyboard shortcut

### Hướng phát triển
- [ ] Thêm xác thực bằng SMS
- [ ] Nhật ký hoạt động người dùng (Audit Log)
- [ ] Dashboard quản trị
- [ ] Tích hợp OAuth2 (Google/Github)

📌 **Lưu ý triển khai**
- Sử dụng HTTPS trong production
- Cấu hình CORS chặt chẽ
- Triển khai Redis cho refresh tokens
- Giới hạn số lần thử MFA

Dự án phù hợp để học tập về hệ thống xác thực hiện đại, tích hợp MFA và quản lý phiên làm việc an toàn.

**AUTH PAGE:**
![Screenshot 2025-02-08 222639](https://github.com/user-attachments/assets/cb40dd63-90d8-4a77-8f3c-937e734cfaf2)
![Screenshot 2025-02-08 223132](https://github.com/user-attachments/assets/c545559f-9056-4bce-ad18-0c4c08bb9074)

**HOME PAGE:**
![Screenshot 2025-02-08 222934](https://github.com/user-attachments/assets/b5a1405c-ef8c-462a-838d-c02237395c70)
![Screenshot 2025-02-08 222853](https://github.com/user-attachments/assets/5d1c2733-2ea7-4f14-ae39-799600a62f77)

**2FA:**
![Screenshot 2025-02-05 144033](https://github.com/user-attachments/assets/7bbe40de-9727-42ff-aa80-6a1d64b811b9)
![Screenshot 2025-02-08 223722](https://github.com/user-attachments/assets/3be595d5-3e79-4a45-b4d1-943cf1504770)
![Screenshot 2025-02-08 222821](https://github.com/user-attachments/assets/bcbc3f52-ce6e-4f0a-b544-60f483e54fa8)

**DARK MODE:**
![Screenshot 2025-02-08 223025](https://github.com/user-attachments/assets/f1d556c3-8244-461c-bbfd-1bf4cf558497)

