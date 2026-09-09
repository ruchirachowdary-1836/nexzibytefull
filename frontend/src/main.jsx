import { ClerkProvider } from '@clerk/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const application = clerkPublishableKey ? (
  <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
    <App />
  </ClerkProvider>
) : <App />;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {application}
  </StrictMode>,
);