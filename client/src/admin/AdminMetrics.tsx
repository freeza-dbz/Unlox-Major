import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { iconList } from './iconList';

type Metric = {
  _id: string;
  title: string;
  value: string;
  description?: string;
  icon?: string;
  suffix?: string;
  label?: string;
  is_active: boolean;
  display_order: number;
};

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/metrics`;

export default function AdminMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    description: '',
    icon: '',
    suffix: '',
    label: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const result = await response.json();
      if (result.success) {
        setMetrics(result.data);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete metric.');
      }
      setSuccess('Metric deleted successfully!');
      setMetrics(metrics.filter(m => m._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async () => {
    if (editingId) {
      await handleUpdateMetric(editingId);
    } else {
      await handleCreateMetric();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      value: '',
      description: '',
      icon: '',
      suffix: '',
      label: '',
      is_active: true,
      display_order: 0,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const preparePayload = () => {
    if (!formData.title || !formData.value) {
      setError('Title and value are required.');
      return null;
    }
    return { ...formData, display_order: Number(formData.display_order) };
  }

  const handleCreateMetric = async () => { 
    setError('');
    setSuccess('');
    const payload = preparePayload();
    if (!payload) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to create metric.');

      setSuccess('Metric created successfully!');
      setShowForm(false);
      resetForm();
      fetchMetrics();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateMetric = async (id: string) => {
    setError('');
    setSuccess('');
    const payload = preparePayload();
    if (!payload) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update metric.');

      setSuccess('Metric updated successfully!');
      setShowForm(false);
      resetForm();
      fetchMetrics();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Metrics</h2>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) resetForm();
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Metric'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {showForm && (
        <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Metric' : 'Add New Metric'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title (e.g., Projects Completed)" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Value (e.g., 500)" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Suffix (e.g., +)" value={formData.suffix || ''} onChange={(e) => setFormData({ ...formData, suffix: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <select
              value={formData.icon || ''}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select an icon</option>
              {iconList.map((iconName) => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>
            <input type="text" placeholder="Label (e.g., Projects Completed)" value={formData.label || ''} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded md:col-span-2" />
            <input type="number" placeholder="Display Order" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded" />
            <div className="flex items-center space-x-4 md:col-span-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                <span>Active</span>
              </label>
            </div>
            <div className="flex space-x-2 md:col-span-2">
              <button onClick={handleFormSubmit} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                <Check size={18} className="mr-1" /> {editingId ? 'Save' : 'Create'}
              </button>
              <button onClick={handleCancel} className="flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                <X size={18} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric._id} className="border border-gray-200 rounded-lg p-4 text-center">
            <h3 className="font-bold text-gray-900 text-lg">{metric.title}</h3>
            <p className="text-3xl font-bold text-blue-600 my-2">{metric.value}{metric.suffix}</p>
            <p className="text-sm text-gray-500">{metric.label}</p>
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => {
                  setEditingId(metric._id);
                  setFormData({
                    title: metric.title,
                    value: metric.value,
                    description: metric.description || '',
                    icon: metric.icon || '',
                    suffix: metric.suffix || '',
                    label: metric.label || '',
                    is_active: metric.is_active,
                    display_order: metric.display_order,
                  });
                  setShowForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center justify-center"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(metric._id)}
                className="flex-1 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}