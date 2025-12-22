import React from 'react';

const SemanticIndicatorModal = ({ 
  isIndicatorModalOpen, 
  editingIndicator, 
  newIndicator, 
  setNewIndicator, 
  handleSaveIndicator, 
  setIsIndicatorModalOpen, 
  setEditingIndicator 
}) => {
  if (!isIndicatorModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editingIndicator ? '编辑指标' : '新建指标'}</h2>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={newIndicator.name}
            onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>表达式</label>
          <textarea
            value={newIndicator.expression}
            onChange={(e) => setNewIndicator({ ...newIndicator, expression: e.target.value })}
            placeholder="如：SUM(账单金额)/COUNT(通行记录)"
            rows={4}
          ></textarea>
        </div>
        <div className="form-group">
          <label>返回类型</label>
          <select
            value={newIndicator.returnType}
            onChange={(e) => setNewIndicator({ ...newIndicator, returnType: e.target.value })}
          >
            <option value="number">数字</option>
            <option value="string">字符串</option>
            <option value="date">日期</option>
            <option value="time">时间</option>
            <option value="boolean">布尔值</option>
          </select>
        </div>
        <div className="form-group">
          <label>单位</label>
          <input
            type="text"
            value={newIndicator.unit}
            onChange={(e) => setNewIndicator({ ...newIndicator, unit: e.target.value })}
            placeholder="如：元、辆、%"
          />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newIndicator.description}
            onChange={(e) => setNewIndicator({ ...newIndicator, description: e.target.value })}
          ></textarea>
        </div>
        <div className="form-group">
          <label>状态</label>
          <select
            value={newIndicator.status}
            onChange={(e) => setNewIndicator({ ...newIndicator, status: e.target.value })}
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="offline">已下线</option>
          </select>
        </div>
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsIndicatorModalOpen(false);
            setEditingIndicator(null);
          }}>取消</button>
          <button className="submit" onClick={handleSaveIndicator}>{editingIndicator ? '更新' : '创建'}</button>
        </div>
      </div>
    </div>
  );
};

export default SemanticIndicatorModal;