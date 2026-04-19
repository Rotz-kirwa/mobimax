import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Bell,
  Search
} from 'lucide-react';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: ReactNode;
  username?: string;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'products', label: 'Products', icon: Package, path: '/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/orders' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export default function AdminLayout({ children, username = 'Administrator' }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token logic here
    localStorage.removeItem('mbx_admin_token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-slate-200 bg-white lg:relative">
        <div className="flex h-16 items-center border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">Mobimax <span className="text-slate-400 font-medium">Ops</span></span>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          <p className="px-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Main Menu</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                {username[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-bold">{username}</p>
                <p className="truncate text-[10px] text-slate-500 font-medium">System Manager</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="z-10 h-16 border-b border-slate-200 bg-white px-8">
          <div className="flex h-full items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search catalog, orders, customers..." 
                className="w-full rounded-lg border-none bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600">
                <Bell size={18} />
              </button>
              <a 
                href="/" 
                target="_blank"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
              >
                Storefront
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
