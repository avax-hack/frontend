import Link from 'next/link'
import { ShieldCheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-6 pt-[80px] pb-[60px] lg:pt-[120px] lg:pb-[80px] text-center px-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
        <ShieldCheckIcon className="h-4 w-4" />
        Milestone-Based Launchpad on Avalanche
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
        EASY TO LAUNCH.{' '}
        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          HARD TO RUG.
        </span>
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground">
        Funds are released milestone-by-milestone, verified by smart contracts.
        Investors stay protected. Builders stay accountable.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button asChild size="lg">
          <Link href="/explore">Explore Projects</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/launch">Launch Project</Link>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground/70">
        Built on Avalanche C-Chain · Smart-contract enforced · No middleman
      </p>
    </section>
  )
}
