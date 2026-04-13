import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(storedUser);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }

    // This listens for storage changes to sync auth state across tabs.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        try {
          const storedUser = JSON.parse(event.newValue || 'null');
          setUser(storedUser);
        } catch (e) {
          setUser(null);
        }
      }
      // If token is removed, user should be logged out.
      if (event.key === 'token' && !event.newValue) {
        setUser(null);
        localStorage.removeItem('user');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isAdmin = user?.isAdmin || user?.user?.isAdmin;

  useEffect(() => {
    // Check for admin role if a user is present and the route is admin-only
    if (!loading && adminOnly && user && !isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized Request',
        text: 'You are not authorized! Admin privileges are required.',
        confirmButtonColor: '#3085d6',
      });
    }
  }, [user, isAdmin, adminOnly, loading]);

  if (loading) {
    // You can replace this with your <LoadingSpinner /> component
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
}
