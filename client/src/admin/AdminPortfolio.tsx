import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  client_name?: string;
  technologies: string[];
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Full-stack solution',
      image_url: '/placeholder.jpg',
      technologies: ['React', 'Node.js'],
      client_name: 'TechCorp',
      is_featured: true,
      is_active: true,
      display_order: 1
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    client_name: '',
    technologies: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // const response = await fetch('YOUR_API_URL/projects');
    // const data = await response.json();
    // if (data) setProjects(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    // await fetch(`YOUR_API_URL/projects/${id}`, { method: 'DELETE' });
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleCreateProject = async () => {
    setError('');
    setSuccess('');
    if (!formData.title || !formData.description) {
      setError('Title and description are required.');
      return;
    }

    // await fetch(`YOUR_API_URL/projects`, { method: 'POST', body: JSON.stringify(formData) });
    
    setSuccess('Project created successfully! (dummy)');
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      client_name: '',
      technologies: '',
    });
    // After success:
    // fetchProjects();
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Projects</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} className="mr-2" />
          {showForm ? 'Cancel' : 'Add Project'}
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
          <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={2}
            />
            <input
              type="text"
              placeholder="Client Name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <div className="flex space-x-2">
              <button onClick={handleCreateProject} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                <Check size={18} className="mr-1" /> Create
              </button>
              <button onClick={() => setShowForm(false)} className="flex items-center px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                <X size={18} className="mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
              <p className="text-xs text-blue-600 mb-4">{project.client_name}</p>
              <div className="flex space-x-2">
                <button className="flex-1 p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center justify-center">
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
