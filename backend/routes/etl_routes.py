from flask import Blueprint, jsonify, request
from utils import get_db_connection, get_current_date

# 创建蓝图
etl_bp = Blueprint('etl', __name__)

# 模拟数据源表结构数据
schema_data = {
    "t_toll_station": [
        { "name": "station_id", "type": "varchar(100)", "nullable": False },
        { "name": "station_name", "type": "varchar(255)", "nullable": False },
        { "name": "road_id", "type": "varchar(100)", "nullable": False },
        { "name": "station_type", "type": "varchar(50)", "nullable": False },
        { "name": "create_date", "type": "datetime", "nullable": False },
        { "name": "update_time", "type": "datetime", "nullable": False },
        { "name": "status", "type": "varchar(20)", "nullable": False }
    ],
    "t_road_owner": [
        { "name": "owner_id", "type": "varchar(100)", "nullable": False },
        { "name": "owner_name", "type": "varchar(255)", "nullable": False },
        { "name": "contact_info", "type": "varchar(255)", "nullable": True },
        { "name": "create_time", "type": "datetime", "nullable": False },
        { "name": "update_time", "type": "datetime", "nullable": False }
    ]
}

# 模拟字段映射数据
mapping_data = {
    "t_toll_station": [
        { "sourceField": "station_id", "targetProperty": "收费站ID" },
        { "sourceField": "station_name", "targetProperty": "收费站名称" },
        { "sourceField": "road_id", "targetProperty": "所属公路" },
        { "sourceField": "station_type", "targetProperty": "收费站类型" },
        { "sourceField": "update_time", "targetProperty": "更新时间" }
    ]
}

@etl_bp.route('/tasks', methods=['GET'])
def get_etl_tasks():
    """获取ETL任务列表"""
    conn = get_db_connection()
    try:
        tasks = conn.execute("SELECT * FROM etl_tasks").fetchall()
        
        result = []
        for task in tasks:
            result.append({
                "id": task[0],
                "name": task[1],
                "description": task[2],
                "sourceDatasourceId": task[3],
                "targetModelId": task[4],
                "status": task[5],
                "schedule": task[6],
                "config": task[7],
                "createdAt": task[8],
                "updatedAt": task[9],
                "lastRun": task[10],
                "nextRun": task[11]
            })
        
        return jsonify(result)
    finally:
        conn.close()

