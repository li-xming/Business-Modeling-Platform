import React, { useState, useEffect } from 'react';
import ETLTaskManager from './modules/ETLTaskManager';
import ETLExecutionMonitor from './modules/ETLExecutionMonitor';
import ETLConfigurator from './modules/ETLConfigurator';

const ETLManager = () => {
  const [activeTab, setActiveTab] = useState('config');

  return (
    <div className="etl-manager">
      <div style={{ padding: '12px 16px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #e0e0e0' }}>
        <span style={{ cursor: 'pointer', color: '#1890ff', marginRight: '8px' }} onClick={() => window.location.href = '/'}>首页</span>
        <span style={{ marginRight: '8px' }}>&gt;</span>
        <span>ETL管理</span>
      </div>
      
      <div style={{ padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <h2>ETL管理平台</h2>
      </div>

      {/* Tab导航 */}
      <div className="tab-nav">
        <button
          className={activeTab === 'config' ? 'active' : ''}
          onClick={() => setActiveTab('config')}
        >
          配置管理
        </button>
        <button
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          任务管理
        </button>
        <button
          className={activeTab === 'monitor' ? 'active' : ''}
          onClick={() => setActiveTab('monitor')}
        >
          执行监控
        </button>
      </div>

      <div className="content">
        {activeTab === 'config' && <ETLConfigurator />}
        {activeTab === 'tasks' && <ETLTaskManager />}
        {activeTab === 'monitor' && <ETLExecutionMonitor />}
      </div>
    </div>
  );
};

export default ETLManager;