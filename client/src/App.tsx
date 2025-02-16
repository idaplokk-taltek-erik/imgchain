import './App.css';

import { RouterProvider } from './lib/router';
import { TrpcProvider } from './lib/trpc_provider';

export function App() {
  return (
    <TrpcProvider>
      <RouterProvider />
    </TrpcProvider>
  );
}

export default App;
