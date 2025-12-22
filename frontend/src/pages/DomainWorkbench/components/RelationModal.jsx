import React from 'react';

const RelationModal = ({ 
  isRelationModalOpen, 
  editingRelation, 
  newRelation, 
  setNewRelation, 
  handleSaveRelation, 
  setIsRelationModalOpen, 
  setEditingRelation,
  models
}) => {
  if (!isRelationModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editingRelation ? '编辑关系' : '新建关系'}</h2>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={newRelation.name}
            onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>源模型</label>
          <select
            value={newRelation.sourceModelId}
            onChange={(e) => setNewRelation({ ...newRelation, sourceModelId: e.target.value })}
          >
            <option value="">选择源模型</option>
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>目标模型</label>
          <select
            value={newRelation.targetModelId}
            onChange={(e) => setNewRelation({ ...newRelation, targetModelId: e.target.value })}
          >
            <option value="">选择目标模型</option>
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>关系类型</label>
          <select
            value={newRelation.type}
            onChange={(e) => setNewRelation({ ...newRelation, type: e.target.value })}
          >
            <option value="one-to-one">一对一</option>
            <option value="one-to-many">一对多</option>
            <option value="many-to-one">多对一</option>
            <option value="many-to-many">多对多</option>
          </select>
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newRelation.description}
            onChange={(e) => setNewRelation({ ...newRelation, description: e.target.value })}
          ></textarea>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="enabled"
            checked={newRelation.enabled}
            onChange={(e) => setNewRelation({ ...newRelation, enabled: e.target.checked })}
          />
          <label htmlFor="enabled" style={{ marginBottom: 0 }}>启用</label>
        </div>
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsRelationModalOpen(false);
            setEditingRelation(null);
          }}>取消</button>
          <button className="submit" onClick={handleSaveRelation}>{editingRelation ? '更新' : '创建'}</button>
        </div>
      </div>
    </div>
  );
};

export default RelationModal;