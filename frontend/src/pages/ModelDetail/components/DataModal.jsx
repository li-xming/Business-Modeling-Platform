import React from 'react';

const DataModal = ({ 
  isDataModalOpen, 
  editingData, 
  newData, 
  setNewData, 
  setIsDataModalOpen, 
  setEditingData,
  handleSaveData,
  properties
}) => {
  if (!isDataModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '600px' }}>
        <h2>{editingData ? '编辑数据记录' : '新建数据记录'}</h2>
        
        {properties.map(property => (
          <div className="form-group" key={property.id}>
            <label>{property.name}{property.required && ' *'}</label>
            <input
              type={property.type === 'number' ? 'number' : 'text'}
              value={newData[property.name] || ''}
              onChange={(e) => setNewData({ ...newData, [property.name]: e.target.value })}
              placeholder={property.description || property.name}
            />
          </div>
        ))}
        
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsDataModalOpen(false);
            setEditingData(null);
            setNewData({});
          }}>取消</button>
          <button className="submit" onClick={handleSaveData}>
            {editingData ? '更新' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataModal;