'use client'

import axios from 'axios'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import { getStripe } from '@/lib/stripeClient'

export default function Tokens() {
  const supabase = createClientComponentClient()

  async function getTokens() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData) return null

    const { data, error } = await supabase.from('tokens').select('*').eq('user_id', userData.user?.id).single()

    return data
  }

  async function createCheckoutLink(priceId: string) {
    const { data } = await axios.post(process.env.NEXT_PUBLIC_URL + '/api/create-checkout-session',
      {
        priceId: priceId,
      }
    )

    const sessionId = data.sessionId
    const stripe = await getStripe()

    stripe?.redirectToCheckout({ sessionId })
  }

  const { data } = useQuery({
    queryKey: ['tokens'],
    queryFn: getTokens,
  })

  return (
    <div className="py-8 px-4">
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">Meus Tokens</h1>

        {data && (
          <>
            <div className="p-4">
              <h1 className="text-6xl font-bold">{data.tokens} <span className="text-lg text-slate-500 font-medium">Tokens</span></h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="rounded-lg border shadow-sm p-4 space-y-6">
                  <h1 className="text-6xl font-bold text-center">
                    1000 <span className="text-lg text-slate-500 font-medium">Tokens</span>
                  </h1>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xl">R$ 59,99</p>

                    <Button onClick={() => createCheckoutLink(process.env.NEXT_PUBLIC_STRIPE_PRICE1000 as string)}>Comprar</Button>
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-lg border shadow-sm p-4 space-y-6">
                  <h1 className="text-6xl font-bold text-center">
                    2000 <span className="text-lg text-slate-500 font-medium">Tokens</span>
                  </h1>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xl">R$ 99,99</p>

                    <Button onClick={() => createCheckoutLink(process.env.NEXT_PUBLIC_STRIPE_PRICE2000 as string)}>Comprar</Button></div>
                </div>
              </div>

              <div>
                <div className="rounded-lg border shadow-sm p-4 space-y-6">
                  <h1 className="text-6xl font-bold text-center">
                    4000 <span className="text-lg text-slate-500 font-medium">tokens</span>
                  </h1>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xl">R$ 179,99</p>

                    <Button onClick={() => createCheckoutLink(process.env.NEXT_PUBLIC_STRIPE_PRICE4000 as string)}>Comprar</Button></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}