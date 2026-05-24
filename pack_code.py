import os

# Các thư mục và file muốn bỏ qua để tránh file output quá nặng
EXCLUDE_DIRS = {
    '.git', '.idea', '.vscode', '__pycache__', 'node_modules', 
    '.venv', 'venv', 'env', 'build', 'ios', 'android', '.dart_tool'
}
EXCLUDE_FILES = {
    'package-lock.json', 'yarn.lock', 'pubspec.lock', 'project_context.txt', 'pack_code.py'
}
# Các đuôi file code muốn gom (bạn có thể thêm bớt tùy dự án)
ALLOWED_EXTENSIONS = {
    '.py', '.dart', '.java', '.java', '.xml', '.yaml', '.yml', 
    '.json', '.md', '.txt', '.html', '.css', '.js', '.ts'
}

def generate_context(project_path, output_file):
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("=== STRUCTURAL OVERVIEW ===\n")
        
        # Bước 1: Ghi cấu trúc thư mục trước
        for root, dirs, files in os.walk(project_path):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            level = root.replace(project_path, '').count(os.sep)
            indent = ' ' * 4 * level
            out.write(f"{indent}{os.path.basename(root)}/\n")
            sub_indent = ' ' * 4 * (level + 1)
            for f in files:
                if f not in EXCLUDE_FILES and os.path.splitext(f)[1] in ALLOWED_EXTENSIONS:
                    out.write(f"{sub_indent}{f}\n")
                    
        out.write("\n=== FILE CONTENTS ===\n")
        
        # Bước 2: Ghi nội dung chi tiết từng file
        for root, dirs, files in os.walk(project_path):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for f in files:
                if f in EXCLUDE_FILES:
                    continue
                ext = os.path.splitext(f)[1]
                if ext in ALLOWED_EXTENSIONS:
                    file_path = os.path.join(root, f)
                    relative_path = os.path.relpath(file_path, project_path)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as src:
                            content = src.read()
                        out.write(f"\n--- START OF FILE: {relative_path} ---\n")
                        out.write(content)
                        out.write(f"\n--- END OF FILE: {relative_path} ---\n")
                    except Exception as e:
                        # Bỏ qua các file lỗi hoặc file nhị phân không đọc được dạng text
                        continue

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(current_dir, "project_context.txt")
    print("Đang quét và gom toàn bộ code dự án...")
    generate_context(current_dir, output_path)
    print(f"Thành công! Đã tạo file: {output_path}")