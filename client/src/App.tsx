import { RouterProvider } from '@tanstack/react-router';
import './App.css';

import { router } from './lib/router';
import { ThemeProvider } from './lib/theme/provider';
import { TrpcProvider } from './lib/trpc_provider';

function InnerApp() {
  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <ThemeProvider>
      <TrpcProvider>
        <InnerApp />
      </TrpcProvider>
    </ThemeProvider>
  );
}

export default App;
