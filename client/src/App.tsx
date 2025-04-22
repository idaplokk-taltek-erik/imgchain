import { RouterProvider } from '@tanstack/react-router';
import './App.css';

import { router } from './lib/router';
import { ThemeProvider } from './lib/theme/provider';

function InnerApp() {
  return <RouterProvider router={router} />;
}

export function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

export default App;
