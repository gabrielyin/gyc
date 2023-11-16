import { stripe } from "@/lib/stripe"
import { updateOrRetrieveCustomer } from "@/lib/supabaseAdmin"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

const tokens: { [key: string]: number } = {
  'price_1OAzQaCJeql6Khrki0QUJoEu': 1000,
  'price_1OC1UcCJeql6KhrkVtaiQFW4': 2000,
  'price_1OC1X5CJeql6Khrkonsf1hIh': 4000,
}

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
      success_url: 'http://localhost:3000/dashboard/freelancer/tokens',
      cancel_url: 'http://localhost:3000/dashboard/freelancer/tokens',
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