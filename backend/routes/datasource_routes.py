from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

datasource_bp = Blueprint('datasource', __name__)

@datasource_bp.route('', methods=['GET'])
def get_datasources():
    """获取数据源列表"""
    model_id = request.args.get('modelId')
    conn = get_db_connection()
    try:
        if model_id and model_id.strip():
            try:
                model_id_int = int(model_id)
                # 查询指定模型的数据源
                datasources = conn.execute("SELECT * FROM datasources WHERE modelId = ?", (model_id_int,)).fetchall()
            except (ValueError, TypeError) as e:
                # 如果modelId不是有效整数，返回所有数据源
                datasources = conn.execute("SELECT * FROM datasources").fetchall()
        else:
            # 返回所有数据源
            datasources = conn.execute("SELECT * FROM datasources").fetchall()
        
        # 转换为字典列表
        result = []
        for row in datasources:
            result.append({
                "id": row[0],
                "name": row[1],
                "type": row[2],
                "url": row[3],
                "tableName": row[4],
                "status": row[5],
                "description": row[6],
                "modelId": row[7],
                "createdAt": row[8],
                "updatedAt": row[9]
            })
        
        return jsonify(result)
    finally:
        conn.close()

@datasource_bp.route('', methods=['POST'])
def create_datasource():
    """新建数据源"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM datasources").fetchone()[0]
        
        # 插入新数据源
        conn.execute(
            "INSERT INTO datasources (id, name, type, url, tableName, status, description, modelId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (next_id, data["name"], data.get("type", "mysql"), data.get("url", ""), data.get("tableName", ""), data.get("status", "inactive"), data.get("description", ""), int(data.get("modelId", 0)), get_current_date(), get_current_date())
        )
        
        # 返回新创建的数据源
        new_datasource = {
            "id": next_id,
            "name": data["name"],
            "type": data.get("type", "mysql"),
            "url": data.get("url", ""),
            "tableName": data.get("tableName", ""),
            "status": data.get("status", "inactive"),
            "description": data.get("description", ""),
            "modelId": int(data.get("modelId", 0)),
            "createdAt": get_current_date(),
            "updatedAt": get_current_date()
        }
        return jsonify(new_datasource), 201
    finally:
        conn.close()

@datasource_bp.route('/<int:id>', methods=['PUT'])
def update_datasource(id):
    """更新数据源"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查数据源是否存在
        datasource = conn.execute("SELECT * FROM datasources WHERE id = ?", (id,)).fetchone()
        if not datasource:
            return jsonify({"error": "Datasource not found"}), 404
        
        # 更新数据源
        conn.execute(
            "UPDATE datasources SET name = ?, type = ?, url = ?, tableName = ?, status = ?, description = ?, modelId = ?, updatedAt = ? WHERE id = ?",
            (data.get("name", datasource[1]), data.get("type", datasource[2]), data.get("url", datasource[3]), data.get("tableName", datasource[4]), data.get("status", datasource[5]), data.get("description", datasource[6]), int(data.get("modelId", datasource[7])), get_current_date(), id)
        )
        
        # 返回更新后的数据源
        updated_datasource = {
            "id": id,
            "name": data.get("name", datasource[1]),
            "type": data.get("type", datasource[2]),
            "url": data.get("url", datasource[3]),
            "tableName": data.get("tableName", datasource[4]),
            "status": data.get("status", datasource[5]),
            "description": data.get("description", datasource[6]),
            "modelId": int(data.get("modelId", datasource[7])),
            "createdAt": datasource[8],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_datasource)
    finally:
        conn.close()

@datasource_bp.route('/<int:id>', methods=['DELETE'])
def delete_datasource(id):
    """删除数据源"""
    conn = get_db_connection()
    try:
        # 删除数据源
        conn.execute("DELETE FROM datasources WHERE id = ?", (id,))
        return jsonify({"message": "Datasource deleted", "success": True})
    finally:
        conn.close()

@datasource_bp.route('/<int:id>/toggle', methods=['PUT'])
def toggle_datasource(id):
    """启用/禁用数据源"""
    conn = get_db_connection()
    try:
        # 检查数据源是否存在
        datasource = conn.execute("SELECT * FROM datasources WHERE id = ?", (id,)).fetchone()
        if not datasource:
            return jsonify({"error": "Datasource not found"}), 404
        
        # 切换状态
        new_status = "active" if datasource[5] == "inactive" else "inactive"
        conn.execute("UPDATE datasources SET status = ?, updatedAt = ? WHERE id = ?", (new_status, get_current_date(), id))
        
        # 返回更新后的数据源
        updated_datasource = {
            "id": id,
            "name": datasource[1],
            "type": datasource[2],
            "url": datasource[3],
            "tableName": datasource[4],
            "status": new_status,
            "description": datasource[6],
            "modelId": datasource[7],
            "createdAt": datasource[8],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_datasource)
    finally:
        conn.close()
