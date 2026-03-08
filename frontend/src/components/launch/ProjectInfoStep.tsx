'use client'

import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { LogoUpload } from './LogoUpload'
import { useTickerAvailability } from '@/features/launch/hooks'
import type { ProjectInfoValues } from '@/features/launch/schemas'

interface ProjectInfoStepProps {
  logoFile: File | null
  logoPreview: string | null
  logoError: string | null
  onLogoChange: (file: File | null) => void
}

export function ProjectInfoStep({
  logoFile,
  logoPreview,
  logoError,
  onLogoChange,
}: ProjectInfoStepProps) {
  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProjectInfoValues>()

  // Debounced ticker validation
  const tickerValue = watch('ticker')
  const [debouncedTicker, setDebouncedTicker] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTicker(tickerValue || '')
    }, 500)
    return () => clearTimeout(timer)
  }, [tickerValue])

  const { data: tickerCheck, isFetching: isCheckingTicker } =
    useTickerAvailability(debouncedTicker)

  useEffect(() => {
    if (tickerCheck && !tickerCheck.available) {
      setError('ticker', {
        type: 'validate',
        message: `Ticker "${debouncedTicker}" is already taken`,
      })
    } else if (tickerCheck?.available && errors.ticker?.type === 'validate') {
      clearErrors('ticker')
    }
  }, [tickerCheck, debouncedTicker, setError, clearErrors, errors.ticker?.type])

  return (
    <div className="flex flex-col gap-6">
      {/* Project Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Project Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="My Awesome Project…"
          maxLength={50}
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Ticker Symbol */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticker">
          Ticker Symbol <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="ticker"
            placeholder="TOKEN…"
            maxLength={10}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!errors.ticker}
            {...register('ticker', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase()
              },
            })}
          />
          {isCheckingTicker && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              Checking…
            </span>
          )}
          {tickerCheck?.available && debouncedTicker.length >= 2 && !isCheckingTicker && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-green-500">
              Available
            </span>
          )}
        </div>
        {errors.ticker && (
          <p className="text-sm text-destructive" role="alert">
            {errors.ticker.message}
          </p>
        )}
      </div>

      {/* Tagline */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tagline">
          Tagline <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tagline"
          placeholder="A short description of your project…"
          maxLength={120}
          autoComplete="off"
          aria-invalid={!!errors.tagline}
          {...register('tagline')}
        />
        {errors.tagline && (
          <p className="text-sm text-destructive" role="alert">
            {errors.tagline.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your project in detail (min 20 characters)…"
          rows={6}
          autoComplete="off"
          aria-invalid={!!errors.description}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="flex flex-col gap-2">
        <Label>Project Logo</Label>
        <LogoUpload
          value={logoFile}
          preview={logoPreview}
          onChange={onLogoChange}
          externalError={logoError}
        />
      </div>

      {/* Links */}
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-medium">Links (optional)</legend>

        <div className="flex flex-col gap-2">
          <Label htmlFor="websiteUrl">Website</Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://example.com…"
            autoComplete="url"
            aria-invalid={!!errors.websiteUrl}
            {...register('websiteUrl')}
          />
          {errors.websiteUrl && (
            <p className="text-sm text-destructive" role="alert">
              {errors.websiteUrl.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="twitterUrl">Twitter / X</Label>
          <Input
            id="twitterUrl"
            type="url"
            placeholder="https://x.com/yourproject…"
            autoComplete="off"
            aria-invalid={!!errors.twitterUrl}
            {...register('twitterUrl')}
          />
          {errors.twitterUrl && (
            <p className="text-sm text-destructive" role="alert">
              {errors.twitterUrl.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="telegramUrl">Telegram</Label>
          <Input
            id="telegramUrl"
            type="url"
            placeholder="https://t.me/yourproject…"
            autoComplete="off"
            aria-invalid={!!errors.telegramUrl}
            {...register('telegramUrl')}
          />
          {errors.telegramUrl && (
            <p className="text-sm text-destructive" role="alert">
              {errors.telegramUrl.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="githubUrl">GitHub</Label>
          <Input
            id="githubUrl"
            type="url"
            placeholder="https://github.com/yourproject…"
            autoComplete="off"
            aria-invalid={!!errors.githubUrl}
            {...register('githubUrl')}
          />
          {errors.githubUrl && (
            <p className="text-sm text-destructive" role="alert">
              {errors.githubUrl.message}
            </p>
          )}
        </div>
      </fieldset>

      {/* Target Raise */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="targetRaise">
          Target Raise (USD) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="targetRaise"
          type="number"
          inputMode="decimal"
          placeholder="100,000…"
          min={1_000}
          max={10_000_000}
          autoComplete="off"
          aria-invalid={!!errors.targetRaise}
          {...register('targetRaise', { valueAsNumber: true })}
        />
        {errors.targetRaise && (
          <p className="text-sm text-destructive" role="alert">
            {errors.targetRaise.message}
          </p>
        )}
      </div>

      {/* Token Supply */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tokenSupply">
          Token Supply <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tokenSupply"
          type="number"
          inputMode="decimal"
          placeholder="1,000,000…"
          min={1}
          autoComplete="off"
          aria-invalid={!!errors.tokenSupply}
          {...register('tokenSupply', { valueAsNumber: true })}
        />
        {errors.tokenSupply && (
          <p className="text-sm text-destructive" role="alert">
            {errors.tokenSupply.message}
          </p>
        )}
      </div>
    </div>
  )
}
