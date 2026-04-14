import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/contact`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setContactInfo(data.data);
      })
      .catch(err => console.error("Failed to fetch contact info for footer", err));
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
              </div>
              <span className="text-xl font-bold text-white">Outpro.India</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Empowering businesses through innovative digital solutions that drive growth and transformation.
            </p>
            <div className="flex space-x-4">
              {contactInfo.linkedin_url && (
                <a
                  href={!contactInfo.linkedin_url.startsWith('http') ? `https://${contactInfo.linkedin_url}` : contactInfo.linkedin_url}
                  target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Linkedin size={20} />
                </a>
              )}
              {contactInfo.twitter_url && (
                <a
                  href={!contactInfo.twitter_url.startsWith('http') ? `https://${contactInfo.twitter_url}` : contactInfo.twitter_url}
                  target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Twitter size={20} />
                </a>
              )}
              {contactInfo.facebook_url && (
                <a
                  href={!contactInfo.facebook_url.startsWith('http') ? `https://${contactInfo.facebook_url}` : contactInfo.facebook_url}
                  target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  <Facebook size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm hover:text-blue-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm hover:text-blue-400 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-sm hover:text-blue-400 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              {contactInfo.email && (
                <li className="flex items-start space-x-2">
                  <Mail size={16} className="mt-1 flex-shrink-0" />
                  <a href={`mailto:${contactInfo.email}`} className="text-sm hover:text-blue-400 transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-start space-x-2">
                  <Phone size={16} className="mt-1 flex-shrink-0" />
                  <a href={`tel:${contactInfo.phone}`} className="text-sm hover:text-blue-400 transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo.address && (
                <li className="flex items-start space-x-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">{contactInfo.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              &copy; {currentYear} Outpro.India. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
