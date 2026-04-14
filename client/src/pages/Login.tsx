import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const URL = `${import.meta.env.VITE_API_URL}/api/v1/users/login`;

const storeTokenInLS = (token: string) => {
  localStorage.setItem('token', token);
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { email, password };

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const res_data = await response.json();
      // console.log("Login response from server ", res_data);
      

      if (response.ok) {
        // Success case
        if (res_data.data?.accessToken) {
          storeTokenInLS(res_data.data.accessToken);
        } else if (res_data.data?.refreshToken) {
          storeTokenInLS(res_data.data.refreshToken);
        } else if (res_data.token) {
          storeTokenInLS(res_data.token);
        }

        if (res_data.success) {
          localStorage.setItem('user', JSON.stringify(res_data.data));
        }

        Swal.fire({
          position: "center",
          icon: "success",
          title: "You are logged in",
          showConfirmButton: false,
          timer: 1500,
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
          },
        });

        setTimeout(() => {
          navigate('/');
        }, 1600);
      } else {
        // Error case - get message from server response
        console.log('Login error response:', response.status, res_data);
        const errorMessage = 
          res_data?.message || 
          res_data?.error?.message || 
          res_data?.error || 
          `Login failed with status ${response.status}. Please try again.`;
        
        setError(errorMessage);

        // Also show error in SweetAlert for better visibility
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
          showClass: {
            popup: `
              animate__animated
              animate__fadeInUp
              animate__faster
            `,
          },
          hideClass: {
            popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster
            `,
          },
        });
      }
    } catch (err) {
      console.error('Login network error:', err);
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMsg);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error",
        text: errorMsg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <LogIn className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Sign in to manage your website content
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                placeholder="admin@outpro.india"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-center text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-600 mb-3">Demo Credentials</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700"><span className="font-semibold">Email:</span> demo@outpro.india</p>
            <p className="text-gray-700"><span className="font-semibold">Password:</span> demo123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
