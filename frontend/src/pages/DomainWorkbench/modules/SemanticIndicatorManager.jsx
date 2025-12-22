import React from 'react';

const SemanticIndicatorManager = ({ 
  semanticIndicators, 
  searchTerm, 
  setSearchTerm, 
  handleEditIndicator, 
  handleDeleteIndicator, 
  handlePublishIndicator, 
  handleOfflineIndicator, 
  handleCopyIndicator 
}) => {
  return (
    <>
      <div className="header-toolbar">
        <input
          type="text"
          placeholder="搜索语义/指标..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => console.log('新建指标')}>新建指标</button>
        <button onClick={() => console.log('导入指标')}>导入</button>
        <button onClick={() => console.log('导出指标')}>导出</button>
      </div>
      <div className="card-list">
        {semanticIndicators.filter(indicator => 
          indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          indicator.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(indicator => (
          <div key={indicator.id} className="card">
            <h3>{indicator.name}</h3>
            <p>表达式: {indicator.expression}</p>
            <p>返回类型: {indicator.returnType}</p>
            <p>单位: {indicator.unit || '-'}</p>
            <p>描述: {indicator.description}</p>
            <p>状态: {
              indicator.status === 'published' ? '已发布' : 
              indicator.status === 'offline' ? '已下线' : '草稿'
            }</p>
            <div className="card-actions">
              <button className="edit" onClick={() => handleEditIndicator(indicator)}>编辑</button>
              {indicator.status === 'draft' && (
                <button onClick={() => handlePublishIndicator(indicator.id)}>发布</button>
              )}
              {indicator.status === 'published' && (
                <button onClick={() => handleOfflineIndicator(indicator.id)}>下线</button>
              )}
              <button onClick={() => handleCopyIndicator(indicator)}>复制</button>
              <button className="delete" onClick={() => handleDeleteIndicator(indicator.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SemanticIndicatorManager;