import { useEffect, useState } from 'react';
import { ImagePlus, Trash2, UploadCloud, X, LayoutGrid } from 'lucide-react';
import {
  createEmptyHeroBannerDraft,
  PRODUCT_IMAGE_FALLBACK,
  readImageFileAsDataUrl,
  validateHeroBannerDraft,
  validateImageFile,
} from '@mobiplus/shared';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface HeroBannerEditorModalProps {
  open: boolean;
  initialBanner: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

function buildDraftFromBanner(banner: any) {
  if (!banner) {
    return createEmptyHeroBannerDraft();
  }

  return {
    id: banner.id || '',
    eyebrow: banner.eyebrow || 'Featured Drop',
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    link: banner.link || '/shop',
    bg: banner.bg || '',
  };
}

export default function HeroBannerEditorModal({ open, initialBanner, onClose, onSave }: HeroBannerEditorModalProps) {
  const [draft, setDraft] = useState(() => buildDraftFromBanner(initialBanner));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setDraft(buildDraftFromBanner(initialBanner));
    setErrors({});
    setUploadError('');
  }, [initialBanner, open]);

  if (!open) return null;

  const setField = (field: string, value: any) => {
    setDraft((current: any) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploading(true);

    try {
      const validationMessage = validateImageFile(file);
      if (validationMessage) throw new Error(validationMessage);

      const dataUrl = await readImageFileAsDataUrl(file);
      setField('bg', dataUrl);
    } catch (error: any) {
      setUploadError(error.message || 'Unable to read the selected image.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors = validateHeroBannerDraft(draft);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({
      ...draft,
      id: draft.id || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-stretch justify-end bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950 text-white shadow-2xl font-sans"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-8 py-6 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
               Storefront Architect
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight italic">
              {initialBanner ? 'Refine Banner' : 'Forge Banner'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-all hover:bg-white/10 hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 p-8 md:p-12 uppercase">
          <section className="space-y-8 rounded-[40px] border border-white/5 bg-white/5 p-8 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
               <LayoutGrid className="text-indigo-500" size={18} />
               <span className="text-[10px] font-black text-slate-500 tracking-widest">Metadata Layer</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-[10px] font-black tracking-[0.3em] text-slate-400 italic">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={draft.eyebrow}
                  onChange={(e) => setField('eyebrow', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-6 py-5 font-bold text-white outline-none transition focus:border-indigo-500 focus:bg-slate-800"
                  placeholder="FEATURED DROP"
                />
              </div>

              <div>
                <label className="mb-3 block text-[10px] font-black tracking-[0.3em] text-slate-400 italic">
                  Primary Headline
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setField('title', e.target.value)}
                  className={clsx("w-full rounded-2xl border bg-slate-900 px-6 py-5 font-black text-white outline-none transition focus:bg-slate-800 italic text-xl", errors.title ? "border-red-500" : "border-white/10 focus:border-indigo-500")}
                  placeholder="LAUNCH THE PROTOCOL"
                />
                {errors.title && <p className="mt-2 text-[10px] font-black text-red-400 tracking-widest">{errors.title}</p>}
              </div>

              <div>
                <label className="mb-3 block text-[10px] font-black tracking-[0.3em] text-slate-400 italic">
                  Supporting Payload
                </label>
                <textarea
                  rows={4}
                  value={draft.subtitle}
                  onChange={(e) => setField('subtitle', e.target.value)}
                  className={clsx("w-full rounded-2xl border bg-slate-900 px-6 py-5 font-bold text-white outline-none transition focus:bg-slate-800 normal-case tracking-normal", errors.subtitle ? "border-red-500" : "border-white/10 focus:border-indigo-500")}
                  placeholder="Describe the value proposition for this banner signal..."
                />
                {errors.subtitle && <p className="mt-2 text-[10px] font-black text-red-400 tracking-widest">{errors.subtitle}</p>}
              </div>

              <div>
                <label className="mb-3 block text-[10px] font-black tracking-[0.3em] text-slate-400 italic">
                  Signal Target (CTA Link)
                </label>
                <input
                  type="text"
                  value={draft.link}
                  onChange={(e) => setField('link', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-6 py-5 font-bold text-white outline-none transition focus:border-indigo-500 focus:bg-slate-800"
                  placeholder="/shop"
                />
              </div>
            </div>
          </section>

          <section className="space-y-8 rounded-[40px] border border-white/5 bg-white/5 p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] text-indigo-400 mb-2 italic">Visual Asset Interface</p>
                <p className="text-xs font-bold text-slate-500 normal-case">
                  Upload high-fidelity assets. JPG, PNG, WEBP (Max 4MB).
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center gap-4 rounded-2xl bg-indigo-600 px-8 py-5 text-[10px] font-black tracking-[0.3em] text-white transition hover:bg-white hover:text-black active:scale-95 shadow-xl shadow-indigo-600/20">
                <UploadCloud size={20} />
                {isUploading ? 'SYNCING...' : 'UPLOAD ASSET'}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 ring-4 ring-white/5 group relative">
              <div className="relative aspect-[16/9] w-full">
                <img
                  src={draft.bg || PRODUCT_IMAGE_FALLBACK}
                  alt="Preview"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-12">
                   <span className="text-[9px] font-black tracking-[0.5em] text-indigo-400 mb-4">{draft.eyebrow || 'PREVIEW SIGNAL'}</span>
                   <h1 className="text-3xl font-black italic tracking-tighter max-w-md">{draft.title || 'HEADLINE'}</h1>
                   <p className="mt-4 text-xs font-bold text-slate-300 max-w-sm normal-case line-clamp-2">{draft.subtitle || 'Payload content preview...'}</p>
                </div>
              </div>
              {draft.bg && (
                 <button 
                   type="button" 
                   onClick={() => setField('bg', '')}
                   className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl shadow-xl hover:bg-black transition-colors"
                 >
                   <Trash2 size={16} />
                 </button>
              )}
            </div>

            {!draft.bg && (
                <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-white/10 bg-slate-900/50 py-12 text-center">
                  <ImagePlus size={40} className="text-slate-700 mb-6" />
                  <p className="text-[10px] font-black tracking-[0.4em] text-slate-500">Asset Required For Broadcast</p>
                </div>
            )}
            
            {uploadError && <p className="mt-4 text-center text-[10px] font-black text-red-400 tracking-widest">{uploadError}</p>}
          </section>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-[10px] font-black tracking-[0.3em] text-slate-300 transition hover:bg-white/10 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-10 py-5 text-[10px] font-black tracking-[0.3em] text-white transition hover:bg-white hover:text-black active:scale-95 shadow-2xl shadow-indigo-600/20"
            >
              {initialBanner ? 'Commit Changes' : 'Initialize Banner'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
