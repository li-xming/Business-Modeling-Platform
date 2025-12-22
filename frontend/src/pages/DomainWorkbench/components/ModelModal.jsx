import React from 'react';

const ModelModal = ({ 
  isModalOpen, 
  editingModel, 
  newModel, 
  setNewModel, 
  handleSaveModel, 
  setIsModalOpen, 
  setEditingModel 
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editingModel ? '编辑模型' : '新建模型'}</h2>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={newModel.name}
            onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newModel.description}
            onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
          ></textarea>
        </div>
        <div className="form-group">
          <label>父模型ID（可选）</label>
          <input
            type="text"
            value={newModel.parentId}
            onChange={(e) => setNewModel({ ...newModel, parentId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>标签（逗号分隔）</label>
          <input
            type="text"
            value={newModel.tags}
            onChange={(e) => setNewModel({ ...newModel, tags: e.target.value })}
          />
        </div>
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsModalOpen(false);
            setEditingModel(null);
            setNewModel({ name: '', description: '', parentId: '', tags: '' });
          }}>取消</button>
          <button className="submit" onClick={handleSaveModel}>{editingModel ? '更新' : '确定'}</button>
        </div>
      </div>
    </div>
  );
};

export default ModelModal;