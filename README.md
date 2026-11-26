# ShopMini – Cửa hàng mini

Bài thực hành 03 (TH03) – môn Lập trình Web.

ShopMini là ứng dụng cửa hàng mini xây dựng bằng **React + TypeScript (Vite)**, quản lý state toàn cục bằng **Context API** và **Redux Toolkit**. Dữ liệu sản phẩm lấy từ [FakeStoreAPI](https://fakestoreapi.com/products).

## Chức năng

- **Trang chủ** (`/`): lưới sản phẩm responsive (1 cột điện thoại, 2 cột tablet, 4 cột desktop), tìm kiếm theo tên, lọc theo danh mục (thanh bên và thẻ "Shop by Category"), banner "Shop Now", khối "Deal of the Day" có đồng hồ đếm ngược, khối "Trending Now", skeleton khi đang tải, thông báo lỗi kèm nút "Thử lại"
- **Chi tiết sản phẩm** (`/products/:id`)
- **Giỏ hàng** (`/cart`): thêm, xóa, tăng giảm số lượng, xóa tất cả, hiển thị tổng số lượng và tổng tiền, trạng thái giỏ trống
- **Đăng nhập** (`/login`): đăng nhập giả lập, đúng khi mật khẩu là `123456`
- **Thanh toán** (`/checkout`): trang được bảo vệ, nút "Đặt hàng" xóa giỏ hàng và hiện thông báo thành công
- **Trang 404** cho đường dẫn không tồn tại
- **Header dùng chung**: số lượng sản phẩm trong giỏ, tên người dùng, nút đăng xuất, nút đổi theme sáng/tối (ô tìm kiếm chỉ hiện ở Trang chủ)

## Công nghệ

React 19, TypeScript (không dùng `any`), Vite, React Router, Redux Toolkit, React-Redux, Context API, CSS thuần.

## Cài đặt và chạy

```bash
npm install
npm run dev      
npm run build    
```

## Các trang

| Đường dẫn | Trang | Ghi chú |
|---|---|---|
| `/` | Trang chủ | Hỗ trợ `?q=` để tìm kiếm |
| `/products/:id` | Chi tiết sản phẩm | |
| `/cart` | Giỏ hàng | |
| `/login` | Đăng nhập | |
| `/checkout` | Thanh toán | Cần đăng nhập (`ProtectedRoute`) |
| `*` | 404 | |

## Quản lý state: dữ liệu nào để ở đâu và vì sao

| Dữ liệu | Nơi lưu | Lý do |
|---|---|---|
| Danh sách sản phẩm và trạng thái tải (`idle`, `loading`, `succeeded`, `failed`, kèm thông báo lỗi) | **Redux** (`productsSlice`) | Gọi API bất đồng bộ bằng `createAsyncThunk` nên cần quản lý đủ các trạng thái tải. Dữ liệu được nhiều nơi cùng đọc (Trang chủ, Chi tiết sản phẩm, Deal of the Day, Trending Now, ảnh đại diện danh mục) và chỉ cần tải một lần |
| Giỏ hàng (danh sách sản phẩm và số lượng) | **Redux** (`cartSlice`) | Nhiều trang và component cùng đọc và sửa (Header, Chi tiết, Trang chủ, Giỏ hàng, Thanh toán). Có nhiều thao tác cập nhật (`addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`). Tổng số lượng và tổng tiền được tính từ một nguồn duy nhất bằng selector (`selectCartTotalQuantity`, `selectCartTotalPrice`) nên không bị lệch số giữa các trang |
| Theme sáng/tối | **Context** (`ThemeContext`) | Là cấu hình giao diện dùng toàn ứng dụng, ít thay đổi, logic chỉ là bật/tắt (`toggleTheme`) nên không cần đến Redux. Giá trị được lưu vào `localStorage` để giữ lại khi tải lại trang |
| Người dùng đang đăng nhập (`user`, `login`, `logout`) | **Context** (`AuthContext`) | Cần ở nhiều nơi (Header, `ProtectedRoute`, trang đăng nhập, trang thanh toán) nhưng dữ liệu rất nhỏ (chỉ có `username`) và ít thay đổi, nên Context là đủ |
| Từ khóa tìm kiếm | **URL** (`?q=`) kết hợp `useState` trong `Header` | Ô nhập ở Header cần chia sẻ từ khóa với Trang chủ. Đặt từ khóa lên URL giúp hai component dùng chung mà không cần state toàn cục, đồng thời giữ được kết quả khi tải lại trang. Giá trị đang gõ dở trong ô nhập là `useState` cục bộ |
| Danh mục đang chọn | **useState** trong `HomePage` | Chỉ Trang chủ dùng; truyền xuống `Sidebar` và `CategoryTabs` qua props. Không cần đưa lên Context hay Redux |
| Nội dung form đăng nhập (`username`, `password`, hiện/ẩn mật khẩu, thông báo lỗi) | **useState** trong `LoginPage` | Dữ liệu tạm thời của một form, không component nào khác cần |
| Đã đặt hàng thành công (`orderSuccess`) | **useState** trong `CheckoutPage` | Chỉ để chuyển giao diện sang thông báo thành công, mất đi khi rời trang cũng không sao |
| Số giây còn lại của đồng hồ đếm ngược | **useState** trong `DealOfTheDay` | Chỉ một component dùng; cập nhật mỗi giây bằng `setInterval` trong `useEffect` và có dọn dẹp (`clearInterval`) khi component bị gỡ |

**Nguyên tắc chọn:**

- Dữ liệu chỉ một component dùng thì dùng `useState`.
- Dữ liệu cấu hình hoặc phiên làm việc, nhỏ và ít thay đổi nhưng dùng ở nhiều nơi thì dùng Context.
- Dữ liệu lấy từ API, có nhiều thao tác cập nhật hoặc cần tính toán dẫn xuất (tổng số lượng, tổng tiền) thì dùng Redux Toolkit.

## Luồng đăng nhập và protected route

1. Người dùng chưa đăng nhập mà vào `/checkout`: `ProtectedRoute` đọc `user` từ `AuthContext`. Nếu chưa có `user`, nó dùng `<Navigate to="/login" state={{ from: location }} replace />` để chuyển sang `/login` và ghi nhớ trang đang định vào trong `location.state`.
2. Ở `LoginPage`, đường dẫn quay lại được lấy từ `location.state.from.pathname`, nếu không có thì mặc định là `/`.
3. Người dùng nhập tên đăng nhập (không để trống) và mật khẩu `123456`. Hàm `login()` trong `AuthContext` kiểm tra điều kiện này; đúng thì cập nhật `user` và trả về `true`, sai thì trả về `false` và trang đăng nhập hiện thông báo lỗi.
4. Đăng nhập thành công thì `navigate(from, { replace: true })` đưa người dùng quay lại đúng trang trước đó (ví dụ `/checkout`). Nếu đã đăng nhập sẵn mà vào `/login`, trang cũng tự chuyển về `from`.
5. Ở trang thanh toán, nút "Đặt hàng" gọi `clearCart()` để xóa giỏ hàng trong Redux và hiện thông báo "Đặt hàng thành công!".

## Luồng dữ liệu sản phẩm

`HomePage` và `ProductDetailPage` đều kiểm tra: nếu `status === 'idle'` thì `dispatch(fetchProducts())`. Nhờ vậy người dùng vào thẳng `/products/:id` (ví dụ tải lại trang) vẫn có dữ liệu. Sau khi tải xong, danh sách nằm trong Redux và được dùng lại ở mọi nơi, không gọi API lần thứ hai.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── store.ts                 configureStore, RootState, AppDispatch
│   └── hooks.ts                 useAppDispatch, useAppSelector
├── features/
│   ├── products/productsSlice.ts
│   └── cart/cartSlice.ts
├── contexts/
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx
├── components/
│   ├── Header.tsx, ThemeSwitch.tsx
│   ├── ProductCard.tsx, ProductSkeleton.tsx
│   ├── ProtectedRoute.tsx
│   ├── Sidebar.tsx, CategoryTabs.tsx
│   └── HeroBanner.tsx, DealOfTheDay.tsx, TrendingList.tsx
├── layouts/MainLayout.tsx
├── pages/
│   ├── HomePage.tsx, ProductDetailPage.tsx, CartPage.tsx
│   └── LoginPage.tsx, CheckoutPage.tsx, NotFoundPage.tsx
├── types/index.ts               Product, CartItem, User, Theme
├── App.tsx                      khai báo Routes
└── main.tsx                     bọc Provider, ThemeProvider, AuthProvider, BrowserRouter
```

## Ghi chú

- Đăng nhập chỉ là **giả lập** theo yêu cầu đề bài, không có máy chủ xác thực.
- Giỏ hàng và trạng thái đăng nhập được giữ trong bộ nhớ của ứng dụng, nên sẽ **mất khi tải lại trang**. Riêng theme được lưu trong `localStorage`.
- Ô "Ghi nhớ đăng nhập" và dòng "Quên mật khẩu?" ở trang đăng nhập chỉ là phần giao diện, chưa có chức năng.
- Mục "Deal of the Day" dùng giá gốc giả lập (giá hiện tại × 1.25) để hiển thị mức giảm, vì API không có giá khuyến mãi.