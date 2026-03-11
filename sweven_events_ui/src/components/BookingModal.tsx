import { useState } from 'react';
import { X, Check, CreditCard, Lock, Mail, QrCode, Download, Calendar } from 'lucide-react';
import { Event, BookingFormData, AddOn } from '../types/event';
import { motion, AnimatePresence } from 'framer-motion';
import { addOns } from '../data/mockEvents';
import { requestBooking } from '@/services/api';


interface BookingModalProps {
  event: Event;
  onClose: () => void;
}

export function BookingModal({ event, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedTierId, setSelectedTierId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    promoCode: ''
  });
  const [confirmationCode] = useState(Math.random().toString(36).substring(2, 10).toUpperCase());

  const selectedTier = event.ticketTiers.find(t => t.id === selectedTierId);
  const selectedAddOnItems = addOns.filter(a => selectedAddOns.includes(a.id));
  
  const subtotal = (selectedTier?.price || 0) * quantity;
  const addOnsTotal = selectedAddOnItems.reduce((sum, addon) => sum + addon.price, 0);
  const total = subtotal + addOnsTotal;

  const maxStep = 5;
  const handleNext = async () => {
    // 🔥 APPROVAL FLOW
    if (event.approvalRequired && step === 3) {
      await requestBooking({
        eventId: event.id,
        tierId: selectedTierId,
        quantity,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      });

      setStep(5);
      return;
    }

    // 🔥 NORMAL PAYMENT FLOW
    if (!event.approvalRequired && step === 4) {

      // 1️⃣ Create booking first
      const bookingRes = await requestBooking({
        eventId: event.id,
        tierId: selectedTierId,
        quantity,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone
      });

      // 2️⃣ Open Razorpay
      await openRazorpay(bookingRes.id);

      // 3️⃣ Move to confirmation step
      
      return;
    }

    if (step < maxStep) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const openRazorpay = async (bookingId: string) => {
    try {
      // 1️⃣ Create order from backend
      const res = await fetch("http://localhost:9001/sweven_events/v1/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: bookingId
        })
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_xxxxxxxx", // replace with your key
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Sweven Events",
        description: event.title,

        handler: async function (response: any) {

          // 2️⃣ Verify payment
          await fetch("http://localhost:9001/sweven_events/v1/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
          });
          setStep(5);
          alert("Payment Successful 🎉");
        },

        theme: {
          color: "#06b6d4"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Payment failed");
    }
  };

  const steps = event.approvalRequired
  ? ['Select Ticket', 'Add-ons', 'Your Details', 'Review', 'Request Sent']
  : ['Select Ticket', 'Add-ons', 'Your Details', 'Payment', 'Confirmation'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        {event.approvalRequired && (
            <div className="mb-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm">
              This event requires organizer approval before payment.
            </div>
          )}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            <p className="text-sm text-zinc-400 mt-1">Complete your booking in {5 - step + 1} steps</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((stepName, idx) => (
              <div key={stepName} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    step > idx + 1 
                      ? 'bg-cyan-500 border-cyan-500' 
                      : step === idx + 1 
                        ? 'border-cyan-500 bg-cyan-500/20' 
                        : 'border-zinc-700 bg-zinc-800'
                  }`}>
                    {step > idx + 1 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-sm font-semibold ${
                        step === idx + 1 ? 'text-cyan-400' : 'text-zinc-500'
                      }`}>
                        {idx + 1}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${
                    step >= idx + 1 ? 'text-zinc-300' : 'text-zinc-600'
                  }`}>
                    {stepName}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                    step > idx + 1 ? 'bg-cyan-500' : 'bg-zinc-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Ticket */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Select Your Ticket</h3>
                {event.ticketTiers.map(tier => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTierId === tier.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{tier.name}</h4>
                        <p className="text-sm text-zinc-400 mt-1">{tier.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">${tier.price}</p>
                        <p className="text-xs text-zinc-500">{tier.seatsAvailable} available</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tier.features.map(feature => (
                        <span key={feature} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {selectedTierId && (
                  <div className="mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <label className="block text-sm text-zinc-400 mb-2">Quantity</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                      >
                        +
                      </button>
                      <div className="ml-auto text-right">
                        <p className="text-sm text-zinc-500">Subtotal</p>
                        <p className="text-xl font-bold text-white">${subtotal}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Add-ons */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Enhance Your Experience</h3>
                <p className="text-sm text-zinc-400 mb-6">Optional add-ons to make your event even better</p>
                
                {addOns.map(addon => (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddOns.includes(addon.id)
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{addon.name}</h4>
                        <p className="text-sm text-zinc-400 mt-1">{addon.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-white">${addon.price}</p>
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          selectedAddOns.includes(addon.id)
                            ? 'border-cyan-500 bg-cyan-500'
                            : 'border-zinc-600'
                        }`}>
                          {selectedAddOns.includes(addon.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Step 3: User Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Your Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-2">Promo Code (Optional)</label>
                    <input
                      type="text"
                      value={formData.promoCode}
                      onChange={(e) => setFormData({...formData, promoCode: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                      placeholder="Enter code"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && !event.approvalRequired && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-white mb-4">Secure Payment</h3>
                
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-6">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Payment Processing</span>
                  </div>
                  <p className="text-xs text-zinc-400">Your payment information is encrypted and secure</p>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Card Number *</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors pr-12"
                    />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">CVV *</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Cardholder Name *</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="mt-6 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <h4 className="text-sm font-semibold text-white mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>{selectedTier?.name} × {quantity}</span>
                      <span>${subtotal}</span>
                    </div>
                    {selectedAddOnItems.map(addon => (
                      <div key={addon.id} className="flex justify-between text-zinc-400">
                        <span>{addon.name}</span>
                        <span>${addon.price}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-zinc-800 flex justify-between font-bold text-white">
                      <span>Total</span>
                      <span className="text-xl text-cyan-400">${total}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Confirmation */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto mb-6 flex items-center justify-center">
                  <Check className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2">
                  {event.approvalRequired ? 'Request Submitted!' : 'Booking Confirmed!'}
                </h3>
                {/* <h3 className="text-3xl font-bold text-white mb-2">
                  {event.approvalRequired ? 'Request Submitted!' : 'Booking Confirmed!'}
                </h3> */}
                {!event.approvalRequired && (
                  <div className="max-w-md mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
                    <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-xl p-4 flex items-center justify-center">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    <p className="text-sm text-zinc-400 mb-1">Confirmation Code</p>
                    <p className="text-2xl font-bold text-white mb-4 tracking-wider">{confirmationCode}</p>
                    
                    <div className="space-y-2 text-sm text-left">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Event:</span>
                        <span className="text-white font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Date:</span>
                        <span className="text-white font-medium">{event.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Tickets:</span>
                        <span className="text-white font-medium">{quantity}x {selectedTier?.name}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-zinc-800">
                        <span className="text-zinc-500">Total Paid:</span>
                        <span className="text-cyan-400 font-bold">${total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!event.approvalRequired && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                      <Download className="w-4 h-4" />
                      Download Tickets
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-semibold flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors">
                      <Calendar className="w-4 h-4" />
                      Add to Calendar
                    </button>
                  </div>
                )}

                <p className="text-xs text-zinc-500 mt-6">
                  You will receive a confirmation email with all the details shortly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {step < 5 && (
          <div className="p-6 border-t border-zinc-800 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={step === 1 && !selectedTierId}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {event.approvalRequired && step === 3
                ? 'Submit Request'
                : step === 4
                  ? 'Pay Now'
                  : 'Continue'}

              
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
