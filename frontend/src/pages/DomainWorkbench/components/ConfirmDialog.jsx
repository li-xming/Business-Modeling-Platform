import React from 'react';

const ConfirmDialog = ({ confirmDialog, closeConfirmDialog }) => {
  if (!confirmDialog.show) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h2>{confirmDialog.title}</h2>
        <p style={{ margin: '20px 0', color: '#666' }}>{confirmDialog.message}</p>
        <div className="form-actions">
          <button className="cancel" onClick={closeConfirmDialog}>取消</button>
          <button className="delete" onClick={confirmDialog.onConfirm}>确认删除</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;