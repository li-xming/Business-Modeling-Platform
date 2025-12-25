import React from 'react';

const TableListModal = ({ 
  isOpen, 
  onClose, 
  datasourceName, 
  tables = [], 
  onTableClick 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '600px', maxHeight: '80vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h3>{datasourceName} - 数据表列表</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="table-list">
            {tables.length > 0 ? (
              <ul>
                {tables.map((table, index) => (
                  <li 
                    key={index} 
                    className="table-item" 
                    onClick={() => onTableClick(table)}
                  >
                    <span className="table-name">{table}</span>
                    <button className="view-button">查看数据</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-tables">
                <p>该数据源没有数据表</p>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableListModal;