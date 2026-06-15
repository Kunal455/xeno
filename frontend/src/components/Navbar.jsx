import { Search, Moon, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ title, subtitle }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Arjun Rawat', email: 'arjun@xenocrm.io' };
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64 group-hover:bg-white"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-400 text-[10px] font-medium flex items-center shadow-sm">
            ⌘K
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Moon size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white"></span>
          </button>
          <Link to="/settings" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            <Settings size={20} />
          </Link>
          
          <Link to="/settings" className="ml-2 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold shadow-sm cursor-pointer hover:ring-2 ring-offset-2 ring-secondary transition-all">
            {initials}
          </Link>
        </div>
      </div>
    </header>
  );
}
