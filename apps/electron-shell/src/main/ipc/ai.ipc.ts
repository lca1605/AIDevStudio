import { ipcMain, WebContents } from 'electron';
import http from 'http';

export function registerAIIPCHandlers() {
  // Lắng nghe yêu cầu chat từ giao diện React gửi lên
  ipcMain.on('ai:chat-request', async (event, payload: { prompt: string; context_files: any[] }) => {
    const webContents = event.sender;
    
    const postData = JSON.stringify({
      prompt: payload.prompt,
      context_files: payload.context_files
    });

    const options = {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      res.setEncoding('utf-8');
      
      // Đọc luồng dữ liệu stream từ FastAPI trả về
      res.on('data', (chunk) => {
        // Bắn trực tiếp từng cụm từ (chunk) về cho giao diện React theo thời gian thực
        if (!webContents.isDestroyed()) {
          webContents.send('ai:chat-chunk', chunk);
        }
      });

      res.on('end', () => {
        if (!webContents.isDestroyed()) {
          webContents.send('ai:chat-end');
        }
      });
    });

    req.on('error', (err) => {
      console.error('[IPC AI Error]:', err);
      if (!webContents.isDestroyed()) {
        webContents.send('ai:chat-error', `Backend Engine Error: ${err.message}`);
      }
    });

    // Gửi dữ liệu đi
    req.write(postData);
    req.end();
  });
}