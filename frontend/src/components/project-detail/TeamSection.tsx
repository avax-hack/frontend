import { GlobeIcon, MessageCircleIcon, GithubIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { IProjectData } from '@/types/project'

interface TeamSectionProps {
  project: IProjectData
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const LINK_CONFIG = [
  { key: 'website' as const, icon: GlobeIcon, label: 'Website' },
  { key: 'twitter' as const, icon: XIcon, label: 'X / Twitter' },
  { key: 'telegram' as const, icon: MessageCircleIcon, label: 'Telegram' },
  { key: 'github' as const, icon: GithubIcon, label: 'GitHub' },
]

export function TeamSection({ project }: TeamSectionProps) {
  const { project_info } = project
  const socialLinks = LINK_CONFIG.flatMap(({ key, icon, label }) => {
    const url = project_info[key]
    return typeof url === 'string' && url ? [{ url, icon, label }] : []
  })

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Team</h2>

      {project_info.creator.bio && (
        <p className="text-sm leading-[1.2] text-muted-foreground">
          {project_info.creator.bio}
        </p>
      )}

      {socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link) => (
            <Button
              key={link.label}
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <link.icon className="size-4" aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            </Button>
          ))}
        </div>
      )}
    </section>
  )
}
