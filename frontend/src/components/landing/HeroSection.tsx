import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-6 py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
        EASY TO LAUNCH.{' '}
        <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          HARD TO RUG.
        </span>
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Milestone-based launchpad on Avalanche. Protocol-level accountability.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/explore">Explore Projects</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/launch">Launch Project</Link>
        </Button>
      </div>
    </section>
  )
}
