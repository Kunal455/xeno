import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getCustomers, createCustomer } from '../services/api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newCustomer = await createCustomer(formData);
      setCustomers([newCustomer, ...customers]);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      console.error("Failed to add customer", err);
      alert("Failed to add customer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch customers", err);
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const getStatusColor = (status) => {
    return status === 'VIP' ? 'warning' : status === 'Active' ? 'success' : 'default';
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-indigo-400', 'bg-purple-400', 'bg-blue-400', 'bg-teal-400', 'bg-rose-400'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="primary" className="gap-2" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold bg-white">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Total Spent</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr><td colSpan="4" className="text-center p-8 text-slate-500">Loading customers...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-8 text-slate-500">No customers found. Database might be empty.</td></tr>
            ) : customers.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-sm ${getAvatarColor(c.name)}`}>
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{c.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{c.email}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{c.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusColor(c.status || 'Active')}>
                    {c.status || 'Active'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Add New Customer</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Customer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}