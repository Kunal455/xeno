import { useState } from 'react';
import { Bot, Send, BarChart3, Megaphone, Users, Sparkles, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function AIAgent() {
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      content: "Hi! I'm Xeno AI Agent 🤖\n\nI can help you:\n• Generate customer segments from natural language\n• Create and launch marketing campaigns\n• Analyze performance and suggest improvements\n\nWhat would you like to do today?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    
    // Mock response for Agent since there's no backend route for conversational agent in the assignment
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        content: `I've noted your request: "${userMsg.content}". \n\nTo fully execute this, please navigate to the Segment Builder or Campaign Builder pages where I have direct access to your database to construct the logic!`
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary'}`}>
                {msg.role === 'user' ? 'U' : <Bot size={18} />}
              </div>
              <div className={`border rounded-2xl p-4 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-secondary text-white border-transparent rounded-tr-sm' 
                  : 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestions & Input Area */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell Xeno AI what you want to achieve..." 
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-sm">
              <Send size={18} className="ml-1" />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-slate-400">
            Press Enter to send
          </div>
        </div>
      </Card>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[300px] flex flex-col gap-6 shrink-0 overflow-y-auto pb-4">
        {/* Timeline */}
        <Card className="p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            Recent Activity
          </h3>
          <div className="space-y-4 text-slate-500 italic text-sm">
            Activity stream active.
          </div>
        </Card>
      </div>
    </div>
  );
}