from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

model_bp = Blueprint('model', __name__)

@model_bp.route('', methods=['GET'])
def get_models():
    """获取模型列表"""
    domain_id = request.args.get('domainId')
    conn = get_db_connection()
    try:
        if domain_id:
            # 查询指定域下的模型
            models = conn.execute("SELECT * FROM models WHERE domainId = ?", (int(domain_id),)).fetchall()
        else:
            # 查询所有模型
            models = conn.execute("SELECT * FROM models").fetchall()
        
        # 将模型转换为字典列表
        model_list = [{
            "id": row[0],
            "name": row[1],
            "code": row[2],
            "description": row[3],
            "creator": row[4],
            "updatedAt": row[5],
            "domainId": row[6]
        } for row in models]
        
        # 获取模型ID列表
        model_ids = [model["id"] for model in model_list]
        
        # 查询相关的模型边
        if model_ids:
            # 使用IN子句查询相关边
            placeholders = ','.join(['?'] * len(model_ids))
            edges = conn.execute(f"SELECT * FROM model_edges WHERE source IN ({placeholders}) AND target IN ({placeholders})", model_ids * 2).fetchall()
        else:
            edges = []
        
        # 将边转换为字典列表
        edge_list = [{
            "source": row[0],
            "target": row[1]
        } for row in edges]
        
        return jsonify({
            "models": model_list,
            "edges": edge_list
        })
    finally:
        conn.close()

@model_bp.route('', methods=['POST'])
def create_model():
    """新建模型"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM models").fetchone()[0]
        
        # 插入新模型
        conn.execute(
            "INSERT INTO models (id, name, code, description, creator, updatedAt, domainId) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (next_id, data["name"], data["code"], data["description"], "当前用户", get_current_date(), int(data["domainId"]))
        )
        
        # 返回新创建的模型
        new_model = {
            "id": next_id,
            "name": data["name"],
            "code": data["code"],
            "description": data["description"],
            "creator": "当前用户",
            "updatedAt": get_current_date(),
            "domainId": int(data["domainId"])
        }
        return jsonify(new_model), 201
    finally:
        conn.close()

@model_bp.route('/<int:id>', methods=['PUT'])
def update_model(id):
    """更新模型"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查模型是否存在
        model = conn.execute("SELECT * FROM models WHERE id = ?", (id,)).fetchone()
        if not model:
            return jsonify({"error": "Model not found"}), 404
        
        # 更新模型
        conn.execute(
            "UPDATE models SET name = ?, code = ?, description = ?, updatedAt = ? WHERE id = ?",
            (data["name"], data["code"], data["description"], get_current_date(), id)
        )
        
        # 返回更新后的模型
        updated_model = {
            "id": id,
            "name": data["name"],
            "code": data["code"],
            "description": data["description"],
            "creator": model[3],
            "updatedAt": get_current_date(),
            "domainId": model[5]
        }
        return jsonify(updated_model)
    finally:
        conn.close()

@model_bp.route('/<int:id>', methods=['DELETE'])
def delete_model(id):
    """删除模型"""
    conn = get_db_connection()
    try:
        # 删除模型
        conn.execute("DELETE FROM models WHERE id = ?", (id,))
        # 删除相关的模型边
        conn.execute("DELETE FROM model_edges WHERE source = ? OR target = ?", (id, id))
        # 删除相关的属性
        conn.execute("DELETE FROM properties WHERE modelId = ?", (id,))
        return jsonify({"message": "Model deleted"})
    finally:
        conn.close()
