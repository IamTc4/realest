import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import { MapPin, Bed, Bath, Home } from 'lucide-react';
import Link from 'next/link';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get('/properties');
        setProperties(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
            <div>Loading...</div>
        ) : properties.map((prop) => {
            const images = JSON.parse(prop.images || '[]');
            const mainImage = images[0] || 'https://via.placeholder.com/400x300';
            return (
              <Link href={`/properties/${prop.id}`} key={prop.id} className="group">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                        <img
                            src={mainImage}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                            {prop.status}
                        </div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{prop.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            {prop.location}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                             <div className="flex items-center">
                                 <Bed className="h-4 w-4 mr-1 text-gray-400" /> {prop.bedrooms} Beds
                             </div>
                             <div className="flex items-center">
                                 <Bath className="h-4 w-4 mr-1 text-gray-400" /> {prop.bathrooms} Baths
                             </div>
                             <div className="flex items-center">
                                 <Home className="h-4 w-4 mr-1 text-gray-400" /> {prop.areaSqFt} sqft
                             </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <span className="text-xl font-bold text-primary">${prop.price.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{prop.type}</span>
                        </div>
                    </div>
                </div>
              </Link>
            );
        })}
      </div>
    </Layout>
  );
}
