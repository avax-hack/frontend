'use client'

import { useCallback, useRef, useState } from 'react'
import { UploadIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg']

interface LogoUploadProps {
  value: File | null
  preview: string | null
  onChange: (file: File | null) => void
  externalError?: string | null
}

export function LogoUpload({ value, preview, onChange, externalError }: LogoUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only PNG and JPG files are accepted'
    }
    if (file.size > MAX_SIZE_BYTES) {
      return 'File size must be 5MB or less'
    }
    return null
  }, [])

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file)
      if (err) {
        setError(err)
        return
      }
      setError(null)
      onChange(file)
    },
    [validate, onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset input so the same file can be re-selected
      e.target.value = ''
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    setError(null)
    onChange(null)
  }, [onChange])

  if (value && preview) {
    return (
      <div className="flex flex-col gap-2">
        <div className="relative inline-block h-24 w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Project logo preview"
            className="h-24 w-24 rounded-lg border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            className="absolute -top-2 -right-2"
            onClick={handleRemove}
            aria-label="Remove logo"
          >
            <XIcon className="size-3" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{value.name}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        aria-label="Upload project logo"
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          isDragOver
            ? 'border-red-500 bg-red-500/10'
            : 'border-white/20 hover:border-white/40',
          (error || externalError) && 'border-destructive'
        )}
      >
        <UploadIcon className="size-6 text-white/40" aria-hidden="true" />
        <p className="text-sm text-white/50">
          Drag & drop or click to upload
        </p>
        <p className="text-xs text-white/30">PNG or JPG, max 5MB</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload project logo"
        tabIndex={-1}
      />
      {(error || externalError) && (
        <p className="text-sm text-destructive" role="alert">
          {error || externalError}
        </p>
      )}
    </div>
  )
}
