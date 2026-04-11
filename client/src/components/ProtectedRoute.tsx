import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.isAdmin || user?.user?.isAdmin;

  useEffect(() => {
    // Check for admin role if a user is present
    if (user && !isAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized Request',
        text: 'You are not authorized! Admin privileges are required.',
        confirmButtonColor: '#3085d6',
      });
    }
  }, [user, isAdmin]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
}
