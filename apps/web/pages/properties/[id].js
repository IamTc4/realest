import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import api from '../../lib/api';
import { MapPin, Bed, Bath, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [prop, setProp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const fetchProp = async () => {
        try {
            const res = await api.get(`/properties/${id}`);
            setProp(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };
        fetchProp();
    }
  }, [id]);

  if (loading || !prop) return <Layout><div>Loading...</div></Layout>;

  const images = JSON.parse(prop.images || '[]');

  return (
    <Layout>
      <div className="mb-6">
          <Link href="/properties" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Inventory
          </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-96 w-full bg-gray-200 relative">
              <img
                  src={images[0] || 'https://via.placeholder.com/800x600'}
                  alt={prop.title}
                  className="w-full h-full object-cover"
              />
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                   <h1 className="text-3xl font-bold text-white mb-2">{prop.title}</h1>
                   <div className="flex items-center text-white/90">
                        <MapPin className="h-5 w-5 mr-2" />
                        {prop.location}
                   </div>
               </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                  <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                      <p className="text-gray-600 leading-relaxed">{prop.description}</p>
                  </div>

                  <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                      <div className="flex flex-wrap gap-2">
                          {prop.amenities?.split(',').map((amenity, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                  {amenity.trim()}
                              </span>
                          ))}
                      </div>
                  </div>

                  <div>
                       <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
                       <div className="grid grid-cols-2 gap-4">
                           {images.map((img, idx) => (
                               <img key={idx} src={img} alt={`Gallery ${idx}`} className="rounded-lg h-48 w-full object-cover" />
                           ))}
                       </div>
                  </div>
              </div>

              <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-6">
                      <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-1">Price</p>
                          <p className="text-3xl font-bold text-primary">${prop.price.toLocaleString()}</p>
                      </div>

                      <div className="space-y-4 mb-6">
                            <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center text-gray-600"><Bed className="h-4 w-4 mr-2" /> Bedrooms</div>
                                <span className="font-semibold text-gray-900">{prop.bedrooms}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center text-gray-600"><Bath className="h-4 w-4 mr-2" /> Bathrooms</div>
                                <span className="font-semibold text-gray-900">{prop.bathrooms}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center text-gray-600"><Home className="h-4 w-4 mr-2" /> Area</div>
                                <span className="font-semibold text-gray-900">{prop.areaSqFt} sqft</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center text-gray-600">Type</div>
                                <span className="font-semibold text-gray-900">{prop.type}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-white rounded-lg border border-gray-100">
                                <div className="flex items-center text-gray-600">Builder</div>
                                <span className="font-semibold text-gray-900">{prop.builder || 'N/A'}</span>
                            </div>
                      </div>

                      <button className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
                          Schedule Viewing
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </Layout>
  );
}
