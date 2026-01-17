"use client"

import { Video, Headphones, FileCheck, Shield } from "lucide-react"

interface SecurityFeature {
  title: string
  description: string
}

interface SecurityContent {
  title: string
  titleAccent: string
  subtitle: string
  features: SecurityFeature[]
}

interface SecuritySectionProps {
  content: SecurityContent
}

export function SecuritySection({ content }: SecuritySectionProps) {
  const icons = [Video, Headphones, FileCheck, Shield]

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          {content.title} <span className="text-primary">{content.titleAccent}</span> em Primeiro Lugar
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{content.subtitle}</p>

        <div className="grid md:grid-cols-3 gap-8">
          {content.features.map((feature, index) => {
            const Icon = icons[index % icons.length]
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors group-hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
