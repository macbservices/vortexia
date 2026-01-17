"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = sessionStorage.getItem("vortexia_admin_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/admin")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (newPassword === "admin123") {
      setError("Escolha uma senha diferente da padrão")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin/dashboard")
      } else {
        setError(data.message || "Erro ao alterar senha")
      }
    } catch {
      setError("Erro ao conectar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordValidation = {
    length: newPassword.length >= 6,
    match: newPassword === confirmPassword && confirmPassword.length > 0,
    notDefault: newPassword !== "admin123",
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(138,43,226,0.08),transparent_50%)]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-primary">VORTEX</span>
            <span className="text-accent">IA</span>
          </h1>
          <p className="text-muted-foreground mt-2">Primeiro Acesso</p>
        </div>

        {/* Form */}
        <div className="glass-strong rounded-2xl p-8 border border-accent/30 shadow-[0_0_40px_rgba(138,43,226,0.1)]">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Troca de Senha Obrigatória</h2>
            <p className="text-sm text-muted-foreground mt-2">Por segurança, crie uma nova senha para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">
                Nova Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="pl-10 pr-10 bg-muted/50 border-border focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                  className="pl-10 pr-10 bg-muted/50 border-border focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="space-y-2 text-sm">
              <div
                className={`flex items-center gap-2 ${passwordValidation.length ? "text-green-500" : "text-muted-foreground"}`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mínimo de 6 caracteres</span>
              </div>
              <div
                className={`flex items-center gap-2 ${passwordValidation.notDefault ? "text-green-500" : "text-muted-foreground"}`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Diferente da senha padrão</span>
              </div>
              <div
                className={`flex items-center gap-2 ${passwordValidation.match ? "text-green-500" : "text-muted-foreground"}`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Senhas coincidem</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                isLoading || !passwordValidation.length || !passwordValidation.match || !passwordValidation.notDefault
              }
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isLoading ? "Alterando..." : "Alterar Senha e Continuar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
