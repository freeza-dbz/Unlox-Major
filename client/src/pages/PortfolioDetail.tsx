import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type CaseStudy = {
  id: string;
  name: string;
  slug: string;
  overview: string;
  challenge: string;
  solution: string;
  kpis: Array<{ label: string; value: string }>;
  roles: string[];
  tools: string[];
  hero_image: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    name: 'E-Commerce Redesign',
    slug: 'ecommerce-redesign',
    overview: 'A complete redesign for a fast-growing retail brand.',
    challenge: 'Improve conversion rates and mobile experience.',
    solution: 'Built a modern storefront with optimized checkout and personalized recommendations.',
    kpis: [
      { label: 'Conversion increase', value: '32%' },
      { label: 'Speed improvement', value: '45%' },
      { label: 'Revenue growth', value: '28%' }
    ],
    roles: ['Design', 'Development', 'UX Research'],
    tools: ['React', 'Shopify', 'Tailwind CSS'],
    hero_image: '/images/ecommerce.jpg'
  },
  {
    id: '2',
    name: 'Brand Launch Campaign',
    slug: 'brand-launch',
    overview: 'A launch campaign for a new SaaS product.',
    challenge: 'Increase awareness and capture leads quickly.',
    solution: 'Created a clean landing page, paid ads funnel, and conversion tracking.',
    kpis: [
      { label: 'Leads generated', value: '1.2k' },
      { label: 'CTR', value: '3.8%' },
      { label: 'Ad spend ROI', value: '5.4x' }
    ],
    roles: ['Strategy', 'Creative', 'Ads'],
    tools: ['Figma', 'Google Ads', 'HubSpot'],
    hero_image: '/images/launch.jpg'
  }
];

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project] = useState<CaseStudy | null>(
    caseStudies.find((item) => item.slug === slug) || null
  );

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <Link to="/portfolio" className="text-blue-600 hover:underline">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 py-20">
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-8 rounded-full bg-slate-800 px-4 py-2 text-sm uppercase tracking-[0.3em] text-blue-300">
                Case Study
              </div>
              <h1 className="text-5xl font-bold tracking-tight">{project.name}</h1>
              <p className="mt-6 text-lg text-slate-300 max-w-2xl">{project.overview}</p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-800 p-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Role</p>
                  <p className="mt-4 text-2xl font-semibold">{project.roles.join(', ')}</p>
                </div>
                <div className="rounded-3xl bg-slate-800 p-8">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Tools</p>
                  <p className="mt-4 text-2xl font-semibold">{project.tools.join(', ')}</p>
                </div>
              </div>
            </div>
            <img
              src={project.hero_image}
              alt={project.name}
              className="rounded-[2rem] object-cover w-full h-[450px] shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12">
          <div className="space-y-12">
            <div className="rounded-3xl bg-white p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-5">The Challenge</h2>
              <p className="text-slate-600 leading-relaxed">{project.challenge}</p>
            </div>
            <div className="rounded-3xl bg-white p-10 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-5">The Solution</h2>
              <p className="text-slate-600 leading-relaxed">{project.solution}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
              <h3 className="text-xl font-semibold mb-5">Project Highlights</h3>
              <ul className="space-y-4 text-slate-200">
                {project.kpis.map((kpi) => (
                  <li key={kpi.label} className="flex items-center justify-between gap-4">
                    <span>{kpi.label}</span>
                    <strong className="text-lg">{kpi.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
              <h3 className="text-xl font-semibold mb-5">Next Step</h3>
              <p className="text-slate-300 leading-relaxed">Interested in a similar project? Reach out and we’ll help you turn your idea into a powerful digital experience.</p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center justify-center w-full px-6 py-4 bg-blue-500 hover:bg-blue-400 rounded-xl text-white text-sm font-semibold transition"
              >
                Contact Us
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Want Similar Results for Your Business?</h2>
          <p className="text-xl mb-8 text-blue-100">Let's discuss how we can help you achieve your goals.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Project
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
