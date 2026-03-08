import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function BottomCTA() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center lg:py-20">
      <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Ready to Build or Invest?
      </h2>
      <p className="max-w-xl text-muted-foreground">
        Join the milestone-based launchpad that puts transparency first.
        Launch your project or explore opportunities today.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
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
