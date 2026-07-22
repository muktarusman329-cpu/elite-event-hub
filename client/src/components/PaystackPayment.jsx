import { useMemo, useState } from 'react';
import {
CalendarDays,
CheckCircle2,
Clock3,
CreditCard,
Loader2,
ShieldCheck,
Users,
Wallet,
XCircle,
} from 'lucide-react';

import api from '../lib/axios';
import { useToastStore } from '../store/useToastStore';
import Button from './ui/Button';

const PAYSTACK_SCRIPT_URL =
'https://js.paystack.co/v2/inline.js';

const loadPaystackScript = () =>
new Promise((resolve, reject) => {
if (window.Paystack || window.PaystackPop) {
resolve();
return;
}


const existingScript =
  document.querySelector(
    `script[src="${PAYSTACK_SCRIPT_URL}"]`
  );

if (existingScript) {
  existingScript.addEventListener(
    'load',
    resolve,
    { once: true }
  );

  existingScript.addEventListener(
    'error',
    reject,
    { once: true }
  );

  return;
}

const script =
  document.createElement('script');

script.src = PAYSTACK_SCRIPT_URL;

script.async = true;

script.onload = resolve;

script.onerror = () =>
  reject(
    new Error(
      'Unable to load Paystack checkout.'
    )
  );

document.body.appendChild(script);

});

