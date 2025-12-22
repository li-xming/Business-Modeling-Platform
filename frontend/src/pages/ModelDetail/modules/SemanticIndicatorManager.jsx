import React, { useState, useEffect } from 'react';

const SemanticIndicatorManager = ({ 
  semanticIndicators,
  setSemanticIndicators,
  boundIndicators,
  setBoundIndicators,
  showNotification,
  showConfirmDialog,
  isIndicatorModalOpen,
  setIsIndicatorModalOpen,
  editingIndicator,
  setEditingIndicator,
  newIndicator,
  setNewIndicator,
  modelId
}) => {
  // 处理创建指标
  const handleCreateIndicator = () => {
    fetch('/api/indicator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIndicator)
    })
      .then(response => response.json())
      .then(indicator => {
        setSemanticIndicators([...semanticIndicators, indicator]);
        setIsIndicatorModalOpen(false);
        setEditingIndicator(null);
        setNewIndicator({
          name: '',
          expression: '',
          returnType: 'number',
          description: ''
        });
        showNotification('指标创建成功');
      })
      .catch(error => {
        console.error('Failed to create indicator:', error);
        showNotification('指标创建失败', 'error');
      });
  };

  // 处理编辑指标
  const handleEditIndicator = (indicator) => {
    setEditingIndicator(indicator);
    setNewIndicator(indicator);
    setIsIndicatorModalOpen(true);
  };

  // 处理更新指标
  const handleUpdateIndicator = () => {
    fetch(`/api/indicator/${editingIndicator.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIndicator)
    })
      .then(response => response.json())
      .then(updatedIndicator => {
        setSemanticIndicators(semanticIndicators.map(i => i.id === updatedIndicator.id ? updatedIndicator : i));
        setIsIndicatorModalOpen(false);
        setEditingIndicator(null);
        setNewIndicator({
          name: '',
          expression: '',
          returnType: 'number',
          description: ''
        });
        showNotification('指标更新成功');
      })
      .catch(error => {
        console.error('Failed to update indicator:', error);
        showNotification('指标更新失败', 'error');
      });
  };

  // 保存指标（创建或更新）
  const handleSaveIndicator = () => {
    if (editingIndicator) {
      handleUpdateIndicator();
    } else {
      handleCreateIndicator();
    }
  };

  // 处理删除指标
  const handleDeleteIndicator = (id) => {
    showConfirmDialog(
      '删除确认',
      '确定要删除该指标吗？删除后无法恢复。',
      () => {
        fetch(`/api/indicator/${id}`, { method: 'DELETE' })
          .then(() => {
            setSemanticIndicators(semanticIndicators.filter(indicator => indicator.id !== id));
            showNotification('指标删除成功');
          })
          .catch(error => {
            console.error('Failed to delete indicator:', error);
            showNotification('指标删除失败', 'error');
          });
      }
    );
  };

  // 绑定指标到模型
  const handleBindIndicator = (indicator) => {
    // 检查是否已经绑定
    if (boundIndicators.find(b => b.id === indicator.id)) {
      showNotification('该指标已绑定到当前模型', 'error');
      return;
    }

    // 发送绑定请求
    fetch(`/api/model/${modelId}/indicator/${indicator.id}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          setBoundIndicators([...boundIndicators, indicator]);
          showNotification(`指标 "${indicator.name}" 绑定成功`);
        } else {
          throw new Error('绑定失败');
        }
      })
      .catch(error => {
        console.error('Failed to bind indicator:', error);
        showNotification('指标绑定失败', 'error');
      });
  };

  // 解绑指标
  const handleUnbindIndicator = (id) => {
    fetch(`/api/model/${modelId}/indicator/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setBoundIndicators(boundIndicators.filter(indicator => indicator.id !== id));
          showNotification('指标解绑成功');
        } else {
          throw new Error('解绑失败');
        }
      })
      .catch(error => {
        console.error('Failed to unbind indicator:', error);
        showNotification('指标解绑失败', 'error');
      });
  };

  return (
    <div className="semantic-indicator-manager">
      <div className="header-toolbar">
        <div>
          <button onClick={() => setIsIndicatorModalOpen(true)}>
            新建指标
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="搜索指标名称..."
            onChange={(e) => console.log('搜索指标:', e.target.value)}
          />
          <button onClick={() => console.log('导出指标')}>导出</button>
          <button onClick={() => console.log('导入指标')}>导入</button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', padding: '20px' }}>
        {/* 左侧可选指标 */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', backgroundColor: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '18px' }}>可用指标</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{semanticIndicators.length} 个指标</span>
          </div>
          <div style={{ padding: '20px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            {semanticIndicators.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '40px 0' }}>
                <p>暂无可用指标</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {semanticIndicators.map(indicator => (
                  <div key={indicator.id} className="card" style={{ padding: '16px', margin: 0, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{indicator.name}</h4>
                      <span className={`status-badge ${indicator.status}`}>
                        {indicator.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      <strong>表达式:</strong> <code>{indicator.expression}</code>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      <strong>返回类型:</strong> {indicator.returnType}
                    </div>
                    <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {indicator.description}
                    </div>
                    <button 
                      onClick={() => handleBindIndicator(indicator)}
                      disabled={boundIndicators.find(b => b.id === indicator.id)}
                      className={boundIndicators.find(b => b.id === indicator.id) ? 'disabled' : 'edit'}
                      style={{ 
                        padding: '6px 14px', 
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all var(--transition-fast)',
                        border: 'none',
                        cursor: 'pointer',
                        background: boundIndicators.find(b => b.id === indicator.id) ? 'var(--bg-tertiary)' : 'var(--success-color)',
                        color: boundIndicators.find(b => b.id === indicator.id) ? 'var(--text-secondary)' : 'white',
                        boxShadow: boundIndicators.find(b => b.id === indicator.id) ? 'none' : '0 2px 4px rgba(16, 185, 129, 0.2)',
                        width: 'auto',
                        alignSelf: 'flex-start'
                      }}
                    >
                      {boundIndicators.find(b => b.id === indicator.id) ? '已绑定' : '绑定'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧已绑定指标 */}
        <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', backgroundColor: 'var(--success-light)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--success-color)', margin: 0, fontSize: '18px' }}>已绑定指标</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{boundIndicators.length} 个指标</span>
          </div>
          <div style={{ padding: '20px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
            {boundIndicators.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '40px 0' }}>
                <p>暂无绑定的指标</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>从左侧选择指标进行绑定</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                {boundIndicators.map(indicator => (
                  <div key={indicator.id} className="card" style={{ padding: '16px', margin: 0, borderLeft: '4px solid var(--success-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{indicator.name}</h4>
                      <span className={`status-badge ${indicator.status}`}>
                        {indicator.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      <strong>表达式:</strong> <code>{indicator.expression}</code>
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                      <strong>返回类型:</strong> {indicator.returnType}
                    </div>
                    <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {indicator.description}
                    </div>
                    <button 
                      onClick={() => handleUnbindIndicator(indicator.id)}
                      className="delete"
                      style={{ 
                        padding: '6px 14px', 
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all var(--transition-fast)',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'var(--error-color)',
                        color: 'white',
                        width: 'auto',
                        alignSelf: 'flex-start'
                      }}
                    >
                      解绑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticIndicatorManager;