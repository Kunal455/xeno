import { useState, useEffect } from 'react';
import { Send, CheckCircle2, MailOpen, MousePointerClick, AlertCircle } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { ChartCard } from '../components/ui/ChartCard';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getCampaignAnalytics } from '../services/api';

const trendData = [
  { name: 'W1', email: 40, sms: 20 },
  { name: 'W2', email: 42, sms: 22 },
  { name: 'W3', email: 45, sms: 25 },
  { name: 'W4', email: 44, sms: 24 },
  { name: 'W5', email: 50, sms: 28 },
  { name: 'W6', email: 48, sms: 27 },
];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const data = await getCampaignAnalytics();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading campaign analytics...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics</div>;
  }

  // Calculate percentages for funnel
  const sent = stats.totalSent || 1; // avoid division by zero
  const deliveredPct = ((stats.totalDelivered / sent) * 100).toFixed(1);
  const openedPct = ((stats.totalOpened / sent) * 100).toFixed(1);
  const clickedPct = ((stats.totalClicked / sent) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Sent" value={stats.totalSent.toLocaleString()} icon={Send} color="primary" />
        <StatCard title="Delivered" value={stats.totalDelivered.toLocaleString()} icon={CheckCircle2} color="success" />
        <StatCard title="Opened" value={stats.totalOpened.toLocaleString()} icon={MailOpen} color="secondary" />
        <StatCard title="Clicked" value={stats.totalClicked.toLocaleString()} icon={MousePointerClick} color="primary" />
        <StatCard title="Failed" value={stats.totalFailed.toLocaleString()} icon={AlertCircle} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel */}
        <ChartCard title="Delivery Funnel">
          <div className="flex flex-col space-y-5 mt-4">
            {[
              { label: 'Sent', count: stats.totalSent.toLocaleString(), pct: '100.0%', color: 'bg-primary' },
              { label: 'Delivered', count: stats.totalDelivered.toLocaleString(), pct: `${deliveredPct}%`, color: 'bg-primary/80' },
              { label: 'Opened', count: stats.totalOpened.toLocaleString(), pct: `${openedPct}%`, color: 'bg-primary/60' },
              { label: 'Clicked', count: stats.totalClicked.toLocaleString(), pct: `${clickedPct}%`, color: 'bg-primary/40' },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>{step.label}</span>
                  <span>{step.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden flex items-center relative">
                  <div className={`h-full ${step.color} rounded-full transition-all`} style={{ width: step.pct }}></div>
                  <span className="absolute left-4 text-xs font-bold text-white mix-blend-difference">{step.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Trend Chart */}
        <ChartCard 
          title="Open Rate Trend by Channel"
          rightAction={
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Email</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success"></span> SMS</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} tickFormatter={(val) => `${val}%`} />
              <Tooltip />
              <Line type="monotone" dataKey="email" stroke="#6366F1" strokeWidth={3} dot={false} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="sms" stroke="#22C55E" strokeWidth={3} dot={false} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}