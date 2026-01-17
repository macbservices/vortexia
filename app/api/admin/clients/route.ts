import { NextResponse } from "next/server"
import { getState, addClient, updateClient, deleteClient } from "@/lib/store"

export async function GET() {
  const state = getState()
  return NextResponse.json({ clients: state.clients })
}

export async function POST(request: Request) {
  try {
    const client = await request.json()
    addClient(client)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao adicionar cliente" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updates } = await request.json()
    updateClient(id, updates)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao atualizar cliente" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    deleteClient(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: "Erro ao excluir cliente" }, { status: 500 })
  }
}
