'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function MeuPedido() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const supabase = createClientComponentClient()
  const router = useRouter()

  async function deletePedido(id: string) {
    await supabase.from('pedidos').delete().eq('id', id)

    router.push('/dashboard/cliente')
  }

  async function getPedido() {
    const { data } = await supabase.from('pedidos').select('*').eq('id', id).single()

    return data
  }

  const { data } = useQuery({
    queryKey: ['pedido'],
    queryFn: getPedido,
  })

  return (
    <div className="py-8 max-w-lg px-4">
      {
        data && (
          <div className="space-y-4">
            <div className={`rounded-full border w-fit px-2 text-sm ${data.status === false ? 'bg-yellow-200 border-yellow-400 text-yellow-600' : 'bg-green-200 border-green-400 text-green-600'}`}>{data.status === false ? 'Aguardando aprovação' : 'Aprovado'}</div>
            <h1 className="font-extrabold text-xl">{data.nome}</h1>
            <p className="text-blue-500 text-sm font-semibold">{data.categoria}</p>
            <div>
              <h2 className="font-semibold">Descrição</h2>
              <p>{data.descricao}</p>
            </div>
            <div>
              <h2 className="font-semibold">Propostas</h2>
              <p>{data.max}/4</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Deletar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja deletar?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Está ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction disabled={data === null} onClick={() => deletePedido(data.id)}>Deletar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      }
    </div>
  )
}