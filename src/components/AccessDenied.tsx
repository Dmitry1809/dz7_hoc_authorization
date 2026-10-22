import React from 'react';

export const AccessDenied: React.FC = () => {
  return (
    <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
      У вас нет прав для просмотра этого раздела.
    </div>
  );
};
