import React from 'react';

const SharedAttributeManager = ({ 
  sharedAttributes, 
  searchTerm, 
  setSearchTerm, 
  handleEditAttr, 
  handleDeleteAttr 
}) => {
  return (
    <>
      <div className="header-toolbar">
        <input
          type="text"
          placeholder="搜索共享属性..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => console.log('新建共享属性')}>新建属性</button>
        <button onClick={() => console.log('导入共享属性')}>导入</button>
        <button onClick={() => console.log('导出共享属性')}>导出</button>
      </div>
      <div className="card-list">
        {sharedAttributes.filter(attr => 
          attr.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(attr => (
          <div key={attr.id} className="card">
            <h3>{attr.name}</h3>
            <p>类型: {attr.type}</p>
            <p>长度: {attr.length || '-'}</p>
            <p>精度: {attr.precision || '-'}</p>
            <p>描述: {attr.description}</p>
            <p>引用次数: {attr.referenceCount}</p>
            <div className="card-actions">
              <button className="edit" onClick={() => handleEditAttr(attr)}>编辑</button>
              <button className="delete" onClick={() => handleDeleteAttr(attr.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SharedAttributeManager;