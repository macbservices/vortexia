import { NextResponse } from "next/server"
import { changePassword } from "@/lib/store"

export async function POST(request: Request) {
  try {
    const { newPassword } = await request.json()

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, message: "A senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    if (newPassword === "admin123") {
      return NextResponse.json({ success: false, message: "Escolha uma senha diferente da padrão" }, { status: 400 })
    }

    changePassword(newPassword)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
