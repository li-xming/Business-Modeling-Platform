import React from 'react';

const DatasourceModal = ({ 
  isDatasourceModalOpen, 
  editingDatasource, 
  newDatasource, 
  setNewDatasource, 
  setIsDatasourceModalOpen, 
  setEditingDatasource,
  handleSaveDatasource
}) => {
  if (!isDatasourceModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '600px' }}>
        <h2>{editingDatasource ? '编辑数据源' : '新建数据源'}</h2>
        
        <div className="form-group">
          <label>名称 *</label>
          <input
            type="text"
            value={newDatasource.name}
            onChange={(e) => setNewDatasource({ ...newDatasource, name: e.target.value })}
            placeholder="数据源名称"
          />
        </div>
        
        <div className="form-group">
          <label>类型 *</label>
          <select
            value={newDatasource.type}
            onChange={(e) => setNewDatasource({ ...newDatasource, type: e.target.value })}
          >
            <option value="mysql">MySQL</option>
            <option value="oracle">Oracle</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlserver">SQL Server</option>
            <option value="kafka">Kafka</option>
            <option value="api">API</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>URL *</label>
          <input
            type="text"
            value={newDatasource.url}
            onChange={(e) => setNewDatasource({ ...newDatasource, url: e.target.value })}
            placeholder="例如: jdbc:mysql://localhost:3306/database"
          />
        </div>
        
        <div className="form-group">
          <label>表名/主题名</label>
          <input
            type="text"
            value={newDatasource.tableName}
            onChange={(e) => setNewDatasource({ ...newDatasource, tableName: e.target.value })}
            placeholder="表名或Kafka主题名"
          />
        </div>
        
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newDatasource.description}
            onChange={(e) => setNewDatasource({ ...newDatasource, description: e.target.value })}
            placeholder="数据源描述"
            rows={3}
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button className="cancel" onClick={() => {
            setIsDatasourceModalOpen(false);
            setEditingDatasource(null);
            setNewDatasource({
              name: '',
              type: 'mysql',
              url: '',
              tableName: '',
              status: 'inactive',
              description: ''
            });
          }}>取消</button>
          <button className="submit" onClick={handleSaveDatasource}>
            {editingDatasource ? '更新' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasourceModal;