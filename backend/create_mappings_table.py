import duckdb
import os

# 获取当前脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))

# 定义数据库路径
DB_PATH = os.path.join(script_dir, 'app.data.db')

def create_mappings_table():
    """创建字段映射表"""
    conn = duckdb.connect(DB_PATH)
    try:
        # 创建映射表
        conn.execute("""
        CREATE TABLE IF NOT EXISTS mappings (
            id INTEGER PRIMARY KEY,
            datasourceId INTEGER NOT NULL,
            modelId INTEGER NOT NULL,
            fieldId VARCHAR(100) NOT NULL,
            propertyId INTEGER NOT NULL,
            createdAt DATE,
            updatedAt DATE,
            FOREIGN KEY (datasourceId) REFERENCES datasources(id),
            FOREIGN KEY (modelId) REFERENCES models(id),
            FOREIGN KEY (propertyId) REFERENCES properties(id)
        )
        """)
        print("mappings表创建成功")
    finally:
        conn.close()

if __name__ == "__main__":
    create_mappings_table()