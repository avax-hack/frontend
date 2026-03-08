'use client'

import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
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
    setValue,
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

  // Compute minimum deadline (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDeadline = tomorrow.toISOString().split('T')[0]

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

      {/* Category */}
      <div className="flex flex-col gap-2">
        <Label>
          Category <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {(['defi', 'infra', 'ai', 'gaming', 'social', 'meme', 'other'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={cn(
                'rounded-full border px-3 py-1.5 text-sm capitalize transition-colors',
                watch('category') === cat
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-accent',
              )}
              onClick={() => setValue('category', cat, { shouldValidate: true })}
            >
              {cat === 'ai' ? 'AI' : cat === 'defi' ? 'DeFi' : cat === 'other' ? 'Other' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="text-sm text-destructive" role="alert">
            {errors.category.message}
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

      {/* IDO Token Amount */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="idoTokenAmount">
          IDO Token Amount <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Number of tokens to sell in the IDO
        </p>
        <Input
          id="idoTokenAmount"
          type="number"
          inputMode="decimal"
          placeholder="1,000,000…"
          min={1}
          autoComplete="off"
          aria-invalid={!!errors.idoTokenAmount}
          {...register('idoTokenAmount', { valueAsNumber: true })}
        />
        {errors.idoTokenAmount && (
          <p className="text-sm text-destructive" role="alert">
            {errors.idoTokenAmount.message}
          </p>
        )}
      </div>

      {/* Token Price (USDC) */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="tokenPrice">
          Token Price (USDC) <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Price per token in USDC (e.g. 0.05 = $0.05)
        </p>
        <Input
          id="tokenPrice"
          type="number"
          inputMode="decimal"
          placeholder="0.05…"
          min={0.000001}
          step="any"
          autoComplete="off"
          aria-invalid={!!errors.tokenPrice}
          {...register('tokenPrice', { valueAsNumber: true })}
        />
        {errors.tokenPrice && (
          <p className="text-sm text-destructive" role="alert">
            {errors.tokenPrice.message}
          </p>
        )}
      </div>

      {/* Deadline */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="deadline">
          IDO Deadline <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          The date the IDO ends
        </p>
        <Input
          id="deadline"
          type="date"
          min={minDeadline}
          autoComplete="off"
          aria-invalid={!!errors.deadline}
          {...register('deadline')}
        />
        {errors.deadline && (
          <p className="text-sm text-destructive" role="alert">
            {errors.deadline.message}
          </p>
        )}
      </div>
    </div>
  )
}
