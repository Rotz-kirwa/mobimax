import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useStore } from '../store/useStore';
import { useOrderStore } from '../store/useOrderStore';

const DELIVERY_OPTIONS = [
  { id: 'nairobi', label: 'Nairobi Delivery', desc: 'Delivered to your door within Nairobi', fee: 250 },
  { id: 'pickup', label: 'Pick Up', desc: 'Pick up from our Nairobi shop — free', fee: 0 },
  { id: 'upcountry', label: 'Upcountry Courier', desc: 'Delivered via courier outside Nairobi', fee: 500 },
];

const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'Pay via M-Pesa STK Push', enabled: true },
  { id: 'cod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when your order arrives', enabled: false },
  { id: 'card', label: 'Card Payment', icon: CreditCard, desc: 'Visa / Mastercard', enabled: false },
];

const INITIAL_DETAILS = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  town: 'Nairobi',
  address: '',
};

type PaymentState = {
  type: 'idle' | 'pending' | 'stk_sent' | 'confirmed' | 'payment_failed' | 'error';
  message: string;
  merchantRequestId: string;
  checkoutRequestId: string;
  reference: string;
};

const DEFAULT_PAYMENT_STATE: PaymentState = {
  type: 'idle',
  message: '',
  merchantRequestId: '',
  checkoutRequestId: '',
  reference: '',
};

const POLL_INTERVAL_MS = 5000;
const POLL_MAX = 24;

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits.slice(3, 12);
  if (digits.startsWith('0')) return digits.slice(1, 10);
  return digits.slice(0, 9);
}

