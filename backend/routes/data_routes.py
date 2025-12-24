from flask import Blueprint, jsonify, request

data_bp = Blueprint('data', __name__)

@data_bp.route('', methods=['GET'])
def get_data_records():
    """获取模型数据记录"""
    model_id = request.args.get('modelId')
    if not model_id or not model_id.strip():
        return jsonify([])
    
    try:
        model_id = int(model_id)
    except (ValueError, TypeError):
        return jsonify([])
    
    # 根据模型ID返回对应的模拟数据
    mock_data_by_model = {
        1: [  # 路段业主
            {"id": 1, "owner_id": "OWNER001", "owner_name": "济广高速公路有限公司", "contact_info": "010-12345678"},
            {"id": 2, "owner_id": "OWNER002", "owner_name": "沪宁高速公路管理公司", "contact_info": "021-87654321"},
            {"id": 3, "owner_id": "OWNER003", "owner_name": "广深高速公路股份公司", "contact_info": "020-11223344"},
            {"id": 4, "owner_id": "OWNER004", "owner_name": "京港澳高速公路有限公司", "contact_info": "010-23456789"},
            {"id": 5, "owner_id": "OWNER005", "owner_name": "沪昆高速公路管理公司", "contact_info": "021-34567890"}
        ],
        2: [  # 收费公路
            {"id": 1, "road_id": "ROAD001", "road_name": "济广高速", "owner_id": "OWNER001", "road_level": "高速", "start_mileage": 0, "end_mileage": 1200},
            {"id": 2, "road_id": "ROAD002", "road_name": "沪宁高速", "owner_id": "OWNER002", "road_level": "高速", "start_mileage": 0, "end_mileage": 274},
            {"id": 3, "road_id": "ROAD003", "road_name": "广深高速", "owner_id": "OWNER003", "road_level": "高速", "start_mileage": 0, "end_mileage": 122.8},
            {"id": 4, "road_id": "ROAD004", "road_name": "京港澳高速", "owner_id": "OWNER004", "road_level": "高速", "start_mileage": 0, "end_mileage": 2285},
            {"id": 5, "road_id": "ROAD005", "road_name": "沪昆高速", "owner_id": "OWNER005", "road_level": "高速", "start_mileage": 0, "end_mileage": 2730}
        ],
        3: [  # 收费站
            {"id": 1, "station_id": "STATION001", "station_name": "济南收费站", "road_id": "ROAD001", "station_type": "主线站"},
            {"id": 2, "station_id": "STATION002", "station_name": "泰安收费站", "road_id": "ROAD001", "station_type": "主线站"},
            {"id": 3, "station_id": "STATION003", "station_name": "枣庄收费站", "road_id": "ROAD002", "station_type": "主线站"},
            {"id": 4, "station_id": "STATION004", "station_name": "菏泽收费站", "road_id": "ROAD001", "station_type": "匝道站"},
            {"id": 5, "station_id": "STATION005", "station_name": "济宁收费站", "road_id": "ROAD002", "station_type": "主线站"},
            {"id": 6, "station_id": "STATION006", "station_name": "兖州收费站", "road_id": "ROAD002", "station_type": "匝道站"},
            {"id": 7, "station_id": "STATION007", "station_name": "聊城收费站", "road_id": "ROAD003", "station_type": "主线站"},
            {"id": 8, "station_id": "STATION008", "station_name": "德州收费站", "road_id": "ROAD003", "station_type": "主线站"}
        ],
        4: [  # ETC门架
            {"id": 1, "gantry_id": "GANTRY001", "gantry_name": "济广高速K100门架", "road_id": "ROAD001", "gantry_location": "K100+500", "gantry_status": "正常"}
        ]
    }
    
    # 返回对应模型的模拟数据，如果没有则返回空列表
    return jsonify(mock_data_by_model.get(model_id, []))
