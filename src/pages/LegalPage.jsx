import { Link } from 'react-router-dom';

const legalContent = {
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    intro: 'This page explains how MobiMax handles contact details, browsing activity, and order-related information across the storefront experience.',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We may collect details you submit through checkout fields, contact channels, or support conversations, alongside technical browsing data needed to operate the storefront securely.',
      },
      {
        heading: 'How We Use Data',
        body: 'Information is used to respond to inquiries, process transactions, coordinate delivery, improve the catalog experience, and prevent abuse or fraud.',
      },
      {
        heading: 'Your Controls',
        body: 'You can request updates or deletion of contact details by reaching out to support before an order is fulfilled or support history is archived.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Terms & Conditions',
    intro: 'These terms outline how MobiMax presents products, handles pricing, and supports customer orders through the storefront.',
    sections: [
      {
        heading: 'Product Information',
        body: 'Availability, pricing, warranties, and specifications should be confirmed at the time of purchase, especially for limited promotions or condition-based inventory.',
      },
      {
        heading: 'Orders & Fulfilment',
        body: 'Orders are subject to verification, payment confirmation where applicable, and logistical coverage for the customer delivery region.',
      },
      {
        heading: 'Returns & Support',
        body: 'Return eligibility, exchanges, and warranty claims are assessed against product condition, proof of purchase, and the category-specific support policy.',
      },
    ],
  },
  cookies: {
    eyebrow: 'Cookies',
    title: 'Cookie Notice',
    intro: 'This page describes how lightweight browser storage and analytics-style technologies support navigation, saved state, and storefront performance.',
    sections: [
      {
        heading: 'Essential Usage',
        body: 'Cookies or similar browser storage may be used to keep navigation stable, remember session choices, and improve page delivery.',
      },
      {
        heading: 'Experience Preferences',
        body: 'Preference storage can help preserve storefront behavior such as remembered selections, viewed categories, or saved items across a visit.',
      },
      {
        heading: 'Managing Cookies',
        body: 'You can manage or clear cookies through your browser settings, though doing so may reset saved storefront preferences or session state.',
      },
    ],
  },
};

export default function LegalPage({ pageKey }) {
  const page = legalContent[pageKey] || legalContent.privacy;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-0.5 bg-brand-green"></div>
            <span className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em]">{page.eyebrow}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
            {page.title}
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-500 font-medium leading-relaxed max-w-3xl">
            {page.intro}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-12">
        <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-premium space-y-8">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">{section.body}</p>
            </section>
          ))}

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="inline-flex items-center justify-center bg-gray-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-brand-green transition-all">
              Continue Shopping
            </Link>
            <Link to="/account" className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-100 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest hover:border-gray-200 transition-all">
              Open Account Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
