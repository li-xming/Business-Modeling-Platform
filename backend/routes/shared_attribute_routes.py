from flask import Blueprint, jsonify, request
from utils import get_db_connection

shared_attribute_bp = Blueprint('shared_attribute', __name__)

@shared_attribute_bp.route('', methods=['GET'])
def get_shared_attributes():
    """获取共享属性列表"""
    domain_id = request.args.get('domainId')
    conn = get_db_connection()
    try:
        if domain_id:
            # 查询指定域的共享属性
            attributes = conn.execute("SELECT * FROM shared_attributes WHERE domainId = ?", (int(domain_id),)).fetchall()
        else:
            # 查询所有共享属性
            attributes = conn.execute("SELECT * FROM shared_attributes").fetchall()
        
        # 将查询结果转换为字典列表
        attr_list = [{
            "id": row[0],
            "name": row[1],
            "type": row[2],
            "length": row[3],
            "precision": row[4],
            "description": row[5],
            "valueRange": row[6],
            "domainId": row[7],
            "referenceCount": row[8]
        } for row in attributes]
        
        return jsonify(attr_list)
    finally:
        conn.close()

@shared_attribute_bp.route('', methods=['POST'])
def create_shared_attribute():
    """新建共享属性"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM shared_attributes").fetchone()[0]
        
        # 插入新共享属性
        conn.execute(
            "INSERT INTO shared_attributes (id, name, type, length, precision, description, valueRange, domainId, referenceCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (next_id, data["name"], data.get("type", "string"), data.get("length"), data.get("precision"), data.get("description", ""), data.get("valueRange"), int(data.get("domainId", 3)), 0)
        )
        
        # 返回新创建的共享属性
        new_attr = {
            "id": next_id,
            "name": data["name"],
            "type": data.get("type", "string"),
            "length": data.get("length"),
            "precision": data.get("precision"),
            "description": data.get("description", ""),
            "valueRange": data.get("valueRange"),
            "domainId": int(data.get("domainId", 3)),
            "referenceCount": 0
        }
        return jsonify(new_attr), 201
    finally:
        conn.close()

@shared_attribute_bp.route('/<int:id>', methods=['PUT'])
def update_shared_attribute(id):
    """更新共享属性"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查共享属性是否存在
        attr = conn.execute("SELECT * FROM shared_attributes WHERE id = ?", (id,)).fetchone()
        if not attr:
            return jsonify({"error": "Shared attribute not found"}), 404
        
        # 更新共享属性
        conn.execute(
            "UPDATE shared_attributes SET name = ?, type = ?, length = ?, precision = ?, description = ?, valueRange = ? WHERE id = ?",
            (data.get("name", attr[1]), data.get("type", attr[2]), data.get("length", attr[3]), data.get("precision", attr[4]), data.get("description", attr[5]), data.get("valueRange", attr[6]), id)
        )
        
        # 返回更新后的共享属性
        updated_attr = {
            "id": id,
            "name": data.get("name", attr[1]),
            "type": data.get("type", attr[2]),
            "length": data.get("length", attr[3]),
            "precision": data.get("precision", attr[4]),
            "description": data.get("description", attr[5]),
            "valueRange": data.get("valueRange", attr[6]),
            "domainId": attr[7],
            "referenceCount": attr[8]
        }
        return jsonify(updated_attr)
    finally:
        conn.close()

@shared_attribute_bp.route('/<int:id>', methods=['DELETE'])
def delete_shared_attribute(id):
    """删除共享属性"""
    conn = get_db_connection()
    try:
        # 删除共享属性
        conn.execute("DELETE FROM shared_attributes WHERE id = ?", (id,))
        return jsonify({"message": "Shared attribute deleted", "success": True})
    finally:
        conn.close()
