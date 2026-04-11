import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X } from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1/testimonials";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const getAuthHeaders = () => {
    let token = localStorage.getItem('token');
    
    // Fallback if token wasn't saved correctly but exists in the user object
    if (!token || token === 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      token = userData?.accessToken || userData?.token || '';
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token');
        }
        throw new Error('Failed to fetch testimonials');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setTestimonials(result.data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete testimonial');
      }

      setSuccess('Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial');
    }
  };

  const handleSave = async (id: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          content: formData.content,
          rating: formData.rating,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update testimonial');
      }

      if (result.success) {
        setSuccess('Testimonial updated successfully!');
        setEditing(null);
        fetchTestimonials();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update testimonial');
    }
  };

  const handleCreate = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          company: formData.company,
          content: formData.content,
          rating: formData.rating,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create testimonial');
      }

      if (result.success) {
        setSuccess('Testimonial created successfully!');
        setShowForm(false);
        setFormData({
          name: '',
          role: '',
          company: '',
          content: '',
          rating: 5,
        });
        fetchTestimonials();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create testimonial');
    }
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <button 
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Testimonial'}
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
          <h3 className="text-lg font-semibold mb-4">Add New Testimonial</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Client Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Position"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Testimonial"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={3}
            />
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleCreate}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Check size={18} className="mr-1" /> Create
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: '',
                    role: '',
                    company: '',
                    content: '',
                    rating: 5,
                  });
                }}
                className="flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                <X size={18} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            {editing === testimonial._id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <textarea
                  placeholder="Testimonial"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                />
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(testimonial._id)}
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
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {testimonial.role} at {testimonial.company}
                  </p>
                  <p className="text-gray-700 mb-2 italic">"{testimonial.content}"</p>
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditing(testimonial._id);
                      setFormData({
                        name: testimonial.name,
                        role: testimonial.role,
                        company: testimonial.company,
                        content: testimonial.content,
                        rating: testimonial.rating,
                      });
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
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