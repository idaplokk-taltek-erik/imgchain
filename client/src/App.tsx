import { RouterProvider } from '@tanstack/react-router';
import './App.css';

import { router } from './lib/router';
import { TrpcProvider } from './lib/trpc_provider';
import { useUser } from './lib/user/helpers';
import { UserProvider } from './lib/user/provider';

function InnerApp() {
  const user = useUser();

  if (user.loading) {
    return 'Loading...'
  }

  return <RouterProvider router={router} context={{ user }} />;
}

export function App() {
  return (
    <TrpcProvider>
      <UserProvider>
        <InnerApp />
      </UserProvider>
    </TrpcProvider>
  );
}

export default App;
