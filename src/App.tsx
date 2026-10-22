import React, { useState } from 'react';
import { withAuthorization } from './hoc/withAuthorization';
import { AdminPanel } from './components/AdminPanel';
import type { CurrentUser } from './types';

// Оборачиваем панель администратора в HOC, разрешая доступ только для 'admin'
const ProtectedAdminPanel = withAuthorization(AdminPanel, ['admin']);

export const App: React.FC = () => {
  // Симулируем различные состояния пользователя для демонстрации
  const [userState, setUserState] = useState<{ label: string; data: CurrentUser | null }>({
    label: 'Администратор',
    data: { roles: ['admin', 'user'] },
  });

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto' }}>
      <h1>Пример контроля доступа через HOC</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setUserState({ label: 'Администратор', data: { roles: ['admin', 'user'] } })}>
          Войти как Admin
        </button>
        <button onClick={() => setUserState({ label: 'Обычный пользователь', data: { roles: ['user'] } })}>
          Войти как User
        </button>
        <button onClick={() => setUserState({ label: 'Гость (Не авторизован)', data: null })}>
          Выйти из системы
        </button>
      </div>

      <p>Текущий статус: <strong>{userState.label}</strong></p>
      <hr />

      {/* Рендерим защищенный компонент. Он также принимает кастомный пропс title */}
      <ProtectedAdminPanel 
        currentUser={userState.data} 
        title="Секретная панель администратора" 
      />
    </div>
  );
};

export default App;
