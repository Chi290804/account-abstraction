# Demo Account Abstraction

Dự án này minh họa cách sử dụng **Account Abstraction** với [thirdweb](https://thirdweb.com/) SDK. Bao gồm các tính năng như tài trợ phí giao dịch (sponsored transactions), session keys và batch giao dịch.

## Bắt đầu

### Yêu cầu

- Node.js (v16 trở lên)
- Trình quản lý gói npm hoặc yarn

### Cài đặt

1. Clone repository:
   ```bash
   git clone https://github.com/Chi290804/account-abstraction
   cd account-abstraction
   ```

2. Cài đặt thư viện:
   ```bash
   yarn install
   ```

3. Tạo biến môi trường:
   - Tạo file `.env` ở thư mục gốc.
   - Thêm biến sau vào file:
     ```env
     NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_client_id_here
     ```
   Thay `your_client_id_here` bằng thirdweb client ID của bạn.
   (Bạn có thể dùng: "766513980ce8af05ea9158c103e2d4dd")

### Chạy dự án

- Khởi động server phát triển:
  ```bash
  yarn dev
  ```

- Mở trình duyệt và truy cập `http://localhost:3000`.

## Tổng quan chức năng

### 1. Sponsored Transactions
- Cho phép người dùng thực hiện giao dịch mà không cần trả phí gas.
- Ví dụ: Claim NFT mà không cần ETH để trả phí gas.

### 2. Session Keys
- Tạo session key với quyền hạn cụ thể để thực hiện giao dịch thay cho tài khoản.
- Ví dụ: Cấp quyền cho session key để mint NFT hoặc tương tác với smart contract nhất định.

### 3. Batching Transactions
- Gộp nhiều giao dịch thành một để tiết kiệm phí.
- Ví dụ: Claim NFT và token trong một giao dịch.

## Account Abstraction là gì?

Account Abstraction là khái niệm cho phép ví smart contract hoạt động như tài khoản người dùng. Từ đó có thể:

- **Tài trợ phí gas**: Giao dịch được tài trợ bởi bên thứ ba, giúp người dùng không cần trả phí gas.
- **Logic tùy chỉnh**: Xác thực và thực thi giao dịch theo logic riêng.
- **Session Keys**: Khóa tạm thời với quyền hạn giới hạn cho các hành động cụ thể.
- **Batching**: Thực hiện nhiều hành động trong một giao dịch.

Dự án sử dụng thirdweb SDK để minh họa các tính năng này một cách thân thiện.

## Tham khảo

- [Tài liệu thirdweb](https://portal.thirdweb.com/)
- [Tổng quan Account Abstraction](https://portal.thirdweb.com/typescript/v5/account-abstraction)