import fs from "fs"
import path from "path"

export interface SiteColors {
  primary: string
  accent: string
  background: string
  foreground: string
}

export interface HeroContent {
  title: string
  titleAccent: string
  subtitle: string
  description: string
  ctaText: string
  backgroundImage: string
}

export interface OfferItem {
  month: string
  price: string
  description: string
  highlight: boolean
}

export interface OffersContent {
  title: string
  titleAccent: string
  subtitle: string
  items: OfferItem[]
}

export interface HardwareContent {
  title: string
  titleAccent: string
  subtitle: string
  productName: string
  specs: string[]
  impactTitle: string
  impactSubtitle: string
  impactDescription: string
}

export interface SecurityFeature {
  title: string
  description: string
}

export interface SecurityContent {
  title: string
  titleAccent: string
  subtitle: string
  features: SecurityFeature[]
}

export interface FooterContent {
  brandName: string
  brandAccent: string
  description: string
  copyright: string
  legalTitle: string
  legalContent: string
}

export interface SiteContent {
  hero: HeroContent
  offers: OffersContent
  hardware: HardwareContent
  security: SecurityContent
  footer: FooterContent
}

export interface AdminSettings {
  availableSlots: number
  totalSlots: number
  whatsappLink: string
  colors: SiteColors
  content: SiteContent
}

export interface Client {
  id: string
  name: string
  status: "active" | "inactive"
  activationDate: string
  nextDueDate: string
}

export interface AdminState {
  settings: AdminSettings
  clients: Client[]
  isPasswordChanged: boolean
  currentPassword: string
}

const DATA_DIR = "/var/www/vortexia/data"
const DATA_FILE = path.join(DATA_DIR, "admin-data.json")

const DEV_DATA_DIR = path.join(process.cwd(), "data")
const DEV_DATA_FILE = path.join(DEV_DATA_DIR, "admin-data.json")

const defaultState: AdminState = {
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
        description:
          "Hardware de elite em regime de comodato com performance de servidor próprio. Estabilidade máxima, sem intermediários.",
        ctaText: "Garantir Vaga via Vídeo-Chamada",
        backgroundImage: "/images/mxq-pro-4k.webp",
      },
      offers: {
        title: "Oferta",
        titleAccent: "Irresistível",
        subtitle: "Comece com condições especiais e descubra o poder da Vortexia",
        items: [
          { month: "Mês 1", price: "R$ 100", description: "Ativação + Caução", highlight: false },
          { month: "Mês 2", price: "R$ 0", description: "Bônus Reembolsável", highlight: true },
          { month: "Mês 3+", price: "R$ 50", description: "Valor mensal fixo", highlight: false },
        ],
      },
      hardware: {
        title: "Vortexia Box",
        titleAccent: "MXQ Pro 4K",
        subtitle: "Tecnologia de ponta em um design compacto",
        productName: "MXQ Pro 4K",
        specs: ["5G Wi-Fi", "4K Ultra HD", "64GB Armazenamento", "Android 11"],
        impactTitle: "4K - Qualidade Cinematográfica",
        impactSubtitle: "Entretenimento Sem Limites",
        impactDescription:
          "Transforme sua TV em um centro de entretenimento completo com a melhor tecnologia do mercado.",
      },
      security: {
        title: "Segurança",
        titleAccent: "Premium",
        subtitle: "Sua tranquilidade é nossa prioridade",
        features: [
          { title: "Servidor Próprio", description: "Infraestrutura dedicada para máxima estabilidade" },
          { title: "Sem Intermediários", description: "Conexão direta, sem dependência de terceiros" },
          { title: "Suporte 24/7", description: "Assistência técnica disponível a qualquer momento" },
          { title: "Garantia Total", description: "Cobertura completa do equipamento em comodato" },
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
  },
  clients: [
    { id: "1", name: "João Silva", status: "active", activationDate: "2024-01-15", nextDueDate: "2024-02-15" },
    { id: "2", name: "Maria Santos", status: "active", activationDate: "2024-01-20", nextDueDate: "2024-02-20" },
    { id: "3", name: "Pedro Oliveira", status: "inactive", activationDate: "2024-01-10", nextDueDate: "2024-02-10" },
  ],
  isPasswordChanged: false,
  currentPassword: "admin123",
}

