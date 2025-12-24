import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Divider, Space, InputNumber } from 'antd';

const { Option } = Select;

const ETLConfigurator = () => {
  const [datasources, setDatasources] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedDatasource, setSelectedDatasource] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [datasourceSchema, setDatasourceSchema] = useState([]);
  const [modelProperties, setModelProperties] = useState([]);
  const [fieldMappings, setFieldMappings] = useState({});
  const [transformRules, setTransformRules] = useState([]);

  // 获取数据源和模型列表
  useEffect(() => {
    fetch('/api/datasource')
      .then(response => response.json())
      .then(data => setDatasources(data))
      .catch(error => console.error('Failed to fetch datasources:', error));

    fetch('/api/model')
      .then(response => response.json())
      .then(data => {
        const modelsData = Array.isArray(data) ? data : data.models || [];
        setModels(modelsData);
      })
      .catch(error => console.error('Failed to fetch models:', error));
  }, []);

  // 获取数据源的表结构
  const loadDatasourceSchema = (datasourceId) => {
    // 模拟获取数据源的表结构
    // 实际项目中应该调用后端API获取数据源的表结构
    const mockSchema = [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar(255)' },
      { name: 'description', type: 'text' },
      { name: 'create_date', type: 'datetime' },
      { name: 'update_time', type: 'datetime' },
      { name: 'status', type: 'varchar(20)' }
    ];
    setDatasourceSchema(mockSchema);
  };

  // 获取模型的属性
  const loadModelProperties = (modelId) => {
    fetch(`/api/property?modelId=${modelId}`)
      .then(response => response.json())
      .then(data => setModelProperties(data))
      .catch(error => console.error('Failed to fetch model properties:', error));
  };

  // 处理数据源选择
  const handleDatasourceChange = (datasourceId) => {
    setSelectedDatasource(datasourceId);
    loadDatasourceSchema(datasourceId);
  };

  // 处理模型选择
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    loadModelProperties(modelId);
  };

  // 处理字段映射
  const handleFieldMappingChange = (sourceField, targetField) => {
    setFieldMappings({
      ...fieldMappings,
      [sourceField]: targetField
    });
  };

  // 添加转换规则
  const addTransformRule = () => {
    setTransformRules([
      ...transformRules,
      { id: Date.now(), type: 'dateFormat', sourceColumn: '', targetFormat: '' }
    ]);
  };

  // 更新转换规则
  const updateTransformRule = (id, field, value) => {
    setTransformRules(
      transformRules.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    );
  };

  // 删除转换规则
  const removeTransformRule = (id) => {
    setTransformRules(transformRules.filter(rule => rule.id !== id));
  };

  return (
    <div className="etl-configurator">
      <Card title="ETL配置向导" style={{ marginBottom: '20px' }}>
        <Form layout="vertical">
          <Form.Item label="选择数据源">
            <Select
              placeholder="请选择数据源"
              onChange={handleDatasourceChange}
              value={selectedDatasource}
            >
              {datasources.map(ds => (
                <Option key={ds.id} value={ds.id}>{ds.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="选择目标模型">
            <Select
              placeholder="请选择目标模型"
              onChange={handleModelChange}
              value={selectedModel}
            >
              {models.map(model => (
                <Option key={model.id} value={model.id}>{model.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>

      {selectedDatasource && selectedModel && (
        <>
          <Card title="字段映射配置" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 1fr', gap: '16px', alignItems: 'center' }}>
              <div><strong>源字段</strong></div>
              <div style={{ textAlign: 'center' }}><strong>映射</strong></div>
              <div><strong>目标属性</strong></div>

              {datasourceSchema.map((sourceField, index) => (
                <React.Fragment key={index}>
                  <div>
                    <Input value={sourceField.name} disabled />
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      类型: {sourceField.type}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>→</div>
                  <div>
                    <Select
                      placeholder="选择目标属性"
                      onChange={(value) => handleFieldMappingChange(sourceField.name, value)}
                      value={fieldMappings[sourceField.name] || undefined}
                    >
                      {modelProperties.map(prop => (
                        <Option key={prop.id} value={prop.name}>{prop.name} ({prop.type})</Option>
                      ))}
                    </Select>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Card>

          <Card title="转换规则配置" style={{ marginBottom: '20px' }}>
            <Button onClick={addTransformRule} style={{ marginBottom: '16px' }}>
              添加转换规则
            </Button>

            {transformRules.map(rule => (
              <Card key={rule.id} size="small" style={{ marginBottom: '10px' }}>
                <Space style={{ width: '100%' }} size="middle">
                  <Select
                    value={rule.type}
                    onChange={(value) => updateTransformRule(rule.id, 'type', value)}
                    style={{ width: 150 }}
                  >
                    <Option value="dateFormat">日期格式化</Option>
                    <Option value="mask">数据脱敏</Option>
                    <Option value="convertType">类型转换</Option>
                    <Option value="custom">自定义转换</Option>
                  </Select>
                  
                  <Select
                    placeholder="源字段"
                    value={rule.sourceColumn}
                    onChange={(value) => updateTransformRule(rule.id, 'sourceColumn', value)}
                    style={{ width: 150 }}
                  >
                    {datasourceSchema.map(field => (
                      <Option key={field.name} value={field.name}>{field.name}</Option>
                    ))}
                  </Select>
                  
                  {rule.type === 'dateFormat' && (
                    <Input
                      placeholder="目标格式"
                      value={rule.targetFormat}
                      onChange={(e) => updateTransformRule(rule.id, 'targetFormat', e.target.value)}
                      style={{ width: 150 }}
                    />
                  )}
                  
                  <Button 
                    danger 
                    size="small" 
                    onClick={() => removeTransformRule(rule.id)}
                  >
                    删除
                  </Button>
                </Space>
              </Card>
            ))}
          </Card>

          <Card title="抽取配置">
            <Form layout="vertical">
              <Form.Item label="抽取类型">
                <Select defaultValue="full">
                  <Option value="full">全量抽取</Option>
                  <Option value="incremental">增量抽取</Option>
                </Select>
              </Form.Item>
              
              {selectedDatasource && (
                <Form.Item label="增量字段">
                  <Select placeholder="选择用于增量抽取的字段">
                    {datasourceSchema.map(field => (
                      <Option key={field.name} value={field.name}>
                        {field.name} ({field.type})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              
              <Form.Item label="批次大小">
                <InputNumber min={1} max={10000} defaultValue={1000} style={{ width: '100%' }} />
              </Form.Item>
              
              <Divider />
              
              <Form.Item label="调度配置">
                <Space>
                  <Input placeholder="Cron表达式" />
                  <Button>生成表达式</Button>
                </Space>
              </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button type="primary" size="large">
                保存ETL配置
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ETLConfigurator;