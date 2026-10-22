import React from 'react';
import type { CurrentUser } from '../types';

interface AdminPanelProps {
  currentUser?: CurrentUser | null;
  title?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, title = 'Панель управления' }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '10px' }}>
      <h2>{title}</h2>
      <p>Добро пожаловать в админку!</p>
      <p>Ваши роли: {currentUser?.roles.join(', ')}</p>
    </div>
  );
};
