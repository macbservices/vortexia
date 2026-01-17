import { HeroSection } from "@/components/landing/hero-section"
import { ScarcityCard } from "@/components/landing/scarcity-card"
import { OfferSection } from "@/components/landing/offer-section"
import { HardwareSection } from "@/components/landing/hardware-section"
import { SecuritySection } from "@/components/landing/security-section"
import { Footer } from "@/components/landing/footer"
import { getState } from "@/lib/store"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
  let settings
  try {
    const state = getState()
    settings = state.settings
  } catch (error) {
    console.error("[VORTEXIA] Error loading state:", error)
    settings = {
      availableSlots: 7,
      totalSlots: 15,
      whatsappLink: "https://wa.me/5511999999999",
      colors: { primary: "#00d4ff", accent: "#8a2be2", background: "#050505", foreground: "#f0f0f0" },
      content: {
        hero: {
          title: "VORTEX",
          titleAccent: "IA",
          subtitle: "A Evolução do Seu Entretenimento",
          description: "Hardware de elite em regime de comodato.",
          ctaText: "Garantir Vaga via Vídeo-Chamada",
          backgroundImage: "/images/mxq-pro-4k.webp",
        },
        offers: {
          title: "Oferta",
          titleAccent: "Irresistível",
          subtitle: "Comece com condições especiais",
          items: [
            { month: "Mês 1", price: "R$ 100", description: "Ativação + Caução", highlight: false },
            { month: "Mês 2", price: "R$ 0", description: "Bônus Reembolsável", highlight: true },
            { month: "Mês 3+", price: "R$ 50", description: "Valor mensal fixo", highlight: false },
          ],
        },
        hardware: {
          title: "Vortexia Box",
          titleAccent: "MXQ Pro 4K",
          subtitle: "Tecnologia de ponta",
          productName: "MXQ Pro 4K",
          specs: ["5G Wi-Fi", "4K Ultra HD", "64GB"],
          impactTitle: "4K - Qualidade Cinematográfica",
          impactSubtitle: "Entretenimento Sem Limites",
          impactDescription: "Transforme sua TV em um centro de entretenimento.",
        },
        security: {
          title: "Sua",
          titleAccent: "Segurança",
          subtitle: "Transparência e confiança",
          features: [
            { title: "Servidor Próprio", description: "Infraestrutura dedicada" },
            { title: "Sem Intermediários", description: "Conexão direta" },
            { title: "Suporte 24/7", description: "Assistência técnica" },
          ],
        },
        footer: {
          brandName: "VORTEX",
          brandAccent: "IA",
          description: "A evolução do seu entretenimento.",
          copyright: "© 2026 Vortexia. Todos os direitos reservados.",
          legalTitle: "Termos do Comodato",
          legalContent: "O equipamento Vortexia Box é fornecido em regime de comodato...",
        },
      },
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection whatsappLink={settings.whatsappLink} content={settings.content.hero} />
      <ScarcityCard availableSlots={settings.availableSlots} totalSlots={settings.totalSlots} />
      <OfferSection content={settings.content.offers} />
      <HardwareSection content={settings.content.hardware} />
      <SecuritySection content={settings.content.security} />
      <Footer content={settings.content.footer} />
    </main>
  )
}
