import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const IndicatorModal = ({ 
  isIndicatorModalOpen, 
  editingIndicator, 
  newIndicator, 
  setNewIndicator, 
  setIsIndicatorModalOpen, 
  setEditingIndicator,
  handleSaveIndicator
}) => {
  const handleCancel = () => {
    setIsIndicatorModalOpen(false);
    setEditingIndicator(null);
    setNewIndicator({
      name: '',
      expression: '',
      returnType: 'number',
      description: ''
    });
  };

  return (
    <Modal
      title={editingIndicator ? '编辑指标' : '新建指标'}
      open={isIndicatorModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSaveIndicator}>
          {editingIndicator ? '更新' : '确定'}
        </Button>
      ]}
      width={600}
    >
      <Form layout="vertical">
        <Form.Item
          label="名称 *"
          rules={[{ required: true, message: '请输入指标名称' }]}
        >
          <Input
            value={newIndicator.name}
            onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
            placeholder="指标名称"
          />
        </Form.Item>
        
        <Form.Item
          label="表达式 *"
          rules={[{ required: true, message: '请输入指标计算表达式' }]}
        >
          <Input.TextArea
            value={newIndicator.expression}
            onChange={(e) => setNewIndicator({ ...newIndicator, expression: e.target.value })}
            placeholder="指标计算表达式"
            rows={3}
          />
        </Form.Item>
        
        <Form.Item
          label="返回类型 *"
          rules={[{ required: true, message: '请选择返回类型' }]}
        >
          <Select
            value={newIndicator.returnType}
            onChange={(value) => setNewIndicator({ ...newIndicator, returnType: value })}
            placeholder="选择返回类型"
          >
            <Option value="number">数字</Option>
            <Option value="string">字符串</Option>
            <Option value="boolean">布尔值</Option>
            <Option value="date">日期</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="描述">
          <Input.TextArea
            value={newIndicator.description}
            onChange={(e) => setNewIndicator({ ...newIndicator, description: e.target.value })}
            placeholder="指标描述"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IndicatorModal;