@etl_bp.route('/tasks', methods=['POST'])
def create_etl_task():
    """创建ETL任务"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        # 获取下一个ID
        next_id = conn.execute("SELECT COALESCE(MAX(id), 0) + 1 FROM etl_tasks").fetchone()[0]
        
        # 插入新任务
        conn.execute(
            "INSERT INTO etl_tasks (id, name, description, sourceDatasourceId, targetModelId, status, schedule, config, createdAt, updatedAt, lastRun, nextRun) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                next_id,
                data.get("name"),
                data.get("description"),
                data.get("sourceDatasourceId"),
                data.get("targetModelId"),
                data.get("status", "inactive"),
                data.get("schedule", "0 */1 * * *"),
                str(data.get("config", {})),
                get_current_date(),
                get_current_date(),
                None,
                None
            )
        )
        conn.commit()
        
        return jsonify({"id": next_id, "message": "ETL任务创建成功"}), 201
    finally:
        conn.close()

@etl_bp.route('/tasks/<int:id>', methods=['PUT'])
def update_etl_task(id):
    """更新ETL任务"""
    data = request.get_json()
    conn = get_db_connection()
    try:
        conn.execute(
            "UPDATE etl_tasks SET name = ?, description = ?, sourceDatasourceId = ?, targetModelId = ?, status = ?, schedule = ?, config = ?, updatedAt = ? WHERE id = ?",
            (
                data.get("name"),
                data.get("description"),
                data.get("sourceDatasourceId"),
                data.get("targetModelId"),
                data.get("status"),
                data.get("schedule"),
                str(data.get("config")),
                get_current_date(),
                id
            )
        )
        conn.commit()
        
        return jsonify({"message": "ETL任务更新成功"})
    finally:
        conn.close()

@etl_bp.route('/tasks/<int:id>', methods=['DELETE'])
def delete_etl_task(id):
    """删除ETL任务"""
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM etl_tasks WHERE id = ?", (id,))
        conn.commit()
        
        return jsonify({"message": "ETL任务删除成功"})
    finally:
        conn.close()

@etl_bp.route('/tasks/<int:id>/execute', methods=['POST'])
def execute_etl_task(id):
    """执行ETL任务"""
    conn = get_db_connection()
    try:
        # 模拟执行，实际项目中应该调用ETL引擎
        conn.execute("UPDATE etl_tasks SET status = ?, lastRun = ? WHERE id = ?", ("running", get_current_date(), id))
        conn.commit()
        
        # 模拟执行完成
        conn.execute("UPDATE etl_tasks SET status = ?, lastRun = ? WHERE id = ?", ("active", get_current_date(), id))
        conn.commit()
        
        return jsonify({"message": "ETL任务执行成功"})
    finally:
        conn.close()

@etl_bp.route('/tasks/<int:id>/toggle', methods=['PUT'])
def toggle_etl_task(id):
    """启用/禁用ETL任务"""
    conn = get_db_connection()
    try:
        task = conn.execute("SELECT status FROM etl_tasks WHERE id = ?", (id,)).fetchone()
        if not task:
            return jsonify({"error": "ETL任务不存在"}), 404
        
        new_status = "active" if task[0] == "inactive" else "inactive"
        conn.execute("UPDATE etl_tasks SET status = ? WHERE id = ?", (new_status, id))
        conn.commit()
        
        return jsonify({"message": f"ETL任务已{'启用' if new_status == 'active' else '禁用'}"})
    finally:
        conn.close()

@etl_bp.route('/logs', methods=['GET'])
def get_etl_logs():
    """获取ETL执行日志"""
    task_id = request.args.get('taskId')
    conn = get_db_connection()
    try:
        if task_id and task_id.strip():
            logs = conn.execute("SELECT * FROM etl_logs WHERE taskId = ?", (int(task_id),)).fetchall()
        else:
            logs = conn.execute("SELECT * FROM etl_logs").fetchall()
        
        result = []
        for log in logs:
            result.append({
                "id": log[0],
                "taskId": log[1],
                "status": log[2],
                "startTime": log[3],
                "endTime": log[4],
                "recordsProcessed": log[5],
                "recordsSuccess": log[6],
                "recordsFailed": log[7],
                "errorMessage": log[8],
                "details": log[9]
            })
        
        return jsonify(result)
    finally:
        conn.close()

@etl_bp.route('/generate-table-definition', methods=['POST'])
def generate_table_definition():
    """根据模型生成表定义"""
    data = request.get_json()
    model_id = data.get('modelId')
    
    if not model_id:
        return jsonify({"error": "modelId is required"}), 400
    
    conn = get_db_connection()
    try:
        # 获取模型信息
        model = conn.execute("SELECT name, code FROM models WHERE id = ?", (model_id,)).fetchone()
        if not model:
            return jsonify({"error": "Model not found"}), 404
        
        # 获取模型属性
        properties = conn.execute("SELECT * FROM properties WHERE modelId = ?", (model_id,)).fetchall()
        
        # 生成表定义
        table_definition = {
            "tableName": model[1] if model[1] else model[0].lower().replace(' ', '_'),
            "columns": [
                {
                    "name": prop[10] if prop[10] else prop[1].lower().replace(' ', '_'),
                    "type": prop[3],
                    "required": prop[4],
                    "constraints": ["NOT NULL"] if prop[4] else [],
                    "isPrimaryKey": prop[7],
                    "isForeignKey": prop[8]
                } for prop in properties
            ]
        }
        
        return jsonify(table_definition)
    finally:
        conn.close()

@etl_bp.route('/datasource/<int:datasource_id>/tables/<table_name>/schema', methods=['GET'])
def get_table_schema(datasource_id, table_name):
    """获取数据源表结构"""
    # 模拟返回表结构，实际项目中应该根据数据源类型和连接信息查询真实表结构
    schema = schema_data.get(table_name, [
        { "name": "id", "type": "int" },
        { "name": "name", "type": "varchar(255)" },
        { "name": "create_time", "type": "datetime" },
        { "name": "update_time", "type": "datetime" },
        { "name": "status", "type": "varchar(20)" }
    ])
    
    return jsonify(schema)

@etl_bp.route('/datasource/<int:datasource_id>/mappings', methods=['GET'])
def get_datasource_mappings(datasource_id):
    """获取数据源字段映射"""
    table_name = request.args.get('tableName')
    if not table_name:
        return jsonify({"error": "tableName is required"}), 400
    
    # 模拟返回映射关系，实际项目中应该从数据库查询
    mappings = mapping_data.get(table_name, [])
    
    return jsonify(mappings)

# 注册蓝图函数
def register_blueprint(app):
    app.register_blueprint(etl_bp, url_prefix='/api/etl')
