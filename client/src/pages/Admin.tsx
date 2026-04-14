import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BarChart3, Settings, Briefcase, MessageSquare, UserCheck, ConciergeBell, UsersRound, TrendingUp, Mail } from 'lucide-react';
import AdminServices from '../admin/AdminServices';
import AdminPortfolio from '../admin/AdminPortfolio';
import AdminTestimonials from '../admin/AdminTestimonials';
import AdminTeam from '../admin/AdminTeam';
import AdminContact from '../admin/AdminContact';
import AdminMetrics from '../admin/AdminMetrics';
import AdminSettings from '../admin/AdminSettings';
import AdminUsers from '../admin/AdminUsers';
import Swal from 'sweetalert2';

const LOGOUT_URL = `${import.meta.env.VITE_API_URL}/api/v1/users/logout`;

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(LOGOUT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out.",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate('/');
      } else {
        // Even if logout fails, clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      }
    } catch (err) {
      // Even if error, clear local storage
      console.error('Logout error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: ConciergeBell },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'metrics', label: 'Metrics', icon: TrendingUp },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'team', label: 'Team', icon: UsersRound },
    { id: 'users', label: 'Users', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 p-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'services' && <AdminServices />}
          {activeTab === 'portfolio' && <AdminPortfolio />}
          {activeTab === 'testimonials' && <AdminTestimonials />}
          {activeTab === 'contact' && <AdminContact />}
          {activeTab === 'metrics' && <AdminMetrics />}
          {activeTab === 'team' && <AdminTeam />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

type Metric = {
  _id: string;
  title: string;
  value: string;
  suffix?: string;
};

function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/metrics`);
        const result = await response.json();
        if (result.success) {
          setMetrics(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div key={metric._id} className={`bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg`}>
              <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}{metric.suffix}</div>
              <div className="text-gray-700">{metric.title}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Content Overview</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Manage your services and offerings</li>
              <li>• Update portfolio projects and case studies</li>
              <li>• Publish client testimonials</li>
              <li>• Customize company information</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Tips</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Keep content fresh and up-to-date</li>
              <li>• Use high-quality images for projects</li>
              <li>• Add detailed descriptions for services</li>
              <li>• Regularly update testimonials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
