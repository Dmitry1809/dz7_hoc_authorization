import React from 'react';
import { AccessDenied } from '../components/AccessDenied';
import type { CurrentUser } from '../types';

interface WithAuthorizationProps {
  currentUser?: CurrentUser | null;
}

export function withAuthorization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[],
  FallbackComponent: React.ComponentType = AccessDenied // Кастомный компонент по умолчанию
) {
  const WithAuthorization: React.FC<Omit<P, 'currentUser'> & WithAuthorizationProps> = (props) => {
    const { currentUser, ...restProps } = props;

    // 1. Если данные пользователя отсутствуют
    if (!currentUser || !currentUser.roles || !Array.isArray(currentUser.roles)) {
      return <FallbackComponent />;
    }

    // 2. Проверяем наличие хотя бы одной разрешенной роли
    const hasAccess = currentUser.roles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
      return <FallbackComponent />;
    }

    // 3. Доступ разрешен
    return <WrappedComponent {...(restProps as unknown as P)} />;
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuthorization.displayName = `WithAuthorization(${displayName})`;

  return React.memo(WithAuthorization);
}
