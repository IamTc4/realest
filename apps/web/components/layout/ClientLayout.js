import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '../../lib/utils';
import { Home, Search, Heart, User, MessageSquare } from 'lucide-react';

const ClientLayout = ({ children }) => {
  const router = useRouter();

  const navItems = [
    { icon: Home, label: 'Home', href: '/client' },
    { icon: Search, label: 'Search', href: '/client/search' },
    { icon: Heart, label: 'Saved', href: '/client/saved' },
    { icon: MessageSquare, label: 'Chat', href: '/client/chat' },
    { icon: User, label: 'Profile', href: '/client/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/client" className="text-2xl font-bold text-emerald-600">
            DeveloperBee
          </Link>
          <div className="flex items-center space-x-4">
             {/* Desktop Nav could go here */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full">
                <item.icon className={cn("w-6 h-6", isActive ? "text-emerald-600" : "text-gray-500")} />
                <span className={cn("text-xs mt-1", isActive ? "text-emerald-600 font-medium" : "text-gray-500")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
