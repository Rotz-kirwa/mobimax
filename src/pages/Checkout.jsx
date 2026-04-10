import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Smartphone,
  Timer,
  Wallet,
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import * as Sentry from '@sentry/react';
import { useStore } from '../store/useStore';
import { useOrderStore } from '../store/useOrderStore';

const PAYMENT_METHODS = [
  {
    id: 'mpesa',
    name: 'M-Pesa Express',
    icon: Smartphone,
    desc: 'Instant STK Push',
    enabled: true,
  },
  {
    id: 'pod',
    name: 'Pay on Delivery',
    icon: Wallet,
    desc: 'Coming Soon',
    enabled: false,
  },
  {
    id: 'card',
    name: 'Credit / Debit',
    icon: CreditCard,
    desc: 'Coming Soon',
    enabled: false,
  },
];

const INITIAL_DETAILS = {
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: 'Nairobi',
};

const DEFAULT_PAYMENT_STATE = {
  // type: 'idle' | 'pending' | 'stk_sent' | 'confirmed' | 'payment_failed' | 'error'
  type: 'idle',
  message: '',
  merchantRequestId: '',
  checkoutRequestId: '',
  reference: '',
};

const POLL_INTERVAL_MS = 5000;
const POLL_MAX = 24; // 24 × 5 s = 120 s

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits.slice(3, 12);
  if (digits.startsWith('0')) return digits.slice(1, 10);
  return digits.slice(0, 9);
}

