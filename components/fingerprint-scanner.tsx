"use client"

import React, { useEffect, useRef, useState } from "react"

type Props = {
  className?: string
  onVerified?: () => void
}

export default function FingerprintScanner({ className, onVerified }: Props) {
  const [scanning, setScanning] = useState(false)
  const [verified, setVerified] = useState(false)
  const holdTimer = useRef<number | null>(null)
  const vibrateTimer = useRef<number | null>(null)
  const HOLD_TIME = 750

  const startVibrate = () => {
    if (typeof navigator !== "undefined" && (navigator as any).vibrate) {
      // subtle repeating vibration while holding
      ;(navigator as any).vibrate([80, 40, 80, 40])
      vibrateTimer.current = window.setInterval(() => {
        ;(navigator as any).vibrate(40)
      }, 250)
    }
  }

  const stopVibrate = () => {
    if (vibrateTimer.current) {
      window.clearInterval(vibrateTimer.current)
      vibrateTimer.current = null
    }
    if (typeof navigator !== "undefined" && (navigator as any).vibrate) {
      ;(navigator as any).vibrate(0)
    }
  }

  const onPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (verified || scanning) return
    e.preventDefault()
    e.stopPropagation()
    setScanning(true)
    startVibrate()
    holdTimer.current = window.setTimeout(() => {
      setVerified(true)
      setScanning(false)
      stopVibrate()
      // success vibration pulse
      if (typeof navigator !== "undefined" && (navigator as any).vibrate) {
        ;(navigator as any).vibrate([200, 100, 200])
      }
      // notify parent
      if (onVerified) {
        window.setTimeout(() => onVerified(), 300)
      }
    }, HOLD_TIME)
  }

  const onPressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (verified) return
    e.preventDefault()
    e.stopPropagation()
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    stopVibrate()
    setScanning(false)
  }

  useEffect(() => {
    return () => {
      if (holdTimer.current) window.clearTimeout(holdTimer.current)
      if (vibrateTimer.current) window.clearInterval(vibrateTimer.current)
      stopVibrate()
    }
  }, [])

  return (
    <div className={className} style={{ position: "relative", zIndex: 2 }}>
      <div className="scanner-container">
        <div
          className={`fingerprint ${scanning ? "scanning" : ""} ${verified ? "success" : ""}`}
          onMouseDown={onPressStart}
          onMouseUp={onPressEnd}
          onMouseLeave={onPressEnd}
          onTouchStart={(e) => {
            e.preventDefault()
            onPressStart(e)
          }}
          onTouchEnd={onPressEnd}
          onTouchMove={(e) => e.preventDefault()}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            return false
          }}
          style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
          role="button"
          aria-label="Fingerprint scanner"
        >
          <div className="scan-line" />
        </div>
        <div className="status">
          {verified
            ? "IDENTITY VERIFIED"
            : scanning
              ? "BIOMETRIC SYNC IN PROGRESS"
              : "PLACE THUMB TO INITIATE BIOMETRIC LINK"}
        </div>
        <div className="hint">Sankalp Bharat AUTH GATE</div>
      </div>

      <style jsx>{`
        .scanner-container {
          text-align: center;
        }

        .fingerprint {
          width: 170px;
          height: 230px;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          border: 2px solid rgba(140, 170, 255, 0.7);
          box-shadow: 0 0 30px rgba(110, 140, 255, 0.6), inset 0 0 25px rgba(120, 90, 255, 0.4);
          background: linear-gradient(180deg, rgba(120, 150, 255, 0.18), rgba(180, 90, 255, 0.18));
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          margin: 0 auto;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
        }

        .fingerprint::before {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(160, 200, 255, 0.18) 0px,
            rgba(160, 200, 255, 0.18) 2px,
            transparent 4px,
            transparent 9px
          );
          opacity: 0.35;
          pointer-events: none;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, transparent, #a7f3ff, transparent);
          top: -10px;
          opacity: 0;
        }

        .scanning {
          animation: vibrate 0.1s infinite;
        }
        .scanning .scan-line {
          opacity: 1;
          animation: scan 1.1s linear infinite;
        }

        .success {
          border-color: #8affc1;
          box-shadow: 0 0 40px #8affc1, inset 0 0 30px rgba(138, 255, 193, 0.6);
          animation: none;
        }

        .status {
          margin-top: 14px;
          font-size: 14px;
          letter-spacing: 2px;
          color: #d2cfff;
        }
        .hint {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 4px;
        }

        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
        @keyframes vibrate {
          0% { transform: translate(0); }
          20% { transform: translate(1px, -1px); }
          40% { transform: translate(-1px, 1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(-1px, -1px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  )
}
