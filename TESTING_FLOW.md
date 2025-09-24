z# BSS App Testing Flow

## 🚀 Cách chạy app để test

1. **Mở terminal và chạy:**

   ```bash
   cd /e/wdp/bss-app
   npm start
   ```

2. **Chọn platform để test:**

   - `a` - Android (cần có Android emulator hoặc device)
   - `w` - Web browser
   - `i` - iOS (chỉ trên macOS với iOS simulator)

3. **Hoặc quét QR code bằng Expo Go app trên điện thoại**

## 📱 Flow Test Navigation

### PHASE 1: Auth Flow Testing

App sẽ bắt đầu với **Auth Stack** (vì `isAuthenticated = false`)

#### 1.1 Welcome Screen

- **Location:** `src/features/auth/screens/WelcomeScreen.tsx`
- **Test:**
  - ✅ Kiểm tra hiển thị welcome message
  - ✅ Buttons "Login" và "Register" hoạt động
  - ✅ Navigation đến đúng screen

#### 1.2 Login Screen

- **Location:** `src/features/auth/screens/LoginScreen.tsx`
- **Test:**
  - ✅ Input fields (email/phone, password)
  - ✅ "Login" button
  - ✅ "Register" link
  - ✅ Navigate to OTP Verification (nếu có)

#### 1.3 Register Screen

- **Location:** `src/features/auth/screens/RegisterScreen.tsx`
- **Test:**
  - ✅ Form fields (name, email, phone, password)
  - ✅ "Register" button
  - ✅ Navigate to OTP Verification

#### 1.4 OTP Verification Screen

- **Location:** `src/features/auth/screens/OTPVerificationScreen.tsx`
- **Test:**
  - ✅ OTP input fields
  - ✅ "Verify" button
  - ✅ "Resend OTP" functionality
  - ✅ Navigate to Main App after success

---

### PHASE 2: Main App Flow Testing

Sau khi login thành công sẽ chuyển đến **MainTab Navigator**

#### 2.1 Home Screen (Tab 1)

- **Location:** `src/features/station/screens/HomeScreen.tsx`
- **Test:**
  - ✅ Hiển thị nội dung Home
  - ✅ Tab bar navigation
  - ✅ Tab icon/label "Home"

#### 2.2 Stations Screen (Tab 2)

- **Location:** `src/features/station/screens/StationListScreen.tsx`
- **Test:**
  - ✅ Danh sách trạm sạc pin
  - ✅ Station cards/items
  - ✅ Navigation to station details (nếu có)
  - ✅ Tab icon/label "Stations"

#### 2.3 History Screen (Tab 3)

- **Location:** `src/features/history/screens/HistoryScreen.tsx`
- **Test:**
  - ✅ Lịch sử giao dịch
  - ✅ History items list
  - ✅ Tab icon/label "History"

#### 2.4 Profile Screen (Tab 4)

- **Location:** `src/features/profile/screens/ProfileScreen.tsx`
- **Test:**
  - ✅ Thông tin user profile
  - ✅ Settings/preferences
  - ✅ Logout functionality
  - ✅ Tab icon/label "Profile"

---

## 🧪 Debug & Testing Tips

### 1. Kiểm tra Navigation Types

```bash
# Chạy TypeScript check
npx tsc --noEmit --skipLibCheck
```

### 2. Test Authentication State

Trong `src/navigation/index.tsx` line ~46:

```tsx
const isAuthenticated = false; // Change to true to test Main App
```

### 3. Console Logs

Mở debugger bằng `j` trong terminal để xem logs

### 4. Hot Reload

- Sửa code sẽ tự động reload
- Nếu cần force reload: `r` trong terminal

---

## 📋 Test Checklist

### ✅ Navigation Flow

- [ ] Auth screens navigate correctly
- [ ] Main tabs switch properly
- [ ] Back navigation works
- [ ] Deep linking (if implemented)

### ✅ UI/UX

- [ ] All screens render without crashes
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design

### ✅ Functionality

- [ ] Forms validation
- [ ] API calls (mock data)
- [ ] State management
- [ ] User interactions

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"

**Solution:** Check import paths và file names

### Issue: TypeScript errors

**Solution:** Run `npx tsc --noEmit` to check types

### Issue: Metro bundler errors

**Solution:** Clear cache with `npx expo start --clear`

### Issue: Navigation not working

**Solution:** Check screen names match type definitions

---

## 📱 Testing Platforms

### Web Browser (Easiest)

- Press `w` in terminal
- Opens in browser at `http://localhost:19006`
- Good for quick UI testing

### Android Emulator

- Press `a` in terminal
- Requires Android Studio setup
- Best for mobile-specific testing

### Expo Go App

- Scan QR code with phone
- Real device testing
- Install Expo Go from app store

---

## 🔄 Quick Test Commands

```bash
# Start development server
npm start

# Type checking
npx tsc --noEmit

# Clear cache and restart
npx expo start --clear

# Build for production testing
npx expo build:web
```

## 📝 Test Results Log

### Date: [YOUR_DATE]

- [ ] Welcome Screen: ✅/❌
- [ ] Login Screen: ✅/❌
- [ ] Register Screen: ✅/❌
- [ ] OTP Screen: ✅/❌
- [ ] Home Tab: ✅/❌
- [ ] Stations Tab: ✅/❌
- [ ] History Tab: ✅/❌
- [ ] Profile Tab: ✅/❌
- [ ] Navigation Flow: ✅/❌

**Notes:**
[Add your testing notes here]
