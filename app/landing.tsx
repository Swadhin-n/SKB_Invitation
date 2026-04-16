"use client"

import Image from "next/image"

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="public/images/invitebg_landscape.webp"
          alt="TNX Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-white">
        <div className="max-w-4xl text-center">
          {/* Logo/Title Section */}
          <div className="mb-8">
            <Image
              src="/images/Technex_26_name.webp"
              alt="Technex"
              width={400}
              height={100}
              className="mx-auto"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold md:text-6xl">
              Welcome to Sankalp Bharat 2k26!
            </h1>
            
            <p className="text-lg md:text-xl opacity-90">
              Join us for an incredible technical festival experience
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Get Your Invitation
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Logos Section */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
            <Image
              src="/images/SVPCET.webp"
              alt="SVPCET"
              width={200}
              height={200}
              className="opacity-90 hover:opacity-100 transition-opacity w-44 h-44 sm:w-52 sm:h-52"
            />
    
          </div>
        </div>
      </div>

      {/* Optional: Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />
    </div>
  )
}
