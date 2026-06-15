import { Card } from '../components/ui/Card';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Settings</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-bold shadow-md">
            AR
          </div>
          <div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
              Change Avatar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input type="text" defaultValue="Arjun" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input type="text" defaultValue="Rawat" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" defaultValue="arjun@xenocrm.io" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-600 shadow-sm transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}