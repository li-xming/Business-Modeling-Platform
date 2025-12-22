import React from 'react';

const HoverDrawer = ({ isDrawerVisible, hoveredModel, allData, relations }) => {
  if (!hoveredModel) return null;

  return (
    <div className={`hover-drawer ${isDrawerVisible ? 'visible' : ''}`}>
      <div style={{ padding: '16px' }}>
        {/* 模型节点详情 */}
        {hoveredModel.type === 'model' && (
          <>
            <h3>{hoveredModel.name}</h3>
            <p>描述: {hoveredModel.description}</p>
            <p>创建人: {hoveredModel.creator}</p>
            <p>更新时间: {hoveredModel.updatedAt}</p>
            
            {/* 模型属性列表 */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ marginBottom: '8px', color: '#3b82f6' }}>模型属性</h4>
              {allData.properties.filter(prop => prop.modelId === hoveredModel.originalId).length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #3b82f6', color: '#3b82f6' }}>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>名称</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>类型</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>必填</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>主键</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.properties
                      .filter(prop => prop.modelId === hoveredModel.originalId)
                      .map(prop => (
                        <tr key={prop.id} style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                          <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>{prop.name}</td>
                          <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>{prop.type}</td>
                          <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>{prop.required ? '是' : '否'}</td>
                          <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>{prop.isPrimaryKey ? '是' : '否'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0' }}>暂无属性</p>
              )}
            </div>
            
            {/* 模型关系列表 */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ marginBottom: '8px', color: '#3b82f6' }}>模型关系</h4>
              {relations.filter(rel => rel.sourceModel === hoveredModel.name || rel.targetModel === hoveredModel.name).length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #3b82f6', color: '#3b82f6' }}>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>关系名称</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>相关模型</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>关系类型</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relations
                      .filter(rel => rel.sourceModel === hoveredModel.name || rel.targetModel === hoveredModel.name)
                      .map(rel => {
                        const relatedModel = rel.sourceModel === hoveredModel.name ? rel.targetModel : rel.sourceModel;
                        const relationDirection = rel.sourceModel === hoveredModel.name ? '→' : '←';
                        return (
                          <tr key={rel.id} style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>{rel.name}</td>
                            <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>
                              {rel.sourceModel} {relationDirection} {rel.targetModel}
                            </td>
                            <td style={{ padding: '4px 8px', color: '#cbd5e1' }}>{rel.type}</td>
                            <td style={{ padding: '4px 8px', color: rel.enabled ? '#10b981' : '#ef4444' }}>
                              {rel.enabled ? '启用' : '禁用'}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              ) : (
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0' }}>暂无关系</p>
              )}
            </div>
          </>
        )}
        
        {/* 属性节点详情 */}
        {hoveredModel.type === 'property' && (
          <>
            <h3>{hoveredModel.name}</h3>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '8px' }}>
              <p>描述: {hoveredModel.description}</p>
              <p>类型: {hoveredModel.type}</p>
              <p>必填: {hoveredModel.required ? '是' : '否'}</p>
              <p>主键: {hoveredModel.isPrimaryKey ? '是' : '否'}</p>
              <p>外键: {hoveredModel.isForeignKey ? '是' : '否'}</p>
              <p>物理字段: {hoveredModel.physicalColumn || '未设置'}</p>
              <p>敏感级别: {hoveredModel.sensitivityLevel || '公开'}</p>
              <p>默认值: {hoveredModel.defaultValue !== null ? hoveredModel.defaultValue : '未设置'}</p>
              <p>脱敏规则: {hoveredModel.maskRule || '无'}</p>
              {hoveredModel.constraints && hoveredModel.constraints.length > 0 && (
                <p>约束规则: {hoveredModel.constraints.join(', ')}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HoverDrawer;