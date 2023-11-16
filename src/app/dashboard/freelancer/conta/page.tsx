'use client'

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function Conta() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  async function getUser() {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData) return null

    const { data } = await supabase.from('profiles').select('*').eq('user_id', userData.user?.id).single()

    return {
      id: userData.user?.id,
      email: userData.user?.email,
      whatsapp: data.whatsapp,
    }
  }

  async function Sair() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const { data } = useQuery({
    queryKey: ['conta'],
    queryFn: getUser,
  })

  return (
    <div className="py-8 px-4 md:max-w-lg">
      <div className="border rounded-lg p-4 space-y-4">
        <h1 className="text-xl font-extrabold">Minha Conta</h1>

        <div>
          <h1 className="font-semibold text-lg">{data?.email}</h1>
          <p>{data?.whatsapp}</p>
        </div>

        <Button onClick={() => Sair()}>Sair</Button>
      </div>
    </div>
  )
}