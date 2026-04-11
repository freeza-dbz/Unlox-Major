import { useEffect, useState } from 'react';
import { Plus, Trash2, CreditCard as Edit2, Check, X } from 'lucide-react';

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'CEO',
      company: 'Tech Corp',
      content: 'Great work!',
      rating: 5,
      is_featured: true,
      is_active: true,
      display_order: 1
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_position: '',
    client_company: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order');
    if (data) setTestimonials(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchTestimonials();
  };

  const handleSave = async (id: string) => {
    await supabase
      .from('testimonials')
      .update({
        client_name: formData.client_name,
        client_position: formData.client_position,
        client_company: formData.client_company,
        content: formData.content,
        rating: formData.rating,
      })
      .eq('id', id);

    setEditing(null);
    fetchTestimonials();
  };

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} className="mr-2" />
          Add Testimonial
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            {editing === testimonial.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={formData.client_position}
                  onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={formData.client_company}
                  onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
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
                    onClick={() => handleSave(testimonial.id)}
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
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{testimonial.client_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {testimonial.client_position} at {testimonial.client_company}
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
                      setEditing(testimonial.id);
                      setFormData({
                        client_name: testimonial.client_name,
                        client_position: testimonial.client_position,
                        client_company: testimonial.client_company,
                        content: testimonial.content,
                        rating: testimonial.rating,
                      });
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
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
