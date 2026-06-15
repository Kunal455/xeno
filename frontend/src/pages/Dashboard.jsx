import { useState, useEffect } from 'react';
import { Users, ShoppingCart, DollarSign, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { ChartCard } from '../components/ui/ChartCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getOverviewAnalytics } from '../services/api';

const defaultRevenueData = [
  { name: 'Jan', value: 30000 }, { name: 'Feb', value: 35000 },
  { name: 'Mar', value: 42000 }, { name: 'Apr', value: 48000 },
  { name: 'May', value: 55000 }, { name: 'Jun', value: 65000 }, { name: 'Jul', value: 72000 },
];

const defaultCustomerData = [
  { name: 'Jan', value: 8000 }, { name: 'Feb', value: 9000 },
  { name: 'Mar', value: 10500 }, { name: 'Apr', value: 12000 },
  { name: 'May', value: 14000 }, { name: 'Jun', value: 15500 }, { name: 'Jul', value: 18000 },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getOverviewAnalytics();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        setError("Could not connect to the backend server. Is it running?");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-64 text-slate-500">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="p-8 bg-red-50 text-red-600 rounded-2xl m-4 border border-red-100">{error}</div>;
  }

  // Format currency
  const formatCurrency = (val) => `₹${(val / 100000).toFixed(1)}L`;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Customers" value={stats.totalCustomers.toLocaleString()} icon={Users} trend="up" trendValue="+12.3%" color="primary" />
        <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingCart} trend="up" trendValue="+8.7%" color="secondary" />
        <StatCard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend="up" trendValue="+18.2%" color="success" />
        <StatCard title="Campaigns Sent" value={stats.totalCampaigns.toLocaleString()} icon={Send} trend="down" trendValue="-3.1%" color="warning" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Revenue Trend" 
            subtitle="vs. previous period"
            rightAction={<Badge variant="success">↗ +18.2% MoM</Badge>}
          >
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats.revenueTrend || defaultRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="lg:col-span-1">
          <ChartCard title="Customer Growth" subtitle="Monthly new registrations">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.customerGrowth || defaultCustomerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(val) => `${val}`} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22C55E" strokeWidth={3} dot={{r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}