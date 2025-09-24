# 🧪 Edge Case Test Scenarios - BSS App

## 🚨 Error Handling & Edge Cases

### 🎯 Test Case: Network Simulation

```
Mô tả: Test app behavior khi có network issues
```

#### Scenario 1: Slow Network

```
📍 Login với network chậm:
1. Login với test@bss.com / 123456
2. Nhấn login nhiều lần liên tiếp
3. ✅ Expected: Button disabled khi loading
4. ✅ Expected: Chỉ một request được gửi
5. ✅ Expected: Loading state hiển thị
```

#### Scenario 2: Network Timeout

```
📍 Vehicle setup khi offline:
1. Tắt wifi/data
2. Fill vehicle form
3. Submit form
4. ✅ Expected: Error message xuất hiện
5. ✅ Expected: Form data không bị mất
```

---

### 🎯 Test Case: Data Validation Edge Cases

#### Email Validation:

```
Test inputs:
❌ ""                    → "Vui lòng nhập đầy đủ thông tin"
❌ "a"                   → "Thông tin không hợp lệ"
❌ "ab"                  → "Thông tin không hợp lệ"
✅ "abc@test.com"        → Success
❌ "test@"               → "Thông tin không hợp lệ"
❌ "@test.com"           → "Thông tin không hợp lệ"
✅ "user+tag@domain.co"  → Success
```

#### Password Validation:

```
Test inputs:
❌ ""          → "Vui lòng nhập đầy đủ thông tin"
❌ "1"         → "Thông tin không hợp lệ"
❌ "12345"     → "Thông tin không hợp lệ"
✅ "123456"    → Success
✅ "password"  → Success
✅ "P@ssw0rd!" → Success
```

#### Vehicle License Plate:

```
Test formats (Vietnamese plates):
✅ "30A-12345"     → Success (Standard format)
✅ "51G-99999"     → Success (Standard format)
✅ "29B1-67890"    → Success (4-digit prefix)
❌ "123"           → Error (Too short)
❌ "ABCD-12345"    → Error (Invalid format)
❌ "30A12345"      → Error (Missing dash)
❌ ""              → Error (Empty)
```

#### Year Validation:

```
Test inputs:
❌ ""      → "Vui lòng điền đầy đủ thông tin"
❌ "abc"   → Validation error
❌ "1990"  → Error (Too old)
❌ "2030"  → Error (Future year)
✅ "2020"  → Success
✅ "2023"  → Success
✅ "2024"  → Success
```

---

### 🎯 Test Case: Memory & Performance

#### AsyncStorage Limits:

```
📍 Test large data storage:
1. Login/logout 50 lần liên tiếp
2. Register 10 different vehicles
3. ✅ Expected: App vẫn hoạt động smooth
4. ✅ Expected: Data không bị corrupt
```

#### Memory Leaks:

```
📍 Navigation stress test:
1. Navigate qua lại các tab 100 lần
2. Login/logout/login 20 lần
3. ✅ Expected: App không crash
4. ✅ Expected: Performance không giảm
```

---

### 🎯 Test Case: Concurrent Operations

#### Simultaneous Login:

```
📍 Multiple login attempts:
1. Nhấn "Đăng nhập" 5 lần nhanh liên tiếp
2. ✅ Expected: Chỉ 1 request được process
3. ✅ Expected: UI không bị duplicate
4. ✅ Expected: Loading state consistent
```

#### Race Condition:

```
📍 Login + Vehicle setup đồng thời:
1. Login success → navigation triggered
2. Trước khi navigate, nhấn vehicle setup
3. ✅ Expected: Navigation sequence đúng
4. ✅ Expected: Không bị stuck
```

---

### 🎯 Test Case: State Management

#### Auth State Corruption:

```
📍 Manual AsyncStorage modification:
1. Login thành công
2. DevTools: AsyncStorage.setItem('auth_token', 'invalid')
3. Navigate giữa các tab
4. ✅ Expected: App detect invalid token
5. ✅ Expected: Auto-logout hoặc error handling
```

#### Vehicle State Edge Cases:

```
📍 Partial vehicle data:
1. Login success
2. DevTools: Set partial vehicle info
   AsyncStorage.setItem('vehicle_info', '{"licensePlate":"30A-12345"}')
3. Restart app
4. ✅ Expected: Force vehicle setup completion
5. ✅ Expected: No crash với incomplete data
```

---

### 🎯 Test Case: UI/UX Edge Cases

#### Long Text Inputs:

