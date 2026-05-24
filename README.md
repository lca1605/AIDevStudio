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