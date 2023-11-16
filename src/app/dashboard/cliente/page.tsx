'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

export default function Pedidos() {
  const supabase = createClientComponentClient()

  async function getPedidos() {
    const { data } = await supabase.from('pedidos').select('*')

    return data
  }

  const { data = [] } = useQuery({
    queryKey: ['pedidos'],
    queryFn: getPedidos
  })

  return (
    <div className="py-8 space-y-4 px-4">
      <h1 className="text-xl font-extrabold">Meus Pedidos</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data?.map((pedido) => {
          return (
            <Link href={`/dashboard/cliente/meu-pedido?id=${pedido.id}`} className="p-4 cursor-pointer rounded-lg border" key={pedido.id}>
              <h1 className="font-semibold">{pedido.nome}</h1>
              <p className="text-blue-500 text-sm font-semibold">{pedido.categoria}</p>
              <p className="text-sm">{pedido.descricao}</p>
              <p>{pedido.max}/4 Propostas Recebidas</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}