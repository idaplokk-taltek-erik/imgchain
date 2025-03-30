import { createContext } from 'react';

export type UserContext = { loading: boolean; user: unknown };
export const UserContext = createContext<UserContext | undefined>(undefined);
