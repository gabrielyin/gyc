'use client'

import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

export default function Freelancer() {
  const supabase = createClientComponentClient()
  const [searchQuery, setSearchQuery] = useState('');

  async function getPedidos() {
    const { data } = await supabase.from('pedidos').select('*')

    return data
  }

  const { data = [] } = useQuery({
    queryKey: ['pedidos-freelas'],
    queryFn: getPedidos
  })

  const searchTerm = new RegExp(searchQuery.trim(), 'i');

  const filteredData = data!.filter((pedido) => {
    return (
      searchTerm.test(pedido.nome) ||
      searchTerm.test(pedido.categoria) ||
      searchTerm.test(pedido.descricao)
    );
  });

  return (
    <div className="py-8 space-y-4 px-4">
      <h1 className="text-xl font-extrabold">Encontrar novos projetos</h1>

      <Input
        placeholder="Buscar projeto"
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />

      <div className="grid grid-cols-3">
        {filteredData?.map((pedido) => {
          return (
            <Link href={`/dashboard/freelancer/projeto?id=${pedido.id}`} className="p-2 cursor-pointer rounded-lg border" key={pedido.id}>
              <h1 className="font-semibold">{pedido.nome}</h1>
              <p className="text-blue-500 text-sm font-semibold">{pedido.categoria}</p>
              <p className="text-sm">{pedido.descricao}</p>
              <p>{pedido.max}/4 Propostas Recebidas</p>
              <h3 className="text-lg font-bold">{100 - (25 * pedido.max)} Tokens</h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}