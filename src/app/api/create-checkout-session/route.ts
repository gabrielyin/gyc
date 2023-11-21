import { stripe } from "@/lib/stripe"
import { updateOrRetrieveCustomer } from "@/lib/supabaseAdmin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

const tokens: { [key: string]: number } = {}

tokens[process.env.NEXT_PUBLIC_STRIPE_PRICE1000 as string] = 1000;
tokens[process.env.NEXT_PUBLIC_STRIPE_PRICE2000 as string] = 2000;
tokens[process.env.NEXT_PUBLIC_STRIPE_PRICE4000 as string] = 4000;

export async function POST(request: Request) {
  const { priceId } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  try {
    const customer = await updateOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
      name: user?.user_metadata.full_name || '',
    })

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: process.env.NEXT_PUBLIC_URL + '/dashboard/freelancer/tokens',
      cancel_url: process.env.NEXT_PUBLIC_URL + '/dashboard/freelancer/tokens',
      payment_method_types: ['card'],
      mode: 'payment',
      customer,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user?.id as string,
        quantity: tokens[priceId],
      }
    })

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.log(error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}