import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  client_name: string;
  kpis: { value: string; label: string; unit: string }[];
  completion_date?: string;
  slug: string;
  project_url?: string;
  github_url?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

export default function Portfolio() {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration and user dashboards.',
      image_url: '/placeholder.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      client_name: 'TechCorp',
      kpis: [
        { value: '65', label: 'Conversion lift', unit: '%' },
        { value: '40', label: 'Faster page load', unit: '%' }
      ],
      completion_date: '2025-10-15',
      slug: 'ecommerce-platform',
      is_featured: true,
      is_active: true,
      display_order: 1
    },
    {
      id: '2',
      title: 'Portfolio Website',
      description: 'A modern portfolio platform with admin editing and rich visuals.',
      image_url: '/placeholder.jpg',
      technologies: ['React', 'TypeScript', 'Tailwind'],
      client_name: 'Creator Studio',
      kpis: [
        { value: '100', label: 'Portfolio launches', unit: '+' },
        { value: '20', label: 'Design iterations', unit: '+' }
      ],
      completion_date: '2025-08-20',
      slug: 'portfolio-website',
      is_featured: true,
      is_active: true,
      display_order: 2
    }
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore our successful projects and see how we've helped businesses achieve their digital transformation goals.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-1">{project.title}</h3>
                    <p className="text-blue-300 text-sm font-semibold">{project.client_name}</p>
                  </div>
                  {project.is_featured && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {project.kpis.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {project.kpis.slice(0, 2).map((kpi, idx) => (
                        <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {kpi.value}{kpi.unit}
                          </div>
                          <div className="text-xs text-gray-600">{kpi.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {project.completion_date && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar size={14} className="mr-1" />
                      {new Date(project.completion_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </div>
                  )}

                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    View Case Study
                    <ArrowRight className="ml-2" size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's create something amazing together.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get In Touch
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
