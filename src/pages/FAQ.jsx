import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const faqItems = [
  {
    question: 'Are the devices on Mobimax genuine?',
    answer:
      'The storefront is positioned around authentic electronics, clear condition labels, and premium trust signals. Admin inventory should keep condition and availability accurate for each product.',
  },
  {
    question: 'Do you support M-Pesa checkout?',
    answer:
      'Yes. The checkout flow is designed for M-Pesa STK push, with the final live trigger depending on valid Safaricom Daraja credentials and a public callback URL.',
  },
  {
    question: 'How fast is delivery?',
    answer:
      'The current customer-facing UX promises fast Nairobi and countrywide delivery. Operational lead times should still be aligned with your actual fulfilment process before launch.',
  },
  {
    question: 'Can I buy Ex-UK or refurbished stock?',
    answer:
      'Yes. The product model supports multiple conditions, including New, Ex-UK Used, and Refurbished, so each listing can be labeled clearly.',
  },
  {
    question: 'Do you offer returns or warranty support?',
    answer:
      'The storefront includes policy and trust messaging, but the exact return and warranty rules should be finalized in your operational policy pages before going live.',
  },
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <title>FAQ – Mobimax</title>
      <meta
        name="description"
        content="Frequently asked questions about Mobimax orders, payments, product authenticity, delivery, and support."
      />

      <div className="border-b border-gray-100 bg-white py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-600">
            Support
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-gray-500">
            Clear answers to the most common shopper questions around payments, delivery, stock condition, and support expectations.
          </p>
        </div>
      </div>

      <div className="container mx-auto mt-12 max-w-5xl px-4">
        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openItem === index;

            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left"
                >
                  <span className="text-lg font-black uppercase tracking-tight text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={clsx(
                      'shrink-0 text-gray-400 transition-transform',
                      isOpen && 'rotate-180 text-emerald-600'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-6 py-6">
                    <p className="text-sm font-medium leading-relaxed text-gray-500">
                      {item.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
