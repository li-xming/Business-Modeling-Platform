from datetime import datetime
import os
import duckdb

# 获取当前脚本所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))

# 定义数据库路径
DB_PATH = os.path.join(script_dir, 'app.data.db')

# 获取数据库连接
def get_db_connection():
    conn = duckdb.connect(DB_PATH)
    return conn

# 获取当前日期
def get_current_date():
    return datetime.now().strftime("%Y-%m-%d")

# 获取下一个ID
def get_next_id(data_list):
    if not data_list:
        return 1
    return max(item["id"] for item in data_list) + 1

# 根据ID获取模型名称
def get_model_name_by_id(model_id, mock_data):
    for model in mock_data["models"]:
        if model["id"] == model_id:
            return model["name"]
    return None

# 根据名称获取模型ID
def get_model_id_by_name(model_name, mock_data):
    for model in mock_data["models"]:
        if model["name"] == model_name:
            return model["id"]
    return None