function PaystackPayment({
booking,
onSuccess,
onFailure,
redirectToDashboard = true,
}) {
const [loading, setLoading] =
useState(false);

const [status, setStatus] =
useState(null);

const pushToast = useToastStore(
(s) => s.push
);

const amount = useMemo(() => {
return Number(booking?.total || 0);
}, [booking]);

const formattedAmount =
amount.toLocaleString();

const handlePayment = async () => {
if (!booking?.id) return;

setLoading(true);

setStatus(null);

try {
  const { data } = await api.post(
    '/payments/initialize',
    {
      bookingId: booking.id,
    }
  );

  if (!data.publicKey) {
    throw new Error(
      'PAYSTACK_PUBLIC_KEY is missing.'
    );
  }

  if (!data.accessCode) {
    throw new Error(
      'Paystack did not return access code.'
    );
  }

  await loadPaystackScript();

  const PaystackConstructor =
    window.Paystack ||
    window.PaystackPop;

  const popup =
    new PaystackConstructor();

  const verifyPayment = async (
    transaction = {}
  ) => {
    try {
      const reference =
        transaction.reference ||
        transaction.trxref ||
        data.reference;

      const verifyResponse =
        await api.post(
          '/payments/verify',
          {
            reference,
          }
        );

      setStatus('success');

      pushToast({
        type: 'success',
        title:
          'Payment successful',
        message:
          'Your booking payment was verified successfully.',
      });

      onSuccess?.(
        verifyResponse.data
      );

      if (
        redirectToDashboard
      ) {
        window.setTimeout(() => {
          window.location.assign(
            '/dashboard/bookings'
          );
        }, 1500);
      }
    } catch (error) {
      const message =
        error?.response?.data
          ?.message ||
        error.message ||
        'Payment verification failed.';

      setStatus('failed');

      pushToast({
        type: 'error',
        title:
          'Verification failed',
        message,
      });

      onFailure?.(error);
    } finally {
      setLoading(false);
    }
  };

  const callbacks = {
    onSuccess:
      verifyPayment,

    onCancel: () => {
      setStatus('failed');

      setLoading(false);

      pushToast({
        type: 'error',
        title:
          'Payment cancelled',
        message:
          'No charge was completed.',
      });
    },

    onError: (error) => {
      const message =
        error?.message ||
        'Paystack checkout failed.';

      console.error(
        '[paystack] checkout error:',
        error
      );

      setStatus('failed');

      setLoading(false);

      pushToast({
        type: 'error',
        title:
          'Payment error',
        message,
      });
    },
  };

  if (
    typeof popup.resumeTransaction ===
    'function'
  ) {
    popup.resumeTransaction(
      data.accessCode,
      callbacks
    );
  } else {
    popup.newTransaction({
      key: data.publicKey,

      email: data.email,

      amount: data.amount,

      currency:
        data.currency,

      reference:
        data.reference,

      channels:
        data.channels,

      metadata: {
        ...data.metadata,

        bookingId:
          booking.id,

        hall:
          booking.hallname,

        eventType:
          booking.eventType,

        guests:
          booking.guests,
      },

      ...callbacks,
    });
  }
} catch (error) {
  const message =
    error?.response?.data
      ?.message ||
    error.message ||
    'Unable to initialize payment.';

  console.error(
    '[paystack] initialization error:',
    error
  );

  setStatus('failed');

  setLoading(false);

  pushToast({
    type: 'error',
    title:
      'Payment error',
    message,
  });

  onFailure?.(error);
}

};

return ( <div className="rounded-[2rem] border border-emerald-500/20 bg-slate-950/90 p-6 shadow-2xl">
{/* Header */} <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"> <div> <div className="flex items-center gap-2 text-emerald-300"> <ShieldCheck className="h-5 w-5" />
        <p className="text-sm font-semibold uppercase tracking-[0.25em]">
          Secure Paystack Checkout
        </p>
      </div>

      <h2 className="mt-4 text-3xl font-bold text-white">
        Complete Your Booking Payment
      </h2>

      <p className="mt-3 max-w-xl text-slate-400">
        Pay securely using card,
        bank transfer, USSD,
        mobile money, or bank app.
      </p>
    </div>

    <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-5">
      <p className="text-sm text-slate-300">
        Total Amount
      </p>

      <h2 className="mt-2 text-4xl font-bold text-white">
        ₦{formattedAmount}
      </h2>
    </div>
  </div>

  {/* Booking Summary */}
  <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    <SummaryCard
      icon={
        <CalendarDays className="h-5 w-5 text-emerald-400" />
      }
      title="Event Date"
      value={booking?.date}
    />

    <SummaryCard
      icon={
        <Clock3 className="h-5 w-5 text-emerald-400" />
      }
      title="Duration"
      value={`${booking?.duration || 1} Hours`}
    />

    <SummaryCard
      icon={
        <Users className="h-5 w-5 text-emerald-400" />
      }
      title="Guests"
      value={`${booking?.guests || 0}`}
    />

    <SummaryCard
      icon={
        <Wallet className="h-5 w-5 text-emerald-400" />
      }
      title="Hall"
      value={
        booking?.hallname ||
        'Event Hall'
      }
    />
  </div>

  {/* Pricing Breakdown */}
  <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
    <div className="mb-6 flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-emerald-400" />

      <h3 className="text-xl font-semibold text-white">
        Payment Breakdown
      </h3>
    </div>

    <div className="space-y-4">
      <PriceRow
        label="Base Hall Price"
        value={
          booking?.basePrice
        }
      />

      <PriceRow
        label="Hourly Charges"
        value={
          booking?.hourlyCharge
        }
      />

      <PriceRow
        label="Guest Charges"
        value={
          booking?.guestCharge
        }
      />

      <PriceRow
        label="Services"
        value={
          booking?.servicesTotal
        }
      />

      <PriceRow
        label="VAT"
        value={
          booking?.vatCharge
        }
      />

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-lg text-slate-300">
            Grand Total
          </p>

          <h2 className="text-3xl font-bold text-white">
            ₦
            {Number(
              booking?.total || 0
            ).toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  </div>

  {/* Status */}
  {status === 'success' && (
    <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-5">
      <p className="flex items-center gap-2 text-emerald-300">
        <ShieldCheck className="h-5 w-5" />
        Payment verified successfully.
        Redirecting...
      </p>
    </div>
  )}

  {status === 'failed' && (
    <div className="mt-6 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-5">
      <p className="flex items-center gap-2 text-rose-300">
        <XCircle className="h-5 w-5" />
        Payment failed or cancelled.
        Please try again.
      </p>
    </div>
  )}

  {/* Pay Button */}
  <Button
    type="button"
    onClick={handlePayment}
    disabled={
      loading ||
      booking?.paymentStatus ===
        'Paid'
    }
    className="mt-8 h-16 w-full rounded-full bg-emerald-500 text-lg font-semibold text-slate-950 hover:bg-emerald-400"
  >
    {loading ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Processing Payment...
      </>
    ) : booking?.paymentStatus ===
      'Paid' ? (
      'Payment Completed'
    ) : (
      <>
        <CreditCard className="mr-2 h-5 w-5" />
        Pay ₦
        {formattedAmount}
      </>
    )}
  </Button>
</div>


);
}

function SummaryCard({
icon,
title,
value,
}) {
return ( <div className="rounded-3xl border border-white/10 bg-white/5 p-5"> <div className="mb-3">
{icon} </div>

  <p className="text-sm text-slate-400">
    {title}
  </p>

  <h3 className="mt-2 text-lg font-semibold text-white">
    {value || 'N/A'}
  </h3>
</div>

);
}

function PriceRow({
label,
value,
}) {
return ( <div className="flex items-center justify-between"> <p className="text-slate-400">
{label} </p>

  <p className="font-medium text-white">
    ₦
    {Number(
      value || 0
    ).toLocaleString()}
  </p>
</div>

);
}

export default PaystackPayment;
