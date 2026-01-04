'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'

export function ResearchProgress() {
    const params = useParams()
    const [statuses, setStatuses] = useState<any[]>([])
    const [logs, setLogs] = useState<any[]>([])
    const [activePillars, setActivePillars] = useState<string[]>([])

    // UI State
    const [isOpen, setIsOpen] = useState(true) // Always open initially if researching
    const bottomRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!params.id) return

        // 1. Initial State Fetch
        refreshState()

        // 2. Poll for updates (every 2s)
        const interval = setInterval(refreshState, 2000)
        return () => clearInterval(interval)
    }, [params.id])

    // Auto-scroll to bottom of logs
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    const refreshState = async () => {
        // A. Fetch Pillar Status
        const statusRes = await supabase
            .from('org_pillar_status')
            .select('*')
            .eq('org_id', params.id)

        if (statusRes.data) {
            setStatuses(statusRes.data)

            // Check if ANY are active
            const active = statusRes.data
                .filter(s => ['PENDING', 'SEARCHING', 'SYNTHESIZING'].includes(s.status))
                .map(s => s.pillar_id)

            setActivePillars(active)

            // If all complete, we can stop or show "Complete"
            // But we keep the UI visible for review
        }

        // B. Fetch Logs (Recent 50)
        const logRes = await supabase
            .from('prep_logs')
            .select('*')
            .eq('org_id', params.id)
            .order('created_at', { ascending: true }) // Oldest first for terminal flow
            // Limit is tricky if we want "all since start", but let's grab last 100
            .limit(100)

        if (logRes.data) {
            setLogs(logRes.data)
        }
    }

    // Helper to get Color for log type
    const getLogColor = (code: string) => {
        if (code === 'ERROR') return 'text-red-400'
        if (code === 'Search') return 'text-amber-400'
        if (code === 'Scrape') return 'text-cyan-400'
        if (code === 'WORKER_START') return 'text-emerald-400'
        if (code === 'WORKER_DONE') return 'text-emerald-500 font-bold'
        return 'text-slate-400'
    }

    // Don't show anything if no work has ever started (empty statuses)
    if (statuses.length === 0) return null

    return (
        <div className="border-b border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-6 py-4">

                {/* 1. Header & Controls */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${activePillars.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            Research OS Kernel
                        </h2>

                        {/* Summary Chips */}
                        <div className="flex gap-2">
                            {statuses.map(s => (
                                <div key={s.id} className={`
                                   text-[10px] font-mono px-2 py-0.5 rounded border capitalize
                                   ${s.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}
                                   ${s.status === 'FAILED' ? 'bg-red-500/10 text-red-600 border-red-500/20' : ''}
                                   ${['SEARCHING', 'SYNTHESIZING'].includes(s.status) ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse' : ''}
                                   ${s.status === 'PENDING' ? 'bg-slate-100 text-slate-500 border-slate-200' : ''}
                               `}>
                                    {s.pillar_id.replace('_', ' ')}: {s.status.toLowerCase()}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline decoration-dotted"
                    >
                        {isOpen ? 'Minimize Terminal' : 'Show Logs'}
                    </button>
                </div>

                {/* 2. Neural Terminal Feed */}
                {isOpen && (
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-xs shadow-inner">
                        <div className="h-[200px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                            {logs.length === 0 && (
                                <div className="text-zinc-500 italic">Waiting for satellite uplink...</div>
                            )}
                            {logs.map((log) => (
                                <div key={log.id} className="flex gap-3 font-mono leading-relaxed group">
                                    <span className="text-zinc-600 shrink-0 select-none">
                                        {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span className={`shrink-0 w-[100px] text-right ${getLogColor(log.internal_code)}`}>
                                        [{log.internal_code}]
                                    </span>
                                    <span className="text-zinc-300 group-hover:text-white transition-colors">
                                        {log.display_text}
                                    </span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        {/* Active Cursor Line */}
                        {activePillars.length > 0 && (
                            <div className="mt-2 flex items-center gap-2 text-emerald-500/50 animate-pulse border-t border-zinc-900 pt-2">
                                <span className="text-[10px]">{">"}</span>
                                <span className="h-3 w-1.5 bg-emerald-500/50 block" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
