from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

action_type_bp = Blueprint('action_type', __name__)

@action_type_bp.route('', methods=['GET'])
def get_action_types():
    """获取操作类型列表"""
    target_object_type_id = request.args.get('targetObjectTypeId')
    conn = get_db_connection()
    try:
        if target_object_type_id:
            # 查询指定目标对象类型的操作类型
            action_types = conn.execute("SELECT * FROM action_types WHERE targetObjectTypeId = ?", (int(target_object_type_id),)).fetchall()
        else:
            # 查询所有操作类型
            action_types = conn.execute("SELECT * FROM action_types").fetchall()
        
        # 转换为字典列表
        result = []
        for row in action_types:
            import json
            # 解析JSON字符串
            inputSchema = json.loads(row[5]) if row[5] else {}
            outputSchema = json.loads(row[6]) if row[6] else {}
            
            result.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "targetObjectTypeId": row[3],
                "inputSchema": inputSchema,
                "outputSchema": outputSchema,
                "requiresApproval": row[7],
                "handlerFunction": row[8],
                "createdAt": row[9],
                "updatedAt": row[10]
            })
        
        return jsonify(result)
    finally:
        conn.close()

@action_type_bp.route('', methods=['POST'])
def create_action_type():
    """新建操作类型"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM action_types").fetchone()[0]
        
        import json
        # 转换为JSON字符串
        inputSchema = json.dumps(data.get("inputSchema", {}))
        outputSchema = json.dumps(data.get("outputSchema", {}))
        
        # 插入新操作类型
        conn.execute(
            "INSERT INTO action_types (id, name, description, targetObjectTypeId, inputSchema, outputSchema, requiresApproval, handlerFunction, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (next_id, data["name"], data.get("description", ""), int(data["targetObjectTypeId"]), inputSchema, outputSchema, data.get("requiresApproval", False), data.get("handlerFunction", ""), get_current_date(), get_current_date())
        )
        
        # 返回新创建的操作类型
        new_action_type = {
            "id": next_id,
            "name": data["name"],
            "description": data.get("description", ""),
            "targetObjectTypeId": int(data["targetObjectTypeId"]),
            "inputSchema": data.get("inputSchema", {}),
            "outputSchema": data.get("outputSchema", {}),
            "requiresApproval": data.get("requiresApproval", False),
            "handlerFunction": data.get("handlerFunction", ""),
            "createdAt": get_current_date(),
            "updatedAt": get_current_date()
        }
        return jsonify(new_action_type), 201
    finally:
        conn.close()

@action_type_bp.route('/<int:id>', methods=['PUT'])
def update_action_type(id):
    """更新操作类型"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查操作类型是否存在
        action_type = conn.execute("SELECT * FROM action_types WHERE id = ?", (id,)).fetchone()
        if not action_type:
            return jsonify({"error": "Action type not found"}), 404
        
        import json
        # 转换为JSON字符串
        inputSchema = json.dumps(data.get("inputSchema", {}))
        outputSchema = json.dumps(data.get("outputSchema", {}))
        
        # 更新操作类型
        conn.execute(
            "UPDATE action_types SET name = ?, description = ?, targetObjectTypeId = ?, inputSchema = ?, outputSchema = ?, requiresApproval = ?, handlerFunction = ?, updatedAt = ? WHERE id = ?",
            (data.get("name", action_type[1]), data.get("description", action_type[2]), data.get("targetObjectTypeId", action_type[3]), inputSchema, outputSchema, data.get("requiresApproval", action_type[7]), data.get("handlerFunction", action_type[8]), get_current_date(), id)
        )
        
        # 返回更新后的操作类型
        updated_action_type = {
            "id": id,
            "name": data.get("name", action_type[1]),
            "description": data.get("description", action_type[2]),
            "targetObjectTypeId": data.get("targetObjectTypeId", action_type[3]),
            "inputSchema": data.get("inputSchema", {}),
            "outputSchema": data.get("outputSchema", {}),
            "requiresApproval": data.get("requiresApproval", action_type[7]),
            "handlerFunction": data.get("handlerFunction", action_type[8]),
            "createdAt": action_type[9],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_action_type)
    finally:
        conn.close()

@action_type_bp.route('/<int:id>', methods=['DELETE'])
def delete_action_type(id):
    """删除操作类型"""
    conn = get_db_connection()
    try:
        # 删除操作类型
        conn.execute("DELETE FROM action_types WHERE id = ?", (id,))
        return jsonify({"message": "Action type deleted", "success": True})
    finally:
        conn.close()

@action_type_bp.route('/<int:id>/execute', methods=['POST'])
def execute_action_type(id):
    """执行操作类型"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 查找操作类型
        action_type = conn.execute("SELECT * FROM action_types WHERE id = ?", (id,)).fetchone()
        if not action_type:
            return jsonify({"error": "Action type not found"}), 404
        
        # 查找对应的函数
        func = conn.execute("SELECT * FROM functions WHERE name = ?", (action_type[8],)).fetchone()
        if not func:
            return jsonify({"error": "Handler function not found"}), 404
        
        # 这里可以添加实际的函数执行逻辑
        # 目前只是返回模拟结果
        result = {
            "success": True,
            "message": f"Executed action type: {action_type[1]}",
            "data": {
                "actionTypeId": id,
                "actionName": action_type[1],
                "input": data,
                "output": {"status": "completed"}
            }
        }
        
        return jsonify(result)
    finally:
        conn.close()
