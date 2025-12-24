from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

function_bp = Blueprint('function', __name__)

@function_bp.route('', methods=['GET'])
def get_functions():
    """获取函数列表"""
    domain_id = request.args.get('domainId')
    conn = get_db_connection()
    try:
        if domain_id:
            # 查询指定域的函数
            functions = conn.execute("SELECT * FROM functions WHERE domainId = ?", (int(domain_id),)).fetchall()
        else:
            # 查询所有函数
            functions = conn.execute("SELECT * FROM functions").fetchall()
        
        # 转换为字典列表
        result = []
        for row in functions:
            import json
            # 解析JSON字符串，添加异常处理
            try:
                inputSchema = json.loads(row[4]) if row[4] else {}
            except json.JSONDecodeError:
                inputSchema = {}
            
            try:
                metadata = json.loads(row[7]) if row[7] else {}
            except json.JSONDecodeError:
                metadata = {}
            
            result.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "code": row[3],
                "inputSchema": inputSchema,
                "returnType": row[5],
                "version": row[6],
                "metadata": metadata,
                "domainId": row[8],
                "createdAt": row[9],
                "updatedAt": row[10]
            })
        
        return jsonify(result)
    finally:
        conn.close()

@function_bp.route('', methods=['POST'])
def create_function():
    """新建函数"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM functions").fetchone()[0]
        
        import json
        # 转换为JSON字符串
        inputSchema = json.dumps(data.get("inputSchema", {}))
        metadata = json.dumps(data.get("metadata", {}))
        
        # 插入新函数
        conn.execute(
            "INSERT INTO functions (id, name, description, code, inputSchema, returnType, version, metadata, domainId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (next_id, data["name"], data.get("description", ""), data.get("code", ""), inputSchema, data.get("returnType", "object"), data.get("version", "1.0.0"), metadata, int(data.get("domainId", 3)), get_current_date(), get_current_date())
        )
        
        # 返回新创建的函数
        new_func = {
            "id": next_id,
            "name": data["name"],
            "description": data.get("description", ""),
            "code": data.get("code", ""),
            "inputSchema": data.get("inputSchema", {}),
            "returnType": data.get("returnType", "object"),
            "version": data.get("version", "1.0.0"),
            "metadata": data.get("metadata", {}),
            "domainId": int(data.get("domainId", 3)),
            "createdAt": get_current_date(),
            "updatedAt": get_current_date()
        }
        return jsonify(new_func), 201
    finally:
        conn.close()

@function_bp.route('/<int:id>', methods=['PUT'])
def update_function(id):
    """更新函数"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查函数是否存在
        func = conn.execute("SELECT * FROM functions WHERE id = ?", (id,)).fetchone()
        if not func:
            return jsonify({"error": "Function not found"}), 404
        
        import json
        # 转换为JSON字符串
        inputSchema = json.dumps(data.get("inputSchema", {}))
        metadata = json.dumps(data.get("metadata", {}))
        
        # 更新函数
        conn.execute(
            "UPDATE functions SET name = ?, description = ?, code = ?, inputSchema = ?, returnType = ?, version = ?, metadata = ?, updatedAt = ? WHERE id = ?",
            (data.get("name", func[1]), data.get("description", func[2]), data.get("code", func[3]), inputSchema, data.get("returnType", func[6]), data.get("version", func[8]), metadata, get_current_date(), id)
        )
        
        # 返回更新后的函数
        updated_func = {
            "id": id,
            "name": data.get("name", func[1]),
            "description": data.get("description", func[2]),
            "code": data.get("code", func[3]),
            "inputSchema": data.get("inputSchema", {}),
            "returnType": data.get("returnType", func[6]),
            "version": data.get("version", func[8]),
            "metadata": data.get("metadata", {}),
            "domainId": func[9],
            "createdAt": func[10],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_func)
    finally:
        conn.close()

@function_bp.route('/<int:id>', methods=['DELETE'])
def delete_function(id):
    """删除函数"""
    conn = get_db_connection()
    try:
        # 检查函数是否存在
        func = conn.execute("SELECT * FROM functions WHERE id = ?", (id,)).fetchone()
        if not func:
            return jsonify({"error": "Function not found"}), 404
        
        # 检查是否有ActionType引用该函数
        func_name = func[1]
        referenced = conn.execute("SELECT COUNT(*) FROM action_types WHERE handlerFunction = ?", (func_name,)).fetchone()[0] > 0
        if referenced:
            return jsonify({"error": "Cannot delete function, it is referenced by action type(s)"}), 400
        
        # 删除函数
        conn.execute("DELETE FROM functions WHERE id = ?", (id,))
        return jsonify({"message": "Function deleted", "success": True})
    finally:
        conn.close()
