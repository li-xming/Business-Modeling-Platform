import React from 'react';

const PropertyModal = ({ 
  isPropertyModalOpen, 
  editingProperty, 
  newProperty, 
  setNewProperty, 
  setIsPropertyModalOpen, 
  setEditingProperty,
  handleSaveProperty
}) => {
  if (!isPropertyModalOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ width: '600px' }}>
        <h2>{editingProperty ? '编辑属性' : '新建属性'}</h2>
        
        <div className="form-group">
          <label>名称 *</label>
          <input
            type="text"
            value={newProperty.name}
            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
            placeholder="属性名称"
          />
        </div>
        
        <div className="form-group">
          <label>数据类型 *</label>
          <select
            value={newProperty.type}
            onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
          >
            <option value="string">字符串</option>
            <option value="text">文本</option>
            <option value="number">数字</option>
            <option value="integer">整数</option>
            <option value="boolean">布尔值</option>
            <option value="date">日期</option>
            <option value="datetime">日期时间</option>
            <option value="json">JSON</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>描述</label>
          <textarea
            value={newProperty.description}
            onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
            placeholder="属性描述"
            rows={3}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>物理字段名</label>
          <input
            type="text"
            value={newProperty.physicalColumn}
            onChange={(e) => setNewProperty({ ...newProperty, physicalColumn: e.target.value })}
            placeholder="数据库字段名"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label>长度</label>
            <input
              type="number"
              value={newProperty.length || ''}
              onChange={(e) => setNewProperty({ ...newProperty, length: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="字段长度"
            />
          </div>
          
          <div className="form-group">
            <label>精度</label>
            <input
              type="number"
              value={newProperty.precision || ''}
              onChange={(e) => setNewProperty({ ...newProperty, precision: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="小数位数"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>默认值</label>
          <input
            type="text"
            value={newProperty.defaultValue !== null ? newProperty.defaultValue.toString() : ''}
            onChange={(e) => setNewProperty({ ...newProperty, defaultValue: e.target.value || null })}
            placeholder="默认值"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={newProperty.required}
                onChange={(e) => setNewProperty({ ...newProperty, required: e.target.checked })}
              />
              必填
            </label>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={newProperty.isPrimaryKey}
                onChange={(e) => setNewProperty({ ...newProperty, isPrimaryKey: e.target.checked })}
              />
              主键
            </label>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={newProperty.isForeignKey}
                onChange={(e) => setNewProperty({ ...newProperty, isForeignKey: e.target.checked })}
              />
              外键
            </label>
          </div>
          
          <div className="form-group">
            <label>敏感级别</label>
            <select
              value={newProperty.sensitivityLevel}
              onChange={(e) => setNewProperty({ ...newProperty, sensitivityLevel: e.target.value })}
            >
              <option value="public">公开</option>
              <option value="internal">内部</option>
              <option value="private">私有</option>
              <option value="secret">机密</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>脱敏规则</label>
          <select
            value={newProperty.maskRule || ''}
            onChange={(e) => setNewProperty({ ...newProperty, maskRule: e.target.value || null })}
          >
            <option value="">无</option>
            <option value="phone_middle_4">手机号中间4位*</option>
            <option value="id_card_last_4">身份证号后4位*</option>
            <option value="name_first_1">姓名首字*</option>
            <option value="email_mask">邮箱</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>约束规则</label>
          <textarea
            value={newProperty.constraints.join('\n')}
            onChange={(e) => setNewProperty({ ...newProperty, constraints: e.target.value.split('\n').filter(Boolean) })}
            placeholder="每行一个约束规则，例如：NOT NULL, UNIQUE, MIN(0)"
            rows={4}
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button className="cancel" onClick={() => {
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
          }}>取消</button>
          <button className="submit" onClick={handleSaveProperty}>
            {editingProperty ? '更新' : '确定'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;