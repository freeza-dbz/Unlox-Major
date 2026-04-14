import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X, Code } from 'lucide-react';
import { iconList } from './iconList';

import { apiClient } from '../lib/apiClient';
type Service = {
  _id: string;
  title: string;
  description: string;
  feature?: string;
  icon: string;
  display_order: number;
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    feature: '',
    display_order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiClient.get('/api/v1/services');
      if (result.success) {
        setServices(result.data);
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
      await apiClient.delete(`/api/v1/services/${id}`);
      setSuccess('Service deleted successfully!');
      setServices(services.filter(s => s._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSave = async (id: string) => {
    const payload = { ...formData, display_order: Number(formData.display_order) };

    try {
      await apiClient.patch(`/api/v1/services/${id}`, payload);
      setSuccess('Service updated successfully!');
      setEditing(null);
      fetchServices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreate = async () => {
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description) {
      setError('Title and description are required.');
      return;
    }
    const payload = { ...formData, display_order: Number(formData.display_order) };

    try {
      await apiClient.post('/api/v1/services', payload);
      setSuccess('Service created successfully!');
      setShowForm(false);
      setFormData({ title: '', description: '', icon: '', feature: '', display_order: 0 });
      fetchServices();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getIcon = (iconName: string) => {
    if (iconName === 'Code') return <Code size={24} className="text-blue-600" />;
    return <Code size={24} className="text-gray-400" />;
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <button 
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
            setFormData({ title: '', description: '', icon: '', feature: '', display_order: 0 });
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {showForm && !editing ? 'Cancel' : 'Add Service'}
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

      {showForm && !editing && (
        <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value, })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Short Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={2}
            />
            <select
              value={formData.icon}
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
            <input
              type="number"
              placeholder="Display Order"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Features (one per line)"
              value={formData.feature}
              onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={3}
            />
            <div className="flex space-x-2">
              <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                <Check size={18} className="mr-1" /> Create
              </button>
              <button onClick={() => setShowForm(false)} className="flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                <X size={18} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            {editing === service._id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <textarea
                  placeholder="Short Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={2}
                />
                <select
                  value={formData.icon}
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
                <input
                  type="number"
                  placeholder="Display Order"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <textarea
                  placeholder="Features (one per line)"
                  value={formData.feature}
                  onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(service._id)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Check size={18} className="mr-1" /> Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    <X size={18} className="mr-1" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.feature && service.feature.split('\n').slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setEditing(service._id);
                      setFormData({
                        title: service.title,
                        description: service.description,
                        icon: service.icon,
                        feature: service.feature || '',
                        display_order: service.display_order,
                      });
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
