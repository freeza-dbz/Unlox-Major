import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import * as Icons from 'lucide-react';

type Service = {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  image_url: string;
  slug: string;
  features: string[];
  is_active: boolean;
  display_order: number;
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service] = useState<Service>({
    id: '1',
    title: 'Web Development',
    short_description: 'Custom web applications built with modern technologies.',
    full_description: 'We design and build custom web applications using modern frameworks, secure APIs, and scalable architecture to help your business grow.',
    icon: 'Code',
    image_url: '/placeholder.jpg',
    slug: 'web-development',
    features: ['Responsive design', 'API integration', 'Performance optimization', 'Maintenance & support'],
    is_active: true,
    display_order: 1
  });

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  const Icon = getIcon(service.icon);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <ArrowRight size={16} className="mr-2 rotate-180" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
                <Icon className="text-blue-600" size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{service.title}</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{service.short_description}</p>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div className="relative">
              <img
                src={service.image_url}
                alt={service.title}
                className="rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Overview</h2>
          <div className="prose prose-lg text-gray-600 leading-relaxed">
            <p>{service.full_description}</p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {service.features.map((feature, idx) => (
              <div key={idx} className="flex items-start space-x-3 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Check className="text-blue-600" size={16} />
                  </div>
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss how {service.title.toLowerCase()} can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
