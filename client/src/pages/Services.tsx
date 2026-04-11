import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

type Service = {
  id: string;
  title: string;
  short_description: string;
  icon: string;
  slug: string;
  features: string[];
  is_active: boolean;
  display_order: number;
};

export default function Services() {
  const [services] = useState<Service[]>([
    {
      id: '1',
      title: 'Web Development',
      short_description: 'Custom web applications built with modern technologies.',
      icon: 'Code',
      slug: 'web-development',
      features: ['Responsive design', 'API integration', 'Performance optimization'],
      is_active: true,
      display_order: 1
    },
    {
      id: '2',
      title: 'Mobile Apps',
      short_description: 'Native and cross-platform mobile applications for your business.',
      icon: 'Smartphone',
      slug: 'mobile-apps',
      features: ['iOS & Android', 'Push notifications', 'App store publishing'],
      is_active: true,
      display_order: 2
    },
    {
      id: '3',
      title: 'UI/UX Design',
      short_description: 'Beautiful and intuitive user experiences across devices.',
      icon: 'Palette',
      slug: 'ui-ux-design',
      features: ['User research', 'Prototyping', 'Design systems'],
      is_active: true,
      display_order: 3
    }
  ]);

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Circle;
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive digital solutions designed to transform your business and drive measurable results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 group"
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl group-hover:bg-blue-600 transition-colors">
                        <Icon className="text-blue-600 group-hover:text-white transition-colors" size={32} />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{service.short_description}</p>

                      <div className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        to={`/services/${service.slug}`}
                        className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform"
                      >
                        Learn More
                        <ArrowRight className="ml-2" size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how our services can help transform your business.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Contact Us Today
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
