import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Mapping paths to titles based on Figma spec
  const pageInfo = {
    '/': { title: 'Dashboard', subtitle: 'Overview of your CRM performance' },
    '/customers': { title: 'Customers', subtitle: 'Manage and view your customer base' },
    '/orders': { title: 'Orders', subtitle: 'Track and manage all orders' },
    '/segments': { title: 'AI Segment Builder', subtitle: 'Create smart audiences with AI' },
    '/campaigns': { title: 'Campaign Builder', subtitle: 'Design and launch marketing campaigns' },
    '/analytics': { title: 'Analytics', subtitle: 'Deep dive into campaign performance' },
    '/insights': { title: 'AI Insights', subtitle: 'AI-powered recommendations and findings' },
    '/agent': { title: 'AI Agent', subtitle: 'Your intelligent marketing assistant' },
    '/settings': { title: 'Settings', subtitle: 'Manage your account and preferences' },
  };

  // Fallback for unknown routes
  const currentInfo = pageInfo[location.pathname] || { title: 'Xeno CRM', subtitle: '' };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar title={currentInfo.title} subtitle={currentInfo.subtitle} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
