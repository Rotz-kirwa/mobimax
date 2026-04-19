import { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const faqItems = [
  {
    question: 'Are the devices on Mobimax genuine?',
    answer:
      'The platform is architected exclusively around authentic technical assets. Every listing undergoas a rigorous provenance check to ensure architectural integrity before inclusion in the catalog.',
  },
  {
    question: 'Do you support M-Pesa checkout?',
    answer:
      'Yes. Our settlement protocol is engineered for Daraja M-Pesa STK push. Once a transaction signal is initialized, you will receive an authentication request directly on your identified mobile device.',
  },
  {
    question: 'How fast is logistics fulfilment?',
    answer:
      'We operate a priority distribution chain. Nairobi-sector acquisitions are typically fulfilled within a 4-hour window, while countrywide logistical signals are completed within 24-48 hours.',
  },
  {
    question: 'Can I buy Ex-UK or used stock?',
    answer:
      'Yes. We maintain a curated selection of Ex-UK Used assets. These are technically audited and classified with clear condition markers to ensure absolute transparency in your acquisition.',
  },
  {
    question: 'What are the return protocols?',
    answer:
      'All acquisitions are protected by our sovereign return protocol if the technical specimen does not meet the verified listing criteria. You have 48 hours to signal an anomaly upon receipt.',
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <div className="bg-white border-b border-slate-100 py-16 md:py-24 text-center">
        <div className="container mx-auto max-w-5xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-12 h-1 bg-brand-green rounded-full"></div>
                <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.4em]">Intelligence Base</span>
                <div className="w-12 h-1 bg-brand-green rounded-full"></div>
             </div>
             <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-slate-900 italic leading-none mb-8">
               Intelligence & FAQ
             </h1>
             <p className="max-w-2xl mx-auto text-lg font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
               Verified answers to common acquisition protocols, logistics, and settlement inquiries.
             </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto mt-16 max-w-4xl px-4">
        <div className="space-y-6">
          {faqItems.map((item, index) => {
            const isOpen = openItem === index;

            return (
              <motion.article
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={clsx(
                  "overflow-hidden rounded-[32px] border transition-all duration-500",
                  isOpen ? "bg-white border-green-200 shadow-2xl shadow-brand-green/10 scale-[1.02]" : "bg-white border-slate-100 shadow-sm"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-10 py-8 text-left"
                >
                  <span className={clsx("text-lg font-black uppercase tracking-tight transition-colors", isOpen ? "text-brand-green italic" : "text-slate-900")}>
                    {item.question}
                  </span>
                  <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center transition-all", isOpen ? "bg-brand-green text-white rotate-180" : "bg-slate-50 text-slate-400")}>
                    <ChevronDown size={20} strokeWidth={3} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-50 px-10 py-8 bg-slate-50/50"
                    >
                      <p className="text-sm font-bold leading-loose text-slate-500 normal-case tracking-normal max-w-3xl">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.8 }}
          className="mt-20 p-12 bg-slate-950 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-brand-green/20"
        >
           <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                 <HelpCircle className="text-brand-green" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em]">Direct Signal</span>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight italic">Queries Persist?</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Connect with a network specialist for precise intel.</p>
           </div>
           <a href="/contact" className="bg-brand-green text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-brand-green transition-all active:scale-95 flex items-center gap-3">
              Establish Comms <ArrowRight size={18} />
           </a>
        </motion.div>
      </div>
    </div>
  );
}
