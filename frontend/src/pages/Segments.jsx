import { useState } from 'react';
import { Sparkles, ChevronRight, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateSegment } from '../services/api';

export default function Segments() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const examplePrompts = [
    "Find customers who spent more than ₹5000 and haven't purchased in 60 days",
    "VIP customers who haven't engaged with last 3 campaigns",
    "New customers acquired in the last 30 days from Delhi",
    "Customers who bought jewelry but never bought clothing"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateSegment(prompt);
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to generate segment from AI." });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel - Builder */}
      <div className="w-full lg:w-[450px] flex flex-col gap-6 shrink-0 overflow-y-auto pr-2">
        <Card className="overflow-hidden flex flex-col shadow-card border-0 ring-1 ring-slate-100 shrink-0">
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={18} />
              </div>
              <h2 className="text-xl font-bold">AI Segment Builder</h2>
            </div>
            <p className="text-indigo-100 text-sm">Describe your audience in plain English</p>
          </div>
          
          <div className="p-6 flex flex-col gap-4 bg-white">
            <div className="relative">
              <Sparkles size={16} className="absolute left-4 top-4 text-primary" />
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Describe your target audience..."
              ></textarea>
            </div>
            <Button 
              variant="primary" 
              className="w-full py-3 gap-2 bg-secondary hover:bg-purple-600 animate-pulse-slow"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {loading ? "Generating..." : "Generate Segment →"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 border border-orange-100 bg-orange-50/30 shrink-0">
          <div className="flex items-center gap-2 mb-4 text-orange-500 font-semibold text-sm">
            <Sparkles size={16} />
            Example prompts
          </div>
          <div className="space-y-3">
            {examplePrompts.map((ep, idx) => (
              <button 
                key={idx} 
                onClick={() => setPrompt(ep)}
                className="w-full text-left p-3 rounded-xl hover:bg-white transition-all group flex items-start gap-3 border border-transparent hover:border-slate-200 hover:shadow-sm"
              >
                <ChevronRight size={16} className="text-slate-400 mt-0.5 group-hover:text-primary shrink-0" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 leading-snug">{ep}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 h-full min-h-0">
        <Card className={`h-full flex flex-col p-6 lg:p-8 bg-white border-slate-200 overflow-y-auto shadow-card ${!result ? 'items-center justify-center border-dashed border-2' : 'border border-slate-100'}`}>
          {!result ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 text-primary shadow-inner mx-auto">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your segment will appear here</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Describe your target audience on the left and click Generate to see the matching customers.
              </p>
            </div>
          ) : result.error ? (
             <div className="text-red-500 p-4 bg-red-50 rounded-xl border border-red-100">{result.error}</div>
          ) : (
             <div className="w-full text-left flex flex-col h-full min-h-0">
                <div className="shrink-0">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Sparkles className="text-primary animate-pulse" /> {result.name || "AI Generated Segment"}
                  </h3>
                  <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-6 overflow-x-auto whitespace-pre">
                    {JSON.stringify(result.criteria, null, 2)}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Users size={18} className="text-primary" />
                      <span>Audience Size:</span>
                      <span className="text-primary text-xl font-bold bg-primary/10 px-3 py-1 rounded-full">
                        {result.customerIds?.length || 0} {result.customerIds?.length === 1 ? 'customer' : 'customers'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-normal">Generated dynamically from live database data</span>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Matching Customers</h4>
                  {result.customerIds && result.customerIds.length > 0 ? (
                    <div className="border border-slate-100 rounded-xl overflow-hidden shadow-soft">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                          {result.customerIds.map((customer) => (
                            <tr key={customer._id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{customer.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{customer.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-semibold">
                                ₹{customer.totalSpent?.toLocaleString('en-IN') || 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <Users size={24} className="text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 font-medium text-slate-700">No matching customers found</p>
                      <p className="text-xs text-slate-400 mt-1">Try relaxing your segment criteria prompt.</p>
                    </div>
                  )}
                </div>

                <div className="shrink-0 mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 italic">
                    Note: The CRM Backend successfully processed the natural language prompt and built the segment rules.
                  </p>
                </div>
             </div>
          )}
        </Card>
      </div>
    </div>
  );
}