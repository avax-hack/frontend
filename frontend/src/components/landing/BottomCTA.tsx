import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function BottomCTA() {
  return (
    <section className="relative overflow-hidden">
      {/* Red radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.08)_0%,_transparent_70%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center lg:py-28">
        <span className="text-sm font-semibold uppercase tracking-widest text-red-500">
          Get Started
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
          Ready to Build or Invest?
        </h2>
        <p className="max-w-xl text-white/60">
          Join the milestone-based launchpad that puts transparency first.
          Launch your project or explore opportunities today.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="bg-red-600 text-white hover:bg-red-700">
            <Link href="/explore">Explore Projects</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            <Link href="/launch">Launch Project</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
