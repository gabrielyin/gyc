'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export default function Projeto() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const supabase = createClientComponentClient()

  async function getProjeto() {
    const { data, error } = await supabase.from('pedidos').select('*').eq('id', id).single()

    if (error) {
      toast({ variant: 'destructive', title: 'Erro' })
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const { data: connectionResponse, error: connectionError } = await supabase.from('conexoes').select(`profiles(whatsapp,email)`).match({ user_id: user?.id, pedido_id: data.id })

    if (connectionError) {
      toast({ variant: 'destructive', title: 'Erro' })
      return
    }

    return {
      ...data,
      profile: connectionResponse.length === 0 ? null : connectionResponse[0].profiles,
    }
  }

  async function createConection(pedidosId: string, quantity: number) {
    const { data: { user } } = await supabase.auth.getUser()
    const response = await supabase.from('conexoes').insert({
      pedido_id: pedidosId,
      user_id: user?.id,
    })

    if (response.error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao criar conexão' })
      return
    }

    await supabase.from('pedidos').update({ max: quantity + 1 }).eq('id', pedidosId)
    toast({ variant: 'default', title: 'Conexão criada', description: 'Conexão criada com sucesso' })
  }

  const { data } = useQuery({
    queryKey: ['projetos'],
    queryFn: getProjeto
  })


  return (
    <div className="py-8 max-w-lg px-4 space-y-4">
      {data && (
        <>
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
          {!data.profile && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={data.max >= 4} className={data.max >= 4 ? 'bg-opacity-25' : ''}>Desbloquer</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza que deseja desbloquer?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Após desbloquer o contato você terá acesso ao contato do cliente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => createConection(data.id, data.max)}>Desbloquear</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {data.profile && (
            <div className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-xl mb-2">Contato</h2>
              <p>{data.profile.whatsapp}</p>
              <p>{data.profile.email}</p>
            </div>
          )
          }
        </>
      )
      }
    </div >
  )
}