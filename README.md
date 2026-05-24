# AIDevStudio (AI-AppBuilder) - Tổng quan Dự án

Chào mừng bạn tham gia vào đội ngũ phát triển **AIDevStudio**! Đây là tài liệu hướng dẫn tổng quan về kiến trúc hệ thống và các bước thiết lập môi trường cục bộ để bắt đầu làm việc.

---

## 🛠️ Kiến Trúc Hệ Thống (Architecture)

Dự án được tổ chức theo cấu trúc **Monorepo** quản lý bằng công cụ `pnpm workspaces` và điều phối tiến trình biên dịch thông qua `Turborepo`. Hệ thống chia làm 3 thành phần cốt lõi:

1. **`apps/electron-shell` (Frontend/Desktop Wrapper):**
   * **Công nghệ:** Electron + Vite + React 19 + TypeScript.
   * **Nhiệm vụ:** Xây dựng giao diện IDE (ChatPanel, Editor, FileExplorer) và quản lý vòng đời ứng dụng qua Main/Renderer Process.
2. **`apps/python-engine` (Backend/AI Agent Core):**
   * **Công nghệ:** Python 3.x + FastAPI + Uvicorn + OpenAI SDK.
   * **Nhiệm vụ:** Xử lý AST mã nguồn, quản lý Prompt hệ thống, kết nối tới mô hình AI (Ollama local hoặc OpenAI) và stream kết quả thời gian thực về Shell qua Local API (Cổng `8000`).
3. **`packages/shared-types`:**
   * Nơi lưu trữ các định nghĩa kiểu dữ liệu (Types & Constants) dùng chung cho toàn hệ thống.

---

## 🚀 Hướng Dẫn Thiết Lập Môi Trường (Setup Guide)

Đảm bảo máy tính của bạn đã cài đặt sẵn **Node.js (Bản LTS)** và **Python 3.10+**.

### 1. Cấu hình Toàn cục & Tầng Electron (Node.js)
Mở terminal tại thư mục gốc của dự án (`AIDevStudio/`) và chạy chuỗi lệnh sau:

```bash
# Cài đặt trình quản lý thư viện pnpm (nếu chưa có)
npm install -g pnpm

# Cài đặt toàn bộ các node_modules cho hệ thống Monorepo
pnpm install
2. Cấu hình Môi Trường Ảo Cho Python Engine
Di chuyển vào thư mục backend và khởi tạo môi trường cô lập, tuyệt đối không cài thư viện chung vào hệ thống máy.

Bash
# Di chuyển vào backend
cd apps/python-engine

# Tạo môi trường ảo cục bộ tên là .venv
python -m venv .venv

# Kích hoạt môi trường ảo (Mẫu cho Windows PowerShell)
.venv\Scripts\Activate.ps1
# (Đối với macOS/Linux: source .venv/bin/activate)

# Cập nhật pip và cài đặt thư viện từ file cấu hình sẵn
python -m pip install --upgrade pip
pip install -r requirements.txt
💻 Chu Trình Khởi Chạy Khi Code (Development Workflow)
Bước 1: Khởi động AI Model cục bộ
Ứng dụng sử dụng mô hình lập trình chạy local, đảm bảo bạn đã khởi động Ollama dưới máy:

Bash
ollama run qwen2.5-coder:latest
Bước 2: Chạy toàn bộ hệ thống Monorepo
Mở một Terminal mới tại thư mục gốc dự án (AIDevStudio/) và khởi chạy chế độ nhà phát triển:

Bash
pnpm dev
Quy Ước Quan Trọng Khi Làm Việc Nhóm
Không đẩy thư mục .venv lên Git: Thư mục môi trường ảo .venv đã được đưa vào cấu hình .gitignore. Tuyệt đối không can thiệp hoặc gỡ bỏ dòng này để tránh gây nặng kho lưu trữ.

Cập nhật thư viện mới: Khi bạn cài thêm bất kỳ thư viện Python nào (bằng pip install), hãy nhớ chạy lệnh sau tại thư mục apps/python-engine để cập nhật lại danh sách cho các thành viên khác:

Bash
pip freeze > requirements.txt
Kiểm tra kiểu dữ liệu: Backend Python áp dụng Type Hint nghiêm ngặt với Pylance. Khi viết code, hãy chú ý khai báo kiểu dữ liệu rõ ràng (Ví dụ: node: Dict[str, Any] = {}) để tránh cảnh báo lỗi hệ thống.

Mọi thắc mắc trong quá trình code vui lòng thảo luận trực tiếp trên kênh trao đổi nội bộ của nhóm!