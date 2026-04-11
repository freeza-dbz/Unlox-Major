import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  slug: string;
  short_description: string;
  full_description: string;
  features: string[];
};

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Web Development',
      description: 'Custom web applications',
      icon: 'Code',
      is_active: true,
      display_order: 1,
      slug: 'web-development',
      short_description: 'Custom web applications',
      full_description: 'Full description here',
      features: ['Feature 1', 'Feature 2']
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon: '',
    features: '',
  });

  useEffect(() => {
    // fetchServices();
  }, []);

  const fetchServices = async () => {
    // Dummy
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('services').delete().eq('id', id);
    fetchServices();
  };

  const handleSave = async (id: string) => {
    const features = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f);

    await supabase
      .from('services')
      .update({
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description,
        full_description: formData.full_description,
        icon: formData.icon,
        features: features as any,
      })
      .eq('id', id);

    setEditing(null);
    fetchServices();
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} className="mr-2" />
          Add Service
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            {editing === service.id ? (
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
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={2}
                />
                <textarea
                  placeholder="Features (one per line)"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(service.id)}
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
                  <p className="text-gray-600 mb-3">{service.short_description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setEditing(service.id);
                      setFormData({
                        title: service.title,
                        slug: service.slug,
                        short_description: service.short_description,
                        full_description: service.full_description,
                        icon: service.icon,
                        features: service.features.join('\n'),
                      });
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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
