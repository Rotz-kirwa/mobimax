import { useEffect, useState } from 'react';
import { ImagePlus, Trash2, UploadCloud, X } from 'lucide-react';
import {
  createEmptyHeroBannerDraft,
  PRODUCT_IMAGE_FALLBACK,
  readImageFileAsDataUrl,
  validateHeroBannerDraft,
  validateImageFile,
} from '../../lib/catalog';

function buildDraftFromBanner(banner) {
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

export default function HeroBannerEditorModal({ open, initialBanner, onClose, onSave }) {
  const [draft, setDraft] = useState(() => buildDraftFromBanner(initialBanner));
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setDraft(buildDraftFromBanner(initialBanner));
    setErrors({});
    setUploadError('');
  }, [initialBanner, open]);

  if (!open) {
    return null;
  }

  const setField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: '' }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const validationMessage = validateImageFile(file);

      if (validationMessage) {
        throw new Error(validationMessage);
      }

      const dataUrl = await readImageFileAsDataUrl(file);
      setField('bg', dataUrl);
    } catch (error) {
      setUploadError(error.message || 'Unable to read the selected image.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateHeroBannerDraft(draft);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave({
      id: draft.id || undefined,
      eyebrow: draft.eyebrow.trim(),
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      link: draft.link.trim(),
      bg: draft.bg.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-stretch justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950 text-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
              Storefront Editor
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
              {initialBanner ? 'Edit Hero Banner' : 'Add Hero Banner'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close hero banner editor"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
          <section className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Eyebrow
              </label>
              <input
                type="text"
                value={draft.eyebrow}
                onChange={(event) => setField('eyebrow', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="Featured Drop"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Headline
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(event) => setField('title', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="Launch the latest flagship drop"
              />
              {errors.title && <p className="mt-2 text-xs font-bold text-red-300">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Supporting Copy
              </label>
              <textarea
                rows="4"
                value={draft.subtitle}
                onChange={(event) => setField('subtitle', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-white outline-none transition focus:border-emerald-400"
                placeholder="A short marketing line that explains why shoppers should click."
              />
              {errors.subtitle && (
                <p className="mt-2 text-xs font-bold text-red-300">{errors.subtitle}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                CTA Link
              </label>
              <input
                type="text"
                value={draft.link}
                onChange={(event) => setField('link', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white outline-none transition focus:border-emerald-400"
                placeholder="/shop"
              />
              {errors.link && <p className="mt-2 text-xs font-bold text-red-300">{errors.link}</p>}
            </div>
          </section>

          <section className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                  Background Image
                </p>
                <p className="mt-2 text-sm font-medium text-slate-400">
                  Paste a URL or upload a hero asset. JPG, PNG, and WEBP files up to 4MB are accepted.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400">
                <UploadCloud size={16} />
                {isUploading ? 'Uploading…' : 'Upload Hero'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.25em] text-slate-300">
                Image URL
              </label>
              <input
                type="text"
                value={draft.bg}
                onChange={(event) => setField('bg', event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-medium text-white outline-none transition focus:border-emerald-400"
                placeholder="https://example.com/hero.jpg"
              />
              {(errors.bg || uploadError) && (
                <p className="mt-2 text-xs font-bold text-red-300">{errors.bg || uploadError}</p>
              )}
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={draft.bg || PRODUCT_IMAGE_FALLBACK}
                  alt="Hero banner preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center px-6 sm:px-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
                    {draft.eyebrow || 'Featured Drop'}
                  </p>
                  <h3 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    {draft.title || 'Hero headline preview'}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-200">
                    {draft.subtitle || 'Your supporting message will appear here.'}
                  </p>
                </div>
              </div>
            </div>

            {draft.bg ? (
              <button
                type="button"
                onClick={() => setField('bg', '')}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 transition hover:border-red-300 hover:bg-red-500/10 hover:text-red-200"
              >
                <Trash2 size={14} />
                Remove Image
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-slate-900/30 px-6 py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/5 text-slate-300">
                  <ImagePlus size={28} />
                </div>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                  No Hero Image Yet
                </p>
              </div>
            )}
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-200 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-emerald-500 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-emerald-400"
            >
              {initialBanner ? 'Save Banner' : 'Create Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
