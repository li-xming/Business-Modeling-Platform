import React from 'react';

const Notification = ({ notification }) => {
  if (!notification.show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease'
    }}>
      {notification.message}
    </div>
  );
};

export default Notification;