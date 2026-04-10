import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Truck, Zap } from 'lucide-react';

const pillars = [
  {
    title: 'Authentic Devices',
    description:
      'We focus on genuine electronics, clear product condition labels, and transparent pricing built around trust.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Fulfilment',
    description:
      'From Nairobi dispatch to countrywide delivery, the experience is designed to feel smooth, premium, and dependable.',
    icon: Truck,
  },
  {
    title: 'Premium Selection',
    description:
      'Mobimax curates fast-moving phones, computing, wearables, audio, accessories, and standout flagship launches.',
    icon: Zap,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <title>About Mobimax</title>
      <meta
        name="description"
        content="Learn about Mobimax, Kenya's premium electronics storefront for authentic phones, computing, audio, and accessories."
      />

      <section className="relative overflow-hidden border-b border-gray-100 bg-slate-950 py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-red-500/15 blur-[120px]"></div>
        </div>
        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
            About Mobimax
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-none tracking-tighter sm:text-5xl md:text-7xl">
            Premium electronics, built around trust and real-world convenience.
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-slate-300">
            Mobimax is designed to serve shoppers who care about authenticity, fast delivery,
            transparent pricing, and a premium buying experience from browsing to checkout.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[32px] border border-gray-100 bg-gray-50 p-8 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-500/10 text-emerald-600">
                  <pillar.icon size={26} />
                </div>
                <h2 className="mt-6 text-2xl font-black uppercase tracking-tight text-gray-900">
                  {pillar.title}
                </h2>
                <p className="mt-4 text-sm font-medium leading-relaxed text-gray-500">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 py-20">
        <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
              Why It Exists
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-gray-900 sm:text-4xl">
              A cleaner, more trustworthy electronics storefront for Kenya.
            </h2>
            <p className="mt-6 text-base font-medium leading-relaxed text-gray-500">
              Mobimax is meant to bridge the gap between sleek premium merchandising and the
              practical details buyers actually need: stock clarity, payment convenience,
              delivery confidence, and strong support signals.
            </p>
          </div>

          <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                ['Phones', 'Flagship to value'],
                ['Audio', 'Premium sound'],
                ['Computing', 'Work and power'],
              ].map(([label, copy]) => (
                <div key={label}>
                  <p className="text-3xl font-black tracking-tighter text-gray-900">{label}</p>
                  <p className="mt-2 text-sm font-medium text-gray-500">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[24px] bg-slate-950 px-6 py-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300">
                Service Promise
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300">
                Clear product condition, premium presentation, and checkout flows tailored for
                M-Pesa and local fulfilment expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-red-500/10 text-red-500">
            <Award size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-black uppercase tracking-tight text-gray-900 sm:text-4xl">
            Ready to explore the catalog?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-gray-500">
            Browse premium devices, latest arrivals, hot deals, and curated collections built for a modern electronics store.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/shop"
              className="rounded-3xl bg-gray-900 px-10 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-brand-green"
            >
              Browse Catalog
            </Link>
            <Link
              to="/contact"
              className="rounded-3xl border border-gray-200 px-10 py-4 text-xs font-black uppercase tracking-[0.25em] text-gray-900 transition hover:border-gray-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
