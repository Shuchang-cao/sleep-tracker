// src/middleware/auth.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/lib/auth'; // Make sure this import path is correct
import { useEffect, useState } from 'react';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await auth.api.getSession();
        setSession(session); // Update the session state
      } catch (error) {
        setSession(null); // If the session is not found or an error occurs
      } finally {
        setLoading(false); // Done loading
      }
    }

    fetchSession(); // Fetch the session on component mount
  }, []);

  // While session is loading, you can show a loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is no session (user is not authenticated)
  if (!session?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
