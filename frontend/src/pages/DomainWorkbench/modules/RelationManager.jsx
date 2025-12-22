import React from 'react';

const RelationManager = ({ 
  relations, 
  searchTerm, 
  setSearchTerm, 
  handleEditRelation, 
  handleDeleteRelation, 
  handleToggleRelation 
}) => {
  return (
    <>
      <div className="header-toolbar">
        <input
          type="text"
          placeholder="搜索关系..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => console.log('新建关系')}>新建关系</button>
        <button onClick={() => console.log('导入关系')}>导入</button>
        <button onClick={() => console.log('导出关系')}>导出</button>
      </div>
      <div className="card-list">
        {relations.filter(relation => 
          relation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          relation.sourceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          relation.targetModel.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(relation => (
          <div key={relation.id} className="card">
            <h3>{relation.name}</h3>
            <p>关系: {relation.sourceModel} → {relation.targetModel}</p>
            <p>类型: {relation.type}</p>
            <p>描述: {relation.description}</p>
            <p>状态: {relation.enabled ? '启用' : '禁用'}</p>
            <div className="card-actions">
              <button className="edit" onClick={() => handleEditRelation(relation)}>编辑</button>
              <button className={relation.enabled ? 'delete' : 'edit'} onClick={() => handleToggleRelation(relation.id)}>
                {relation.enabled ? '禁用' : '启用'}
              </button>
              <button className="delete" onClick={() => handleDeleteRelation(relation.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RelationManager;