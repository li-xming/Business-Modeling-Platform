from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

indicator_bp = Blueprint('indicator', __name__)

@indicator_bp.route('', methods=['GET'])
def get_indicators():
    """获取指标列表"""
    domain_id = request.args.get('domainId')
    model_id = request.args.get('modelId')
    status = request.args.get('status')
    
    conn = get_db_connection()
    try:
        # 构建查询语句
        query = "SELECT * FROM indicators"
        conditions = []
        params = []
        
        if domain_id:
            conditions.append("domainId = ?")
            params.append(int(domain_id))
        
        if status:
            conditions.append("status = ?")
            params.append(status)
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        # 执行查询
        indicators = conn.execute(query, params).fetchall()
        
        # 转换为字典列表
        result = []
        for row in indicators:
            result.append({
                "id": row[0],
                "name": row[1],
                "expression": row[2],
                "returnType": row[3],
                "unit": row[4],
                "description": row[5],
                "status": row[6],
                "domainId": row[7],
                "createdAt": row[8],
                "updatedAt": row[9]
            })
        
        if model_id:
            # 获取该模型绑定的指标ID
            bound_indicator_ids = conn.execute("SELECT indicatorId FROM model_indicators WHERE modelId = ?", (int(model_id),)).fetchall()
            bound_indicator_ids = [row[0] for row in bound_indicator_ids]
            result = [i for i in result if i["id"] in bound_indicator_ids]
        
        return jsonify(result)
    finally:
        conn.close()

@indicator_bp.route('', methods=['POST'])
def create_indicator():
    """新建指标"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM indicators").fetchone()[0]
        
        # 插入新指标
        conn.execute(
            "INSERT INTO indicators (id, name, expression, returnType, unit, description, status, domainId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (next_id, data["name"], data.get("expression", ""), data.get("returnType", "number"), data.get("unit", ""), data.get("description", ""), data.get("status", "draft"), int(data.get("domainId", 3)), get_current_date(), get_current_date())
        )
        
        # 返回新创建的指标
        new_indicator = {
            "id": next_id,
            "name": data["name"],
            "expression": data.get("expression", ""),
            "returnType": data.get("returnType", "number"),
            "unit": data.get("unit", ""),
            "description": data.get("description", ""),
            "status": data.get("status", "draft"),
            "domainId": int(data.get("domainId", 3)),
            "createdAt": get_current_date(),
            "updatedAt": get_current_date()
        }
        return jsonify(new_indicator), 201
    finally:
        conn.close()

@indicator_bp.route('/<int:id>', methods=['PUT'])
def update_indicator(id):
    """更新指标"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 检查指标是否存在
        indicator = conn.execute("SELECT * FROM indicators WHERE id = ?", (id,)).fetchone()
        if not indicator:
            return jsonify({"error": "Indicator not found"}), 404
        
        # 更新指标
        conn.execute(
            "UPDATE indicators SET name = ?, expression = ?, returnType = ?, unit = ?, description = ?, status = ?, updatedAt = ? WHERE id = ?",
            (data.get("name", indicator[1]), data.get("expression", indicator[2]), data.get("returnType", indicator[3]), data.get("unit", indicator[4]), data.get("description", indicator[5]), data.get("status", indicator[6]), get_current_date(), id)
        )
        
        # 返回更新后的指标
        updated_indicator = {
            "id": id,
            "name": data.get("name", indicator[1]),
            "expression": data.get("expression", indicator[2]),
            "returnType": data.get("returnType", indicator[3]),
            "unit": data.get("unit", indicator[4]),
            "description": data.get("description", indicator[5]),
            "status": data.get("status", indicator[6]),
            "domainId": indicator[7],
            "createdAt": indicator[8],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_indicator)
    finally:
        conn.close()

@indicator_bp.route('/<int:id>', methods=['DELETE'])
def delete_indicator(id):
    """删除指标"""
    conn = get_db_connection()
    try:
        # 删除指标
        conn.execute("DELETE FROM indicators WHERE id = ?", (id,))
        # 同时删除模型指标关联
        conn.execute("DELETE FROM model_indicators WHERE indicatorId = ?", (id,))
        return jsonify({"message": "Indicator deleted", "success": True})
    finally:
        conn.close()

