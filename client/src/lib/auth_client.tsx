import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const { signIn, signOut, signUp, useSession } = createAuthClient({
  baseURL: 'http://localhost:4000',
  plugins: [adminClient()],
});
