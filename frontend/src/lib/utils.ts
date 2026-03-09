import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatLaunchDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTokenToUSD(raw: string): string {
  return formatUSD(Number(raw))
}

export function formatLargeNumber(value: number): string {
  const absNum = Math.abs(value)

  if (absNum >= 1e9) {
    return (value / 1e9).toFixed(2) + 'B'
  }
  if (absNum >= 1e6) {
    return (value / 1e6).toFixed(2) + 'M'
  }
  if (absNum >= 1e3) {
    return (value / 1e3).toFixed(2) + 'K'
  }
  return value.toFixed(2)
}

export function formatTokenAmount(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num) || num === 0) return '0'

  const absNum = Math.abs(num)

  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  }
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  }
  if (absNum >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  }
  if (absNum < 0.01 && absNum > 0) {
    return num.toExponential(2)
  }
  return num.toFixed(2)
}
