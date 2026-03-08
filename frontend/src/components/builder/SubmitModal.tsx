'use client'

import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UploadIcon, XIcon } from 'lucide-react'
import { useSubmitMilestone } from '@/features/builder/hooks'
import type { IMilestoneInfo } from '@/types/milestone'

interface SubmitModalProps {
  milestone: IMilestoneInfo | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = ['application/pdf', 'application/zip', 'application/x-zip-compressed']

export function SubmitModal({ milestone, open, onOpenChange }: SubmitModalProps) {
  const [evidenceText, setEvidenceText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: submitMilestone, isPending } = useSubmitMilestone()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFileError(null)

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFileError('Only PDF and ZIP files are accepted')
      return
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFileError('File must be under 10MB')
      return
    }

    setFile(selected)
  }

  function handleSubmit() {
    if (!milestone || !evidenceText.trim()) return

    submitMilestone(
      {
        milestoneId: milestone.milestone_id,
        evidenceText: evidenceText.trim(),
        file: file ?? undefined,
      },
      {
        onSuccess: () => {
          setEvidenceText('')
          setFile(null)
          setFileError(null)
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Milestone for Verification</DialogTitle>
          <DialogDescription>
            {milestone
              ? `Milestone ${milestone.order}: ${milestone.title}`
              : 'Submit evidence for verification'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="evidence-text">Evidence Description</Label>
            <Textarea
              id="evidence-text"
              placeholder="Describe the evidence for milestone completion..."
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              rows={4}
              spellCheck={false}
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Evidence File (optional)</Label>
            {file ? (
              <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                <span className="text-sm truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove file"
                  disabled={isPending}
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-sm text-muted-foreground hover:border-primary/50"
                disabled={isPending}
              >
                <UploadIcon className="size-4" aria-hidden="true" />
                Upload PDF or ZIP (max 10MB)
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.zip"
              className="hidden"
              onChange={handleFileChange}
            />
            {fileError && (
              <p className="text-xs text-red-400">{fileError}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!evidenceText.trim() || isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? 'Submitting...' : 'Submit to UMA Oracle'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
