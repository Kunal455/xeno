import { useState, useEffect } from 'react';
import { Sparkles, Mail, MessageSquare, BellRing, Phone } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateCampaignMessage, launchCampaign, getSegments, createCampaign } from '../services/api';

export default function Campaigns() {
  const [segments, setSegments] = useState([]);
  const [formData, setFormData] = useState({ name: '', segmentId: '', channel: 'Email', goal: 'Re-engagement' });
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const selectedSegment = segments.find(s => s._id === formData.segmentId);
  const isSegmentEmpty = !selectedSegment || !selectedSegment.customerIds || selectedSegment.customerIds.length === 0;

  useEffect(() => {
    async function fetchSegments() {
      try {
        const data = await getSegments();
        setSegments(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, segmentId: data[0]._id }));
        }
      } catch (err) {
        console.error("Failed to load segments", err);
      }
    }
    fetchSegments();
  }, []);

  const channels = [
    { name: 'Email', icon: Mail, color: 'text-primary' },
    { name: 'SMS', icon: MessageSquare, color: 'text-success' },
    { name: 'Push', icon: BellRing, color: 'text-warning' },
    { name: 'WhatsApp', icon: Phone, color: 'text-teal-500' }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLaunched(false);
    try {
      const data = await generateCampaignMessage(`${formData.goal} via ${formData.channel}`);
      setAiMessage(data.message);
    } catch (err) {
      console.error(err);
      setAiMessage("Failed to generate AI message.");
    }
    setLoading(false);
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const newCampaign = await createCampaign({
        name: formData.name || 'AI Generated Campaign',
        segmentId: formData.segmentId,
        channel: formData.channel,
        messageTemplate: aiMessage,
        status: 'draft'
      });

      await launchCampaign(newCampaign._id);
      
      setLaunched(true);
    } catch (err) {
      console.error(err);
      alert("Failed to launch campaign");
    }
    setLaunching(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
      {/* Left Column: Form */}
      <div className="w-full lg:w-[450px] shrink-0 overflow-y-auto pr-2 pb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">Campaign Builder</h2>
          <p className="text-sm text-slate-500">Configure your campaign settings</p>
        </div>

        <form className="space-y-6" onSubmit={handleGenerate}>
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Campaign Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Re-engagement Drive Q3" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Target Segment */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Target Segment</label>
            <select 
              value={formData.segmentId}
              onChange={e => setFormData({...formData, segmentId: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {segments.length === 0 && <option value="">Loading segments...</option>}
              {segments.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.customerIds?.length || 0} customers)</option>
              ))}
            </select>
          </div>

          {/* Channel */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">Channel</label>
            <div className="grid grid-cols-4 gap-3">
              {channels.map((channel) => (
                <button
                  key={channel.name}
                  type="button"
                  onClick={() => setFormData({...formData, channel: channel.name})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    formData.channel === channel.name 
                      ? 'border-primary bg-indigo-50/50 shadow-sm ring-1 ring-primary' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <channel.icon size={20} className={`mb-2 ${channel.color}`} />
                  <span className={`text-xs font-medium ${formData.channel === channel.name ? 'text-primary' : 'text-slate-600'}`}>
                    {channel.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Campaign Goal</label>
            <select 
              value={formData.goal}
              onChange={e => setFormData({...formData, goal: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option>Re-engagement</option>
              <option>Upsell / Cross-sell</option>
              <option>Brand Awareness</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} variant="secondary" className="w-full py-3 gap-2 border-primary text-primary hover:bg-indigo-50 mt-4 font-bold bg-white shadow-sm border-2">
            {loading ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Generating...' : 'Generate AI Message'}
          </Button>
        </form>
      </div>

      {/* Right Column: Preview */}
      <Card className="flex-1 flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 text-slate-700 font-semibold bg-slate-50/50">
          <Sparkles size={16} className="text-primary" />
          AI Message Preview
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/30 overflow-y-auto">
          {!aiMessage ? (
            <>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                <Sparkles size={24} />
              </div>
              <p className="text-slate-500 max-w-[200px] leading-relaxed">
                Configure your campaign and click Generate AI Message
              </p>
            </>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left whitespace-pre-wrap text-slate-700 font-medium leading-relaxed">
                {aiMessage}
              </div>
              {launched ? (
                <div className="mt-6 p-4 bg-green-50 text-success rounded-xl font-bold border border-green-200">
                  🎉 Campaign successfully launched! The simulation channel service is now delivering messages. Check the Analytics page in a few moments!
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-2">
                  <Button 
                    onClick={handleLaunch} 
                    disabled={launching || isSegmentEmpty} 
                    className={`py-4 text-lg font-bold shadow-soft transition-all duration-300 ${
                      isSegmentEmpty 
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed hover:bg-slate-100' 
                        : 'bg-primary hover:bg-indigo-600 text-white'
                    }`}
                  >
                    {launching ? 'Launching...' : isSegmentEmpty ? 'Target Segment has 0 Customers' : `Launch ${formData.channel} Campaign 🚀`}
                  </Button>
                  {isSegmentEmpty && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex flex-col items-center text-center gap-1">
                      <p className="text-xs font-semibold text-amber-700">
                        ⚠️ Empty Segment Selected
                      </p>
                      <p className="text-[11px] text-amber-600 leading-normal max-w-sm">
                        This campaign cannot be launched because the selected segment contains 0 customers. Go to the <a href="/customers" className="underline hover:text-amber-800 font-bold">Customers</a> or <a href="/orders" className="underline hover:text-amber-800 font-bold">Orders</a> pages to add data that matches this segment's rules.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}