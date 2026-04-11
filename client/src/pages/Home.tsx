import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Award, Star } from 'lucide-react';
import * as Icons from 'lucide-react';

type Service = {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  icon: string;
  slug?: string;
  is_active: boolean;
  display_order: number;
};

type Metric = {
  id: string;
  title: string;
  value: string;
  description: string;
  icon?: string;
  suffix?: string;
  label?: string;
  is_active: boolean;
  display_order: number;
};

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

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  project_url?: string;
  github_url?: string;
  client_name?: string;
  kpis?: { value: string; label: string; unit: string }[];
  slug?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
};

export default function Home() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies',
      short_description: 'Custom web applications built with modern technologies',
      icon: 'Code',
      slug: 'web-development',
      is_active: true,
      display_order: 1
    },
    {
      id: '2',
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications',
      short_description: 'Native and cross-platform mobile applications',
      icon: 'Smartphone',
      slug: 'mobile-apps',
      is_active: true,
      display_order: 2
    },
    {
      id: '3',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces',
      short_description: 'Beautiful and intuitive user interfaces',
      icon: 'Palette',
      slug: 'ui-ux-design',
      is_active: true,
      display_order: 3
    }
  ]);
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: '1',
      title: 'Projects Completed',
      value: '50',
      description: 'Successful projects delivered',
      icon: 'CheckCircle',
      suffix: '+',
      label: 'Projects Completed',
      is_active: true,
      display_order: 1
    },
    {
      id: '2',
      title: 'Happy Clients',
      value: '30',
      description: 'Satisfied customers',
      icon: 'Users',
      suffix: '+',
      label: 'Happy Clients',
      is_active: true,
      display_order: 2
    }
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'CEO',
      company: 'Tech Corp',
      content: 'Excellent work and great communication.',
      rating: 5,
      is_featured: true,
      is_active: true,
      display_order: 1
    }
  ]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and MongoDB',
      image_url: '/placeholder.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      client_name: 'TechCorp',
      kpis: [
        { value: '50%', label: 'Increase in sales', unit: '%' },
        { value: '2x', label: 'Faster load times', unit: 'x' }
      ],
      slug: 'ecommerce-platform',
      is_featured: true,
      is_active: true,
      display_order: 1
    }
  ]);
  const [loading, setLoading] = useState(false);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Business With
                <span className="text-blue-600"> Digital Innovation</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                We empower enterprises with cutting-edge technology solutions that drive growth, efficiency, and competitive advantage in the digital age.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Start Your Project
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-blue-600"
                >
                  View Our Work
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl transform rotate-3 opacity-10"></div>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Digital Innovation"
                className="relative rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => {
              const Icon = getIcon(metric.icon);
              return (
                <div key={metric.id} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {metric.value}{metric.suffix}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-600 transition-colors">
                    <Icon className="text-blue-600 group-hover:text-white transition-colors" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{service.short_description}</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Learn More
                    <ArrowRight className="ml-2" size={16} />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Services
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how we've helped businesses achieve their digital goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg">{project.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-blue-600 font-semibold mb-2">{project.client_name}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.kpis.slice(0, 2).map((kpi, idx) => (
                      <div key={idx} className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                        <span className="font-bold text-gray-900">{kpi.value}{kpi.unit}</span> {kpi.label}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    View Case Study
                    <ArrowRight className="ml-2" size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Projects
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by industry leaders across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how we can help you achieve your digital goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
