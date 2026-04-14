import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Linkedin, Twitter, Facebook, Send, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Swal from "sweetalert2";
import { apiClient } from '../lib/apiClient';

type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  business_hours?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
};

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    message: string;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    emailjs.init('lKqTT0FWFqe8kU_oS'); // Your EmailJS public key
    const fetchContactInfo = async () => {
      try {
        const data = await apiClient.get('/api/v1/contact');
        if (data.success) {
          setContactInfo(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch contact info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
        setFormError("Please fill out all required fields.");
        setFormLoading(false);
        return;
    }

    const templateParams = {
        to_email: contactInfo.email || 'anmolit12412015@iiitsonepat.ac.in', // Fallback email
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        message: formData.message,
    };

    try {
        const response = await emailjs.send(
            'service_1mig9kj', // Your EmailJS service ID
            'template_j2mhm8y', // Your EmailJS template ID
            templateParams
        );

        if (response.status === 200) {
            Swal.fire({
                title: "Message Sent!",
                text: "Thank you for reaching out. We'll get back to you soon.",
                icon: "success",
                confirmButtonColor: "#10b981",
            });
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } else {
            throw new Error('Failed to send email.');
        }
    } catch (err) {
        console.error('EmailJS error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again later.';
        setFormError(errorMessage);
        Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            confirmButtonColor: "#ef4444",
        });
    } finally {
        setFormLoading(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: Phone, label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
    { icon: MapPin, label: 'Address', value: contactInfo.address, href: '#' },
    { icon: Clock, label: 'Business Hours', value: contactInfo.business_hours, href: '#' },
  ];

  const socialItems = [
    { icon: Linkedin, href: contactInfo.linkedin_url, name: 'LinkedIn' },
    { icon: Twitter, href: contactInfo.twitter_url, name: 'Twitter' },
    { icon: Facebook, href: contactInfo.facebook_url, name: 'Facebook' },
  ];

  return (
    <>
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      {!loading && (
        <div>
          <section className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Get In <span className="text-blue-600">Touch</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  We'd love to hear from you. Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  {formError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-800 text-sm">{formError}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                        <input type="text" name="firstName" id="first-name" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                        <input type="text" name="lastName" id="last-name" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea name="message" id="message" value={formData.message} onChange={handleChange} required rows={4} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div>
                      <button type="submit" disabled={formLoading} className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400">
                        {formLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Sending...
                            </>
                        ) : (
                            <><Send size={18} className="mr-2" /> Send Message</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  {contactItems.map((item, index) => item.value && (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0"><div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><item.icon className="text-blue-600" size={24} /></div></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                        <a href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors break-all">{item.value}</a>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow us</h3>
                    <div className="flex space-x-4">
                      {socialItems.map((item, index) => item.href && (
                        <a 
                          key={index} 
                          href={item.href.startsWith('http') ? item.href : `https://${item.href}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-blue-600 transition-colors" 
                          aria-label={item.name}
                        >
                          <item.icon size={24} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}