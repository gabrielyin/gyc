import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen p-8">
      <Card className="p-4 space-y-2">
        <Label className="block mb-2 font-semibold text-xl">Recuperar Senha</Label>
        <Label>Nova Senha</Label>
        <Input />
        <Button>Enviar</Button>
      </Card>
    </div>
  )
}