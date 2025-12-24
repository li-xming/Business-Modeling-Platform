from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

domain_bp = Blueprint('domain', __name__)

@domain_bp.route('/list', methods=['GET'])
def get_domain_list():
    """获取域列表和边"""
    conn = get_db_connection()
    try:
        # 查询域列表
        domains = conn.execute("SELECT * FROM domains").fetchall()
        # 将查询结果转换为字典列表
        domain_list = [{
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "owner": row[3],
            "updatedAt": row[4]
        } for row in domains]
        
        # 查询域边
        edges = conn.execute("SELECT * FROM domain_edges").fetchall()
        # 将查询结果转换为字典列表
        edge_list = [{
            "source": row[0],
            "target": row[1]
        } for row in edges]
        
        return jsonify({
            "domains": domain_list,
            "edges": edge_list
        })
    finally:
        conn.close()

@domain_bp.route('', methods=['POST'])
def create_domain():
    """新建域"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM domains").fetchone()[0]
        
        # 插入新域
        conn.execute(
            "INSERT INTO domains (id, name, description, owner, updatedAt) VALUES (?, ?, ?, ?, ?)",
            (next_id, data["name"], data["description"], data["owner"], get_current_date())
        )
        
        # 返回新创建的域
        new_domain = {
            "id": next_id,
            "name": data["name"],
            "description": data["description"],
            "owner": data["owner"],
            "updatedAt": get_current_date()
        }
        return jsonify(new_domain), 201
    finally:
        conn.close()

@domain_bp.route('/<int:id>', methods=['PUT'])
def update_domain(id):
    """更新域"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查域是否存在
        domain = conn.execute("SELECT * FROM domains WHERE id = ?", (id,)).fetchone()
        if not domain:
            return jsonify({"error": "Domain not found"}), 404
        
        # 更新域
        conn.execute(
            "UPDATE domains SET name = ?, description = ?, owner = ?, updatedAt = ? WHERE id = ?",
            (data["name"], data["description"], data["owner"], get_current_date(), id)
        )
        
        # 返回更新后的域
        updated_domain = {
            "id": id,
            "name": data["name"],
            "description": data["description"],
            "owner": data["owner"],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_domain)
    finally:
        conn.close()

@domain_bp.route('/<int:id>', methods=['DELETE'])
def delete_domain(id):
    """删除域"""
    conn = get_db_connection()
    try:
        # 删除域
        conn.execute("DELETE FROM domains WHERE id = ?", (id,))
        # 删除相关的域边
        conn.execute("DELETE FROM domain_edges WHERE source = ? OR target = ?", (id, id))
        return jsonify({"message": "Domain deleted"})
    finally:
        conn.close()
