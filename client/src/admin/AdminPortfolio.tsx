import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2 } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
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
      is_featured: true,
      is_active: true,
      display_order: 1
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('display_order');
    if (data) setProjects(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('portfolio_projects').delete().eq('id', id);
    fetchProjects();
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Projects</h2>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} className="mr-2" />
          Add Project
        </button>
      </div>

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
