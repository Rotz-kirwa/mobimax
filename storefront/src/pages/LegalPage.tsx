import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const legalContent: Record<string, any> = {
  privacy: {
    eyebrow: 'Privacy Layer',
    title: 'Data Sovereignty Protocol',
    intro: 'Comprehensive protocol governing the handling of contact identifiers, session telemetry, and transactional artifacts within the Mobimax network.',
    sections: [
      {
        heading: 'Signal Collection',
        body: 'We acquire identifiers submitted via checkout nodes, direct support channels, and encrypted communication paths, alongside telemetry required for secure network operation.',
      },
      {
        heading: 'Asset Utilization',
        body: 'Identifiers are utilized to facilitate logistics, verify technical acquisitions, and improve the storefront response latency.',
      },
      {
        heading: 'Sovereign Controls',
        body: 'Entities may request the purging or synchronization of identifiers by establishing a support signal prior to archival cycles.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms Layer',
    title: 'Acquisition Protocols',
    intro: 'Standardized terms regulating technical asset presentation, valuation transparency, and fulfillment cycles across the storefront.',
    sections: [
      {
        heading: 'Technical Fidelity',
        body: 'Asset condition, valuation markers, and specifications must be verified at the point of acquisition, particularly for high-demand specimens.',
      },
      {
        heading: 'Logistical Chains',
        body: 'Acquisitions are subject to node verification, settlement confirmation, and regional logistical coverage limits.',
      },
      {
        heading: 'Support Cycles',
        body: 'Return eligibility and technical support claims are reviewed against specimen condition, transaction records, and specific asset policies.',
      },
    ],
  },
  cookies: {
    eyebrow: 'Cookie Layer',
    title: 'Telemetry Notification',
    intro: 'Documentation of lightweight session storage and telemetry protocols used to stabilize core navigation and storefront performance.',
    sections: [
      {
        heading: 'Essential Channels',
        body: 'Session storage is utilized to maintain navigational stability, remember complex selections, and optimize frame delivery.',
      },
      {
        heading: 'Behavioral Persistence',
        body: 'Telemetry helps preserve preferred storefront configurations, including filtered results and active wishlist markers across visits.',
      },
      {
        heading: 'Control Mechanisms',
        body: 'Signal management can be performed via browser-level terminal settings, though this may reset local navigational preferences.',
      },
    ],
  },
};

interface LegalPageProps {
  pageKey: string;
}

export default function LegalPage({ pageKey }: LegalPageProps) {
  const page = legalContent[pageKey] || legalContent.privacy;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      <div className="bg-white border-b border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-brand-green rounded-full"></div>
              <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">{page.eyebrow}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight uppercase leading-none italic">
              {page.title}
            </h1>
            <p className="mt-8 text-lg font-bold text-slate-400 capitalize tracking-widest leading-loose max-w-3xl">
              {page.intro}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] border border-slate-100 p-12 md:p-16 shadow-2xl shadow-brand-green/10 space-y-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="space-y-16 relative z-10 transition-all">
            {page.sections.map((section: any) => (
              <section key={section.heading} className="group">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic group-hover:text-brand-green transition-colors">
                  {section.heading}
                </h2>
                <p className="text-slate-500 font-bold leading-relaxed normal-case tracking-normal max-w-4xl">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="pt-12 border-t border-slate-50 flex flex-col sm:flex-row gap-6 relative z-10">
            <Link to="/shop" className="inline-flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all shadow-2xl shadow-brand-green/10 active:scale-95 group">
              Acquisition Interface <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-brand-green transition-all active:scale-95">
              Establish Signal
            </Link>
          </div>
        </motion.div>
        
        <div className="mt-16 flex items-center justify-center gap-10 opacity-30 group grayscale hover:grayscale-0 hover:opacity-100 transition-all">
           <ShieldCheck size={40} className="text-brand-green" />
           <Activity size={40} className="text-brand-green" />
        </div>
      </div>
    </div>
  );
}
