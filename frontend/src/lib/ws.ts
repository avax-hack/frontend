import { IS_MOCK } from './mock'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8001/ws'

type MessageHandler = (data: unknown) => void

interface Subscription {
  method: string
  params: Record<string, unknown>
  handler: MessageHandler
}

let idCounter = 0
function nextId() {
  return ++idCounter
}

export class WebSocketClient {
  private ws: WebSocket | null = null
  private subs = new Map<string, Subscription>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectDelay = 1000
  private disposed = false

  connect() {
    if (IS_MOCK || this.ws) return

    this.disposed = false
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      this.reconnectDelay = 1000
      this.resubscribeAll()
    }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data as string)
        // JSON-RPC notification: { method, params }
        if (msg.method && msg.params) {
          const result = msg.params.result
          if (result?.type === 'SUBSCRIPTION_ERROR') {
            const channel = msg.params.subscription
            console.warn('[ws] subscription error:', channel, result)
            return
          }
          for (const sub of this.subs.values()) {
            if (sub.method === msg.method) {
              sub.handler(result)
            }
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    ws.onclose = () => {
      this.ws = null
      this.scheduleReconnect()
    }

    ws.onerror = () => {
      ws.close()
    }

    this.ws = ws
  }

  disconnect() {
    this.disposed = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
  }

  subscribe(
    method: string,
    params: Record<string, unknown>,
    handler: MessageHandler,
  ): string {
    const key = `${method}:${JSON.stringify(params)}`
    this.subs.set(key, { method, params, handler })
    this.sendSubscribe(method, params)
    return key
  }

  unsubscribe(key: string) {
    const sub = this.subs.get(key)
    if (sub) {
      const unsubMethod = sub.method.replace('_subscribe', '_unsubscribe')
      this.sendSubscribe(unsubMethod, sub.params)
      this.subs.delete(key)
    }
  }

  private sendSubscribe(method: string, params: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({ jsonrpc: '2.0', id: nextId(), method, params }),
      )
    }
  }

  private resubscribeAll() {
    for (const sub of this.subs.values()) {
      this.sendSubscribe(sub.method, sub.params)
    }
  }

  private scheduleReconnect() {
    if (this.disposed) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, this.reconnectDelay)
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000)
  }
}

// Singleton
let instance: WebSocketClient | null = null

export function getWsClient(): WebSocketClient {
  if (!instance) {
    instance = new WebSocketClient()
  }
  return instance
}
