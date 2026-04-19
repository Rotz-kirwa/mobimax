import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const contactMethods = [
  {
    title: 'Acquisition Line',
    value: '+254 797 674862',
    href: 'tel:+254797674862',
    icon: Phone,
    color: 'green'
  },
  {
    title: 'Technical Support',
    value: 'support@mobimax.io',
    href: 'mailto:support@mobimax.io',
    icon: Mail,
    color: 'slate'
  },
  {
    title: 'Secure Comms',
    value: 'Initialize Chat',
    href: 'https://wa.me/254797674862',
    icon: MessageCircle,
    color: 'green'
  },
  {
    title: 'Distribution Hub',
    value: 'MobiMax Tower, Nairobi',
    href: 'https://maps.google.com/?q=Nairobi',
    icon: MapPin,
    color: 'slate'
  },
];

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(formState.subject || 'Enterprise Enquiry');
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`
    );
    window.location.href = `mailto:support@mobimax.io?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <section className="bg-white border-b border-slate-100 py-24 md:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center l"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-brand-green rounded-full"></div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">Signal Channel</span>
              <div className="w-12 h-1 bg-brand-green rounded-full"></div>
            </div>
            <h1 className="max-w-5xl text-5xl md:text-7xl font-black uppercase tracking-tight text-slate-900 leading-none italic mb-8">
              Establish Connection
            </h1>
            <p className="max-w-2xl text-lg font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Our specialists are online to facilitate technical acquisition and logistics.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 -mt-16">
        <div className="container mx-auto grid max-w-7xl gap-4 md:gap-8 px-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, idx) => (
            <motion.a
              key={method.title}
              href={method.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
              className="group rounded-[40px] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-brand-green/10 hover:-translate-y-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-brand-green group-hover:text-white transition-all duration-500 mb-8 border border-slate-100">
                <method.icon size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-2">
                {method.title}
              </p>
              <p className="text-lg font-black uppercase tracking-tight text-slate-900 italic">
                {method.value}
              </p>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[48px] border border-slate-100 bg-slate-950 p-12 text-white shadow-2xl shadow-brand-green/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center gap-4 mb-10">
               <Clock className="text-brand-green" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Operation Tempo</span>
            </div>
            
            <div className="space-y-8 relative z-10">
              {[
                ['Standard Cycle', 'Mon — Fri', '08:00 — 18:00'],
                ['Tactical Saturday', 'Sat', '09:00 — 16:00'],
                ['Silent Sunday', 'Sun', 'Digital Support Only'],
              ].map(([title, day, time]) => (
                <div key={title} className="border-b border-white/5 pb-6">
                  <p className="text-[9px] font-black text-brand-green uppercase tracking-widest mb-2">{title}</p>
                  <div className="flex items-center justify-between">
                     <span className="text-lg font-black uppercase italic">{day}</span>
                     <span className="text-sm font-bold text-slate-400">{time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10 italic">
               <p className="text-xs text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
                 "Our network is engineered for speed. Expect technical response within 120 seconds for high-priority signals."
               </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[48px] border border-slate-100 bg-white p-12 shadow-2xl shadow-brand-green/10 group"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green mb-2">Encryption Interface</p>
            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 italic mb-10">
              Transmit Data
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Identifer</label>
                 <input
                   type="text"
                   required
                   value={formState.name}
                   onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                   placeholder="Legal Name"
                   className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-green/10"
                 />
              </div>
              <div className="space-y-4">
                 <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Signal Channel</label>
                 <input
                   type="email"
                   required
                   value={formState.email}
                   onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                   placeholder="comm_id@network.io"
                   className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-green/10"
                 />
              </div>
              <div className="space-y-4 md:col-span-2">
                 <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Marker</label>
                 <input
                   type="text"
                   required
                   value={formState.subject}
                   onChange={(e) => setFormState(s => ({ ...s, subject: e.target.value }))}
                   placeholder="Acquisition Inquiry / Asset Tracking / Logistics"
                   className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-green/10"
                 />
              </div>
              <div className="space-y-4 md:col-span-2">
                 <label className="ml-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Message Payload</label>
                 <textarea
                   rows={6}
                   required
                   value={formState.message}
                   onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                   placeholder="Detailed transmission content..."
                   className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 font-medium text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-brand-green/10"
                 />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-brand-green text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:bg-slate-950 transition-all shadow-2xl shadow-brand-green/30 flex items-center justify-center gap-4 group"
                >
                  Confirm Transmission
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
