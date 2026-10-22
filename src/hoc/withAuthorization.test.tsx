import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { withAuthorization } from './withAuthorization';
import type { CurrentUser } from '../types';

// Простой тестовый компонент, который мы будем защищать
interface MockComponentProps {
  title: string;
}
const MockComponent: React.FC<MockComponentProps> = ({ title }) => (
  <div>Основной контент: {title}</div>
);

// Кастомный компонент ошибки для проверки альтернативной заглушки
const CustomFallback: React.FC = () => <div>Кастомная ошибка доступа</div>;

describe('withAuthorization HOC', () => {
  const allowedRoles = ['admin', 'manager'];
  const ProtectedComponent = withAuthorization(MockComponent, allowedRoles);

  test('Доступ разрешён: рендерится целевой компонент, если у пользователя есть нужная роль', () => {
    const user: CurrentUser = { roles: ['admin'] };

    render(<ProtectedComponent currentUser={user} title="Панель" />);

    expect(screen.getByText('Основной контент: Панель')).toBeInTheDocument();
    expect(screen.queryByText('У вас нет прав для просмотра этого раздела.')).not.toBeInTheDocument();
  });

  test('Доступ разрешён: работает, если у пользователя несколько ролей и одна совпадает', () => {
    const user: CurrentUser = { roles: ['user', 'manager'] };

    render(<ProtectedComponent currentUser={user} title="Панель" />);

    expect(screen.getByText('Основной контент: Панель')).toBeInTheDocument();
  });

  test('Доступ запрещён: рендерится стандартная заглушка AccessDenied, если роли не совпадают', () => {
    const user: CurrentUser = { roles: ['user'] };

    render(<ProtectedComponent currentUser={user} title="Панель" />);

    expect(screen.queryByText('Основной контент: Панель')).not.toBeInTheDocument();
    expect(screen.getByText('У вас нет прав для просмотра этого раздела.')).toBeInTheDocument();
  });

  test('Данные пользователя отсутствуют: рендерится заглушка, если currentUser равен null или undefined', () => {
    render(<ProtectedComponent currentUser={null} title="Панель" />);

    expect(screen.queryByText('Основной контент: Панель')).not.toBeInTheDocument();
    expect(screen.getByText('У вас нет прав для просмотра этого раздела.')).toBeInTheDocument();
  });

  test('Кастомная заглушка: рендерится переданный FallbackComponent в случае отказа в доступе', () => {
    const ProtectedWithCustomFallback = withAuthorization(MockComponent, allowedRoles, CustomFallback);
    const user: CurrentUser = { roles: ['user'] };

    render(<ProtectedWithCustomFallback currentUser={user} title="Панель" />);

    expect(screen.queryByText('Основной контент: Панель')).not.toBeInTheDocument();
    expect(screen.queryByText('У вас нет прав для просмотра этого раздела.')).not.toBeInTheDocument();
    expect(screen.getByText('Кастомная ошибка доступа')).toBeInTheDocument();
  });
});
