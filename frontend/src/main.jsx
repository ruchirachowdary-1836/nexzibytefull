import { ClerkProvider, useClerk, useUser } from '@clerk/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkApp() {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();

  const appUser = clerkUser
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Member',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        profile_image: clerkUser.imageUrl,
        professional_role: clerkUser.publicMetadata?.professional_role || null,
        isClerkUser: true,
      }
    : null;

  return <App clerkUser={appUser} onClerkSignOut={signOut} />;
}

const application = clerkPublishableKey ? (
  <ClerkProvider publishableKey={clerkPublishableKey} afterSignOutUrl="/">
    <ClerkApp />
  </ClerkProvider>
) : <App />;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {application}
  </StrictMode>,
);