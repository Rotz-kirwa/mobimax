import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

const contactMethods = [
  {
    title: 'Call Sales',
    value: '+254 797 674862',
    href: 'tel:+254797674862',
    icon: Phone,
  },
  {
    title: 'Email Support',
    value: 'sales@mobimax.co.ke',
    href: 'mailto:sales@mobimax.co.ke',
    icon: Mail,
  },
  {
    title: 'WhatsApp',
    value: 'Chat instantly',
    href: 'https://wa.me/254797674862',
    icon: MessageCircle,
  },
  {
    title: 'Store Location',
    value: 'MobiMax Tower, Nairobi',
    href: 'https://maps.google.com/?q=Nairobi',
    icon: MapPin,
  },
];

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(formState.subject || 'Mobimax enquiry');
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`
    );

    window.location.href = `mailto:sales@mobimax.co.ke?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <title>Contact Mobimax</title>
      <meta
        name="description"
        content="Contact Mobimax for sales, support, delivery questions, and product availability help."
      />

      <section className="border-b border-gray-100 bg-gray-50 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
            Contact
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase tracking-tighter text-gray-900 sm:text-5xl md:text-6xl">
            Reach the Mobimax team for sales, support, and dispatch help.
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-gray-500">
            Use the support channels below to ask about products, stock, delivery, or payment guidance before checkout.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 xl:grid-cols-4">
          {contactMethods.map((method) => (
            <a
              key={method.title}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noreferrer' : undefined}
              className="rounded-[28px] border border-gray-100 bg-gray-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-emerald-500/10 text-emerald-600">
                <method.icon size={24} />
              </div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                {method.title}
              </p>
              <p className="mt-3 text-lg font-black uppercase tracking-tight text-gray-900">
                {method.value}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-gray-100 bg-slate-950 p-8 text-white shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">
              Support Hours
            </p>
            <div className="mt-8 space-y-5">
              {[
                ['Monday - Friday', '8:00 AM - 6:00 PM'],
                ['Saturday', '9:00 AM - 4:00 PM'],
                ['Sunday', 'By message only'],
              ].map(([day, time]) => (
                <div key={day} className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-black uppercase tracking-tight text-white">{day}</span>
                  <span className="text-sm font-medium text-slate-300">{time}</span>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
              Email the Team
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-gray-900">
              Send a Message
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <input
                type="text"
                value={formState.name}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Your name"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold text-gray-900 outline-none transition focus:border-emerald-400"
              />
              <input
                type="email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="Email address"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold text-gray-900 outline-none transition focus:border-emerald-400"
              />
              <input
                type="text"
                value={formState.subject}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, subject: event.target.value }))
                }
                placeholder="Subject"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-bold text-gray-900 outline-none transition focus:border-emerald-400 md:col-span-2"
              />
              <textarea
                rows="6"
                value={formState.message}
                onChange={(event) =>
                  setFormState((current) => ({ ...current, message: event.target.value }))
                }
                placeholder="Tell us what you need help with..."
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 font-medium text-gray-900 outline-none transition focus:border-emerald-400 md:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="mt-6 rounded-2xl bg-gray-900 px-8 py-4 text-[11px] font-black uppercase tracking-[0.25em] text-white transition hover:bg-brand-green"
            >
              Compose Support Email
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
