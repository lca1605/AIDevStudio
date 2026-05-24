import os
from pathlib import Path
from typing import List, Dict, Any

class WorkspaceManager:
    def __init__(self, workspace_root: str):
        self.root = Path(workspace_root).resolve()
        # Các thư mục mặc định cần bỏ qua để AI không đọc nhầm file rác
        self.exclude_dirs = {
            '.git', '.idea', '.vscode', '__pycache__', 
            'node_modules', '.venv', 'venv', 'build', 'dist'
        }

    def get_project_tree(self) -> List[Dict[str, Any]]:
        """Quét và trả về cấu trúc cây của toàn bộ dự án dưới dạng List JSON."""
        return self._build_tree(self.root)

    def _build_tree(self, current_path: Path) -> List[Dict[str, Any]]:
        tree = []
        try:
            for item in current_path.iterdir():
                if item.name in self.exclude_dirs:
                    continue
                
                is_dir = item.is_dir()
                # Định nghĩa kiểu dữ liệu rõ ràng là Dict[str, Any] để sửa lỗi Pylance
                node: Dict[str, Any] = {
                    "name": item.name,
                    "path": str(item.relative_to(self.root)),
                    "type": "directory" if is_dir else "file"
                }
                
                if is_dir:
                    node["children"] = self._build_tree(item)
                    
                tree.append(node)
        except Exception:
            pass
        return sorted(tree, key=lambda x: (x["type"] != "directory", x["name"]))
    def read_file_content(self, relative_path: str) -> str:
        """Đọc nội dung an toàn của một file trong workspace."""
        file_path = (self.root / relative_path).resolve()
        # Bảo mật: Không cho phép đọc file nằm ngoài thư mục workspace root
        if not str(file_path).startswith(str(self.root)):
            raise PermissionError("Access denied: Path is outside workspace root.")
        
        if not file_path.exists() or not file_path.is_file():
            raise FileNotFoundError(f"File not found: {relative_path}")
            
        return file_path.read_text(encoding="utf-8", errors="ignore")

    def write_file_content(self, relative_path: str, content: str) -> bool:
        """Ghi hoặc cập nhật code do AI sinh ra vào file cụ thể."""
        file_path = (self.root / relative_path).resolve()
        if not str(file_path).startswith(str(self.root)):
            raise PermissionError("Access denied: Path is outside workspace root.")
            
        # Tự động tạo thư mục cha nếu chưa tồn tại (ví dụ AI muốn tạo component mới trong thư mục mới)
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content, encoding="utf-8")
        return True