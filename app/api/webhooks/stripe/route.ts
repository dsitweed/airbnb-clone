import { stripe } from '@/lib/stripe';
import { createReservation } from '@/services/reservation';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature');

    if (!signature) {
      return new Response('Invalid signature', { status: 400 });
    }
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      endpointSecret,
    );

    if (event.type === 'checkout.session.completed') {
      if (!event.data.object.customer_details?.email) {
        throw new Error('Missing user email');
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { listingId, startDate, endDate, totalPrice, userId } =
        session.metadata as Record<string, string>;

      if (!listingId || !startDate || !endDate || !totalPrice || !userId) {
        throw new Error('Invalid request metadata');
      }

      await createReservation({
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: Number(totalPrice),
        userId: userId,
      });
    }

    return NextResponse.json({
      result: event,
      ok: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      {
        status: 500,
      },
    );
  }
}