```
Test với text dài:
📍 Register form:
- firstName: "Nguyễn Thành Đạt Phương Thảo Mai Linh" (50+ chars)
- email: "verylongemailaddressfortesting@extremelylongdomainname.co.vn"
- ✅ Expected: Text không bị overflow
- ✅ Expected: Form vẫn functional
```

#### Special Characters:

```
Test inputs with special chars:
📍 Vehicle info:
- Model: "VF8 Plus ++ (Premium) 2023 🚗"
- Color: "Đỏ cam Ý/Rosso Corsa"
- ✅ Expected: Save/restore chính xác
- ✅ Expected: Display không bị garbled
```

#### Screen Rotation:

```
📍 Device orientation:
1. Login screen → Rotate device
2. Form data có bị mất không?
3. Vehicle setup → Rotate device
4. ✅ Expected: Form state preserved
5. ✅ Expected: Layout responsive
```

---

### 🎯 Test Case: Security

#### Token Expiry Simulation:

```
📍 Expired token handling:
1. Login successful
2. DevTools: AsyncStorage.setItem('auth_token', 'expired_token')
3. Try to access protected features
4. ✅ Expected: Handle gracefully
5. ✅ Expected: Redirect to login
```

#### Data Sanitization:

```
📍 XSS/Script injection:
- Name: "<script>alert('hack')</script>"
- Email: "test@domain.com<script>"
- ✅ Expected: Text rendered as plain text
- ✅ Expected: No script execution
```

---

### 🎯 Test Case: Accessibility

#### Screen Reader:

```
📍 Accessibility testing:
1. Enable TalkBack/VoiceOver
2. Navigate through login flow
3. ✅ Expected: All elements readable
4. ✅ Expected: Proper focus order
```

#### Keyboard Navigation:

```
📍 Tab navigation:
1. Use external keyboard
2. Tab through login form
3. ✅ Expected: Proper tab order
4. ✅ Expected: Enter key submits
```

---

## 🔧 Testing Tools & Setup

### Manual Testing Checklist:

```
□ Test on iOS & Android
□ Test on different screen sizes
□ Test with slow network
□ Test with no network
□ Test with device rotation
□ Test with accessibility features
□ Test memory usage
□ Test battery usage
```

### Automated Testing Setup:

```javascript
// Future: Jest test setup
describe("Auth Flow", () => {
  test("should handle login with valid credentials", async () => {
    // Test implementation
  });

  test("should validate email format", () => {
    // Test implementation
  });
});
```

### Debug Commands:

```javascript
// Clear all app data
await AsyncStorage.clear();

// Check current auth state
const token = await AsyncStorage.getItem("auth_token");
const user = await AsyncStorage.getItem("user_data");
const vehicle = await AsyncStorage.getItem("vehicle_info");

console.log("Auth State:", { token, user, vehicle });

// Simulate network delay
const originalLogin = AuthService.simpleLogin;
AuthService.simpleLogin = async (...args) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return originalLogin(...args);
};
```

---

## 📊 Edge Case Results Matrix

| Test Scenario    | Input           | Expected Result     | Pass/Fail |
| ---------------- | --------------- | ------------------- | --------- |
| Empty email      | ""              | Validation error    | [ ]       |
| Short email      | "ab"            | Validation error    | [ ]       |
| Invalid plate    | "123"           | Validation error    | [ ]       |
| Future year      | "2030"          | Validation error    | [ ]       |
| Long name        | 50+ chars       | Handled gracefully  | [ ]       |
| Special chars    | Unicode/emoji   | Preserved correctly | [ ]       |
| Network timeout  | Offline submit  | Error + retry       | [ ]       |
| Multiple submits | 5x fast click   | Single request      | [ ]       |
| Token expiry     | Invalid token   | Redirect to login   | [ ]       |
| Partial data     | Corrupt storage | Force re-setup      | [ ]       |

---

## 🎯 Critical Path Testing

### High Priority (Must Pass):

1. ✅ Basic auth flow works
2. ✅ Data persistence works
3. ✅ Form validation works
4. ✅ Error messages shown
5. ✅ No crashes on common flows

### Medium Priority (Should Pass):

1. ✅ Edge case validation
2. ✅ Network error handling
3. ✅ Performance acceptable
4. ✅ UI doesn't break with long text
5. ✅ Accessibility features work

### Low Priority (Nice to Have):

1. ✅ Advanced security checks
2. ✅ Perfect responsive design
3. ✅ Optimal performance
4. ✅ Detailed error messages
5. ✅ Advanced UX features

---

**💪 Comprehensive edge case testing ensures robust, production-ready app!**