function validateCustomerDetails(details) {
  const errors = {};
  if (!details.firstName.trim()) errors.firstName = 'Enter the customer first name.';
  if (!details.lastName.trim()) errors.lastName = 'Enter the customer last name.';
  if (normalizePhone(details.phone).length !== 9) errors.phone = 'Use a Safaricom line like 712345678.';
  if (!details.address.trim()) errors.address = 'Enter the delivery address.';
  if (!details.city.trim()) errors.city = 'Enter the city or town.';
  return errors;
}

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Checkout() {
  const { cart, clearCart } = useStore();
  const createOrder = useOrderStore((state) => state.createOrder);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState(INITIAL_DETAILS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [paymentState, setPaymentState] = useState(DEFAULT_PAYMENT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollingCountdown, setPollingCountdown] = useState(120);

  const pollingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 100000 ? 0 : 500;
  const total = subtotal + deliveryFee;
  const formattedPhone = normalizePhone(customerDetails.phone);

  const paymentComplete = ['stk_sent', 'confirmed', 'payment_failed'].includes(paymentState.type);
  const detailsLockedIn = checkoutStep === 2 || paymentComplete;

  // ── Polling effect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (paymentState.type !== 'stk_sent' || !paymentState.checkoutRequestId) return;

    let polls = 0;
    setPollingCountdown(120);

    countdownIntervalRef.current = setInterval(() => {
      setPollingCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    pollingIntervalRef.current = setInterval(async () => {
      polls += 1;

      try {
        const res = await fetch(
          `/api/mpesa/status?checkoutRequestId=${encodeURIComponent(paymentState.checkoutRequestId)}`
        );
        const data = await res.json().catch(() => ({}));

        if (data.resultCode === '0') {
          // Payment confirmed ✅
          clearInterval(pollingIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
          createOrder({
            reference: paymentState.reference,
            checkoutRequestId: paymentState.checkoutRequestId,
            merchantRequestId: paymentState.merchantRequestId,
            paymentMethod: 'mpesa',
            paymentStatus: 'confirmed',
            status: 'paid',
            customer: {
              ...customerDetails,
              phone: `254${formattedPhone}`,
            },
            items: cart.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image: item.image,
            })),
            totals: {
              subtotal,
              deliveryFee,
              total,
            },
          });
          setPaymentState((prev) => ({ ...prev, type: 'confirmed' }));
          clearCart();
          return;
        }

        if (data.resultCode !== 'pending' && data.resultCode != null) {
          // Payment explicitly failed / cancelled
          clearInterval(pollingIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
          setPaymentState((prev) => ({
            ...prev,
            type: 'payment_failed',
            message: data.resultDesc || 'Payment was not completed. Please try again.',
          }));
          return;
        }

        if (polls >= POLL_MAX) {
          // 2-minute window elapsed
          clearInterval(pollingIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
          setPaymentState((prev) => ({
            ...prev,
            type: 'payment_failed',
            message: 'Payment window expired. Please try again.',
          }));
        }
      } catch (pollError) {
        // Network hiccup — keep polling silently, but capture for observability
        Sentry.captureException(pollError, { tags: { feature: 'mpesa_status_poll' }, level: 'warning' });
      }
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollingIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, [
    cart,
    clearCart,
    createOrder,
    customerDetails,
    deliveryFee,
    formattedPhone,
    paymentState.checkoutRequestId,
    paymentState.merchantRequestId,
    paymentState.reference,
    paymentState.type,
    subtotal,
    total,
  ]);

  const handleFieldChange = (field, value) => {
    setCustomerDetails((current) => ({
      ...current,
      [field]: field === 'phone' ? normalizePhone(value) : value,
    }));
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: '' }));
    if (paymentState.type !== 'idle') setPaymentState(DEFAULT_PAYMENT_STATE);
  };

  const continueToPayment = () => {
    const errors = validateCustomerDetails(customerDetails);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) { setCheckoutStep(1); return; }
    setCheckoutStep(2);
  };

  const triggerStkPush = async () => {
    const errors = validateCustomerDetails(customerDetails);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) { setCheckoutStep(1); return; }

    if (paymentMethod !== 'mpesa') {
      setPaymentState({
        ...DEFAULT_PAYMENT_STATE,
        type: 'error',
        message: 'Only M-Pesa Express is wired right now.',
      });
      return;
    }

    setIsSubmitting(true);
    setPaymentState({ ...DEFAULT_PAYMENT_STATE, type: 'pending', message: 'Sending the M-Pesa STK prompt to your phone…' });

    try {
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          items: cart.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
          customer: { ...customerDetails, phone: `254${formattedPhone}` },
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 404) {
        throw new Error(
          'The M-Pesa API route is unavailable in plain Vite dev mode. Deploy to Vercel or use a public server.'
        );
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to start the STK push right now.');
      }

      // STK push dispatched — begin polling
      setPaymentState({
        type: 'stk_sent',
        message: result.customerMessage || 'STK push sent. Check your phone and enter your M-Pesa PIN.',
        merchantRequestId: result.merchantRequestId || '',
        checkoutRequestId: result.checkoutRequestId || '',
        reference: result.reference || '',
      });
    } catch (error) {
      Sentry.captureException(error, { tags: { feature: 'mpesa_stk_push' } });
      setPaymentState({ ...DEFAULT_PAYMENT_STATE, type: 'error', message: error.message || 'Unable to start the STK push right now.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimaryAction = () => {
    if (checkoutStep === 1) { continueToPayment(); return; }
    if (paymentState.type === 'payment_failed' || paymentState.type === 'error') {
      setPaymentState(DEFAULT_PAYMENT_STATE);
      setPollingCountdown(120);
      return;
    }
    void triggerStkPush();
  };

  const primaryButtonLabel = (() => {
    if (checkoutStep === 1) return 'Continue to Payment';
    if (isSubmitting) return 'Sending STK Push…';
    if (paymentState.type === 'stk_sent') return 'Waiting for Payment…';
    if (paymentState.type === 'confirmed') return 'Payment Confirmed';
    if (paymentState.type === 'payment_failed' || paymentState.type === 'error') return 'Retry Payment';
    return 'Trigger STK Push';
  })();

  const primaryButtonDisabled =
    isSubmitting ||
    paymentState.type === 'stk_sent' ||
    paymentState.type === 'confirmed';

  if (cart.length === 0 && paymentState.type !== 'confirmed') {
    return (
      <div className="container mx-auto px-4 py-40 text-center">
        <title>Checkout – MobiPlus</title>
        <h2 className="mb-4 text-3xl font-black uppercase tracking-tighter text-gray-900 sm:text-4xl">
          No Inventory Selected
        </h2>
        <p className="mb-12 text-sm font-bold uppercase text-gray-400">
          Your checkout sequence was interrupted because the cart is empty.
        </p>
        <Link
          to="/shop"
          className="rounded-3xl bg-brand-green px-10 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:shadow-xl"
        >
          Explore Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <title>Checkout – MobiPlus</title>
      <meta name="description" content="Complete your MobiPlus order securely via M-Pesa. Fast delivery across Kenya." />

      <div className="mb-12 border-b border-gray-100 bg-white py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <Link
                to="/cart"
                className="mb-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 transition-colors hover:text-brand-green"
              >
                <ChevronLeft size={16} strokeWidth={3} /> Return to Cart
              </Link>
              <h1 className="text-3xl font-black uppercase leading-none tracking-tighter text-gray-900 sm:text-4xl md:text-5xl">
                Checkout Protocol
              </h1>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full text-xs font-black shadow-lg shadow-brand-green/20',
                    detailsLockedIn ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {detailsLockedIn ? <CheckCircle2 size={18} /> : '1'}
                </div>
                <span className={clsx('mt-2 text-[9px] font-black uppercase tracking-widest', detailsLockedIn ? 'text-gray-900' : 'text-gray-400')}>
                  Details
                </span>
              </div>
              <div className="h-px w-12 bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full text-xs font-black',
                    paymentComplete ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20' : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {paymentState.type === 'confirmed' ? <CheckCircle2 size={18} /> : '2'}
                </div>
                <span className={clsx('mt-2 text-[9px] font-black uppercase tracking-widest', paymentComplete ? 'text-gray-900' : 'text-gray-400')}>
                  Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="flex-1 space-y-12">

            {/* ── Step 1: Customer Details ─────────────────────────────── */}
            <div className="relative rounded-[40px] border border-gray-100 bg-white p-10 shadow-premium">
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Logistic Destination</h2>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
                    Customer details for dispatch and payment
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="checkout-first-name" className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Legal First Name
                  </label>
                  <input
                    id="checkout-first-name"
                    type="text"
                    value={customerDetails.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    className={clsx(
                      'w-full rounded-2xl border bg-gray-50 px-6 py-4 font-bold text-gray-900 outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10',
                      fieldErrors.firstName ? 'border-red-200' : 'border-gray-100'
                    )}
                    placeholder="John"
                    aria-invalid={Boolean(fieldErrors.firstName)}
                  />
                  {fieldErrors.firstName && <p className="text-xs font-bold text-red-500">{fieldErrors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="checkout-last-name" className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Legal Last Name
                  </label>
                  <input
                    id="checkout-last-name"
                    type="text"
                    value={customerDetails.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    className={clsx(
                      'w-full rounded-2xl border bg-gray-50 px-6 py-4 font-bold text-gray-900 outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10',
                      fieldErrors.lastName ? 'border-red-200' : 'border-gray-100'
                    )}
                    placeholder="Doe"
                    aria-invalid={Boolean(fieldErrors.lastName)}
                  />
                  {fieldErrors.lastName && <p className="text-xs font-bold text-red-500">{fieldErrors.lastName}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="checkout-phone" className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Safaricom Contact Number
                  </label>
                  <div
                    className={clsx(
                      'flex overflow-hidden rounded-2xl border bg-gray-50 transition-all focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/10',
                      fieldErrors.phone ? 'border-red-200' : 'border-gray-100'
                    )}
                  >
                    <span className="flex items-center bg-gray-200/50 px-6 text-sm font-black text-gray-500">+254</span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="numeric"
                      value={customerDetails.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="w-full bg-transparent px-6 py-4 font-bold text-gray-900 outline-none"
                      placeholder="712345678"
                      aria-invalid={Boolean(fieldErrors.phone)}
                    />
                  </div>
                  <p className="text-[11px] font-bold text-gray-400">This same Safaricom line receives the STK push prompt.</p>
                  {fieldErrors.phone && <p className="text-xs font-bold text-red-500">{fieldErrors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="checkout-address" className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Physical Address / Apartment
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={customerDetails.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    className={clsx(
                      'w-full rounded-2xl border bg-gray-50 px-6 py-4 font-bold text-gray-900 outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10',
                      fieldErrors.address ? 'border-red-200' : 'border-gray-100'
                    )}
                    placeholder="e.g. Westlands, Terrace Apartments, Door 4B"
                    aria-invalid={Boolean(fieldErrors.address)}
                  />
                  {fieldErrors.address && <p className="text-xs font-bold text-red-500">{fieldErrors.address}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="checkout-city" className="ml-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Metropolis / City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={customerDetails.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className={clsx(
                      'w-full rounded-2xl border bg-gray-50 px-6 py-4 font-bold text-gray-900 outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/10',
                      fieldErrors.city ? 'border-red-200' : 'border-gray-100'
                    )}
                    aria-invalid={Boolean(fieldErrors.city)}
                  />
                  {fieldErrors.city && <p className="text-xs font-bold text-red-500">{fieldErrors.city}</p>}
                </div>
              </div>
            </div>

            {/* ── Step 2: Payment ──────────────────────────────────────── */}
            <div
              className={clsx(
                'relative rounded-[40px] border border-gray-100 bg-white p-10 shadow-premium transition-all',
                checkoutStep === 1 && 'opacity-80'
              )}
            >
              <div className="mb-10 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Settlement Protocol</h2>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400">
                    Payment unlocks after customer details are valid
                  </p>
                </div>
              </div>

              {checkoutStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 flex items-start gap-4 rounded-3xl border border-gray-100 bg-gray-50 p-6"
                >
                  <ShieldCheck size={20} className="mt-1 shrink-0 text-brand-green" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                    Complete the delivery details first, then continue to the payment stage to trigger the M-Pesa STK push.
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    disabled={!method.enabled || checkoutStep === 1 || isSubmitting}
                    onClick={() => setPaymentMethod(method.id)}
                    className={clsx(
                      'group flex items-center gap-6 rounded-[28px] border-2 p-6 text-left transition-all',
                      paymentMethod === method.id && method.enabled && checkoutStep === 2
                        ? 'border-brand-green bg-brand-green/5 shadow-lg shadow-brand-green/10'
                        : 'border-gray-50 bg-gray-50/60',
                      method.enabled && checkoutStep === 2 ? 'hover:border-gray-200' : 'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div
                      className={clsx(
                        'flex h-12 w-12 items-center justify-center rounded-2xl transition-all',
                        paymentMethod === method.id && method.enabled && checkoutStep === 2
                          ? 'bg-brand-green text-white'
                          : 'bg-white text-gray-400'
                      )}
                    >
                      <method.icon size={22} />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span
                        className={clsx(
                          'text-sm font-black uppercase tracking-tight',
                          paymentMethod === method.id && method.enabled && checkoutStep === 2 ? 'text-gray-900' : 'text-gray-500'
                        )}
                      >
                        {method.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{method.desc}</span>
                    </div>
                    {method.enabled && (
                      <span className="rounded-full bg-brand-green/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green">
                        Live
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Ready for STK info panel */}
              {checkoutStep === 2 && paymentMethod === 'mpesa' && paymentState.type === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-3xl border border-brand-green/20 bg-brand-green/10 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <ShieldCheck size={20} className="mt-1 shrink-0 text-brand-green" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-900">Ready for Daraja STK Push</p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-gray-600">
                          We will send the payment prompt to{' '}
                          <span className="font-black text-gray-900">+254 {formattedPhone}</span>. Approve the amount on your phone using your M-Pesa PIN.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/80 px-5 py-4 text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">STK Amount</p>
                      <p className="mt-1 text-2xl font-black tracking-tighter text-brand-green">KSh {total.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sending STK… */}
              {paymentState.type === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-start gap-4 rounded-3xl border border-blue-100 bg-blue-50 p-6"
                >
                  <LoaderCircle size={20} className="mt-1 shrink-0 animate-spin text-blue-600" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-900">Dispatching Payment Prompt</p>
                    <p className="mt-2 text-sm font-medium text-blue-800">{paymentState.message}</p>
                  </div>
                </motion.div>
              )}

              {/* STK sent — polling for payment */}
              {paymentState.type === 'stk_sent' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6"
                >
                  <div className="flex items-start gap-4">
                    <LoaderCircle size={22} className="mt-1 shrink-0 animate-spin text-emerald-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-widest text-emerald-900">Waiting for Payment</p>
                        <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1">
                          <Timer size={12} className="text-emerald-600" />
                          <span className="text-[11px] font-black tabular-nums text-emerald-700">
                            {formatCountdown(pollingCountdown)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-emerald-800">{paymentState.message}</p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white/70 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">Reference</p>
                          <p className="mt-2 break-all text-xs font-black text-gray-900">{paymentState.reference || 'Pending'}</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">Merchant Request</p>
                          <p className="mt-2 break-all text-xs font-black text-gray-900">{paymentState.merchantRequestId || '—'}</p>
                        </div>
                        <div className="rounded-2xl bg-white/70 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">Checkout Request</p>
                          <p className="mt-2 break-all text-xs font-black text-gray-900">{paymentState.checkoutRequestId || '—'}</p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-700">
                        Checking your payment every 5 seconds. Do not close this page.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment confirmed ✅ */}
              {paymentState.type === 'confirmed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 rounded-3xl border-2 border-emerald-400 bg-emerald-50 p-8 text-center"
                >
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
                  <p className="text-lg font-black uppercase tracking-tight text-emerald-900">Payment Confirmed ✅</p>
                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    Your M-Pesa payment was received. Order reference:{' '}
                    <span className="font-black text-gray-900">{paymentState.reference}</span>
                  </p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-600">
                    You will receive an M-Pesa confirmation SMS. Our team will contact you for dispatch.
                  </p>
                  <Link
                    to="/shop"
                    className="mt-8 inline-block rounded-2xl bg-emerald-500 px-8 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-emerald-600 transition-all"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              )}

              {/* Payment failed / timeout */}
              {paymentState.type === 'payment_failed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-start gap-4 rounded-3xl border border-red-100 bg-red-50 p-6"
                >
                  <AlertCircle size={20} className="mt-1 shrink-0 text-red-500" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-red-900">Payment Not Completed</p>
                    <p className="mt-2 text-sm font-medium text-red-700">{paymentState.message}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-red-500">
                      Click "Retry Payment" below to send a new STK push.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Generic API error */}
              {paymentState.type === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex items-start gap-4 rounded-3xl border border-red-100 bg-red-50 p-6"
                >
                  <AlertCircle size={20} className="mt-1 shrink-0 text-red-500" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-red-900">Payment Trigger Failed</p>
                    <p className="mt-2 text-sm font-medium text-red-700">{paymentState.message}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Order Summary Sidebar ──────────────────────────────────── */}
          <div className="w-full lg:w-[460px]">
            <div className="group sticky top-28 overflow-hidden rounded-[50px] bg-gray-900 p-12 text-white shadow-2xl">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-green opacity-10 blur-[60px]"></div>

              <h2 className="mb-10 flex items-center justify-between border-b border-white/5 pb-6 text-2xl font-black uppercase tracking-tighter">
                Your Selection
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                  {cart.length} Units
                </span>
              </h2>

              {detailsLockedIn && (
                <div className="mb-8 rounded-3xl border border-white/5 bg-white/5 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Buyer Profile</p>
                  <p className="mt-3 text-lg font-black uppercase tracking-tight text-white">
                    {customerDetails.firstName} {customerDetails.lastName}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    +254 {formattedPhone} • {customerDetails.city}
                  </p>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-gray-300">{customerDetails.address}</p>
                </div>
              )}

              <div className="custom-scrollbar mb-12 max-h-[300px] space-y-8 overflow-y-auto pr-4">
                {cart.map((item) => (
                  <div key={item.id} className="group/item flex gap-6">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-white p-3">
                      <img
                        src={item.image}
                        alt={`${item.brand} ${item.name} – cart thumbnail`}
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover/item:scale-110"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="mb-2 line-clamp-2 text-sm font-black uppercase leading-tight tracking-tighter transition-colors group-hover/item:text-brand-green">
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-black text-white">KSh {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-10 space-y-4 border-t border-white/5 pt-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                  <span>Inventory Value</span>
                  <span className="text-white">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                  <span>Express Logistics</span>
                  <span className={clsx('font-black', deliveryFee === 0 ? 'text-brand-green' : 'text-white')}>
                    {deliveryFee === 0 ? 'COMPLIMENTARY' : `KSh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="mb-12 rounded-3xl border border-white/5 bg-white/5 p-8">
                <div className="mb-1 flex items-end justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Total Settlement</span>
                  <span className="text-4xl font-black tracking-tighter text-brand-green">KSh {total.toLocaleString()}</span>
                </div>
                <p className="text-right text-[9px] font-bold uppercase tracking-widest text-gray-600">VAT inclusive certified</p>
              </div>

              {paymentState.type !== 'confirmed' && (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={primaryButtonDisabled}
                  className={clsx(
                    'flex w-full items-center justify-center gap-4 rounded-[28px] py-6 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98]',
                    primaryButtonDisabled
                      ? 'cursor-not-allowed bg-white/10 text-white/60'
                      : 'bg-brand-green text-white hover:bg-white hover:text-gray-900 hover:shadow-2xl hover:shadow-brand-green/20'
                  )}
                >
                  {(isSubmitting || paymentState.type === 'stk_sent') && (
                    <LoaderCircle size={18} className="animate-spin" />
                  )}
                  {primaryButtonLabel}
                  {!isSubmitting && paymentState.type === 'idle' && <ChevronRight size={18} strokeWidth={3} />}
                </button>
              )}

              {checkoutStep === 2 && paymentState.type === 'idle' && (
                <button
                  type="button"
                  onClick={() => { setCheckoutStep(1); setPaymentState(DEFAULT_PAYMENT_STATE); }}
                  className="mt-4 w-full rounded-[24px] border border-white/10 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 transition-colors hover:border-white/20 hover:text-white"
                >
                  Edit Customer Details
                </button>
              )}

              <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 opacity-40 grayscale">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white">VISA</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white">M-PESA</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-white">MASTERCARD</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                  <ShieldCheck size={14} className="text-brand-green" /> 256-Bit Encrypted Secure Chain
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
