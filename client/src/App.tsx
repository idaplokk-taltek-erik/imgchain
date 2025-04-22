import { RouterProvider } from '@tanstack/react-router';
import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { router } from './lib/router';
import { ThemeProvider } from './lib/theme/provider';
import { trpcHooks } from './lib/trpc';

function InnerApp() {
  return <RouterProvider router={router} />;
}

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcHooks.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:4000/trpc',
        }),
      ],
    }),
  );

  return (
    <trpcHooks.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <InnerApp />
        </ThemeProvider>
      </QueryClientProvider>
    </trpcHooks.Provider>
  );
}

export default App;
