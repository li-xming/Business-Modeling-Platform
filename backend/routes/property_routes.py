from flask import Blueprint, jsonify, request
from utils import get_db_connection

property_bp = Blueprint('property', __name__)

@property_bp.route('', methods=['GET'])
def get_properties():
    """获取属性列表"""
    model_id = request.args.get('modelId')
    conn = get_db_connection()
    try:
        if model_id:
            # 查询指定模型的属性
            properties = conn.execute("SELECT * FROM properties WHERE modelId = ?", (int(model_id),)).fetchall()
        else:
            # 查询所有属性
            properties = conn.execute("SELECT * FROM properties").fetchall()
        
        # 将属性转换为字典列表
        property_list = []
        for row in properties:
            # 解析constraints字段，从JSON字符串转换为列表
            constraints = row[9]
            # 检查constraints是否为字符串类型，如果是则解析为JSON
            if isinstance(constraints, str):
                import json
                try:
                    constraints = json.loads(constraints)
                except json.JSONDecodeError:
                    constraints = []
            elif constraints is None:
                constraints = []
            
            property_item = {
                "id": row[0],
                "name": row[1],
                "code": row[2],
                "type": row[3],
                "required": row[4],
                "description": row[5],
                "modelId": row[6],
                "isPrimaryKey": row[7],
                "isForeignKey": row[8],
                "defaultValue": row[9],
                "constraints": constraints,
                "sensitivityLevel": row[11],
                "maskRule": row[12],
                "physicalColumn": row[13]
            }
            # 如果是外键，添加外键表和列信息
            if row[7]:
                property_item["foreignKeyTable"] = row[14]
                property_item["foreignKeyColumn"] = row[15]
            property_list.append(property_item)
        
        return jsonify(property_list)
    finally:
        conn.close()

@property_bp.route('', methods=['POST'])
def create_property():
    """新建属性"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM properties").fetchone()[0]
        
        # 准备constraints字段，转换为JSON字符串
        import json
        constraints = data.get("constraints", [])
        constraints_json = json.dumps(constraints)
        
        # 插入新属性
        conn.execute(
            "INSERT INTO properties (id, name, code, type, required, description, modelId, isPrimaryKey, isForeignKey, defaultValue, constraints, sensitivityLevel, maskRule, physicalColumn, foreignKeyTable, foreignKeyColumn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                next_id, data["name"], data.get("code", data["name"].lower().replace(" ", "_")), data["type"], data["required"],
                data["description"], int(data["modelId"]),
                data.get("isPrimaryKey", False), data.get("isForeignKey", False),
                data.get("defaultValue", None), constraints_json,
                data.get("sensitivityLevel", "public"),
                data.get("maskRule", None),
                data.get("physicalColumn", data["name"].lower().replace(" ", "_")),
                data.get("foreignKeyTable", None),
                data.get("foreignKeyColumn", None)
            )
        )
        
        # 返回新创建的属性
        new_property = {
            "id": next_id,
            "name": data["name"],
            "code": data.get("code", data["name"].lower().replace(" ", "_")),
            "type": data["type"],
            "required": data["required"],
            "description": data["description"],
            "modelId": int(data["modelId"]),
            "isPrimaryKey": data.get("isPrimaryKey", False),
            "isForeignKey": data.get("isForeignKey", False),
            "defaultValue": data.get("defaultValue", None),
            "constraints": constraints,
            "sensitivityLevel": data.get("sensitivityLevel", "public"),
            "maskRule": data.get("maskRule", None),
            "physicalColumn": data.get("physicalColumn", data["name"].lower().replace(" ", "_")),
            "foreignKeyTable": data.get("foreignKeyTable", None),
            "foreignKeyColumn": data.get("foreignKeyColumn", None)
        }
        return jsonify(new_property), 201
    finally:
        conn.close()

@property_bp.route('/<int:id>', methods=['PUT'])
def update_property(id):
    """更新属性"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查属性是否存在
        prop = conn.execute("SELECT * FROM properties WHERE id = ?", (id,)).fetchone()
        if not prop:
            return jsonify({"error": "Property not found"}), 404
        
        import json
        # 转换constraints为JSON字符串
        constraints = json.dumps(data.get("constraints", []))
        
        # 更新属性
        conn.execute(
            "UPDATE properties SET name = ?, code = ?, type = ?, required = ?, description = ?, isPrimaryKey = ?, isForeignKey = ?, defaultValue = ?, constraints = ?, sensitivityLevel = ?, maskRule = ?, physicalColumn = ?, foreignKeyTable = ?, foreignKeyColumn = ? WHERE id = ?",
            (data.get("name", prop[1]), data.get("code", prop[15] if len(prop) > 15 else prop[1].lower().replace(" ", "_")), data.get("type", prop[2]), data.get("required", prop[3]), data.get("description", prop[4]), data.get("isPrimaryKey", prop[6]), data.get("isForeignKey", prop[7]), data.get("defaultValue", prop[8]), constraints, data.get("sensitivityLevel", prop[10]), data.get("maskRule", prop[11]), data.get("physicalColumn", prop[12]), data.get("foreignKeyTable"), data.get("foreignKeyColumn"), id)
        )
        
        # 返回更新后的属性
        updated_prop = {
            "id": id,
            "name": data.get("name", prop[1]),
            "code": data.get("code", prop[15] if len(prop) > 15 else prop[1].lower().replace(" ", "_")),
            "type": data.get("type", prop[2]),
            "required": data.get("required", prop[3]),
            "description": data.get("description", prop[4]),
            "modelId": prop[5],
            "isPrimaryKey": data.get("isPrimaryKey", prop[6]),
            "isForeignKey": data.get("isForeignKey", prop[7]),
            "defaultValue": data.get("defaultValue", prop[8]),
            "constraints": data.get("constraints", []),
            "sensitivityLevel": data.get("sensitivityLevel", prop[10]),
            "maskRule": data.get("maskRule", prop[11]),
            "physicalColumn": data.get("physicalColumn", prop[12]),
            "foreignKeyTable": data.get("foreignKeyTable"),
            "foreignKeyColumn": data.get("foreignKeyColumn")
        }
        return jsonify(updated_prop)
    finally:
        conn.close()

@property_bp.route('/<int:id>', methods=['DELETE'])
def delete_property(id):
    """删除属性"""
    conn = get_db_connection()
    try:
        # 删除属性
        conn.execute("DELETE FROM properties WHERE id = ?", (id,))
        return jsonify({"message": "Property deleted"})
    finally:
        conn.close()
