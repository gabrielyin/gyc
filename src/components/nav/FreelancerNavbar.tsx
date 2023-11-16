'use client'

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function FreelancerNavbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dashboard/freelancer/tokens" legacyBehavior passHref>
            <NavigationMenuLink className={`bg-blue-500 focus:bg-blue-600 hover:bg-opacity-70 hover:bg-blue-600 ${navigationMenuTriggerStyle()}`}>
              Tokens
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-blue-500 data-[state=open]:bg-blue-600 default::bg-blue-600 hover:bg-opacity-70 hover:bg-blue-600 focus:bg-blue-600">Projetos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[200px] p-4 grid gap-3">
              <Link href="/dashboard/cliente/pedido">
                Buscar projetos
              </Link>
              <Link href="/dashboard/freelancer">
                Meus Projetos
              </Link>
            </ul>

          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/freelancer/conta" legacyBehavior passHref>
            <NavigationMenuLink className={`bg-blue-500 focus:bg-blue-600 hover:bg-opacity-70 hover:bg-blue-600 ${navigationMenuTriggerStyle()}`}>
              Conta
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}