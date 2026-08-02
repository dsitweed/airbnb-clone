import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

interface SuccessPaymentProps {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function SuccessPayment({
  searchParams,
}: SuccessPaymentProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)');
  }

  const { status, customer_details, line_items, payment_intent } =
    await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent'],
    });

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    return (
      <section
        id="success"
        className="main-container flex flex-col justify-center gap-4"
      >
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customer_details?.email}.
          <br />
          If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
        <section className="flex break-all">
          {JSON.stringify(line_items)}
        </section>
        <section className="flex break-all">
          {JSON.stringify(payment_intent)}
        </section>
      </section>
    );
  }
}
