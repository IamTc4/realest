import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ClientLayout from '../../../components/layout/ClientLayout';
import { MapPin, Bed, Bath, Share2, Heart, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
        fetch(`http://localhost:3001/api/properties/${id}`)
        .then(res => res.json())
        .then(data => {
            setProperty(data);
            setLoading(false);
        })
        .catch(console.error);

        // Check if saved (would require auth token in real implementation)
        // fetchSavedStatus(id);
    }
  }, [id]);

  const handleSave = () => {
      // Mock save functionality
      setIsSaved(!isSaved);
      // In real app, call API
  };

  if (loading || !property) return <ClientLayout><div className="p-8 text-center">Loading...</div></ClientLayout>;

  const images = JSON.parse(property.images || '[]');

  return (
    <ClientLayout>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Image Gallery (Simplified) */}
          <div className="relative h-64 md:h-96 bg-gray-200">
               {images[0] ? <img src={images[0]} className="w-full h-full object-cover" alt={property.title} /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
               <div className="absolute top-4 right-4 flex space-x-2">
                   <button className="bg-white/90 p-2 rounded-full shadow hover:bg-white" onClick={handleSave}>
                       <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                   </button>
                   <button className="bg-white/90 p-2 rounded-full shadow hover:bg-white">
                       <Share2 className="w-5 h-5 text-gray-700" />
                   </button>
               </div>
          </div>

          <div className="p-6">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                   <div>
                       <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                       <div className="flex items-center text-gray-500">
                           <MapPin className="w-4 h-4 mr-1" />
                           {property.location}
                       </div>
                   </div>
                   <div className="mt-4 md:mt-0">
                       <span className="text-3xl font-bold text-emerald-600">${property.price.toLocaleString()}</span>
                   </div>
               </div>

               {/* Key Features */}
               <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100 mb-6">
                   <div className="text-center">
                       <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Bedrooms</span>
                       <div className="flex items-center justify-center font-bold text-lg text-gray-800">
                           <Bed className="w-5 h-5 mr-2 text-emerald-500" /> {property.bedrooms}
                       </div>
                   </div>
                   <div className="text-center border-l border-gray-100">
                       <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Bathrooms</span>
                       <div className="flex items-center justify-center font-bold text-lg text-gray-800">
                           <Bath className="w-5 h-5 mr-2 text-emerald-500" /> {property.bathrooms}
                       </div>
                   </div>
                   <div className="text-center border-l border-gray-100">
                       <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Area</span>
                       <div className="flex items-center justify-center font-bold text-lg text-gray-800">
                           <span className="mr-1">{property.areaSqFt}</span> <span className="text-sm font-normal text-gray-500">sq ft</span>
                       </div>
                   </div>
               </div>

               <div className="space-y-6">
                   <div>
                       <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
                       <p className="text-gray-600 leading-relaxed">{property.description}</p>
                   </div>

                   <div>
                       <h2 className="text-lg font-bold text-gray-900 mb-2">Amenities</h2>
                       <div className="flex flex-wrap gap-2">
                           {property.amenities?.split(',').map(amenity => (
                               <span key={amenity} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                                   {amenity.trim()}
                               </span>
                           ))}
                       </div>
                   </div>
               </div>
          </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sticky bottom-20 md:static">
           <button className="flex-1 bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center shadow-lg shadow-emerald-200">
               <MessageCircle className="w-5 h-5 mr-2" /> Enquire Now
           </button>
           <button className="flex-1 bg-white text-emerald-600 border border-emerald-200 font-bold py-3 px-4 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center">
               <Calendar className="w-5 h-5 mr-2" /> Book Visit
           </button>
           <button className="flex-1 bg-[#25D366] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center">
               WhatsApp
           </button>
      </div>
    </ClientLayout>
  );
}