@indicator_bp.route('/<int:id>/publish', methods=['PUT'])
def publish_indicator(id):
    """发布指标"""
    conn = get_db_connection()
    try:
        # 检查指标是否存在
        indicator = conn.execute("SELECT * FROM indicators WHERE id = ?", (id,)).fetchone()
        if not indicator:
            return jsonify({"error": "Indicator not found"}), 404
        
        # 更新指标状态为已发布
        conn.execute("UPDATE indicators SET status = ?, updatedAt = ? WHERE id = ?", ("published", get_current_date(), id))
        
        # 返回更新后的指标
        updated_indicator = {
            "id": id,
            "name": indicator[1],
            "expression": indicator[2],
            "returnType": indicator[3],
            "unit": indicator[4],
            "description": indicator[5],
            "status": "published",
            "domainId": indicator[7],
            "createdAt": indicator[8],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_indicator)
    finally:
        conn.close()

@indicator_bp.route('/<int:id>/offline', methods=['PUT'])
def offline_indicator(id):
    """下线指标"""
    conn = get_db_connection()
    try:
        # 检查指标是否存在
        indicator = conn.execute("SELECT * FROM indicators WHERE id = ?", (id,)).fetchone()
        if not indicator:
            return jsonify({"error": "Indicator not found"}), 404
        
        # 更新指标状态为已下线
        conn.execute("UPDATE indicators SET status = ?, updatedAt = ? WHERE id = ?", ("offline", get_current_date(), id))
        
        # 返回更新后的指标
        updated_indicator = {
            "id": id,
            "name": indicator[1],
            "expression": indicator[2],
            "returnType": indicator[3],
            "unit": indicator[4],
            "description": indicator[5],
            "status": "offline",
            "domainId": indicator[7],
            "createdAt": indicator[8],
            "updatedAt": get_current_date()
        }
        return jsonify(updated_indicator)
    finally:
        conn.close()

# 模型-指标绑定接口
@indicator_bp.route('/model/<int:model_id>', methods=['GET'])
def get_model_indicators(model_id):
    """获取模型绑定的指标"""
    conn = get_db_connection()
    try:
        # 获取模型绑定的指标ID
        bound_indicator_ids = conn.execute("SELECT indicatorId FROM model_indicators WHERE modelId = ?", (model_id,)).fetchall()
        bound_indicator_ids = [row[0] for row in bound_indicator_ids]
        
        if not bound_indicator_ids:
            return jsonify([])
        
        # 使用IN子句查询指标详情
        placeholders = ','.join(['?'] * len(bound_indicator_ids))
        indicators = conn.execute(f"SELECT * FROM indicators WHERE id IN ({placeholders})", bound_indicator_ids).fetchall()
        
        # 转换为字典列表
        result = []
        for row in indicators:
            result.append({
                "id": row[0],
                "name": row[1],
                "expression": row[2],
                "returnType": row[3],
                "unit": row[4],
                "description": row[5],
                "status": row[6],
                "domainId": row[7],
                "createdAt": row[8],
                "updatedAt": row[9]
            })
        
        return jsonify(result)
    finally:
        conn.close()

@indicator_bp.route('/model/<int:model_id>/<int:indicator_id>', methods=['POST'])
def bind_indicator(model_id, indicator_id):
    """绑定指标到模型"""
    conn = get_db_connection()
    try:
        # 检查是否已绑定
        existing = conn.execute("SELECT * FROM model_indicators WHERE modelId = ? AND indicatorId = ?", (model_id, indicator_id)).fetchone()
        if existing:
            return jsonify({"error": "Already bound"}), 400
        
        # 绑定指标
        conn.execute("INSERT INTO model_indicators (modelId, indicatorId) VALUES (?, ?)", (model_id, indicator_id))
        return jsonify({"message": "Indicator bound", "success": True}), 201
    finally:
        conn.close()

@indicator_bp.route('/model/<int:model_id>/<int:indicator_id>', methods=['DELETE'])
def unbind_indicator(model_id, indicator_id):
    """解绑指标"""
    conn = get_db_connection()
    try:
        # 解绑指标
        conn.execute("DELETE FROM model_indicators WHERE modelId = ? AND indicatorId = ?", (model_id, indicator_id))
        return jsonify({"message": "Indicator unbound", "success": True})
    finally:
        conn.close()
