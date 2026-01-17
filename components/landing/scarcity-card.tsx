"use client"

import { Users } from "lucide-react"

interface ScarcityCardProps {
  availableSlots: number
  totalSlots: number
}

export function ScarcityCard({ availableSlots, totalSlots }: ScarcityCardProps) {
  const filledSlots = totalSlots - availableSlots
  const percentage = (filledSlots / totalSlots) * 100

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="glass-strong rounded-2xl p-8 border border-primary/30 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Vagas do Projeto Piloto</h3>
          </div>

          {/* Progress bar */}
          <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-[shimmer_2s_infinite]" />
          </div>

          {/* Slot counter */}
          <div className="text-center">
            <span className="text-4xl font-bold text-primary">{availableSlots}</span>
            <span className="text-2xl text-muted-foreground"> de </span>
            <span className="text-4xl font-bold text-foreground">{totalSlots}</span>
            <span className="text-lg text-muted-foreground ml-2">restantes</span>
          </div>

          {/* Warning message */}
          {availableSlots <= 5 && (
            <p className="text-center text-accent mt-4 font-medium animate-glow">Últimas vagas disponíveis!</p>
          )}
        </div>
      </div>
    </section>
  )
}
