import { NextResponse } from "next/server"
import { validateLogin, isFirstLogin } from "@/lib/store"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Usuário e senha são obrigatórios" }, { status: 400 })
    }

    const isValid = validateLogin(username, password)

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Credenciais inválidas" }, { status: 401 })
    }

    const requirePasswordChange = isFirstLogin()

    return NextResponse.json({
      success: true,
      requirePasswordChange,
    })
  } catch (error) {
    console.error("[VORTEXIA] Login error:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
