import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, Building, Settings, BarChart3, Bot } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const router = useRouter();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Building, label: 'Properties', href: '/admin/properties' },
    { icon: Users, label: 'Agents & Users', href: '/admin/users' },
    { icon: Bot, label: 'Automations', href: '/admin/automations' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md min-h-screen fixed hidden md:block">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-emerald-700">DeveloperBee</h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
             const isActive = router.pathname === item.href;
             return (
              <Link key={item.href} href={item.href} className={cn("flex items-center space-x-3 p-3 rounded-lg transition-colors", isActive ? "bg-emerald-50 text-emerald-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
             )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-40">
           <h2 className="text-lg font-semibold text-gray-800">
               {navItems.find(i => i.href === router.pathname)?.label || 'Dashboard'}
           </h2>
           <div className="flex items-center space-x-4">
               <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">AD</div>
           </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
