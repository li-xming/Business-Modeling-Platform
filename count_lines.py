import os
import sys
from pathlib import Path

def count_lines_in_file(file_path):
    """计算单个文件的行数"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            return len(lines)
    except Exception:
        return 0

def is_source_file(file_path):
    """判断是否为源码文件"""
    source_extensions = {
        '.py', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', 
        '.md', '.txt', '.yml', '.yaml', '.ini', '.config', '.xml', '.sql',
        '.java', '.cpp', '.c', '.h', '.hpp', '.go', '.rs', '.rb', '.php'
    }
    return file_path.suffix.lower() in source_extensions

def print_tree(directory, prefix="", is_last=True, stats=None, threshold=None):
    """递归打印目录树并统计行数"""
    if stats is None:
        stats = {"total_lines": 0, "total_files": 0, "large_files": []}
    
    # 获取目录下的所有项目（文件和子目录）
    try:
        items = [item for item in directory.iterdir()]
        # 按名称排序，目录在前，文件在后
        items.sort(key=lambda x: (not x.is_dir(), x.name.lower()))
    except PermissionError:
        print(f"{prefix}{'└── ' if is_last else '├── '}{directory.name}/ (访问被拒绝)")
        return stats
    
    # 过滤出需要显示的项目
    filtered_items = []
    for item in items:
        if item.is_dir():
            # 跳过常见的非源码目录
            if item.name not in {'.git', 'node_modules', '__pycache__', '.vscode', '.idea', 'dist', 'build', 'public'}:
                filtered_items.append(item)
        elif is_source_file(item):
            filtered_items.append(item)
    
    for i, item in enumerate(filtered_items):
        is_last_item = i == len(filtered_items) - 1
        connector = '└── ' if is_last_item else '├── '
        
        if item.is_dir():
            print(f"{prefix}{connector}{item.name}/")
            # 递归处理子目录
            stats = print_tree(item, prefix + ("    " if is_last_item else "│   "), True, stats, threshold)
        else:
            line_count = count_lines_in_file(item)
            stats["total_lines"] += line_count
            stats["total_files"] += 1
            if threshold is not None and line_count > threshold:
                stats["large_files"].append((str(item), line_count))
            print(f"{prefix}{connector}{item.name} ({line_count} 行)")
    
    return stats

def main():
    # 获取当前目录
    current_dir = Path.cwd()
    
    # 解析命令行参数
    threshold = None
    if len(sys.argv) > 1:
        try:
            threshold = int(sys.argv[1])
        except ValueError:
            print("警告: 参数必须是整数，忽略参数")
    
    print(f"项目源码行数统计 - {current_dir.name}/")
    print("=" * 60)
    
    # 统计信息
    stats = {"total_lines": 0, "total_files": 0, "large_files": []}
    
    # 打印目录树
    stats = print_tree(current_dir, "", True, stats, threshold)
    
    print("=" * 60)
    print(f"总计: {stats['total_files']} 个文件, {stats['total_lines']} 行代码")
    
    # 如果设置了阈值，打印超过阈值的文件
    if threshold is not None:
        print(f"\n行数超过 {threshold} 的文件:")
        if stats['large_files']:
            for file_path, line_count in stats['large_files']:
                print(f"  {file_path}: {line_count} 行")
        else:
            print("  没有文件超过指定行数")
    
    # 按文件类型统计
    print("\n按文件类型统计:")
    type_stats = {}
    for root, dirs, files in os.walk(current_dir):
        # 过滤掉不需要的目录
        dirs[:] = [d for d in dirs if d not in {'.git', 'node_modules', '__pycache__', '.vscode', '.idea', 'dist', 'build', 'public'}]
        
        for file in files:
            file_path = Path(root) / file
            if is_source_file(file_path):
                ext = file_path.suffix.lower()
                if ext == '':
                    ext = '(无扩展名)'
                
                if ext not in type_stats:
                    type_stats[ext] = {"files": 0, "lines": 0}
                
                line_count = count_lines_in_file(file_path)
                type_stats[ext]["files"] += 1
                type_stats[ext]["lines"] += line_count
    
    # 排序并打印类型统计
    sorted_types = sorted(type_stats.items(), key=lambda x: x[1]["lines"], reverse=True)
    for ext, stats in sorted_types:
        print(f"  {ext}: {stats['files']} 个文件, {stats['lines']} 行")

if __name__ == "__main__":
    main()