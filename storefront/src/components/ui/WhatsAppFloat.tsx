import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PHONE = '254797674862';
const WA_URL = `https://wa.me/${PHONE}`;

/* Official Meta WhatsApp logo path */
function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppFloat() {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-6 right-5 z-[100] flex flex-col items-end gap-3 pointer-events-none font-sans">
      {/* Chat bubble popup */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-slate-100"
            style={{ boxShadow: '0 8px 40px 0 rgba(37,211,102,0.15), 0 2px 16px 0 rgba(0,0,0,0.10)' }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 ring-2 ring-white/30 flex items-center justify-center shrink-0">
                  <WhatsAppIcon size={20} />
                </div>
                <div>
                  <p className="text-white text-[13px] font-bold leading-tight">Mobimax Support</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    <p className="text-white/85 text-[11px] leading-tight">Online · replies in minutes</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBubble(false)}
                className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* Message body */}
            <div className="p-4">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center">
                  <WhatsAppIcon size={14} />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex-1">
                  <p className="text-[13px] text-slate-700 leading-relaxed">
                    👋 Hi there! Looking for a phone, laptop, or accessory?<br />
                    <span className="font-semibold text-slate-900">We'll find the best deal for you.</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5 text-right">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 text-white text-[13px] font-bold py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                <WhatsAppIcon size={16} />
                Start Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button — toggles popup */}
      <div className="pointer-events-auto relative">
        {!showBubble && (
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" style={{ animationDuration: '2.2s' }} />
        )}
        <motion.button
          type="button"
          onClick={() => setShowBubble((v) => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          className="relative flex w-[58px] h-[58px] rounded-full items-center justify-center text-white"
          style={{
            background: 'linear-gradient(145deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 4px 24px 0 rgba(37,211,102,0.45), 0 2px 8px 0 rgba(0,0,0,0.15)',
          }}
          aria-label="Chat on WhatsApp"
        >
          <AnimatePresence mode="wait" initial={false}>
            {showBubble ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="wa"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <WhatsAppIcon size={30} />
              </motion.span>
            )}
          </AnimatePresence>
          {/* Online dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-300 border-2 border-white rounded-full" />
        </motion.button>
      </div>
    </div>
  );
}
