"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

type JungleLetterProps = {
  onReveal?: () => void
  className?: string
}

export default function JungleLetter({ onReveal, className }: JungleLetterProps) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = btnRef.current
    if (!el) return
    el.animate([{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }], {
      duration: 900,
      easing: "ease-in-out",
      delay: 300,
    })
  }, [])

  return (
    <button
      ref={btnRef}
      onClick={() => onReveal?.()}
      aria-label="Open invitation"
      className={cn(
        "group relative grid aspect-[7/3] w-full max-w-4xl place-items-center rounded-2xl border-2",
        "border-[color:var(--primary)] bg-[color:var(--parchment)] text-[color:var(--secondary)]",
        "shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out",
        "hover:-translate-y-1 hover:rotate-1 active:translate-y-0 transform-gpu select-none",
        "before:absolute before:inset-0 before:rounded-2xl before:ring-2 before:ring-[color:var(--primary)]/20 before:blur-0",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-1/2 w-[92%] -translate-x-1/2 rounded-t-xl"
        style={{
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background: "color-mix(in oklab, var(--parchment), black 6%)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        }}
      />

      <div className="pointer-events-none relative z-10 grid h-full w-full place-items-center rounded-2xl p-6 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="text-lg md:text-xl font-semibold tracking-wide text-[color:var(--secondary)]/90">
            You're invited to Sankalp Bharat 2k26!
          </div>
          <div className="mt-3 text-sm md:text-base text-[color:var(--secondary)]/80">Tap the envelope to open.</div>
          <div className="mx-auto mt-4 h-[2px] w-32 bg-[color:var(--primary)]/70" />
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(182,139,42,0.28),transparent_60%)] opacity-90"
      />
    </button>
  )
}
