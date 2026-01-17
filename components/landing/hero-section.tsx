"use client"

import { Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface HeroContent {
  title: string
  titleAccent: string
  subtitle: string
  description: string
  ctaText: string
  backgroundImage: string
}

interface HeroSectionProps {
  whatsappLink: string
  content: HeroContent
}

export function HeroSection({ whatsappLink, content }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={content.backgroundImage || "/images/mxq-pro-4k.webp"}
          alt="Background"
          fill
          className="object-cover opacity-[0.45] scale-110"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/50 to-background/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(138,43,226,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
            <span className="text-primary">{content.title}</span>
            <span className="text-accent">{content.titleAccent}</span>
          </h1>
        </div>

        <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-6 text-balance drop-shadow-lg">
          {content.subtitle}
        </h2>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 text-pretty drop-shadow-md">
          {content.description}
        </p>

        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className="animate-pulse-neon bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl font-semibold shadow-[0_0_30px_rgba(0,212,255,0.5)]"
          >
            <Video className="mr-2 h-5 w-5" />
            {content.ctaText}
          </Button>
        </a>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
