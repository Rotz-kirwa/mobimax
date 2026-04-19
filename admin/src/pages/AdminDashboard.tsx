import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MoreVertical,
  Activity,
  CreditCard,
  Target
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import clsx from 'clsx';
import { useAdminDashboard } from '../hooks/useAdmin';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function StatCard({ label, value, trend, trendValue, icon: Icon, color, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm group hover:shadow-xl hover:shadow-indigo-600/5 transition-all duration-500"
    >
      <div className="flex items-center justify-between">
        <div className={clsx("flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 duration-500", color)}>
          <Icon size={28} />
        </div>
        <button className="text-slate-300 hover:text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="mt-6 uppercase font-sans">
        <p className="text-[10px] font-black tracking-[0.3em] text-slate-400 italic">{label}</p>
        <h3 className="text-3xl font-black tracking-tight mt-2 italic text-slate-900 leading-none">{value}</h3>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <div className={clsx(
          "flex items-center gap-0.5 rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 italic">Temporal Delta</span>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-6 font-sans">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initializing Telemetry</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = dashboard?.stats || { products: 0, orders: 0, revenue: 0 };

  return (
    <AdminLayout>
      <div className="space-y-10 uppercase font-sans">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-1.5 bg-indigo-600 rounded-full"></div>
               <span className="text-[10px] font-black text-indigo-600 tracking-[0.4em]">Operations Terminal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-slate-900 leading-none">Intelligence.</h1>
          </div>
          <div className="flex gap-4">
            <button className="rounded-2xl border border-slate-200 bg-white px-8 py-4 text-[10px] font-black tracking-widest text-slate-950 transition hover:bg-slate-50 active:scale-95 shadow-sm uppercase">
              Download Matrix
            </button>
            <button className="rounded-2xl bg-slate-950 px-8 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl shadow-indigo-600/20 transition hover:bg-indigo-600 active:scale-95 uppercase">
              Force Sync
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            label="Gross Capture" 
            value={`KES ${stats.revenue.toLocaleString()}`} 
            trend="up" 
            trendValue="+14.2%" 
            icon={TrendingUp} 
            color="bg-indigo-600 text-white"
            delay={0.1}
          />
          <StatCard 
            label="Active Flow" 
            value={stats.orders} 
            trend="up" 
            trendValue="+2.4%" 
            icon={ShoppingBag} 
            color="bg-slate-900 text-white"
            delay={0.2}
          />
          <StatCard 
            label="Asset Census" 
            value={stats.products} 
            trend="down" 
            trendValue="-1.8%" 
            icon={Package} 
            color="bg-slate-50 text-slate-900"
            delay={0.3}
          />
          <StatCard 
            label="Neural Growth" 
            value="1,204" 
            trend="up" 
            trendValue="+33.1%" 
            icon={Users} 
            color="bg-slate-100 text-indigo-600"
            delay={0.4}
          />
        </div>

        {/* Main Diagnostic Area */}
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Order Activity */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <Activity size={20} className="text-indigo-600" />
                 <h3 className="text-xl font-black italic text-slate-900 leading-none tracking-tight">Acquisition Stream</h3>
              </div>
              <Link to="/orders" className="text-[10px] font-black text-indigo-600 hover:text-black tracking-[0.3em] uppercase transition-colors">Sector Full Access</Link>
            </div>
            
            <div className="space-y-8">
              {(dashboard?.recentOrders || []).map((order: any, idx: number) => (
                <div key={order.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-500">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-tighter italic">{order.reference}</p>
                      <p className="text-[10px] font-bold text-slate-400 normal-case tracking-normal mt-1 italic">
                        Node: {order.customer?.name} • Capturing {order.total.toLocaleString()} KES
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={clsx(
                        "rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest",
                        order.paymentStatus === 'confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                        {order.orderStatus}
                    </span>
                    <button className="text-slate-200 hover:text-slate-500 transition-colors"><MoreVertical size={20} /></button>
                  </div>
                </div>
              ))}
              {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                      <p className="text-[10px] font-black text-slate-300 tracking-[0.4em] italic uppercase">No active acquisitions captured.</p>
                  </div>
              )}
            </div>
          </motion.div>

          {/* Performance Interface */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-8"
          >
            <div className="rounded-[40px] border border-slate-200 bg-slate-950 p-10 shadow-2xl shadow-indigo-600/10 text-white">
                <div className="flex items-center gap-4 mb-10">
                   <Target size={20} className="text-indigo-400" />
                   <h3 className="text-xl font-black italic tracking-tight leading-none">Sector Quota</h3>
                </div>
                
                <div className="space-y-10">
                   <div>
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black tracking-[0.3em] text-slate-400">Retail Signal</span>
                         <span className="text-xs font-black italic">84%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"></motion.div>
                      </div>
                   </div>
                   
                   <div>
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-[10px] font-black tracking-[0.3em] text-slate-400">Stock Velocity</span>
                         <span className="text-xs font-black italic">62%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: '62%' }} className="h-full bg-white rounded-full"></motion.div>
                      </div>
                   </div>
                </div>
                
                <button className="mt-12 w-full rounded-2xl bg-white/5 border border-white/10 py-5 text-[10px] font-black tracking-[0.3em] text-slate-300 transition hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 uppercase">
                    Initialize Full Audit
                </button>
            </div>

            <div className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                   <CreditCard size={20} className="text-indigo-600" />
                   <h3 className="text-xl font-black italic tracking-tight leading-none text-slate-900">Revenue Stream</h3>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] italic mb-2">Settled Liquidity</p>
                        <p className="text-2xl font-black italic tracking-tighter text-slate-900 tabular-nums leading-none">KES {stats.revenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
