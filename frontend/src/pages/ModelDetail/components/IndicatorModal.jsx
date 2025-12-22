import React from 'react';

const IndicatorModal = ({ 
  isIndicatorModalOpen, 
  editingIndicator, 
  newIndicator, 
  setNewIndicator, 
  setIsIndicatorModalOpen, 
  setEditingIndicator,
  handleSaveIndicator
}) => {
  if (!isIndicatorModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '600px' }}>
        <h2>{editingIndicator ? '编辑指标' : '新建指标'}</h2>
        
        <div className="form-group">
          <label>名称 *</label>
          <input
            type="text"
            value={newIndicator.name}
            onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
            placeholder="指标名称"
          />
        </div>
        
        <div className="form-group">
          <label>表达式 *</label>
          <textarea
            value={newIndicator.expression}
            onChange={(e) => setNewIndicator({ ...newIndicator, expression: e.target.value })}
            placeholder="指标计算表达式"
            rows={3}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>返回类型 *</label>
          <select
            value={newIndicator.returnType}
            onChange={(e) => setNewIndicator({ ...newIndicator, returnType: e.target.value })}
          >
            <option value="number">数字</option>
            <option value="string">字符串</option>
            <option value="boolean">布尔值</option>
            <option value="date">日期</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newIndicator.description}
            onChange={(e) => setNewIndicator({ ...newIndicator, description: e.target.value })}
            placeholder="指标描述"
            rows={3}
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsIndicatorModalOpen(false);
            setEditingIndicator(null);
            setNewIndicator({
              name: '',
              expression: '',
              returnType: 'number',
              description: ''
            });
          }}>取消</button>
          <button className="submit" onClick={handleSaveIndicator}>
            {editingIndicator ? '更新' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndicatorModal;