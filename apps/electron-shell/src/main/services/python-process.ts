import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { app } from 'electron';

export class PythonProcessManager {
  private static instance: PythonProcessManager;
  private process: ChildProcess | null = null;

  private constructor() {}

  public static getInstance(): PythonProcessManager {
    if (!PythonProcessManager.instance) {
      PythonProcessManager.instance = new PythonProcessManager();
    }
    return PythonProcessManager.instance;
  }

  public start(): void {
    if (this.process) return;

    // Xác định đường dẫn gốc của Monorepo (AIDevStudio/)
    const rootDir = path.resolve(app.getAppPath(), '../..');
    
    // Đường dẫn chính xác tới môi trường ảo và file main.py dựa trên cấu trúc thư mục của bạn
    const pythonExe = process.platform === 'win32'
      ? path.join(rootDir, 'apps', 'python-engine', '.venv', 'Scripts', 'python.exe')
      : path.join(rootDir, 'apps', 'python-engine', '.venv', 'bin', 'python');
      
    const scriptPath = path.join(rootDir, 'apps', 'python-engine', 'main.py');

    console.log(`[Python Engine] Starting via: ${pythonExe}`);

    // Khởi chạy tiến trình Python ngầm
    this.process = spawn(pythonExe, [scriptPath], {
      cwd: path.dirname(scriptPath),
      env: { ...process.env, PYTHONUNBUFFERED: '1' }
    });

    this.process.stdout?.on('data', (data) => {
      console.log(`[Python Engine STDOUT]: ${data.toString().trim()}`);
    });

    this.process.stderr?.on('data', (data) => {
      console.error(`[Python Engine STDERR]: ${data.toString().trim()}`);
    });

    this.process.on('close', (code) => {
      console.log(`[Python Engine] Exited with code ${code}`);
      this.process = null;
    });
  }

  public stop(): void {
    if (this.process) {
      console.log('[Python Engine] Killing process...');
      this.process.kill();
      this.process = null;
    }
  }
}