function validateDetails(details: typeof INITIAL_DETAILS) {
  const errors: Record<string, string> = {};
  if (!details.firstName.trim()) errors.firstName = 'First name is required.';
  if (!details.lastName.trim()) errors.lastName = 'Last name is required.';
  if (normalizePhone(details.phone).length !== 9) errors.phone = 'Enter a valid Safaricom number.';
  if (!details.town.trim()) errors.town = 'Town / city is required.';
  if (!details.address.trim()) errors.address = 'Delivery address is required.';
  return errors;
}

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Checkout() {
  const { cart, clearCart } = useStore();
  const createOrder = useOrderStore((state) => (state as any).createOrder);
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState(INITIAL_DETAILS);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [deliveryOption, setDeliveryOption] = useState('nairobi');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [paymentState, setPaymentState] = useState<PaymentState>(DEFAULT_PAYMENT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollingCountdown, setPollingCountdown] = useState(120);

  const pollingIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryOption)!;
  const subtotal = (cart as any[]).reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 150000 ? 0 : selectedDelivery.fee;
  const total = subtotal + deliveryFee;
  const formattedPhone = normalizePhone(details.phone);

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
        const res = await fetch(`/api/mpesa/status?checkoutRequestId=${encodeURIComponent(paymentState.checkoutRequestId)}`);
        const data = await res.json().catch(() => ({}));

        if (data.resultCode === '0') {
          clearInterval(pollingIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
          createOrder({
            reference: paymentState.reference,
            checkoutRequestId: paymentState.checkoutRequestId,
            merchantRequestId: paymentState.merchantRequestId,
            paymentMethod: 'mpesa',
            customer: { ...details, phone: `254${formattedPhone}` },
            items: cart,
            totals: { subtotal, deliveryFee, total },
          });
          setPaymentState((prev) => ({ ...prev, type: 'confirmed' }));
          clearCart();
          return;
        }

        if (data.resultCode !== 'pending' && data.resultCode != null) {
          clearInterval(pollingIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
          setPaymentState((prev) => ({ ...prev, type: 'payment_failed', message: data.resultDesc || 'Payment was not completed.' }));
          return;
        }

        if (polls >= POLL_MAX) {
          clearInterval(pollingIntervalRef.current);
          clearInterval(countdownIntervalRef.current);
          setPaymentState((prev) => ({ ...prev, type: 'payment_failed', message: 'Payment timed out. Please try again.' }));
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollingIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, [paymentState.type, paymentState.checkoutRequestId]);

  const handleFieldChange = (field: string, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: field === 'phone' ? normalizePhone(value) : value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const continueToPayment = () => {
    const errors = validateDetails(details);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerStkPush = async () => {
    setIsSubmitting(true);
    setPaymentState({ ...DEFAULT_PAYMENT_STATE, type: 'pending', message: 'Sending M-Pesa request…' });
    try {
      const response = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customer: { ...details, phone: `254${formattedPhone}` },
          items: (cart as any[]).map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong. Please retry.');
      setPaymentState({
        type: 'stk_sent',
        message: 'Check your phone and enter your M-Pesa PIN to complete payment.',
        merchantRequestId: result.merchantRequestId || '',
        checkoutRequestId: result.checkoutRequestId || '',
        reference: result.reference || '',
      });
    } catch (error: any) {
      setPaymentState({ ...DEFAULT_PAYMENT_STATE, type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && paymentState.type !== 'confirmed') {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-lg font-sans">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
          <Package size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 text-sm mb-8">Add items to your cart before checking out.</p>
        <Link to="/shop" className="bg-brand-green text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-5">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <Link to="/cart" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-green transition-colors font-medium">
              <ChevronLeft size={16} /> Back to Cart
            </Link>
            <h1 className="text-lg font-bold text-slate-900">Checkout</h1>
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 text-[12px] sm:text-sm shrink-0">
              <span className={clsx('font-semibold', step === 1 ? 'text-brand-green' : 'text-slate-400')}>1. Details</span>
              <span className="text-slate-300">›</span>
              <span className={clsx('font-semibold', step === 2 ? 'text-brand-green' : 'text-slate-400')}>2. Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — Form */}
          <div className="flex-1 space-y-6">

            {/* ── Step 1: Delivery Details ── */}
            <div className={clsx('bg-white rounded-2xl border p-6 transition-all', step === 1 ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-60 pointer-events-none')}>
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-brand-green" /> Your Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={details.firstName}
                    onChange={(e) => handleFieldChange('firstName', e.target.value)}
                    placeholder="e.g. John"
                    className={clsx('w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-green transition-colors', fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white')}
                  />
                  {fieldErrors.firstName && <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    value={details.lastName}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    placeholder="e.g. Kamau"
                    className={clsx('w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-green transition-colors', fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white')}
                  />
                  {fieldErrors.lastName && <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone Number (M-Pesa) *</label>
                  <div className={clsx('flex rounded-xl border overflow-hidden transition-colors focus-within:border-brand-green', fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50')}>
                    <span className="px-3 flex items-center text-xs font-bold text-slate-500 bg-slate-100 border-r border-slate-200">+254</span>
                    <input
                      type="tel"
                      value={details.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="7XX XXX XXX"
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address <span className="text-slate-400 font-normal">(optional)</span></label>
                  <input
                    type="email"
                    value={details.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="e.g. john@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-green focus:bg-white transition-colors"
                  />
                </div>

                {/* Town */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Town / City *</label>
                  <input
                    type="text"
                    value={details.town}
                    onChange={(e) => handleFieldChange('town', e.target.value)}
                    placeholder="e.g. Nairobi"
                    className={clsx('w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-green transition-colors', fieldErrors.town ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white')}
                  />
                  {fieldErrors.town && <p className="text-xs text-red-500 mt-1">{fieldErrors.town}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Delivery Address *</label>
                  <input
                    type="text"
                    value={details.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="e.g. Westlands, near Junction Mall"
                    className={clsx('w-full rounded-xl border px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-brand-green transition-colors', fieldErrors.address ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 focus:bg-white')}
                  />
                  {fieldErrors.address && <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Truck size={16} className="text-brand-green" /> Delivery Method
                </h3>
                <div className="space-y-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label key={opt.id} className={clsx('flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all', deliveryOption === opt.id ? 'border-brand-green bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300')}>
                      <div className="flex items-center gap-3 min-w-0">
                        <input type="radio" name="delivery" value={opt.id} checked={deliveryOption === opt.id} onChange={() => setDeliveryOption(opt.id)} className="accent-brand-green shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                          <p className="text-xs text-slate-500 leading-snug">{opt.desc}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-900 shrink-0">
                        {opt.fee === 0 ? 'Free' : `KSh ${opt.fee.toLocaleString()}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {step === 1 && (
                <button onClick={continueToPayment} className="mt-6 w-full bg-brand-green text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors">
                  Continue to Payment
                </button>
              )}
            </div>

            {/* ── Step 2: Payment ── */}
            <div className={clsx('bg-white rounded-2xl border p-6 transition-all', step === 2 ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-50 pointer-events-none')}>
              <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Smartphone size={18} className="text-brand-green" /> Payment Method
              </h2>

              <div className="space-y-2 mb-6">
                {PAYMENT_METHODS.map((method) => (
                  <label key={method.id} className={clsx('flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all', !method.enabled && 'opacity-40 cursor-not-allowed', paymentMethod === method.id && method.enabled ? 'border-brand-green bg-emerald-50/50' : 'border-slate-200')}>
                    <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} disabled={!method.enabled} onChange={() => method.enabled && setPaymentMethod(method.id)} className="accent-brand-green" />
                    <method.icon size={18} className="text-slate-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{method.label}</p>
                      <p className="text-xs text-slate-500">{method.desc}</p>
                    </div>
                    {!method.enabled && <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Coming Soon</span>}
                  </label>
                ))}
              </div>

              <AnimatePresence>
                {step === 2 && paymentState.type !== 'confirmed' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {paymentState.type === 'idle' && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 flex gap-3">
                        <ShieldCheck size={18} className="text-brand-green shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-600">
                          An M-Pesa STK push will be sent to <span className="font-bold text-slate-900">+254 {formattedPhone}</span>. Enter your PIN on your phone to complete payment.
                        </p>
                      </div>
                    )}

                    {paymentState.type === 'stk_sent' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <LoaderCircle size={18} className="animate-spin text-brand-green shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 mb-0.5">Waiting for your M-Pesa confirmation…</p>
                          <p className="text-xs text-slate-500">{paymentState.message}</p>
                        </div>
                        <span className="text-sm font-bold text-brand-green tabular-nums shrink-0">{formatCountdown(pollingCountdown)}</span>
                      </div>
                    )}

                    {(paymentState.type === 'payment_failed' || paymentState.type === 'error') && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex gap-3">
                        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{paymentState.message}</p>
                      </div>
                    )}

                    <button
                      onClick={triggerStkPush}
                      disabled={isSubmitting || paymentState.type === 'stk_sent'}
                      className={clsx(
                        'w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors',
                        isSubmitting || paymentState.type === 'stk_sent'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-brand-green text-white hover:bg-emerald-600'
                      )}
                    >
                      {isSubmitting && <LoaderCircle size={16} className="animate-spin" />}
                      {paymentState.type === 'stk_sent' ? 'Waiting for payment…' : paymentState.type === 'payment_failed' || paymentState.type === 'error' ? 'Retry Payment' : 'Pay Now — KSh ' + total.toLocaleString()}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {paymentState.type === 'confirmed' && (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
                  <p className="text-sm text-slate-500 mb-1">Thank you for your order.</p>
                  <p className="text-xs text-slate-400 mb-8">Order ref: <span className="font-semibold text-slate-600">{paymentState.reference}</span></p>
                  <Link to="/shop" className="bg-brand-green text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors">
                    Continue Shopping
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-24 shadow-sm">

              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">
                  Your Order ({(cart as any[]).reduce((a: number, i: any) => a + i.quantity, 0)} item{(cart as any[]).length !== 1 ? 's' : ''})
                </h2>
              </div>

              {/* Product cards */}
              <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                {(cart as any[]).map((item) => (
                  <div key={item.id} className="flex gap-4 p-4">
                    {/* Product image */}
                    <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-2 mb-1">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mb-2">{item.brand}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                          Qty: {item.quantity}
                        </span>
                        <div className="text-right">
                          <p className="text-[15px] font-bold text-brand-green leading-tight">
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-slate-400">KSh {item.price.toLocaleString()} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 border-t border-slate-100 space-y-2.5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery — {selectedDelivery.label}</span>
                  <span className={clsx('font-semibold', deliveryFee === 0 ? 'text-brand-green' : 'text-slate-900')}>
                    {deliveryFee === 0 ? 'Free' : `KSh ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900 text-base">Total</span>
                  <span className="text-xl font-black text-brand-green">KSh {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Delivering to (step 2) */}
              {step === 2 && details.firstName && (
                <div className="mx-5 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Delivering to</p>
                  <p className="text-sm font-bold text-slate-900">{details.firstName} {details.lastName}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">+254 {formattedPhone} · {details.town}</p>
                  <p className="text-[12px] text-slate-500">{details.address}</p>
                  <button onClick={() => setStep(1)} className="text-[11px] text-brand-green font-semibold mt-2 hover:underline">
                    Edit details
                  </button>
                </div>
              )}

              {/* Trust strip */}
              <div className="px-5 pb-5 flex items-center justify-around text-slate-400 border-t border-slate-100 pt-4">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck size={18} className="text-brand-green" />
                  <span className="text-[10px] font-semibold text-slate-500">Secure</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck size={18} className="text-brand-green" />
                  <span className="text-[10px] font-semibold text-slate-500">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Smartphone size={18} className="text-brand-green" />
                  <span className="text-[10px] font-semibold text-slate-500">M-Pesa</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Package size={18} className="text-brand-green" />
                  <span className="text-[10px] font-semibold text-slate-500">Genuine</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
