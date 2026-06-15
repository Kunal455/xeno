import { useState, useEffect } from 'react';
import { Search, Package, ShoppingCart, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { getOrders, getCustomers, createOrder } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ customerId: '', amount: '', productName: 'Coffee', quantity: '1' });

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersData, customersData] = await Promise.all([
          getOrders(),
          getCustomers()
        ]);
        setOrders(ordersData);
        setCustomers(customersData);
        if (customersData.length > 0) {
          setFormData(prev => ({ ...prev, customerId: customersData[0]._id }));
        }
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        customerId: formData.customerId,
        amount: Number(formData.amount),
        products: [
          {
            productName: formData.productName,
            quantity: Number(formData.quantity),
            price: Number(formData.amount) / Number(formData.quantity)
          }
        ]
      };
      const newOrder = await createOrder(payload);
      
      const customer = customers.find(c => c._id === formData.customerId);
      if (customer) {
        newOrder.customerId = customer;
      }
      
      setOrders([newOrder, ...orders]);
      setShowModal(false);
      setFormData(prev => ({ ...prev, amount: '' }));
    } catch (err) {
      console.error("Failed to add order", err);
      alert("Failed to add order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value={orders.length.toLocaleString()} icon={ShoppingCart} trend="up" trendValue="+8.7%" color="primary" />
        <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="up" trendValue="+18.2%" color="success" />
        <StatCard title="Avg Order Value" value={`₹${avgOrderValue.toFixed(0).toLocaleString()}`} icon={TrendingUp} trend="up" trendValue="+4.1%" color="secondary" />
      </div>

      <div className="flex justify-between items-center mt-6 mb-2">
        <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
        <Button variant="primary" className="gap-2" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Add Order
        </Button>
      </div>

      <Card className="flex flex-col">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold bg-white">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan="4" className="text-center p-8 text-slate-500">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-8 text-slate-500">No orders found.</td></tr>
              ) : orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Package size={14} />
                      {o._id.substring(0, 8).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">₹{o.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Badge variant={o.status === 'Delivered' ? 'success' : o.status === 'Processing' ? 'primary' : o.status === 'Cancelled' ? 'danger' : 'secondary'}>
                      {o.status || 'Delivered'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Create New Order</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAddOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer</label>
                <select 
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="2500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                  <input 
                    type="text" 
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Create Order'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}