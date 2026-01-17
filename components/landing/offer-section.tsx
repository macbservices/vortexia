"use client"

import { Sparkles, Gift, CreditCard } from "lucide-react"

interface OfferItem {
  month: string
  price: string
  description: string
  highlight: boolean
}

interface OffersContent {
  title: string
  titleAccent: string
  subtitle: string
  items: OfferItem[]
}

interface OfferSectionProps {
  content: OffersContent
}

export function OfferSection({ content }: OfferSectionProps) {
  const icons = [CreditCard, Gift, Sparkles]

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.1),transparent_70%)]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          {content.title} <span className="text-primary">{content.titleAccent}</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">{content.subtitle}</p>

        <div className="grid md:grid-cols-3 gap-6">
          {content.items.map((offer, index) => {
            const Icon = icons[index % icons.length]
            return (
              <div
                key={index}
                className={`glass rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 ${
                  offer.highlight
                    ? "border-2 border-accent shadow-[0_0_30px_rgba(138,43,226,0.3)]"
                    : "border border-border"
                }`}
              >
                <Icon className={`h-10 w-10 mx-auto mb-4 ${offer.highlight ? "text-accent" : "text-primary"}`} />
                <p className="text-muted-foreground mb-2">{offer.month}</p>
                <p className={`text-4xl font-bold mb-2 ${offer.highlight ? "text-accent" : "text-primary"}`}>
                  {offer.price}
                </p>
                <p className="text-foreground">{offer.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
