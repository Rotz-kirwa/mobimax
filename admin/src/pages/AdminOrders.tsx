import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import clsx from 'clsx';
import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useAdmin';
import { toast } from 'sonner';

export default function AdminOrders() {
  const [query, setQuery] = useState('');
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const handleUpdateStatus = async (id: string, status: string, type: 'payment' | 'order') => {
    try {
      await updateStatusMutation.mutateAsync({ id, status, type });
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders?.filter((o: any) => 
    o.reference.toLowerCase().includes(query.toLowerCase()) || 
    o.id.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <AdminLayout>
      <div className="space-y-8 uppercase font-sans">
        {/* Page Header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
               <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
               <span className="text-[10px] font-black text-indigo-600 tracking-[0.4em]">Asset Acquisitions</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tight text-slate-900 leading-none">Order Flow</h1>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-[10px] font-black tracking-widest text-slate-950 transition hover:bg-slate-50 active:scale-95 shadow-sm">
              Operational Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by reference binary..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-6 text-sm font-bold outline-none transition focus:bg-white focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 rounded-2xl border border-slate-200 px-6 py-3.5 text-[10px] font-black text-slate-600 hover:bg-slate-50">
              <Filter size={16} />
              Protocol Status
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-xl shadow-indigo-600/5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-32 gap-6">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Acquisition Data</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-32 text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-slate-50 text-slate-200">
                <ShoppingBag size={48} />
              </div>
              <h3 className="text-xl font-black text-slate-900 italic">No Acquisitions Detected</h3>
              <p className="mt-4 text-[10px] font-black tracking-widest text-slate-400 max-w-xs">
                The network has not captured any order signals matching your query.
              </p>
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Reference Signal</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Customer Node</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Payload Total</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Payment Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Order Protocol</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 italic">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 tracking-tighter">{order.reference}</span>
                        <ExternalLink size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer" />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900">{order.customer?.name || 'Unknown Node'}</p>
                      <p className="text-[10px] font-black text-slate-400 tracking-widest">{order.customer?.email}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-base font-black text-slate-950 tracking-tighter tabular-nums">KES {order.total.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-slate-400 tracking-widest">{(order.items as any[]).length} Specimens</p>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={order.paymentStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value, 'payment')}
                        className={clsx(
                          "appearance-none rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all outline-none cursor-pointer border-0 ring-1",
                          order.paymentStatus === 'confirmed' ? "bg-indigo-600 text-white ring-indigo-500" :
                          order.paymentStatus === 'pending' ? "bg-amber-50 text-amber-600 ring-amber-200" :
                          "bg-red-50 text-red-600 ring-red-200"
                        )}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                        <select 
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value, 'order')}
                        className={clsx(
                          "appearance-none rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all outline-none cursor-pointer border-0 ring-1",
                          order.orderStatus === 'shipped' || order.orderStatus === 'delivered' ? "bg-slate-950 text-white ring-slate-800" :
                          order.orderStatus === 'processing' ? "bg-indigo-50 text-indigo-600 ring-indigo-100" :
                          "bg-slate-50 text-slate-400 ring-slate-100"
                        )}
                      >
                        <option value="pending">Captured</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Dispatched</option>
                        <option value="delivered">Received</option>
                        <option value="cancelled">Aborted</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-950 hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-8 py-6">
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Global Sequence: 1 to {filteredOrders.length} of {filteredOrders.length} nodes</p>
            <div className="flex items-center gap-3">
               <button disabled className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-black text-slate-300 opacity-50 uppercase tracking-widest">Previous</button>
               <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[10px] font-black text-slate-950 hover:bg-slate-100 uppercase tracking-widest transition-colors">Next Sequence</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