function getDataFilePath(): string {
  if (fs.existsSync(DATA_DIR)) {
    return DATA_FILE
  }
  return DEV_DATA_FILE
}

function getDataDirPath(): string {
  if (fs.existsSync(DATA_DIR)) {
    return DATA_DIR
  }
  return DEV_DATA_DIR
}

function ensureDataDir(): void {
  const dataDir = getDataDirPath()
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 })
    }
  } catch (error) {
    console.error("[VORTEXIA] Error creating data directory:", error)
  }
}

function readStateFromFile(): AdminState {
  const dataFile = getDataFilePath()
  try {
    ensureDataDir()
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, "utf-8")
      const parsed = JSON.parse(data) as AdminState
      return {
        ...defaultState,
        ...parsed,
        settings: {
          ...defaultState.settings,
          ...parsed.settings,
          colors: { ...defaultState.settings.colors, ...parsed.settings?.colors },
          content: {
            ...defaultState.settings.content,
            ...parsed.settings?.content,
            hero: { ...defaultState.settings.content.hero, ...parsed.settings?.content?.hero },
            offers: { ...defaultState.settings.content.offers, ...parsed.settings?.content?.offers },
            hardware: { ...defaultState.settings.content.hardware, ...parsed.settings?.content?.hardware },
            security: { ...defaultState.settings.content.security, ...parsed.settings?.content?.security },
            footer: { ...defaultState.settings.content.footer, ...parsed.settings?.content?.footer },
          },
        },
      }
    }
  } catch (error) {
    console.error("[VORTEXIA] Error reading state file:", error)
  }
  writeStateToFile(defaultState)
  return { ...defaultState }
}

function writeStateToFile(state: AdminState): void {
  const dataFile = getDataFilePath()
  try {
    ensureDataDir()
    fs.writeFileSync(dataFile, JSON.stringify(state, null, 2), { encoding: "utf-8", mode: 0o644 })
  } catch (error) {
    console.error("[VORTEXIA] Error writing state file:", error)
  }
}

export function getState(): AdminState {
  return readStateFromFile()
}

export function updateSettings(settings: Partial<AdminSettings>): void {
  const state = readStateFromFile()
  const newState = {
    ...state,
    settings: {
      ...state.settings,
      ...settings,
      colors: { ...state.settings.colors, ...settings.colors },
      content: { ...state.settings.content, ...settings.content },
    },
  }
  writeStateToFile(newState)
}

export function updateClients(clients: Client[]): void {
  const state = readStateFromFile()
  const newState = { ...state, clients }
  writeStateToFile(newState)
}

export function addClient(client: Omit<Client, "id">): void {
  const state = readStateFromFile()
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
  }
  const newState = { ...state, clients: [...state.clients, newClient] }
  writeStateToFile(newState)
}

export function updateClient(id: string, updates: Partial<Client>): void {
  const state = readStateFromFile()
  const newState = {
    ...state,
    clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
  }
  writeStateToFile(newState)
}

export function deleteClient(id: string): void {
  const state = readStateFromFile()
  const newState = {
    ...state,
    clients: state.clients.filter((c) => c.id !== id),
  }
  writeStateToFile(newState)
}

export function changePassword(newPassword: string): void {
  const state = readStateFromFile()
  const newState = {
    ...state,
    isPasswordChanged: true,
    currentPassword: newPassword,
  }
  writeStateToFile(newState)
}

export function validateLogin(username: string, password: string): boolean {
  const state = readStateFromFile()
  return username === "admin" && password === state.currentPassword
}

export function isFirstLogin(): boolean {
  const state = readStateFromFile()
  return !state.isPasswordChanged
}
