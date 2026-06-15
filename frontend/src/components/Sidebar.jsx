import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, Layers, Megaphone, BarChart3, Lightbulb, Bot, Zap, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Segments', path: '/segments', icon: Layers },
  { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Insights', path: '/insights', icon: Lightbulb },
  { name: 'AI Agent', path: '/agent', icon: Bot, badge: 'AI' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Arjun Rawat', email: 'arjun@xenocrm.io' };
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="w-64 border-r border-slate-200 bg-white h-screen flex flex-col shrink-0 sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center mr-3 shrink-0">
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 leading-tight">Xeno CRM</h1>
          <p className="text-xs text-primary font-medium">AI-Native</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 mb-4 px-2 tracking-wider">MENU</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors group",
                  isActive 
                    ? "bg-indigo-50 text-primary font-medium" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center">
                  <item.icon 
                    size={20} 
                    className={cn(
                      "mr-3", 
                      isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                    )} 
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between">
        <Link to="/settings" className="flex items-center hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer flex-1 mr-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold mr-3 shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden text-ellipsis">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          title="Log Out"
          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
