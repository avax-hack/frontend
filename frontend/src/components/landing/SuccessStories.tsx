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
    <section>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:px-6 lg:py-20">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Success Stories
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Proven by Results
          </h2>
          <p className="mx-auto max-w-2xl text-white/60">
            Projects that launched on OpenLaunch, hit every milestone, and delivered real value.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <div
              key={story.name}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg hover:shadow-red-500/10"
            >
              {/* Banner */}
              <div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <span className="text-sm text-white/40">Banner</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-sm font-bold text-red-500">
                    {story.name[0]}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                </div>

                <p className="line-clamp-3 text-sm text-gray-500">
                  {story.description}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">Total Committed</span>
                    <span className="text-lg font-bold text-gray-900">{story.committed}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">ATH Return</span>
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
