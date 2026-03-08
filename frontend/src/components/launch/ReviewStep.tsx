'use client'

import { useState } from 'react'
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeIcon,
  GithubIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatUSD, formatNumber } from '@/lib/utils'
import type { ProjectInfoValues, MilestoneValues } from '@/features/launch/schemas'

interface ReviewStepProps {
  projectInfo: ProjectInfoValues
  milestones: MilestoneValues[]
  logoFile: File | null
  logoPreview: string | null
}

const DESCRIPTION_TRUNCATE_LENGTH = 300

export function ReviewStep({
  projectInfo,
  milestones,
  logoFile,
  logoPreview,
}: ReviewStepProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const descTruncated =
    projectInfo.description.length > DESCRIPTION_TRUNCATE_LENGTH
  const displayDescription =
    isDescExpanded || !descTruncated
      ? projectInfo.description
      : projectInfo.description.slice(0, DESCRIPTION_TRUNCATE_LENGTH) + '…'

  const warnings: string[] = []
  if (!logoFile) warnings.push('Logo not uploaded')
  if (!projectInfo.websiteUrl) warnings.push('No website URL provided')
  if (!projectInfo.twitterUrl) warnings.push('No Twitter/X URL provided')

  const links = [
    { label: 'Website', url: projectInfo.websiteUrl, icon: GlobeIcon },
    { label: 'Twitter/X', url: projectInfo.twitterUrl, icon: GlobeIcon },
    { label: 'Telegram', url: projectInfo.telegramUrl, icon: GlobeIcon },
    { label: 'GitHub', url: projectInfo.githubUrl, icon: GithubIcon },
  ].filter((l) => l.url)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Review & Launch</h2>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/4">
          <CardContent className="flex flex-col gap-2 pt-4">
            {warnings.map((w) => (
              <div key={w} className="flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangleIcon className="size-4 shrink-0" aria-hidden="true" />
                {w}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Project Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Project Info</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Project logo"
                className="h-16 w-16 shrink-0 rounded-lg border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-muted text-xs text-muted-foreground">
                No Logo
              </div>
            )}
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold truncate">
                  {projectInfo.name}
                </h3>
                <Badge variant="secondary">${projectInfo.ticker}</Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {projectInfo.tagline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Target Raise</p>
              <p className="text-sm font-medium">
                {formatUSD(projectInfo.targetRaise)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Token Supply</p>
              <p className="text-sm font-medium">
                {formatNumber(projectInfo.tokenSupply, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="whitespace-pre-wrap text-sm leading-[1.2]">
            {displayDescription}
          </p>
          {descTruncated && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="gap-1 self-start"
            >
              {isDescExpanded ? (
                <>
                  Show less <ChevronUpIcon className="size-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Show more <ChevronDownIcon className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones ({milestones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {milestones.map((m, i) => (
              <div
                key={m.title || `milestone-${i}`}
                className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {m.description}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {m.allocation}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      {links.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <div key={link.label} className="flex items-center gap-2 text-sm">
                  <link.icon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="text-muted-foreground">{link.label}:</span>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-primary hover:underline">{link.url}</a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
