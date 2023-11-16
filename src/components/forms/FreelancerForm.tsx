'use client'

import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import FreelancerLogin from "./FreelancerLogin"
import FreelancerRegister from "./FreelancerRegister"

export default function FreelancerForm() {
  const [isRegister, setIsRegister] = useState(false)

  return (
    <>
      {isRegister ?
        <FreelancerRegister setIsRegister={setIsRegister} /> :
        <FreelancerLogin setIsRegister={setIsRegister} />
      }
    </>
  )
}