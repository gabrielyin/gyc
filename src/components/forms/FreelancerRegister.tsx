import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
  whatsapp: z.string(),
})

export default function ClientRegister({ setIsRegister }: { setIsRegister: Dispatch<SetStateAction<boolean>> }) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      senha: '',
      whatsapp: ''
    }
  })

  async function criarConta(data: z.infer<typeof registerSchema>) {
    try {
      const response = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        phone: data.whatsapp,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_URL
        }
      })

      if (response.error) throw Error(response.error.message)

      if (response.data) {
        const profileResponse = await supabase.from('profiles').insert({
          user_id: response.data.user?.id,
          whatsapp: data.whatsapp,
        })

        if (profileResponse.error) throw Error(profileResponse.error?.message)

        const roleResponse = await supabase.from('roles').insert({
          user_id: response.data.user?.id,
          role: 'FREELANCER'
        })

        if (roleResponse.error) throw Error(roleResponse.error.message)

        const tokenResponse = await supabase.from('tokens').insert({
          user_id: response.data.user?.id,
          tokens: 0,
        })

        if (tokenResponse.error) throw Error(tokenResponse.error.message)

        toast({ variant: 'default', title: 'Conta criada', description: 'Conta criada com sucesso' })
        router.push('/')
      }
    } catch (error) {
      console.log(error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Não possível criar a sua conta' })
    }
  }
  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(criarConta)} className="space-y-4">
        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Senha" type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Whatsapp</FormLabel>
              <FormControl>
                <Input placeholder="Whatsapp" type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button>Criar conta</Button>

          <p onClick={() => setIsRegister(false)} className="underline text-blue-500 cursor-pointer hover:text-blue-600">Tenho conta</p>
        </div>
      </form>
    </Form>
  )
}