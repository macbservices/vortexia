"use client"

import { useState } from "react"
import { X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComodatoModalProps {
  title?: string
  content?: string
}

export function ComodatoModal({ title = "Termo de Comodato", content }: ComodatoModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  const defaultContent = `Este contrato estabelece os termos e condições para o empréstimo de equipamento de hardware em regime de comodato.

CLÁUSULA 1 - DO OBJETO
O hardware é cedido em regime de empréstimo (comodato), permanecendo a propriedade do equipamento com a VORTEXIA. O comodatário recebe o direito de uso enquanto mantiver o contrato ativo e em dia.

CLÁUSULA 2 - DO CAUÇÃO
O valor do caução pago no primeiro mês (R$ 100,00) é revertido integralmente em crédito no 2º mês de serviço, resultando em mensalidade zero no segundo mês. A partir do terceiro mês, o valor mensal será de R$ 50,00.

CLÁUSULA 3 - DAS PENALIDADES
O descumprimento de pagamento ou não devolução do item implica em:
• Bloqueio total do sinal via servidor
• Cobrança do valor de mercado do hardware
• Inclusão em cadastro de inadimplentes, se aplicável

CLÁUSULA 4 - DA DEVOLUÇÃO
Em caso de cancelamento do serviço, o comodatário deve devolver o equipamento em perfeitas condições de uso no prazo de 7 (sete) dias úteis.`

  const displayContent = content || defaultContent

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors inline-flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {title}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden glass-strong rounded-2xl border border-primary/30 shadow-[0_0_50px_rgba(0,212,255,0.2)]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="text-foreground whitespace-pre-line">{displayContent}</div>
            </div>

            <div className="p-6 border-t border-border">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Li e Entendi
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
