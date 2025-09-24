# 🧪 Hướng dẫn Test Flow Hoàn chỉnh - BSS App

## 📱 Tổng quan ứng dụng

BSS (Battery Swap Station) App với flow authentication hoàn chỉnh:

- **Auth Flow**: Welcome → Login/Register → Vehicle Setup → Main App
- **Main App**: 5 tab navigation với QR scan ở giữa
- **Persistent State**: Lưu trạng thái đăng nhập và thông tin xe

---

## 🚀 Flow Test Chính (Recommended)

### 🎯 Test Case 1: Full Flow từ đầu (Đăng ký mới)

#### Bước 1: Welcome Screen

```
✅ Mở app → Hiển thị Welcome Screen
✅ Nhấn "Bắt đầu" → Chuyển đến Login
```

#### Bước 2: Register Account

```
📍 Tại LoginScreen → Nhấn "Chưa có tài khoản? Đăng ký"
📍 Tại RegisterScreen:
  1. Nhấn "🧪 Điền dữ liệu test"
  2. Form auto-fill:
     - Họ: Nguyen
     - Tên: Van A
     - Email: test@bss.com
     - Phone: 0912345678
     - Password: 123456
     - Confirm: 123456
  3. Nhấn "Tạo tài khoản"
  4. Alert "Đăng ký thành công!" → OK
  5. Chuyển về LoginScreen
```

#### Bước 3: Login

```
📍 Tại LoginScreen:
  1. Email: test@bss.com
  2. Password: 123456
  3. Nhấn "Đăng nhập"
  4. Alert "Chào mừng Nguyen!" → Tiếp tục
  5. Chuyển đến VehicleSetupScreen
```

#### Bước 4: Vehicle Registration

```
📍 Tại VehicleSetupScreen:
  1. Nhấn "🚗 Điền dữ liệu test (VinFast VF8)"
  2. Form auto-fill:
     - Biển số: 30A-12345
     - Loại xe: VinFast VF8
     - Năm: 2023
     - Màu: Đỏ
     - Model: VF8 Plus
  3. Nhấn "Hoàn tất thiết lập"
  4. Alert "Thiết lập xe thành công!" → OK
  5. Chuyển đến Main App
```

#### Bước 5: Verify Main App

```
✅ Bottom tabs hiển thị đầy đủ:
  🏠 Home | 📑 Reservations | 🎯 QR | 🕒 History | 👤 Profile
✅ Tab QR ở giữa có background cam
✅ Profile tab hiển thị thông tin user & xe
```

---

## ⚡ Quick Test Cases

### 🎯 Test Case 2: Quick Login (Existing User)

```
📍 Mở app → Login Screen
📍 Nhấn "⚡ Quick Login" → Thẳng VehicleSetup
📍 Setup xe → Main App
```

### 🎯 Test Case 3: Test Persistence

```
1️⃣ Hoàn tất flow đầy đủ (Test Case 1)
2️⃣ Vào Profile → Nhấn "Đăng xuất"
3️⃣ App restart → Welcome Screen
4️⃣ Login lại với cùng account
5️⃣ ✅ Vào thẳng Main App (ko cần setup xe lại)
```

---

## 🧪 Advanced Test Scenarios

### 🎯 Test Case 4: Validation Testing

#### Register Form Validation:

```
❌ Để trống fields → "Vui lòng điền đầy đủ thông tin"
❌ Password != Confirm → "Mật khẩu xác nhận không khớp"
❌ Email ngắn < 3 chars → "Thông tin không hợp lệ"
❌ Password ngắn < 6 chars → "Thông tin không hợp lệ"
```

#### Vehicle Form Validation:

```
❌ Để trống field → "Vui lòng điền đầy đủ thông tin"
✅ Data đầy đủ → Success
```

### 🎯 Test Case 5: Multiple Vehicle Types

#### Test với Honda PCX:

```
📍 VehicleSetup → Nhập thủ công:
- Biển số: 29B1-67890
- Loại xe: Honda PCX
- Năm: 2022
- Màu: Trắng
- Model: PCX 160
```

#### Test với Tesla Model 3:

```
📍 VehicleSetup → Nhập thủ công:
- Biển số: 51G-99999
- Loại xe: Tesla Model 3
- Năm: 2024
- Màu: Xanh dương
- Model: Standard Range Plus
```

---

## 🔍 Debug & Troubleshooting

### Common Issues:

#### 🚫 "Navigation state not found"

```
Solution: Restart app hoàn toàn
```

#### 🚫 "Auth service error"

```
Solution: Clear AsyncStorage
// DevTools Console:
AsyncStorage.clear();
```

#### 🚫 App stuck at Welcome

```
Solution: Check AuthService isLoggedIn logic
```

### Debug Commands:

```javascript
// Check auth status
await AsyncStorage.getItem("auth_token");
await AsyncStorage.getItem("user_data");
await AsyncStorage.getItem("vehicle_info");

// Clear all data
await AsyncStorage.clear();
```

---

## 📊 Test Results Checklist

### ✅ Registration Flow:

- [ ] Welcome screen navigation
- [ ] Register form validation
- [ ] Test data auto-fill
- [ ] Account creation success
- [ ] Navigation to login

### ✅ Authentication Flow:

- [ ] Login validation
- [ ] Success alert & navigation
- [ ] Auth state persistence
- [ ] Quick login functionality

### ✅ Vehicle Setup:

- [ ] Form auto-fill (VinFast)
- [ ] Manual input (Honda, Tesla)
- [ ] Validation checks
- [ ] Data persistence
- [ ] Navigation to Main App

### ✅ Main App:

- [ ] 5 tab navigation
- [ ] QR tab special styling
- [ ] Profile data display
- [ ] Logout functionality
- [ ] Re-login persistence

---

## 🎯 Test Execution Order

### First Time Testing:

```
1. Test Case 1: Full Flow (Register + Login + Vehicle + Main)
2. Test Case 3: Persistence (Logout + Re-login)
3. Test Case 4: Validation (Error scenarios)
4. Test Case 5: Multiple vehicles
```

### Daily Testing:

```
1. Test Case 2: Quick Login
2. Verify main app functionality
3. Test logout/login cycle
```

---

## 📱 Expected Final State

Sau khi hoàn thành testing:

```
🎉 BSS App Features:
✅ Complete auth flow (Welcome → Register → Login → Vehicle → Main)
✅ Persistent login state
✅ Vehicle data storage
✅ 5-tab navigation với QR center
✅ Form validation đầy đủ
✅ Test utilities cho development
✅ Vietnamese UI/UX
✅ Smooth navigation experience

🚀 App sẵn sàng production!
```

---

## 💡 Pro Tips

1. **Sử dụng nút test data** để fill form nhanh
2. **Check DevTools console** để debug
3. **Clear AsyncStorage** khi cần reset
4. **Test trên nhiều device** khác nhau
5. **Verify persistence** bằng cách restart app

**Happy Testing! 🚀**
