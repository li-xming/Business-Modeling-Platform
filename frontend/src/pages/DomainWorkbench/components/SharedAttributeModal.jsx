import React from 'react';

const SharedAttributeModal = ({ 
  isAttrModalOpen, 
  editingAttr, 
  newAttr, 
  setNewAttr, 
  handleSaveAttr, 
  setIsAttrModalOpen, 
  setEditingAttr 
}) => {
  if (!isAttrModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{editingAttr ? '编辑共享属性' : '新建共享属性'}</h2>
        <div className="form-group">
          <label>名称</label>
          <input
            type="text"
            value={newAttr.name}
            onChange={(e) => setNewAttr({ ...newAttr, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>数据类型</label>
          <select
            value={newAttr.type}
            onChange={(e) => setNewAttr({ ...newAttr, type: e.target.value })}
          >
            <option value="string">字符串</option>
            <option value="number">数字</option>
            <option value="date">日期</option>
            <option value="datetime">日期时间</option>
            <option value="boolean">布尔值</option>
            <option value="text">文本</option>
          </select>
        </div>
        <div className="form-group">
          <label>长度</label>
          <input
            type="text"
            value={newAttr.length}
            onChange={(e) => setNewAttr({ ...newAttr, length: e.target.value })}
            placeholder="可选，如：255"
          />
        </div>
        <div className="form-group">
          <label>精度</label>
          <input
            type="text"
            value={newAttr.precision}
            onChange={(e) => setNewAttr({ ...newAttr, precision: e.target.value })}
            placeholder="可选，如：0（整数）、2（两位小数）"
          />
        </div>
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newAttr.description}
            onChange={(e) => setNewAttr({ ...newAttr, description: e.target.value })}
          ></textarea>
        </div>
        <div className="form-group">
          <label>值域（可选）</label>
          <input
            type="text"
            value={newAttr.valueRange}
            onChange={(e) => setNewAttr({ ...newAttr, valueRange: e.target.value })}
            placeholder="如：0,1 或 男,女"
          />
        </div>
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsAttrModalOpen(false);
            setEditingAttr(null);
          }}>取消</button>
          <button className="submit" onClick={handleSaveAttr}>{editingAttr ? '更新' : '创建'}</button>
        </div>
      </div>
    </div>
  );
};

export default SharedAttributeModal;