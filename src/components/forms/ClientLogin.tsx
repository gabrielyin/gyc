'use client'

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string()
})

export default function ClientLogin({ setIsRegister }: { setIsRegister: Dispatch<SetStateAction<boolean>> }) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    }
  })

  async function login(data: z.infer<typeof loginSchema>) {
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.senha,
    })

    router.push('/dashboard/cliente/conta')
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(login)} className="space-y-4">
        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
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
        <div className="flex justify-between">
          <Button>Entrar</Button>

          <p onClick={() => setIsRegister(true)} className="underline text-blue-500 cursor-pointer hover:text-blue-600">Não tenho conta</p>
        </div>
      </form>
    </Form>
  )
}