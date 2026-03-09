import { ShieldCheckIcon, ScanEyeIcon, WalletIcon, CircleCheckIcon } from 'lucide-react'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Milestone Escrow',
    checks: [
      'Funds locked in smart contract',
      'Released only on milestone completion',
      'No single party controls funds',
      'Fully auditable on-chain',
    ],
  },
  {
    icon: ScanEyeIcon,
    title: 'UMA Oracle Verification',
    checks: [
      'Milestone completion verified by UMA oracle',
      'Decentralized and trustless validation',
      'No centralized authority needed',
      'Dispute resolution built-in',
    ],
  },
  {
    icon: WalletIcon,
    title: 'Refund Protection',
    checks: [
      'Automatic refund on failed milestones',
      'No rug-pull risk by design',
      'Investor funds always recoverable',
      'Smart-contract enforced guarantees',
    ],
  },
]

export function WhyOpenLaunch() {
  return (
    <section>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:px-6 lg:py-20">
        <div className="flex flex-col gap-3 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-red-500">
            Trust Layer
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Built for Trust
          </h2>
          <p className="mx-auto max-w-2xl text-white/60">
            Every feature is designed to eliminate rug-pulls and protect your investment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 rounded-xl border border-transparent bg-white p-6 shadow-md transition-all hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                  <feature.icon className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {feature.checks.map((check) => (
                  <li key={check} className="flex items-start gap-2 text-sm text-gray-600">
                    <CircleCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
