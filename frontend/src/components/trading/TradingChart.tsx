'use client'

import { useEffect, useRef } from 'react'
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  type ISeriesApi,
  type UTCTimestamp,
} from 'lightweight-charts'

import type { IChartBar } from '@/features/trading/types'

interface TradingChartProps {
  data: IChartBar[]
}

export function TradingChart({ data }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null)
  const candlestickRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  // Initialize chart
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { borderColor: '#27272a' },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    })

    chartRef.current = chart
    candlestickRef.current = candlestickSeries
    volumeRef.current = volumeSeries

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width })
      }
    })
    observer.observe(container)
    observerRef.current = observer

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      candlestickRef.current = null
      volumeRef.current = null
      observerRef.current = null
    }
  }, [])

  // Update data
  useEffect(() => {
    if (!candlestickRef.current || !volumeRef.current || !chartRef.current) return
    if (data.length === 0) return

    const candlestickData = data.map((bar) => ({
      time: bar.time as UTCTimestamp,
      open: Number(bar.open),
      high: Number(bar.high),
      low: Number(bar.low),
      close: Number(bar.close),
    }))

    const volumeData = data.map((bar) => ({
      time: bar.time as UTCTimestamp,
      value: Number(bar.volume),
      color:
        Number(bar.close) >= Number(bar.open) ? '#22c55e80' : '#ef444480',
    }))

    candlestickRef.current.setData(candlestickData)
    volumeRef.current.setData(volumeData)
    chartRef.current.timeScale().fitContent()
  }, [data])

  return <div ref={containerRef} className="h-[400px] w-full" />
}
