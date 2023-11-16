'use client'

import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import ClientLogin from "./ClientLogin"
import ClientRegister from "./ClientRegister"

export default function ClientForm() {
  const [isRegister, setIsRegister] = useState(false)

  return (
    <>
      {isRegister ?
        <ClientRegister setIsRegister={setIsRegister} /> :
        <ClientLogin setIsRegister={setIsRegister} />
      }
    </>
  )
}