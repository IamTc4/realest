import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, Building, Calendar, FileText, PieChart } from 'lucide-react';

const AgentLayout = ({ children }) => {
  const router = useRouter();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/agent' },
    { icon: Users, label: 'Leads', href: '/agent/leads' },
    { icon: Building, label: 'Properties', href: '/agent/properties' },
    { icon: Calendar, label: 'Tasks', href: '/agent/tasks' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed">
        <div className="p-6">
          <h1 className="text-xl font-bold text-emerald-400">Agent Portal</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
             const isActive = router.pathname === item.href;
             return (
              <Link key={item.href} href={item.href} className={cn("flex items-center space-x-3 p-3 rounded-lg transition-colors", isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white")}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
             )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold">A</div>
                <div>
                    <p className="text-sm font-medium">Agent Smith</p>
                    <p className="text-xs text-slate-400">View Profile</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex-1">
        <header className="bg-white shadow-sm md:hidden sticky top-0 z-50 p-4 flex justify-between items-center">
             <span className="font-bold text-lg">Agent Portal</span>
             {/* Mobile Menu Trigger would go here */}
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>

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

export default AgentLayout;
