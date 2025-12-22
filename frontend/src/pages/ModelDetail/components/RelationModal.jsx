import React, { useState } from 'react';

const RelationModal = ({ 
  isRelationModalOpen, 
  editingRelation, 
  newRelation, 
  setNewRelation, 
  setIsRelationModalOpen, 
  setEditingRelation,
  allModels,
  handleSaveRelation
}) => {
  if (!isRelationModalOpen) return null;

  // 目标模型搜索状态
  const [targetModelSearchTerm, setTargetModelSearchTerm] = useState('');
  const [targetModelSuggestions, setTargetModelSuggestions] = useState([]);
  const [showTargetSuggestions, setShowTargetSuggestions] = useState(false);
  
  // 关系类型搜索状态
  const [relationNameSearchTerm, setRelationNameSearchTerm] = useState('');
  const [relationNameSuggestions, setRelationNameSuggestions] = useState([]);
  const [showRelationNameSuggestions, setShowRelationNameSuggestions] = useState(false);

  // 目标模型搜索处理函数
  const handleTargetModelChange = (e) => {
    const term = e.target.value;
    setTargetModelSearchTerm(term);
    setNewRelation({ ...newRelation, targetModel: term });
    
    if (term.trim()) {
      // 根据输入的关键词模糊匹配模型名称
      const filteredModels = allModels.filter(model => 
        model.name.toLowerCase().includes(term.toLowerCase())
      );
      setTargetModelSuggestions(filteredModels);
      setShowTargetSuggestions(true);
    } else {
      setTargetModelSuggestions([]);
      setShowTargetSuggestions(false);
    }
  };

  // 选择目标模型
  const handleSelectTargetModel = (model) => {
    setNewRelation({ ...newRelation, targetModelId: model.id, targetModel: model.name });
    setTargetModelSearchTerm(model.name);
    setShowTargetSuggestions(false);
  };

  // 关闭关系模态框
  const handleCloseRelationModal = () => {
    setIsRelationModalOpen(false);
    setEditingRelation(null);
    setNewRelation({
      name: '',
      sourceModelId: '',
      targetModelId: '',
      type: 'one-to-many',
      description: ''
    });
    // 清空搜索状态
    setTargetModelSearchTerm('');
    setTargetModelSuggestions([]);
    setShowTargetSuggestions(false);
    setRelationNameSearchTerm('');
    setRelationNameSuggestions([]);
    setShowRelationNameSuggestions(false);
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '600px' }}>
        <h2>{editingRelation ? '编辑关系' : '新建关系'}</h2>
        
        <div className="form-group">
          <label>名称 *</label>
          <input
            type="text"
            value={newRelation.name}
            onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
            placeholder="关系名称"
          />
        </div>
        
        <div className="form-group">
          <label>源模型 *</label>
          <select
            value={newRelation.sourceModelId}
            onChange={(e) => setNewRelation({ ...newRelation, sourceModelId: parseInt(e.target.value) })}
          >
            <option value="">选择源模型</option>
            {allModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>目标模型 *</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={newRelation.targetModel || ''}
              onChange={handleTargetModelChange}
              placeholder="输入目标模型名称进行搜索"
              style={{ width: '100%', color: '#000000' }}
            />
            {showTargetSuggestions && targetModelSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {targetModelSuggestions.map(model => (
                  <div
                    key={model.id}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      color: '#000000',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                    onClick={() => handleSelectTargetModel(model)}
                  >
                    {model.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>关系类型 *</label>
          <select
            value={newRelation.type}
            onChange={(e) => setNewRelation({ ...newRelation, type: e.target.value })}
            style={{ color: '#000000' }}
          >
            <option value="one-to-one" style={{ color: '#000000' }}>一对一</option>
            <option value="one-to-many" style={{ color: '#000000' }}>一对多</option>
            <option value="many-to-one" style={{ color: '#000000' }}>多对一</option>
            <option value="many-to-many" style={{ color: '#000000' }}>多对多</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newRelation.description}
            onChange={(e) => setNewRelation({ ...newRelation, description: e.target.value })}
            placeholder="关系描述"
            rows={3}
            style={{ color: '#000000' }}
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button className="cancel" onClick={handleCloseRelationModal}>取消</button>
          <button className="submit" onClick={handleSaveRelation}>
            {editingRelation ? '更新' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelationModal;