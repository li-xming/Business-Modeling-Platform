import React from 'react';
import PropertyModal from './PropertyModal';
import RelationModal from './RelationModal';
import DatasourceModal from './DatasourceModal';
import DataModal from './DataModal';
import IndicatorModal from './IndicatorModal';
import MappingModal from './MappingModal';

const ModalWrapper = ({
  // Property Modal
  isPropertyModalOpen,
  editingProperty,
  newProperty,
  setNewProperty,
  setIsPropertyModalOpen,
  setEditingProperty,
  
  // Relation Modal
  isRelationModalOpen,
  editingRelation,
  newRelation,
  setNewRelation,
  setIsRelationModalOpen,
  setEditingRelation,
  allModels,
  
  // Datasource Modal
  isDatasourceModalOpen,
  editingDatasource,
  newDatasource,
  setNewDatasource,
  setIsDatasourceModalOpen,
  setEditingDatasource,
  
  // Data Modal
  isDataModalOpen,
  editingData,
  newData,
  setNewData,
  setIsDataModalOpen,
  setEditingData,
  
  // Indicator Modal
  isIndicatorModalOpen,
  editingIndicator,
  newIndicator,
  setNewIndicator,
  setIsIndicatorModalOpen,
  setEditingIndicator,
  
  // Mapping Modal
  isMappingModalOpen,
  mappingDatasource,
  model,
  modelProperties,
  modelId,
  setMappingDatasource,
  setIsMappingModalOpen,
  
  // Other Props
  properties,
  relations,
  datasources,
  dataRecords,
  semanticIndicators,
  boundIndicators,
  showNotification,
  setProperties,
  setRelations,
  setDatasources,
  setDataRecords,
  setSemanticIndicators,
  setBoundIndicators
}) => {
  
  // Property Modal Handler
  const handleSaveProperty = () => {
    if (editingProperty) {
      // 更新属性
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
    } else {
      // 创建属性
      const propertyData = {
        ...newProperty,
        modelId: parseInt(modelId)
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
    }
  };
  
  // Relation Modal Handler
  const handleSaveRelation = () => {
    if (editingRelation) {
      // 更新关系
      fetch(`/api/relation/${editingRelation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRelation)
      })
        .then(response => response.json())
        .then(updatedRelation => {
          setRelations(relations.map(r => r.id === updatedRelation.id ? updatedRelation : r));
          setIsRelationModalOpen(false);
          setEditingRelation(null);
          setNewRelation({
            name: '',
            sourceModelId: '',
            targetModelId: '',
            type: 'one-to-many',
            description: ''
          });
          showNotification('关系更新成功');
        })
        .catch(error => {
          console.error('Failed to update relation:', error);
          showNotification('关系更新失败', 'error');
        });
    } else {
      // 创建关系
      fetch('/api/relation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRelation)
      })
        .then(response => response.json())
        .then(relation => {
          setRelations([...relations, relation]);
          setIsRelationModalOpen(false);
          setEditingRelation(null);
          setNewRelation({
            name: '',
            sourceModelId: '',
            targetModelId: '',
            type: 'one-to-many',
            description: ''
          });
          showNotification('关系创建成功');
        })
        .catch(error => {
          console.error('Failed to create relation:', error);
          showNotification('关系创建失败', 'error');
        });
    }
  };
  
  // Datasource Modal Handler
  const handleSaveDatasource = () => {
    if (editingDatasource) {
      // 更新数据源
      fetch(`/api/datasource/${editingDatasource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDatasource)
      })
        .then(response => response.json())
        .then(updatedDatasource => {
          setDatasources(datasources.map(d => d.id === updatedDatasource.id ? updatedDatasource : d));
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
          showNotification('数据源更新成功');
        })
        .catch(error => {
          console.error('Failed to update datasource:', error);
          showNotification('数据源更新失败', 'error');
        });
    } else {
      // 创建数据源
      const datasourceData = {
        ...newDatasource,
        modelId: parseInt(modelId)
      };
      fetch('/api/datasource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datasourceData)
      })
        .then(response => response.json())
        .then(datasource => {
          setDatasources([...datasources, datasource]);
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
          showNotification('数据源创建成功');
        })
        .catch(error => {
          console.error('Failed to create datasource:', error);
          showNotification('数据源创建失败', 'error');
        });
    }
  };
  
  // Data Modal Handler
  const handleSaveData = () => {
    if (editingData) {
      // 更新数据记录
      fetch(`/api/data/${editingData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })
        .then(response => response.json())
        .then(updatedData => {
          setDataRecords(dataRecords.map(record => record.id === updatedData.id ? updatedData : record));
          setIsDataModalOpen(false);
          setEditingData(null);
          setNewData({});
          showNotification('数据记录更新成功');
        })
        .catch(error => {
          console.error('Failed to update data:', error);
          showNotification('数据记录更新失败', 'error');
        });
    } else {
      // 创建数据记录
      const dataWithId = {
        ...newData,
        id: dataRecords.length + 1
      };
      
      fetch(`/api/data?modelId=${modelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithId)
      })
        .then(response => response.json())
        .then(data => {
          setDataRecords([...dataRecords, data]);
          setIsDataModalOpen(false);
          setEditingData(null);
          setNewData({});
          showNotification('数据记录创建成功');
        })
        .catch(error => {
          console.error('Failed to create data:', error);
          showNotification('数据记录创建失败', 'error');
        });
    }
  };
  
  // Indicator Modal Handler
  const handleSaveIndicator = () => {
    if (editingIndicator) {
      // 更新指标
      fetch(`/api/indicator/${editingIndicator.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newIndicator,
          dimensions: newIndicator.dimensions || [],
          filters: newIndicator.filters || [],
          sortFields: newIndicator.sortFields || [],
          relatedProperties: newIndicator.relatedProperties || []
        })
      })
        .then(response => response.json())
        .then(updatedIndicator => {
          // 更新语义指标列表
          setSemanticIndicators(semanticIndicators.map(i => i.id === updatedIndicator.id ? updatedIndicator : i));
          
          // 检查该指标是否在绑定列表中，如果是，也要更新绑定列表
          const isBound = boundIndicators.some(b => b.id === updatedIndicator.id);
          if (isBound) {
            setBoundIndicators(boundIndicators.map(i => i.id === updatedIndicator.id ? updatedIndicator : i));
          }
          
          setIsIndicatorModalOpen(false);
          setEditingIndicator(null);
          setNewIndicator({
            name: '',
            expression: '',
            dimensions: [],
            filters: [],
            sortFields: [],
            returnType: 'number',
            description: '',
            status: 'draft',
            unit: '',
            relatedProperties: []
          });
          showNotification('指标更新成功');
        })
        .catch(error => {
          console.error('Failed to update indicator:', error);
          showNotification('指标更新失败', 'error');
        });
    } else {
      // 创建指标
      fetch('/api/indicator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newIndicator,
          dimensions: newIndicator.dimensions || [],
          filters: newIndicator.filters || [],
          sortFields: newIndicator.sortFields || [],
          relatedProperties: newIndicator.relatedProperties || [],
          modelId: parseInt(modelId)
        })
      })
        .then(response => response.json())
        .then(indicator => {
          setSemanticIndicators([...semanticIndicators, indicator]);
          setIsIndicatorModalOpen(false);
          setEditingIndicator(null);
          setNewIndicator({
            name: '',
            expression: '',
            dimensions: [],
            filters: [],
            sortFields: [],
            returnType: 'number',
            description: '',
            status: 'draft',
            unit: '',
            relatedProperties: []
          });
          showNotification('指标创建成功');
        })
        .catch(error => {
          console.error('Failed to create indicator:', error);
          showNotification('指标创建失败', 'error');
        });
    }
  };
  return (
    <>
      {/* 属性模态框 */}
      <PropertyModal 
        isPropertyModalOpen={isPropertyModalOpen}
        editingProperty={editingProperty}
        newProperty={newProperty}
        setNewProperty={setNewProperty}
        setIsPropertyModalOpen={setIsPropertyModalOpen}
        setEditingProperty={setEditingProperty}
        handleSaveProperty={handleSaveProperty}
      />
      
      {/* 关系模态框 */}
      <RelationModal 
        isRelationModalOpen={isRelationModalOpen}
        editingRelation={editingRelation}
        newRelation={newRelation}
        setNewRelation={setNewRelation}
        setIsRelationModalOpen={setIsRelationModalOpen}
        setEditingRelation={setEditingRelation}
        allModels={allModels}
        handleSaveRelation={handleSaveRelation}
      />
      
      {/* 数据源模态框 */}
      <DatasourceModal 
        isDatasourceModalOpen={isDatasourceModalOpen}
        editingDatasource={editingDatasource}
        newDatasource={newDatasource}
        setNewDatasource={setNewDatasource}
        setIsDatasourceModalOpen={setIsDatasourceModalOpen}
        setEditingDatasource={setEditingDatasource}
        handleSaveDatasource={handleSaveDatasource}
      />
      
      {/* 数据记录模态框 */}
      <DataModal 
        isDataModalOpen={isDataModalOpen}
        editingData={editingData}
        newData={newData}
        setNewData={setNewData}
        setIsDataModalOpen={setIsDataModalOpen}
        setEditingData={setEditingData}
        handleSaveData={handleSaveData}
        properties={properties}
      />
      
      {/* 指标模态框 */}
      <IndicatorModal 
        isIndicatorModalOpen={isIndicatorModalOpen}
        editingIndicator={editingIndicator}
        newIndicator={newIndicator}
        setNewIndicator={setNewIndicator}
        setIsIndicatorModalOpen={setIsIndicatorModalOpen}
        setEditingIndicator={setEditingIndicator}
        properties={properties}
        handleSaveIndicator={handleSaveIndicator}
      />
      
      {/* 映射模态框 */}
      <MappingModal
        isOpen={isMappingModalOpen}
        onClose={() => {
          setIsMappingModalOpen(false);
          setMappingDatasource(null);
        }}
        datasource={mappingDatasource}
        model={model}
        modelProperties={modelProperties}
        modelId={modelId}
      />
    </>
  );
};

export default ModalWrapper;