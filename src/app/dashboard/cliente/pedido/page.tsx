'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const pedidoSchema = z.object({
  nome: z.string(),
  categoria: z.string(),
  descricao: z.string(),
  duracao: z.string()
})

export default function Pedido() {
  const supabase = createClientComponentClient()

  const { handleSubmit, control, reset, formState: { isSubmitting } } = useForm<z.infer<typeof pedidoSchema>>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      nome: '',
      categoria: '',
      descricao: '',
      duracao: ''
    }
  })

  async function createPedido(data: z.infer<typeof pedidoSchema>) {
    const user = await supabase.auth.getUser()
    await supabase.from('pedidos').insert({
      user_id: user.data?.user?.id,
      nome: data.nome,
      descricao: data.descricao,
      categoria: data.categoria,
      duracao: data.duracao,
    })

    reset()
    toast({ variant: "default", title: 'Pedido criado', description: 'Pedido criado com sucesso' })
  }

  return (
    <div className="max-w-lg px-4">
      <h1 className="text-2xl font-extrabold py-8">Criar Pedido</h1>

      <form onSubmit={handleSubmit(createPedido)} className="grid space-y-6">
        <div className="space-x-2">
          <label htmlFor="categoria" className="font-semibold text-lg">Categoria do Projeto:</label>
          <Controller
            name="categoria"
            control={control}
            render={({ field }) => (
              <select id="categoria" className="w-fit rounded border border-gray-300 p-2" {...field}>
                <option>Selecionar</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Website">Sites</option>
                <option value="Aplicativo-mobile">Aplicativo</option>
                <option value="Software">Software</option>
              </select>
            )}
          />
        </div>

        <div>
          <h1 className="text-lg font-semibold">Nome do Projeto</h1>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <Input className="border" type="text" placeholder="Nome do projeto" {...field} />
            )}
          />
        </div>

        <div>
          <h1 className="text-lg font-semibold">Descrição do Projeto</h1>
          <Controller
            name="descricao"
            control={control}
            render={({ field }) => (
              <Textarea className="border" cols={30} rows={10} {...field} />
            )}
          />
        </div>

        <div>
          <h1 className="text-lg font-semibold">Postar projeto durante quantos dias?</h1>
          <label htmlFor="tempo" className="mr-2">Escolher duração:</label>
          <Controller
            name="duracao"
            control={control}
            render={({ field }) => (
              <select id="duracao" className="w-fit rounded border border-gray-300 p-2" {...field}>
                <option>Selecionar</option>
                <option value="7">7 Dias</option>
                <option value="15">15 Dias</option>
                <option value="30">30 Dias</option>
              </select>
            )}
          />
        </div>

        <Button disabled={isSubmitting} className="w-fit">
          {isSubmitting ? <div className="space-x-2"><Loader2Icon /> Publicando</div> : "Publicar"}
        </Button>
      </form>
    </div >
  )
}