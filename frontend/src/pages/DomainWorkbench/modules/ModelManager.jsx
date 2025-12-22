import React from 'react';
import { useNavigate } from 'react-router-dom';

const ModelManager = ({ 
  filteredModels, 
  searchTerm, 
  setSearchTerm, 
  handleEditModel, 
  handleDeleteModel 
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="header-toolbar">
        <input
          type="text"
          placeholder="搜索模型名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => navigate('/model/create')}>新建模型</button>
        <button onClick={() => console.log('导入模型')}>导入</button>
        <button onClick={() => console.log('导出模型')}>导出</button>
      </div>
      <div className="card-list">
        {filteredModels.map(model => (
          <div 
            key={model.id} 
            className="card"
            onDoubleClick={() => navigate(`/model/${model.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{model.name}</h3>
            <p>描述: {model.description}</p>
            <p>创建人: {model.creator}</p>
            <p>更新时间: {model.updatedAt}</p>
            <div className="card-actions">
              <button className="edit" onClick={(e) => {
                e.stopPropagation();
                handleEditModel(model);
              }}>编辑</button>
              <button className="delete" onClick={(e) => {
                e.stopPropagation();
                handleDeleteModel(model.id);
              }}>删除</button>
              <button onClick={(e) => {
                e.stopPropagation();
                navigate(`/model/${model.id}`);
              }}>详情</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ModelManager;