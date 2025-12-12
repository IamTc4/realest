import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Users, Home, Workflow, Settings, LogOut, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';

const NavItem = ({ href, icon: Icon, children }) => {
  const router = useRouter();
  const active = router.pathname === href || router.pathname.startsWith(href + '/');

  return (
    <Link href={href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${active ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
      <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary' : 'text-gray-400'}`} />
      {children}
    </Link>
  );
};

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user && router.pathname !== '/login') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <LayoutDashboard className="h-8 w-8 text-primary mr-2" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">RealEst</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem href="/" icon={LayoutDashboard}>Dashboard</NavItem>
          <NavItem href="/leads" icon={Users}>Leads CRM</NavItem>
          <NavItem href="/properties" icon={Home}>Inventory</NavItem>
          {/* <NavItem href="/automations" icon={Workflow}>Automations</NavItem> */}
          {/* <NavItem href="/settings" icon={Settings}>Settings</NavItem> */}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.name?.[0]}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
            </div>
          </div>
          <button onClick={logout} className="mt-4 flex items-center w-full px-2 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
           <h1 className="text-2xl font-semibold text-gray-800">
             {router.pathname === '/' ? 'Dashboard' :
              router.pathname.startsWith('/leads') ? 'Lead Management' :
              router.pathname.startsWith('/properties') ? 'Property Inventory' : ''}
           </h1>
           <div className="flex space-x-4">
              {/* Could add notifications here */}
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
