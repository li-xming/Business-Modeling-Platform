import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const PropertyManager = ({ 
  model, 
  properties, 
  setProperties, 
  showNotification,
  showConfirmDialog,
  isPropertyModalOpen, 
  setIsPropertyModalOpen, 
  editingProperty, 
  setEditingProperty, 
  newProperty, 
  setNewProperty,
  selectedProperties,
  setSelectedProperties,
  viewMode,
  setViewMode
}) => {
  // 处理创建属性
  const handleCreateProperty = () => {
    const propertyData = {
      ...newProperty,
      modelId: model.id,
      domainId: model.domainId
    };

    fetch('/api/property', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    })
      .then(response => response.json())
      .then(property => {
        setProperties([...properties, property]);
        setIsPropertyModalOpen(false);
        setEditingProperty(null);
        setNewProperty({ 
          name: '', 
          type: 'string', 
          required: false, 
          description: '', 
          isPrimaryKey: false, 
          isForeignKey: false, 
          defaultValue: null, 
          constraints: [], 
          sensitivityLevel: 'public', 
          maskRule: null, 
          physicalColumn: '' 
        });
        showNotification('属性创建成功');
      })
      .catch(error => {
        console.error('Failed to create property:', error);
        showNotification('属性创建失败', 'error');
      });
  };

  // 处理编辑属性
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setNewProperty(property);
    setIsPropertyModalOpen(true);
  };

  // 处理更新属性
  const handleUpdateProperty = () => {
    fetch(`/api/property/${editingProperty.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProperty)
    })
      .then(response => response.json())
      .then(updatedProperty => {
        setProperties(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
        setIsPropertyModalOpen(false);
        setEditingProperty(null);
        setNewProperty({ 
          name: '', 
          type: 'string', 
          required: false, 
          description: '', 
          isPrimaryKey: false, 
          isForeignKey: false, 
          defaultValue: null, 
          constraints: [], 
          sensitivityLevel: 'public', 
          maskRule: null, 
          physicalColumn: '' 
        });
        showNotification('属性更新成功');
      })
      .catch(error => {
        console.error('Failed to update property:', error);
        showNotification('属性更新失败', 'error');
      });
  };

  // 保存属性（创建或更新）
  const handleSaveProperty = () => {
    if (editingProperty) {
      handleUpdateProperty();
    } else {
      handleCreateProperty();
    }
  };

  // 处理删除属性
  const handleDeleteProperty = (id) => {
    showConfirmDialog(
      '删除确认',
      '确定要删除该属性吗？删除后无法恢复。',
      () => {
        fetch(`/api/property/${id}`, { method: 'DELETE' })
          .then(() => {
            setProperties(properties.filter(property => property.id !== id));
            // 从选中列表中移除
            setSelectedProperties(selectedProperties.filter(propId => propId !== id));
            showNotification('属性删除成功');
          })
          .catch(error => {
            console.error('Failed to delete property:', error);
            showNotification('属性删除失败', 'error');
          });
      }
    );
  };

  // 切换属性选择
  const togglePropertySelection = (id) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(propId => propId !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(properties.map(p => p.id));
    }
  };

  return (
    <div className="property-manager">
      <div className="header-toolbar">
        <div>
          <button 
            className={selectedProperties.length > 0 ? 'active' : ''}
            onClick={toggleSelectAll}
          >
            {selectedProperties.length === properties.length && properties.length > 0 ? '取消全选' : '全选'}
          </button>
          <button 
            onClick={() => {
              setEditingProperty(null);
              setNewProperty({ 
                name: '', 
                type: 'string', 
                required: false, 
                description: '', 
                isPrimaryKey: false, 
                isForeignKey: false, 
                defaultValue: null, 
                constraints: [], 
                sensitivityLevel: 'public', 
                maskRule: null, 
                physicalColumn: '' 
              });
              setIsPropertyModalOpen(true);
            }}
          >
            新建属性
          </button>
          <button 
            disabled={selectedProperties.length === 0}
            onClick={() => console.log('批量删除属性:', selectedProperties)}
          >
            批量删除
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            className="view-toggle"
          >
            {viewMode === 'table' ? '卡片视图' : '表格视图'}
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="搜索属性名称..."
            // 这里应该连接到搜索状态
            onChange={(e) => console.log('搜索属性:', e.target.value)}
          />
          <button onClick={() => console.log('导出属性')}>导出</button>
          <button onClick={() => console.log('导入属性')}>导入</button>
        </div>
      </div>
      
      {viewMode === 'table' ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={selectedProperties.length === properties.length && properties.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>名称</th>
                <th>类型</th>
                <th>必填</th>
                <th>主键</th>
                <th>外键</th>
                <th>默认值</th>
                <th>敏感级别</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property.id)}
                      onChange={() => togglePropertySelection(property.id)}
                    />
                  </td>
                  <td>{property.name}</td>
                  <td>{property.type}</td>
                  <td>{property.required ? '是' : '否'}</td>
                  <td>{property.isPrimaryKey ? '是' : '否'}</td>
                  <td>{property.isForeignKey ? '是' : '否'}</td>
                  <td>{property.defaultValue !== null ? property.defaultValue.toString() : '-'}</td>
                  <td>
                    <span className={`status-badge ${property.sensitivityLevel}`}>
                      {property.sensitivityLevel === 'public' ? '公开' : 
                       property.sensitivityLevel === 'internal' ? '内部' : 
                       property.sensitivityLevel === 'confidential' ? '机密' : '公开'}
                    </span>
                  </td>
                  <td>
                    <button className="edit" onClick={() => handleEditProperty(property)}>编辑</button>
                    <button className="delete" onClick={() => handleDeleteProperty(property.id)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', padding: '16px' }}>
          {properties.map(property => (
            <div key={property.id} className="card" style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>{property.name}</h3>
              <p><strong>类型:</strong> {property.type}</p>
              <p><strong>必填:</strong> {property.required ? '是' : '否'}</p>
              <p><strong>主键:</strong> {property.isPrimaryKey ? '是' : '否'}</p>
              <p><strong>外键:</strong> {property.isForeignKey ? '是' : '否'}</p>
              <p><strong>默认值:</strong> {property.defaultValue !== null ? property.defaultValue.toString() : '-'}</p>
              <p><strong>敏感级别:</strong> 
                <span className={`status-badge ${property.sensitivityLevel}`}>
                  {property.sensitivityLevel === 'public' ? '公开' : 
                   property.sensitivityLevel === 'internal' ? '内部' : 
                   property.sensitivityLevel === 'confidential' ? '机密' : '公开'}
                </span>
              </p>
              <p><strong>描述:</strong> {property.description}</p>
              <div className="card-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                <button className="edit" onClick={() => handleEditProperty(property)}>编辑</button>
                <button className="delete" onClick={() => handleDeleteProperty(property.id)}>删除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyManager;