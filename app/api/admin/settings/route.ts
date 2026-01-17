import { NextResponse } from "next/server"
import { getState, updateSettings } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const state = getState()
    return NextResponse.json({ settings: state.settings })
  } catch (error) {
    console.error("[VORTEXIA] Settings GET error:", error)
    return NextResponse.json({
      settings: {
        availableSlots: 7,
        totalSlots: 15,
        whatsappLink: "https://wa.me/5511999999999",
        colors: {
          primary: "#00d4ff",
          accent: "#8a2be2",
          background: "#050505",
          foreground: "#f0f0f0",
        },
        content: {
          hero: {
            title: "VORTEX",
            titleAccent: "IA",
            subtitle: "A Evolução do Seu Entretenimento",
            description: "Hardware de elite em regime de comodato com performance de servidor próprio.",
            ctaText: "Garantir Vaga via Vídeo-Chamada",
            backgroundImage: "/images/mxq-pro-4k.webp",
          },
          offers: { title: "Oferta", titleAccent: "Irresistível", subtitle: "", items: [] },
          hardware: {
            title: "Vortexia Box",
            titleAccent: "MXQ Pro 4K",
            subtitle: "",
            productName: "",
            specs: [],
            impactTitle: "",
            impactSubtitle: "",
            impactDescription: "",
          },
          security: { title: "Segurança", titleAccent: "Premium", subtitle: "", features: [] },
          footer: {
            brandName: "VORTEX",
            brandAccent: "IA",
            description: "",
            copyright: "",
            legalTitle: "",
            legalContent: "",
          },
        },
      },
    })
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json()
    updateSettings(settings)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[VORTEXIA] Settings PUT error:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar configurações" }, { status: 500 })
  }
}
