'use client'

import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useState } from "react"

interface IPedidos {
  categoria: string | null;
  created_at: string;
  descricao: string | null;
  duracao: number | null;
  id: number;
  max: number;
  nome: string | null;
  status: boolean | null;
  user_id: string | null;
}

interface IConexoes {
  created_at: string;
  id: string;
  pedido_id: number;
  user_id: string | null;
  pedidos: IPedidos | null;
}


export default function MeusProjetos() {
  const supabase = createClientComponentClient()
  const [searchQuery, setSearchQuery] = useState('');

  async function getPedidos(): Promise<IConexoes[]> {

    const { data, error } = await supabase.from('conexoes').select(`*,pedidos(*)`)

    if (error) return []

    return data
  }

  const { data = [] } = useQuery<IConexoes[]>({
    queryKey: ['pedidos-freelas'],
    queryFn: getPedidos
  })

  const searchTerm = new RegExp(searchQuery.trim(), 'i');

  const filteredData = data!.filter(({ pedidos }) => {
    return (
      searchTerm.test(pedidos?.nome as string) ||
      searchTerm.test(pedidos?.categoria as string) ||
      searchTerm.test(pedidos?.descricao as string)
    );
  });

  return (
    <div className="py-8 space-y-4 px-4">
      <div className="grid grid-cols-3">
        {filteredData.length > 0 && filteredData?.map(({ pedidos }) => {
          return (
            <Link href={`/dashboard/freelancer/projeto?id=${pedidos!.id}`} className="p-2 cursor-pointer rounded-lg border" key={pedidos!.id}>
              <h1 className="font-semibold">{pedidos!.nome}</h1>
              <p className="text-blue-500 text-sm font-semibold">{pedidos!.categoria}</p>
              <p className="text-sm">{pedidos!.descricao}</p>
              <p>{pedidos!.max}/4 Propostas Recebidas</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}