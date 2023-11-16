import { stripe } from "@/lib/stripe"
import { upsertTransaction } from "@/lib/supabaseAdmin"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const relevantEvents = new Set([
  'checkout.session.completed'
])

export async function POST(request: Request) {
  const body = await request.text()
  const sig = headers().get('Stripe-signature')

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret) return
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (error) {
    console.log('Error message: ', error);
    return new NextResponse('Webhook Error: ' + error, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session
          upsertTransaction({
            id: checkoutSession.id,
            amount_total: checkoutSession.amount_total as number,
            customer_email: checkoutSession.customer_details?.email as string,
            customer_id: checkoutSession.customer as string,
            payment_intent: checkoutSession.payment_intent as string,
            payment_status: checkoutSession.payment_status,
            quantity: checkoutSession.metadata!.quantity,
            user_id: checkoutSession.metadata!.user_id
          })
      }
    } catch (error) {
      console.log(error)
      return new NextResponse('Webhook error:', { status: 400 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}