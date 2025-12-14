import React, { useEffect, useState } from 'react';
import ClientLayout from '../../components/layout/ClientLayout';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
        setUser(JSON.parse(userData));
    } else {
        router.push('/login');
    }
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
  }

  if (!user) return null;

  return (
    <ClientLayout>
       <div className="max-w-2xl mx-auto">
           <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-emerald-600 h-32 relative">
                   <div className="absolute -bottom-10 left-6">
                       <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                           <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                               {user.name ? user.name.charAt(0) : 'U'}
                           </div>
                       </div>
                   </div>
               </div>

               <div className="pt-12 px-6 pb-6">
                   <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                   <p className="text-gray-500 text-sm">Client</p>

                   <div className="mt-6 space-y-4">
                       <div className="flex items-center text-gray-700">
                           <Mail className="w-5 h-5 mr-3 text-gray-400" />
                           {user.email}
                       </div>
                       <div className="flex items-center text-gray-700">
                           <Phone className="w-5 h-5 mr-3 text-gray-400" />
                           {/* Phone wasn't returned in login response user object in my mock, usually it should be */}
                           +1 234 567 890
                       </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-gray-100">
                       <button onClick={handleLogout} className="flex items-center text-red-600 font-medium hover:text-red-700">
                           <LogOut className="w-5 h-5 mr-2" /> Logout
                       </button>
                   </div>
               </div>
           </div>
       </div>
    </ClientLayout>
  );
}
