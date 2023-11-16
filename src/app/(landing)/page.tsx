'use client'

import { Button } from "@/components/ui/button";
import TypewriterComponent from "typewriter-effect";
import Image from 'next/image'

import forms from '@/assets/undraw_forms.svg'
import proposals from '@/assets/undraw_terms.svg'
import selection from '@/assets/undraw_selecting_team.svg'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ClientForm from "@/components/forms/ClientForm";
import { useEffect, useState } from "react";
import { User, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import FreelancerForm from "@/components/forms/FreelancerForm";

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    }

    getUser()
  }, [supabase.auth])

  return (
    <main>
      <nav className="flex items-center justify-between bg-transparent p-4">
        <h1 className="font-extrabold text-2xl">GYC</h1>

        <div className="flex items-center gap-x-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {isLoading === false &&
              (user ? (<Link className="rounded-full border px-4 py-1.5" href="/dashboard/cliente">Dashboard</Link>) : (<DialogTrigger className="rounded-full border px-4 py-1.5">
                Entrar como Cliente
              </DialogTrigger>))}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Entrar como cliente</DialogTitle>
              </DialogHeader>
              <ClientForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="rounded-full border px-4 py-1.5 bg-black text-white">
              Entrar como Freelancer
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Entrar como freelancer</DialogTitle>
              </DialogHeader>
              <FreelancerForm />
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      <div className="space-y-5 py-36 text-center font-bold text-black">
        <div className="md:space-y-5 font-mono text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-8xl">
          <h1>Encontre Serviços de</h1>
          <div className="bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            <TypewriterComponent
              options={{
                strings: ['Web Design.', 'Aplicativos.', 'Landing Pages.', 'Sistemas.'],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
        <div className="text-sm font-medium tracking-tight md:text-xl">
          Encontre freelancers qualificados para o seu serviço
        </div>

        <div className="max-w-lg mx-auto">
          {isLoading === false &&
            (user ? (<Link href="/dashboard/cliente">
              <Button variant='outline' className="rounded-full border-black border-2 px-7 py-6 text-lg">
                Novo Serviço
              </Button>
            </Link>) : (<Button onClick={() => setIsOpen(true)} variant='outline' className="rounded-full border-black border-2 px-7 py-6 text-lg">
              Novo Serviço
            </Button>))}
        </div>
      </div>

      <div className="space-y-16 py-20 px-6">

        <div className="flex md:flex-row flex-col gap-14">
          <div className="h-[290px] md:flex-1 rounded-3xl bg-green-200 relative">
            <Image src={forms} fill alt='Forms' className="p-12" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8">
            <h1 className="font-mono text-5xl font-semibold tracking-tighter">
              Crie o seu pedido
            </h1>

            <p>
              Crie um pedido e insira os dados relevantes
              <br />
              sobre o seu serviço.
            </p>
          </div>
        </div>

        <div className="flex md:flex-row flex-col gap-14">
          <div className="h-[290px] md:flex-1 rounded-3xl bg-blue-200 relative">
            <Image
              src={proposals}
              alt="Receba Propostas"
              fill
              className="p-12"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8">
            <h1 className="font-mono text-5xl font-semibold tracking-tighter">
              Receba Propostas
            </h1>

            <p>
              Receba até 4 porpostas de freelancers
              <br />
              selecionados.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-14">
          <div className="h-[290px] md:flex-1 rounded-3xl bg-orange-200 relative">
            <Image
              src={selection}
              alt="Seleção"
              fill
              className="p-12"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-8">
            <h1 className="font-mono text-5xl font-semibold tracking-tighter">
              Seleção
            </h1>

            <p>
              Após analisar os orçamentos escolha
              <br /> o freelancer ideal para o serviço
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-16 py-20">
        <h1 className="text-center font-extrabold text-5xl">Quem Somos?</h1>

        <div className="text-center space-y-4">
          <p className="text-sm font-medium tracking-tight md:text-xl text-center max-w-xl mx-auto">Somos uma plataforma de freelancers onde conectamos freelancers qualificados com os serviços dos nossos clientes</p>
          {isLoading === false &&
            (user ? (<Link href="/dashboard/cliente">
              <Button variant='outline' className="rounded-full border-black border-2 px-7 py-6 text-lg">
                Novo Serviço
              </Button>
            </Link>) : (<Button onClick={() => setIsOpen(true)} variant='outline' className="rounded-full border-black border-2 px-7 py-6 text-lg">
              Novo Serviço
            </Button>))}
        </div>
      </div>

      <footer className="border-t py-8 flex justify-between px-4">
        <div className="w-fit"><h1 className="font-extrabold text-2xl">GYC</h1></div>
        <div className="w-fit">
          <ul className="text-slate-400 text-right">
            <li className="cursor-pointer">Contato</li>
            <li>2021gabrielyin@gmail.com</li>
          </ul>
        </div>
      </footer>
    </main>
  )
}
