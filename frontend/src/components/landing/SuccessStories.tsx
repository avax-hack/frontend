const stories = [
  {
    name: 'AvalancheSwap',
    description:
      'A next-generation DEX on Avalanche C-Chain featuring concentrated liquidity, limit orders, and cross-chain routing for optimal trading experience.',
    committed: '$12.5M',
    athReturn: '342%',
  },
  {
    name: 'SnowBridge',
    description:
      'Trustless bridge protocol connecting Avalanche to Ethereum and major L2s with milestone-verified security audits and progressive fund release.',
    committed: '$8.2M',
    athReturn: '215%',
  },
]

export function SuccessStories() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:px-6 lg:py-20">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Success Stories
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Proven by Results
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Projects that launched on OpenLaunch, hit every milestone, and delivered real value.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <div
              key={story.name}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* Banner placeholder */}
              <div className="flex h-[200px] items-center justify-center bg-muted">
                <span className="text-sm text-muted-foreground">Banner</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {story.name[0]}
                  </div>
                  <h3 className="text-lg font-semibold">{story.name}</h3>
                </div>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {story.description}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Total Committed</span>
                    <span className="text-lg font-bold">{story.committed}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">ATH Return</span>
                    <span className="text-lg font-bold text-emerald-500">
                      +{story.athReturn}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
