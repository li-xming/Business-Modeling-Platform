import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const DatasourceModal = ({ 
  isDatasourceModalOpen, 
  editingDatasource, 
  newDatasource, 
  setNewDatasource, 
  setIsDatasourceModalOpen, 
  setEditingDatasource,
  handleSaveDatasource
}) => {
  const handleCancel = () => {
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
  };

  return (
    <Modal
      title={editingDatasource ? '编辑数据源' : '新建数据源'}
      open={isDatasourceModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSaveDatasource}>
          {editingDatasource ? '更新' : '确定'}
        </Button>
      ]}
      width={600}
    >
      <Form layout="vertical">
        <Form.Item
          label="名称 *"
          rules={[{ required: true, message: '请输入数据源名称' }]}
        >
          <Input
            value={newDatasource.name}
            onChange={(e) => setNewDatasource({ ...newDatasource, name: e.target.value })}
            placeholder="数据源名称"
          />
        </Form.Item>
        
        <Form.Item
          label="类型 *"
          rules={[{ required: true, message: '请选择数据源类型' }]}
        >
          <Select
            value={newDatasource.type}
            onChange={(value) => setNewDatasource({ ...newDatasource, type: value })}
            placeholder="选择数据源类型"
          >
            <Option value="mysql">MySQL</Option>
            <Option value="oracle">Oracle</Option>
            <Option value="postgresql">PostgreSQL</Option>
            <Option value="sqlserver">SQL Server</Option>
            <Option value="kafka">Kafka</Option>
            <Option value="api">API</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          label="URL *"
          rules={[{ required: true, message: '请输入数据源URL' }]}
        >
          <Input
            value={newDatasource.url}
            onChange={(e) => setNewDatasource({ ...newDatasource, url: e.target.value })}
            placeholder="例如: jdbc:mysql://localhost:3306/database"
          />
        </Form.Item>
        
        <Form.Item label="表名/主题名">
          <Input
            value={newDatasource.tableName}
            onChange={(e) => setNewDatasource({ ...newDatasource, tableName: e.target.value })}
            placeholder="表名或Kafka主题名"
          />
        </Form.Item>
        
        <Form.Item label="描述">
          <Input.TextArea
            value={newDatasource.description}
            onChange={(e) => setNewDatasource({ ...newDatasource, description: e.target.value })}
            placeholder="数据源描述"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DatasourceModal;