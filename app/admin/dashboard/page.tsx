"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import {
  Settings,
  Users,
  LogOut,
  Save,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Link,
  Hash,
  UserCheck,
  UserX,
  Calendar,
  Palette,
  Layout,
  Shield,
  CreditCard,
  ImageIcon,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Client, AdminSettings } from "@/lib/store"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type TabType = "general" | "colors" | "hero" | "offers" | "hardware" | "security" | "footer" | "clients"

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("general")

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("vortexia_admin_logged_in")
    if (isLoggedIn !== "true") {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem("vortexia_admin_logged_in")
    router.push("/admin")
  }

  const tabs = [
    { id: "general" as TabType, label: "Geral", icon: Settings },
    { id: "colors" as TabType, label: "Cores", icon: Palette },
    { id: "hero" as TabType, label: "Hero", icon: Layout },
    { id: "offers" as TabType, label: "Ofertas", icon: CreditCard },
    { id: "hardware" as TabType, label: "Hardware", icon: ImageIcon },
    { id: "security" as TabType, label: "Segurança", icon: Shield },
    { id: "footer" as TabType, label: "Rodapé", icon: FileText },
    { id: "clients" as TabType, label: "Clientes", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              <span className="text-primary">VORTEX</span>
              <span className="text-accent">IA</span>
            </h1>
            <span className="text-muted-foreground hidden sm:inline">| Painel Admin</span>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs - scrollable on mobile */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "general" && <GeneralPanel />}
        {activeTab === "colors" && <ColorsPanel />}
        {activeTab === "hero" && <HeroPanel />}
        {activeTab === "offers" && <OffersPanel />}
        {activeTab === "hardware" && <HardwarePanel />}
        {activeTab === "security" && <SecurityPanel />}
        {activeTab === "footer" && <FooterPanel />}
        {activeTab === "clients" && <ClientsPanel />}
      </main>
    </div>
  )
}

function useSaveSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const saveSettings = async (settings: Partial<AdminSettings>) => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaveMessage("Salvo com sucesso!")
        mutate("/api/admin/settings")
      } else {
        setSaveMessage("Erro ao salvar")
      }
    } catch {
      setSaveMessage("Erro ao conectar")
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  return { isSaving, saveMessage, saveSettings }
}

function GeneralPanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings) setSettings(data.settings)
  }, [data])

  if (isLoading || !settings) {
    return <LoadingState />
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        Configurações Gerais
      </h2>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              Vagas Disponíveis
            </Label>
            <Input
              type="number"
              min="0"
              max={settings.totalSlots}
              value={settings.availableSlots}
              onChange={(e) => setSettings({ ...settings, availableSlots: Number.parseInt(e.target.value) || 0 })}
              className="bg-muted/50 border-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Total de Vagas
            </Label>
            <Input
              type="number"
              min="1"
              value={settings.totalSlots}
              onChange={(e) => setSettings({ ...settings, totalSlots: Number.parseInt(e.target.value) || 1 })}
              className="bg-muted/50 border-border focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground flex items-center gap-2">
            <Link className="h-4 w-4 text-primary" />
            Link do WhatsApp (Botão CTA)
          </Label>
          <Input
            type="url"
            value={settings.whatsappLink}
            onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
            placeholder="https://wa.me/5511999999999"
            className="bg-muted/50 border-border focus:border-primary"
          />
        </div>

        <SaveButton onClick={() => saveSettings(settings)} isSaving={isSaving} saveMessage={saveMessage} />
      </div>
    </div>
  )
}

function ColorsPanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [colors, setColors] = useState<AdminSettings["colors"] | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings?.colors) setColors(data.settings.colors)
  }, [data])

  if (isLoading || !colors) {
    return <LoadingState />
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        Cores do Site
      </h2>

      <div className="grid sm:grid-cols-2 gap-6">
        <ColorInput
          label="Cor Primária (Azul)"
          value={colors.primary}
          onChange={(v) => setColors({ ...colors, primary: v })}
        />
        <ColorInput
          label="Cor de Destaque (Roxo)"
          value={colors.accent}
          onChange={(v) => setColors({ ...colors, accent: v })}
        />
        <ColorInput
          label="Cor de Fundo"
          value={colors.background}
          onChange={(v) => setColors({ ...colors, background: v })}
        />
        <ColorInput
          label="Cor do Texto"
          value={colors.foreground}
          onChange={(v) => setColors({ ...colors, foreground: v })}
        />
      </div>

      <div className="mt-6 p-4 rounded-xl border border-border">
        <p className="text-sm text-muted-foreground mb-2">Preview das cores:</p>
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-lg border border-border" style={{ backgroundColor: colors.primary }} />
          <div className="w-16 h-16 rounded-lg border border-border" style={{ backgroundColor: colors.accent }} />
          <div className="w-16 h-16 rounded-lg border border-border" style={{ backgroundColor: colors.background }} />
          <div className="w-16 h-16 rounded-lg border border-border" style={{ backgroundColor: colors.foreground }} />
        </div>
      </div>

      <SaveButton onClick={() => saveSettings({ colors })} isSaving={isSaving} saveMessage={saveMessage} />
    </div>
  )
}

function HeroPanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [hero, setHero] = useState<AdminSettings["content"]["hero"] | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings?.content?.hero) setHero(data.settings.content.hero)
  }, [data])

  if (isLoading || !hero) {
    return <LoadingState />
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Layout className="h-5 w-5 text-primary" />
        Seção Hero (Topo)
      </h2>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Título (parte 1)</Label>
            <Input
              value={hero.title}
              onChange={(e) => setHero({ ...hero, title: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Título (parte colorida)</Label>
            <Input
              value={hero.titleAccent}
              onChange={(e) => setHero({ ...hero, titleAccent: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Subtítulo</Label>
          <Input
            value={hero.subtitle}
            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Descrição</Label>
          <Textarea
            value={hero.description}
            onChange={(e) => setHero({ ...hero, description: e.target.value })}
            className="bg-muted/50 border-border min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Texto do Botão CTA</Label>
          <Input
            value={hero.ctaText}
            onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Imagem de Fundo (URL)</Label>
          <Input
            value={hero.backgroundImage}
            onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
            className="bg-muted/50 border-border"
          />
          <p className="text-xs text-muted-foreground">Ex: /images/mxq-pro-4k.webp</p>
        </div>

        <SaveButton
          onClick={() => saveSettings({ content: { hero } } as any)}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      </div>
    </div>
  )
}

function OffersPanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [offers, setOffers] = useState<AdminSettings["content"]["offers"] | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings?.content?.offers) setOffers(data.settings.content.offers)
  }, [data])

  if (isLoading || !offers) {
    return <LoadingState />
  }

  const updateItem = (index: number, field: string, value: string | boolean) => {
    const newItems = [...offers.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setOffers({ ...offers, items: newItems })
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-primary" />
        Seção de Ofertas
      </h2>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Título</Label>
            <Input
              value={offers.title}
              onChange={(e) => setOffers({ ...offers, title: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Título (destaque)</Label>
            <Input
              value={offers.titleAccent}
              onChange={(e) => setOffers({ ...offers, titleAccent: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Subtítulo</Label>
          <Input
            value={offers.subtitle}
            onChange={(e) => setOffers({ ...offers, subtitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-foreground text-lg">Cards de Preço</Label>
          {offers.items.map((item, index) => (
            <div key={index} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Período</Label>
                  <Input
                    value={item.month}
                    onChange={(e) => updateItem(index, "month", e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Preço</Label>
                  <Input
                    value={item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Descrição</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.highlight}
                  onChange={(e) => updateItem(index, "highlight", e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground">Destacar este card</span>
              </label>
            </div>
          ))}
        </div>

        <SaveButton
          onClick={() => saveSettings({ content: { offers } } as any)}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      </div>
    </div>
  )
}

function HardwarePanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [hardware, setHardware] = useState<AdminSettings["content"]["hardware"] | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings?.content?.hardware) setHardware(data.settings.content.hardware)
  }, [data])

  if (isLoading || !hardware) {
    return <LoadingState />
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-primary" />
        Seção Hardware
      </h2>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Título</Label>
            <Input
              value={hardware.title}
              onChange={(e) => setHardware({ ...hardware, title: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Título (destaque)</Label>
            <Input
              value={hardware.titleAccent}
              onChange={(e) => setHardware({ ...hardware, titleAccent: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Subtítulo</Label>
          <Input
            value={hardware.subtitle}
            onChange={(e) => setHardware({ ...hardware, subtitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Título de Impacto</Label>
          <Input
            value={hardware.impactTitle}
            onChange={(e) => setHardware({ ...hardware, impactTitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Subtítulo de Impacto</Label>
          <Input
            value={hardware.impactSubtitle}
            onChange={(e) => setHardware({ ...hardware, impactSubtitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Descrição de Impacto</Label>
          <Textarea
            value={hardware.impactDescription}
            onChange={(e) => setHardware({ ...hardware, impactDescription: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Especificações (separadas por vírgula)</Label>
          <Input
            value={hardware.specs.join(", ")}
            onChange={(e) => setHardware({ ...hardware, specs: e.target.value.split(",").map((s) => s.trim()) })}
            className="bg-muted/50 border-border"
          />
          <p className="text-xs text-muted-foreground">Ex: 5G Wi-Fi, 4K Ultra HD, 64GB</p>
        </div>

        <SaveButton
          onClick={() => saveSettings({ content: { hardware } } as any)}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      </div>
    </div>
  )
}

function SecurityPanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [security, setSecurity] = useState<AdminSettings["content"]["security"] | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings?.content?.security) setSecurity(data.settings.content.security)
  }, [data])

  if (isLoading || !security) {
    return <LoadingState />
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...security.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    setSecurity({ ...security, features: newFeatures })
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Seção Segurança
      </h2>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Título</Label>
            <Input
              value={security.title}
              onChange={(e) => setSecurity({ ...security, title: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Título (destaque)</Label>
            <Input
              value={security.titleAccent}
              onChange={(e) => setSecurity({ ...security, titleAccent: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Subtítulo</Label>
          <Input
            value={security.subtitle}
            onChange={(e) => setSecurity({ ...security, subtitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-foreground text-lg">Features de Segurança</Label>
          {security.features.map((feature, index) => (
            <div key={index} className="p-4 rounded-xl border border-border bg-muted/20 grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Título</Label>
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(index, "title", e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">Descrição</Label>
                <Input
                  value={feature.description}
                  onChange={(e) => updateFeature(index, "description", e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>
            </div>
          ))}
        </div>

        <SaveButton
          onClick={() => saveSettings({ content: { security } } as any)}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      </div>
    </div>
  )
}

function FooterPanel() {
  const { data, isLoading } = useSWR<{ settings: AdminSettings }>("/api/admin/settings", fetcher)
  const [footer, setFooter] = useState<AdminSettings["content"]["footer"] | null>(null)
  const { isSaving, saveMessage, saveSettings } = useSaveSettings()

  useEffect(() => {
    if (data?.settings?.content?.footer) setFooter(data.settings.content.footer)
  }, [data])

  if (isLoading || !footer) {
    return <LoadingState />
  }

  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        Rodapé
      </h2>

      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground">Nome da Marca</Label>
            <Input
              value={footer.brandName}
              onChange={(e) => setFooter({ ...footer, brandName: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Nome da Marca (destaque)</Label>
            <Input
              value={footer.brandAccent}
              onChange={(e) => setFooter({ ...footer, brandAccent: e.target.value })}
              className="bg-muted/50 border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Descrição</Label>
          <Input
            value={footer.description}
            onChange={(e) => setFooter({ ...footer, description: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Copyright</Label>
          <Input
            value={footer.copyright}
            onChange={(e) => setFooter({ ...footer, copyright: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Título do Modal Legal</Label>
          <Input
            value={footer.legalTitle}
            onChange={(e) => setFooter({ ...footer, legalTitle: e.target.value })}
            className="bg-muted/50 border-border"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-foreground">Conteúdo do Modal Legal</Label>
          <Textarea
            value={footer.legalContent}
            onChange={(e) => setFooter({ ...footer, legalContent: e.target.value })}
            className="bg-muted/50 border-border min-h-[150px]"
          />
        </div>

        <SaveButton
          onClick={() => saveSettings({ content: { footer } } as any)}
          isSaving={isSaving}
          saveMessage={saveMessage}
        />
      </div>
    </div>
  )
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-foreground">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer border border-border"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-muted/50 border-border font-mono"
        />
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="glass rounded-2xl p-8 border border-border">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  )
}

function SaveButton({
  onClick,
  isSaving,
  saveMessage,
}: { onClick: () => void; isSaving: boolean; saveMessage: string }) {
  return (
    <div className="flex items-center gap-4 pt-4 border-t border-border mt-6">
      <Button onClick={onClick} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Save className="h-4 w-4 mr-2" />
        {isSaving ? "Salvando..." : "Salvar Alterações"}
      </Button>
      {saveMessage && (
        <span className={`text-sm ${saveMessage.includes("sucesso") ? "text-green-500" : "text-destructive"}`}>
          {saveMessage}
        </span>
      )}
    </div>
  )
}

function ClientsPanel() {
  const { data, error, isLoading } = useSWR<{ clients: Client[] }>("/api/admin/clients", fetcher)
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Client>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    status: "active" as "active" | "inactive",
    activationDate: new Date().toISOString().split("T")[0],
    nextDueDate: "",
  })

  const handleEdit = (client: Client) => {
    setEditingClient(client.id)
    setEditForm(client)
  }

  const handleSaveEdit = async () => {
    if (!editingClient || !editForm) return
    try {
      await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingClient, ...editForm }),
      })
      mutate("/api/admin/clients")
      setEditingClient(null)
      setEditForm({})
    } catch (err) {
      console.error("Error saving client:", err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return
    try {
      await fetch("/api/admin/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      mutate("/api/admin/clients")
    } catch (err) {
      console.error("Error deleting client:", err)
    }
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.name || !newClient.nextDueDate) return
    try {
      await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      })
      mutate("/api/admin/clients")
      setShowAddForm(false)
      setNewClient({
        name: "",
        status: "active",
        activationDate: new Date().toISOString().split("T")[0],
        nextDueDate: "",
      })
    } catch (err) {
      console.error("Error adding client:", err)
    }
  }

  if (isLoading) return <LoadingState />
  if (error) {
    return (
      <div className="glass rounded-2xl p-8 border border-destructive/30 text-center">
        <p className="text-destructive">Erro ao carregar clientes</p>
      </div>
    )
  }

  const clients = data?.clients || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Gestão de Clientes
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {showAddForm && (
        <div className="glass rounded-2xl p-6 border border-primary/30">
          <h3 className="text-lg font-medium text-foreground mb-4">Adicionar Novo Cliente</h3>
          <form onSubmit={handleAddClient} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Nome</Label>
              <Input
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Nome do cliente"
                className="bg-muted/50 border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Status</Label>
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value as "active" | "inactive" })}
                className="w-full h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Data de Ativação</Label>
              <Input
                type="date"
                value={newClient.activationDate}
                onChange={(e) => setNewClient({ ...newClient, activationDate: e.target.value })}
                className="bg-muted/50 border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Próximo Vencimento</Label>
              <Input
                type="date"
                value={newClient.nextDueDate}
                onChange={(e) => setNewClient({ ...newClient, nextDueDate: e.target.value })}
                className="bg-muted/50 border-border"
                required
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Check className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-border text-muted-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="glass rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-foreground font-medium">Nome</th>
                <th className="text-left p-4 text-foreground font-medium">Status</th>
                <th className="text-left p-4 text-foreground font-medium hidden sm:table-cell">Ativação</th>
                <th className="text-left p-4 text-foreground font-medium hidden sm:table-cell">Vencimento</th>
                <th className="text-right p-4 text-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum cliente cadastrado
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    {editingClient === client.id ? (
                      <>
                        <td className="p-4">
                          <Input
                            value={editForm.name || ""}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-muted/50 border-border"
                          />
                        </td>
                        <td className="p-4">
                          <select
                            value={editForm.status || "active"}
                            onChange={(e) =>
                              setEditForm({ ...editForm, status: e.target.value as "active" | "inactive" })
                            }
                            className="h-10 px-3 rounded-md bg-muted/50 border border-border text-foreground"
                          >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                          </select>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <Input
                            type="date"
                            value={editForm.activationDate || ""}
                            onChange={(e) => setEditForm({ ...editForm, activationDate: e.target.value })}
                            className="bg-muted/50 border-border"
                          />
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <Input
                            type="date"
                            value={editForm.nextDueDate || ""}
                            onChange={(e) => setEditForm({ ...editForm, nextDueDate: e.target.value })}
                            className="bg-muted/50 border-border"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingClient(null)
                                setEditForm({})
                              }}
                              className="border-border"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 text-foreground font-medium">{client.name}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              client.status === "active"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {client.status === "active" ? (
                              <UserCheck className="h-3 w-3" />
                            ) : (
                              <UserX className="h-3 w-3" />
                            )}
                            {client.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(client.activationDate).toLocaleDateString("pt-BR")}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(client.nextDueDate).toLocaleDateString("pt-BR")}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(client)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(client.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
