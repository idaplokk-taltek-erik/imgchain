import { useContext } from 'react';
import { UserContext } from './context';

export const useUser = (): UserContext => {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error('useUser can only be called within UserContext');
  }

  return ctx;
};
