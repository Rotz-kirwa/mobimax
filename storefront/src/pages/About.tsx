import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Truck, Zap, LayoutGrid, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const pillars = [
  {
    title: 'Authenticity Protocol',
    description:
      'We focus on genuine electronics, clear product condition labels, and transparent pricing built around zero-compromise trust.',
    icon: ShieldCheck,
  },
  {
    title: 'Priority Logistics',
    description:
      'From Nairobi distribution hubs to countrywide delivery, the experience is engineered for speed, premium handling, and dependability.',
    icon: Truck,
  },
  {
    title: 'Premium Acquisitions',
    description:
      'Mobimax curates high-performance mobility, computing, audio, and flagships for the elite digital citizen.',
    icon: Zap,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans uppercase">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-32 md:py-48 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-brand-green/10 blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-green-500/5 blur-[150px]"></div>
        </div>
        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-brand-green rounded-full"></div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.5em]">The Infrastructure</span>
            </div>
            <h1 className="max-w-5xl text-5xl sm:text-7xl md:text-8xl font-black uppercase leading-none tracking-tight italic mb-8">
              Engineering Trust In <span className="text-green-500">Digital Assets.</span>
            </h1>
            <p className="max-w-2xl text-lg font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Mobimax is a sovereign storefront designed for participants who demand authenticity, logistical speed, and premium interaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 -mt-20 relative z-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {pillars.map((pillar, idx) => (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-[48px] border border-slate-100 bg-white p-12 shadow-2xl shadow-brand-green/10 group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 group-hover:bg-brand-green group-hover:text-white transition-all duration-500 mb-8 font-black">
                  <pillar.icon size={28} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 italic mb-4">
                  {pillar.title}
                </h2>
                <p className="text-sm font-bold leading-loose text-slate-500 normal-case tracking-normal">
                  {pillar.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-y border-slate-100 bg-white">
        <div className="container mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green mb-6">Manifesto</p>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 italic leading-tight mb-8">
              A Sovereign Protocol For Modern Commerce.
            </h2>
            <p className="text-lg font-bold leading-relaxed text-slate-400 normal-case tracking-normal mb-8 max-w-xl">
              Mobimax bridges the gap between digital saturation and the practical requirements of elite buyers: Stock certainty, transaction integrity, and priority distribution.
            </p>
            <div className="flex items-center gap-8">
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 italic tracking-tighter">100% Secure</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Acquisition Network</span>
               </div>
               <div className="w-px h-12 bg-slate-100"></div>
               <div className="flex flex-col">
                  <span className="text-2xl font-black text-slate-900 italic tracking-tighter">2-Hour Signal</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Average Response</span>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[56px] bg-slate-950 p-12 text-white shadow-2xl shadow-brand-green/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid grid-cols-2 gap-6 md:gap-10 mb-12">
              {[
                ['01', 'Phones', 'Flagship Focus'],
                ['02', 'Audio', 'Hi-Fi Grade'],
                ['03', 'Compute', 'Power Station'],
                ['04', 'Watch', 'Wearable Intel'],
              ].map(([num, label, copy]) => (
                <div key={label} className="group">
                  <span className="text-[10px] font-black text-green-500 mb-2 block">{num}</span>
                  <p className="text-2xl font-black tracking-tighter italic text-white group-hover:text-brand-green transition-colors uppercase">{label}</p>
                  <p className="mt-1 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{copy}</p>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 group">
              <div className="flex items-center gap-3 mb-4">
                 <LayoutGrid size={18} className="text-green-500" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Service Protocol</span>
              </div>
              <p className="text-sm font-bold leading-loose text-slate-300 normal-case tracking-normal">
                Encrypted transactions, priority terminal handling, and logistical chains tailored for local and regional expectations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-green-50 text-brand-green rounded-3xl flex items-center justify-center mb-10 border border-green-100 shadow-xl shadow-brand-green/10">
              <Award size={36} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-900 italic leading-none mb-8">
              Access The Infrastructure
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-12 italic">
              Experience the future of electronics acquisition. Secure your next asset today through our sovereign catalog.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/shop"
                className="w-full sm:w-auto bg-slate-950 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-green transition-all shadow-2xl shadow-brand-green/20 active:scale-95 group"
              >
                Access Catalog <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:border-brand-green transition-all active:scale-95"
              >
                Establish Signal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
