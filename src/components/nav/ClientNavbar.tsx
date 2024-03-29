'use client'

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function ClientNavbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-blue-500 data-[state=open]:bg-blue-600 default::bg-blue-600 hover:bg-opacity-70 hover:bg-blue-600 focus:bg-blue-600">Pedidos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-[150px] p-4 grid gap-3">
              <Link href="/dashboard/cliente/pedido">
                Criar pedido
              </Link>
              <Link href="/dashboard/cliente">
                Meus pedidos
              </Link>
            </ul>

          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/cliente/conta" legacyBehavior passHref>
            <NavigationMenuLink className={`bg-blue-500 focus:bg-blue-600 hover:bg-opacity-70 hover:bg-blue-600 ${navigationMenuTriggerStyle()}`}>
              Conta
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}