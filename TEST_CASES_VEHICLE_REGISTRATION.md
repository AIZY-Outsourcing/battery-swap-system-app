# Test Cases cho Đăng ký xe thành công

## 📋 Tổng quan

Các test case này giúp test flow đăng ký xe sau khi đã đăng nhập thành công vào app.

## 🔄 Quy trình test đầy đủ

### Bước 1: Đăng nhập vào app

1. Mở app BSS
2. Nhập thông tin đăng nhập:
   - Email: `test@bss.com`
   - Password: `123456`
3. Nhấn "Đăng nhập"

### Bước 2: Test đăng ký xe

Sau khi đăng nhập thành công, app sẽ chuyển đến màn hình Vehicle Setup.

## 🚗 Test Case 1: VinFast VF8 (Sử dụng nút test)

### Dữ liệu test:

- **Biển số**: `30A-12345`
- **Loại xe**: `VinFast VF8`
- **Năm sản xuất**: `2023`
- **Màu sắc**: `Đỏ`
- **Model**: `VF8 Plus`

### Cách test nhanh:

1. Tại màn hình Vehicle Setup
2. Nhấn nút **"🚗 Điền dữ liệu test (VinFast VF8)"**
3. Form sẽ tự động điền thông tin
4. Nhấn "Hoàn tất thiết lập"

### Kết quả mong đợi:

✅ Hiển thị thông báo "Thiết lập xe thành công!"
✅ Chuyển đến màn hình Home (Main App)
✅ Tab navigation hiển thị đầy đủ 5 tab
✅ Dữ liệu xe được lưu vào AsyncStorage

## 🏍️ Test Case 2: Honda PCX (Nhập thủ công)

### Dữ liệu test:

```
Biển số: 29B1-67890
Loại xe: Honda PCX
Năm sản xuất: 2022
Màu sắc: Trắng
Model: PCX 160
```

### Cách test:

1. Tại màn hình Vehicle Setup
2. Nhập thủ công từng trường thông tin
3. Nhấn "Hoàn tất thiết lập"

### Kết quả mong đợi:

✅ Validation thành công
✅ Lưu thông tin thành công
✅ Chuyển đến Main App

## 🚙 Test Case 3: Tesla Model 3 (Test validation)

### Dữ liệu test:

```
Biển số: 51G-99999
Loại xe: Tesla Model 3
Năm sản xuất: 2024
Màu sắc: Xanh dương
Model: Standard Range Plus
```

### Cách test:

1. Điền thông tin từng trường
2. Test validation bằng cách:
   - Để trống một số trường → Kiểm tra báo lỗi
   - Nhập biển số không đúng format → Kiểm tra validation
   - Nhập năm không hợp lệ → Kiểm tra validation
3. Sau đó điền đầy đủ thông tin đúng
4. Nhấn "Hoàn tất thiết lập"

### Kết quả mong đợi:

❌ Hiển thị lỗi validation khi dữ liệu không hợp lệ
✅ Cho phép tiếp tục khi dữ liệu đúng

## 🔍 Test Case 4: Kiểm tra dữ liệu lưu trữ

### Cách test:

1. Hoàn tất đăng ký xe bất kỳ
2. Đăng xuất khỏi app (vào Profile → Đăng xuất)
3. Đăng nhập lại
4. Kiểm tra xem có bị yêu cầu đăng ký xe lại không

### Kết quả mong đợi:

✅ Không cần đăng ký xe lại
✅ Vào thẳng Main App
✅ Thông tin xe được giữ nguyên

## 📱 Test Case 5: Navigation sau đăng ký

### Cách test:

1. Hoàn tất đăng ký xe
2. Kiểm tra tất cả 5 tab:
   - 🏠 **Home**: Hiển thị danh sách stations
   - 📑 **Reservations**: Hiển thị "Chưa có đặt chỗ nào"
   - 🎯 **QR Scan**: Mở camera để scan QR
   - 🕒 **History**: Hiển thị lịch sử giao dịch
   - 👤 **Profile**: Hiển thị thông tin user và xe

### Kết quả mong đợi:

✅ Tất cả tab hoạt động bình thường
✅ Tab QR ở giữa với style đặc biệt (màu cam)
✅ Profile hiển thị thông tin xe vừa đăng ký

## 🚫 Test Cases lỗi thường gặp

### Test Case 6: Biển số không hợp lệ

```
Biển số test:
- "123" (quá ngắn)
- "ABCDEF-12345" (format không đúng)
- "" (để trống)
```

**Kết quả mong đợi**: Hiển thị lỗi validation

### Test Case 7: Năm sản xuất không hợp lệ

```
Năm test:
- 1990 (quá cũ)
- 2030 (tương lai)
- "abc" (không phải số)
```

**Kết quả mong đợi**: Hiển thị lỗi validation

## 🔧 Debug và Troubleshooting

### Nếu gặp lỗi:

1. **Kiểm tra Console**: Mở DevTools để xem log lỗi
2. **Clear AsyncStorage**:
   ```javascript
   // Trong DevTools Console
   AsyncStorage.clear();
   ```
3. **Restart App**: Reload lại app hoàn toàn
4. **Kiểm tra AuthService**: Đảm bảo đã đăng nhập thành công

### Log quan trọng:

- `✅ Vehicle setup completed` - Đăng ký xe thành công
- `🚗 Vehicle info saved` - Dữ liệu đã lưu
- `🔄 Navigating to Main` - Chuyển sang Main App

## 📊 Checklist hoàn thành

- [ ] Test Case 1: VinFast VF8 với nút test
- [ ] Test Case 2: Honda PCX nhập thủ công
- [ ] Test Case 3: Tesla Model 3 với validation
- [ ] Test Case 4: Kiểm tra persistence data
- [ ] Test Case 5: Navigation tabs hoạt động
- [ ] Test Case 6: Validation biển số
- [ ] Test Case 7: Validation năm sản xuất

## 🎯 Kết luận

Sau khi hoàn thành tất cả test cases, bạn sẽ có:

- ✅ Flow đăng nhập → đăng ký xe → main app hoạt động hoàn hảo
- ✅ Data persistence qua các lần khởi động app
- ✅ Validation form hoạt động đúng
- ✅ Navigation tabs đầy đủ và functional
- ✅ UI/UX smooth và user-friendly

**🚀 App BSS đã sẵn sàng để sử dụng!**
