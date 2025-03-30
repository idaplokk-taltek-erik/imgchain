import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTRPC } from '../trpc';
import { UserContext } from './context';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const trpc = useTRPC();
  // as never hacks around trpc typings are bad if there is no input parametersπ
  const userQuery = useQuery({
    ...trpc.test.query.queryOptions(undefined as never, {}),
    retry: 2,
  });

  const value = useMemo<UserContext>(() => {
    return {
      loading: userQuery.isLoading,
      user: userQuery.data,
    };
  }, [userQuery.data, userQuery.isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
