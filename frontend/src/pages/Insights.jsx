import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { generateInsights } from '../services/api';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await generateInsights();
        setInsights(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load AI insights", err);
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-primary font-bold animate-pulse">Generating AI Intelligence Report...</div>;
  }

  if (!insights) {
    return <div className="p-12 text-center text-red-500">Failed to load insights. Please check if the backend and Gemini API are running.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            AI Intelligence Report
          </div>
          <h2 className="text-3xl font-bold mb-2">Weekly Insights Summary</h2>
          <p className="text-indigo-100 text-sm">Generated just now by Gemini 1.5 Flash</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center min-w-[90px] border border-white/10">
            <div className="text-2xl font-bold mb-1">{insights.length || 0}</div>
            <div className="text-xs text-indigo-100 font-medium">Insights Found</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-slate-900 ml-1">AI-Generated Insights</h3>
          
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
                <TrendingUp size={24} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="bg-indigo-50">General Insight</Badge>
                  <Badge variant="success" className="bg-green-50">High Impact</Badge>
                </div>
                <h4 className="text-lg font-bold text-slate-900">Campaign Performance Analysis</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {insights.insights || "No data available."}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold">
              <Sparkles size={20} className="text-secondary" />
              Smart Actions & Recommendations
            </div>
            <div className="space-y-3">
              {insights.recommendations && insights.recommendations.length > 0 ? (
                insights.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start justify-between w-full p-3.5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all text-left group">
                    <span className="text-sm font-medium text-slate-700 leading-snug">{rec}</span>
                  </div>
                ))
              ) : (
                <button className="flex items-center justify-between w-full p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all text-left group bg-white">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-primary">Create a follow-up campaign based on insights</span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-primary" />
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}