"use client"

import { ComodatoModal } from "./comodato-modal"

interface FooterContent {
  brandName: string
  brandAccent: string
  description: string
  copyright: string
  legalTitle: string
  legalContent: string
}

interface FooterProps {
  content: FooterContent
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold">
              <span className="text-primary">{content.brandName}</span>
              <span className="text-accent">{content.brandAccent}</span>
            </span>
            {content.description && <p className="text-sm text-muted-foreground mt-1">{content.description}</p>}
          </div>

          <div className="flex items-center gap-6">
            <ComodatoModal title={content.legalTitle} content={content.legalContent} />
          </div>

          <p className="text-sm text-muted-foreground">{content.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
