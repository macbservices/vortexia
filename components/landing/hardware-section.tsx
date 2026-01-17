"use client"

import { Server, Wifi, Shield, Zap } from "lucide-react"

interface HardwareContent {
  title: string
  titleAccent: string
  subtitle: string
  productName: string
  specs: string[]
  impactTitle: string
  impactSubtitle: string
  impactDescription: string
}

interface HardwareSectionProps {
  content: HardwareContent
}

export function HardwareSection({ content }: HardwareSectionProps) {
  const features = [
    { icon: Server, title: "Hardware Premium", description: "Equipamento de alta performance" },
    { icon: Wifi, title: "Conexão Estável", description: "Sinal direto sem intermediários" },
    { icon: Shield, title: "Segurança Total", description: "Sistema anti-bloqueio integrado" },
    { icon: Zap, title: "Alta Velocidade", description: "Streaming sem travamentos" },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(0,212,255,0.1),transparent_50%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              <span className="text-primary">{content.title}</span> {content.titleAccent}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              O cliente não compra o aparelho — ele recebe em{" "}
              <span className="text-primary font-semibold">regime de comodato</span>. {content.subtitle}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="glass rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl p-10 flex flex-col items-center justify-center overflow-hidden glass border border-primary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1/2 h-1/2 bg-accent/20 blur-[80px] rounded-full translate-x-10 translate-y-10" />
              </div>

              <div className="relative z-10 text-center space-y-6">
                <div className="text-6xl md:text-7xl font-black">
                  <span className="bg-gradient-to-r from-primary via-cyan-400 to-accent bg-clip-text text-transparent">
                    {content.impactTitle.split(" - ")[0] || "4K"}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {content.impactTitle.split(" - ")[1] || content.impactSubtitle}
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
                <p className="text-lg text-muted-foreground max-w-sm">
                  {content.impactDescription}
                  <span className="text-primary font-semibold"> Sem travamentos, sem complicações.</span>
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  {content.specs.slice(0, 3).map((spec, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-3xl font-bold ${index % 2 === 0 ? "text-primary" : "text-accent"}`}>
                        {spec.split(" ")[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">{spec.split(" ").slice(1).join(" ") || spec}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
