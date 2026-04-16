"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import JungleLetter from "@/components/jungle-letter";
import SignatureCanvas, {
  type SignatureCanvasHandle,
} from "@/components/signature-canvas";
import FingerprintScanner from "@/components/fingerprint-scanner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

export default function Page() {
  const [showLanding, setShowLanding] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [showLaunchVideo, setShowLaunchVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shipArriving, setShipArriving] = useState(false);
  const [biometricVerified, setBiometricVerified] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const sigRef = useRef<SignatureCanvasHandle>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const finishLaunchVideo = useCallback(() => {
    setShowLaunchVideo(false);
    setShowLanding(false);
    videoRef.current?.pause();
    window.setTimeout(() => setShipArriving(true), 500);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const updateLayout = () => {
      if (mediaQuery.matches) {
        setShowLanding(false);
      }
    };

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);

    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  const handleLaunch = () => {
    if (launching) return;
    setLaunching(true);
    setShowLaunchVideo(true);
  };

  useEffect(() => {
    if (!showLaunchVideo) return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {
      // Playback can still begin on a subsequent tap if the browser blocks autoplay.
    });

    const timer = window.setTimeout(() => {
      finishLaunchVideo();
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [finishLaunchVideo, showLaunchVideo]);

  useEffect(() => {
    videoRef.current?.load();
  }, []);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"]',
    );
    if (existingScript) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  const handleReveal = () => {
    setLoading(true);
    setProgress(0);
    // Animate progress 0-100% over 1 second
    const start = Date.now();
    const duration = 1000;
    const animate = () => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p < 100) {
        requestAnimationFrame(animate);
      } else {
        setLoading(false);
        setRevealed(true);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleDownload = useCallback(() => {
    toast.success("Saved to server", {
      description: "Your invitation has been securely stored.",
      // Keep it subtle and on-theme
      duration: 5000,
    });
  }, []);

  const handleClear = () => sigRef.current?.clear();

  if (showLanding) {
    return (
      <div
        className="landing-bg fixed inset-0 w-screen h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/phone_bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000",
        }}
      >
        <style>{`
          @media (max-width: 1023px) {
            .landing-bg {
              background-image: url('/images/bg1.webp') !important;
            }
          }
          @media (min-width: 1024px) {
            .landing-bg {
              background-image: url('/images/bg1.webp') !important;
            }
          }
        `}</style>

        {showLaunchVideo && (
          <div className="absolute inset-0 z-30 bg-black">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/invitebg_video.webm"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={finishLaunchVideo}
            />
          </div>
        )}

       

        {/* Envelope Trigger */}
        <div className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center pb-6 sm:pb-10 pointer-events-auto px-4 sm:px-6 text-center">
          <div
            className={cn(
              "mb-4 sm:mb-6 transition-opacity duration-300",
              launching ? "opacity-0" : "opacity-100 animate-bounce",
            )}
          >
            <p className="text-white font-bold text-lg sm:text-base md:text-xl tracking-[0.16em] drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
              Tap the Envelope to Unveil
            </p>
          </div>

          <div
            className={cn(
              "w-full max-w-md sm:max-w-xl transition-all duration-500 ease-in-out",
              launching && "scale-95 opacity-0",
            )}
          >
            <JungleLetter onReveal={handleLaunch} />
          </div>
        </div>

        <style jsx>{`
          @keyframes float-slow {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes float-medium {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          @keyframes float-fast {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-25px);
            }
          }

          .animate-float-slow {
            animation: float-slow 4s ease-in-out infinite;
          }

          .animate-float-medium {
            animation: float-medium 3s ease-in-out infinite;
          }

          .animate-float-fast {
            animation: float-fast 2s ease-in-out infinite;
          }

          .ship-anim-wrapper {
            width: 100%;
            will-change: transform;
          }

          @keyframes ship-launch-animation {
            0% {
              transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            12% {
              transform: translate3d(0, -8vh, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            29% {
              transform: translate3d(0, -8vh, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            38% {
              transform: translate3d(12vw, -12vh, 0) scale(0.98) rotate(12deg);
              opacity: 1;
            }
            59% {
              transform: translate3d(30vw, -15vh, 0) scale(0.95) rotate(15deg);
              opacity: 1;
            }
            82% {
              transform: translate3d(50vw, -20vh, 0) scale(0.85) rotate(18deg);
              opacity: 0.9;
            }
            100% {
              transform: translate3d(120vw, -100vh, 0) scale(0.75) rotate(22deg);
              opacity: 0;
            }
          }

          .ship-launch-animation {
            animation: ship-launch-animation 3.5s linear forwards !important;
          }
        `}</style>
      </div>
    );
  }

  return (
    <main
     
  ref={captureRef}
  style={
    {
      "--background": "#020814",
      "--foreground": "#ffffff",
      "--primary": "#8ff1a5",
      "--secondary": "#122a42",
      "--accent": "#ffd77e",
      "--highlight": "#95d9ff",
      "--parchment": "#f5e8ce",
    } as React.CSSProperties
  }
  className="min-h-dvh w-full overflow-x-hidden text-[color:var(--foreground)] bg-cover bg-center bg-no-repeat animate-in fade-in"
>
  {/* ✅ ONLY ONE BACKGROUND */}
  <div className="fixed inset-0 -z-10">
    <Image
      src="/images/bg2.webp"
      alt="background"
      fill
      sizes="100vw"
      quality={80}
      className="object-cover object-center"
    />
  </div>

  {/* rest of your code continues */}

      
      

      {/* Content Container - Centered (z-index 20) */}
      <div className="relative z-20 min-h-dvh w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        {loading && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 backdrop-blur-md animate-in fade-in">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <Image
                src="/images/sb_name.webp"
                alt="Sankalp Bharat 2K26"
                width={400}
                height={300}
                className="h-auto w-48  sm:w-64 md:w-80 object-contain animate-pulse"
                priority
              />
              <div className="w-56 sm:w-64 md:w-80 h-3 bg-[color:var(--secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[color:var(--primary)] rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm sm:text-base text-[color:var(--foreground)]/90">
                Loading invitation... {Math.floor(progress)}%
              </p>
            </div>
          </div>
        )}

        {!revealed && (
          <>
            {/* Desktop & Laptop: show envelope */}
            <div className="hidden xl:block w-full max-w-xl">
              <JungleLetter onReveal={handleReveal} />
            </div>

            {/* Mobile & Tablet (including iPads): show fingerprint scanner */}
            <div className="xl:hidden w-full max-w-md px-6">
              {!biometricVerified ? (
                // NOTE: The background of this specific component (bg-[color:var(--secondary)]/75)
                // remains translucent, allowing the new full background to show through.
                <div className="space-y-6 rounded-2xl border border-white/30 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] p-6 sm:p-8">
                  <FingerprintScanner
                    onVerified={() => setBiometricVerified(true)}
                    className="mx-auto"
                  />
                </div>
              ) : (
                <div className="text-center space-y-6 animate-in fade-in rounded-2xl border border-white/30 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] p-6 sm:p-8">
                  <div className="space-y-4">
                    <h2
                      className="text-2xl text-yellow-600 font-bold text-[color:var(--highlight)]"
                      style={{ letterSpacing: "2px" }}
                    >
                      WELCOME, DELEGATES!
                    </h2>
                    <p
                      className="text-base text-black"
                      style={{ lineHeight: "1.6" }}
                    >
                      Your identity has been successfully verified.
                      <br />
                      You are now authorized to enter{" "}
                      <strong>Sankalp Bharat 2K26</strong>.
                    </p>
                  </div>
                  <Button
                    onClick={handleReveal}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600
hover:scale-105 transition-all duration-300 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform"
                  >
                    Proceed to Invitation
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {revealed && (
          <div className="w-full max-w-3xl space-y-6 sm:space-y-8">
            <section
              className={cn(
                "relative rounded-2xl border border-white/30 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-10 animate-in fade-in overflow-hidden",
              )}
              aria-label="Invitation details"
            >
              <div className="relative z-12 space-y-4 sm:space-y-6">
                <Image
                  src="/images/SVPCET.webp"
                  alt="SVPCET"
                  width={1500}
                  height={300}
                  className="h-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto object-contain drop-shadow"
                  priority
                />

                <p className="viaoda text-center text-base sm:text-lg md:text-xl text-black">
                  Cordially invites you to
                </p>
                <div className="flex flex-col items-center justify-center gap-3">
  <div className="p-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
    <Image
      src="/images/sb_logo.webp"
      alt="Logo"
      width={200}
      height={200}
      className="object-contain"
    />
  </div>

  <Image
    src="/images/sb_name.webp"
    alt="Name"
    width={400}
    height={120}
    className="object-contain drop-shadow-[0_5px_20px_rgba(0,0,0,0.5)]"
  />
</div>

                <h3 className="viaoda text-center text-lg sm:text-xl md:text-3xl font-bold text-black">
                  A National-Level Hackathon
                </h3>

                <h2 className="viaoda text-center text-lg sm:text-xl md:text-3xl font-bold text-black">
                  Innovating Sustainable Solutions For A Viksit Bharat
                </h2>

                <p className="viaoda text-center text-sm sm:text-base md:text-lg leading-relaxed text-black">
                  You are warmly invited to join Sankalp Bharat 2K26, a
                  student-led hackathon focused on sustainable and impactful
                  innovation.
                </p>
                <p className="viaoda text-center text-sm sm:text-base md:text-lg leading-relaxed text-black">
                  Organized by the Department of Computer Science and
                  Engineering, Computer Society of India, and Zenith Forum at
                  St. Vincent Pallotti College of Engineering & Technology,
                  Nagpur.
                </p>

                <div className="viaoda grid gap-1 sm:gap-2 text-center text-sm sm:text-base md:text-lg text-black">
                  <p>
                    <span className="viaoda font-semibold text-yellow-500">
                      Date :
                    </span>{" "}
                    Friday, 17th April 2026
                  </p>
                  <p>
                    <span className="viaoda font-semibold text-yellow-500">
                      Time :
                    </span>{" "}
                    10:00 AM onwards
                  </p>
                  <p>
                    <span className="viaoda font-semibold text-yellow-500">
                      Venue :
                    </span>{" "}
                    B - Block, 2nd Floor Auditorium, St. Vincent Pallotti College of
                    Engineering and Technology, Gavsi Manapur, Nagpur
                  </p>
                </div>

                <p className="viaoda text-center text-sm sm:text-base md:text-lg leading-relaxed text-black">
                  Your presence will greatly enrich Sankalp Bharat 2K26.
                  <br></br>
                  We look forward to welcoming you.
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/30 bg-white/5 backdrop-blur-2xl shadow-[0_0_50px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] p-4 sm:p-6 md:p-10">
              <h4 className="viaoda mb-3 sm:mb-4 text-center text-base sm:text-lg md:text-xl font-semibold text-black">
                Sign Your Presence
              </h4>
              {/* Mobile & iPad (tablets): show signature canvas */}
              <div className="block xl:hidden">
                <SignatureCanvas
                  ref={sigRef}
                  className="h-48 sm:h-56 md:h-64 w-full rounded-md bg-[color:var(--secondary)]/80"
                  strokeColor="#ffffff"
                  strokeWidth={0.7}
                />
                <div className="viaoda mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <Button
                    onClick={handleDownload}
                    className="bg-green-600 text-white hover:opacity-90 transition text-xs sm:text-sm"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleClear}
                    className="bg-[#ae8625] text-white transition text-xs sm:text-sm"
                  >
                    Clear Signatures
                  </Button>
                </div>
              </div>
              {/* Desktop: keep signature canvas */}
              <div className="hidden xl:block">
                <SignatureCanvas
                  ref={sigRef}
                  className="h-48 sm:h-56 md:h-64 w-full rounded-md bg-[color:var(--secondary)]/30"
                  strokeColor="#ffffff"
                  strokeWidth={0.7}
                />
                <div className="viaoda mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <Button
                    onClick={handleDownload}
                    className="bg-green-600 text-white hover:opacity-90 transition text-xs sm:text-sm"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleClear}
                    className="bg-[#ae8625] text-white transition text-xs sm:text-sm"
                  >
                    Clear Signature
                  </Button>
                </div>
              </div>
            </section>

            <footer className="viaoda text-center text-sm sm:text-base text-black">
              Crafted for Sankalp Bharat 2K26 — Innovating Solutions for a
              Viksit Bharat<br></br>© Sankalp Bharat 2k26. Made by team - Nikita
              & Swadhin.
            </footer>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ship-arrival-animation {
          0% {
            transform: translate3d(-140vw, -100vh, 0) scale(0.6) rotate(-30deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .ship-arrival-animation {
          animation: ship-arrival-animation 5s cubic-bezier(0.22, 0.61, 0.36, 1)
            forwards;
          will-change: transform;
        }
      `}</style>
    </main>
  );
}
