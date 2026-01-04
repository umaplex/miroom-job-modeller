'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'

export function ResearchProgress() {
    const params = useParams()
    const [statuses, setStatuses] = useState<any[]>([])
    const [latestLog, setLatestLog] = useState<string>("")
    const [isResearching, setIsResearching] = useState(false)
    const [hasFailed, setHasFailed] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!params.id) return

        // Initial Fetch
        checkStatus()

        // Polling (MVP Simple) - Every 2 seconds checks if work is happening
        const interval = setInterval(() => {
            checkStatus()
        }, 2000)

        return () => clearInterval(interval)
    }, [params.id])

    const checkStatus = async () => {
        // 1. Check Pillar Status
        const { data } = await supabase
            .from('org_pillar_status')
            .select('*')
            .eq('org_id', params.id)

        if (data) {
            setStatuses(data)
            const active = data.some(s => ['SEARCHING', 'SYNTHESIZING', 'PENDING'].includes(s.status))
            const failed = data.some(s => s.status === 'FAILED')

            setIsResearching(active)
            setHasFailed(failed)

            // 2. If Active, fetch latest log for "Thinking" UI
            if (active) {
                const logRes = await supabase
                    .from('prep_logs')
                    .select('display_text')
                    .eq('org_id', params.id)
                    .order('created_at', { ascending: false })
                    .limit(1)

                if (logRes.data && logRes.data[0]) {
                    setLatestLog(logRes.data[0].display_text)
                }
            }
        }
    }

    if (hasFailed) return (
        <div className="bg-red-50 border-b border-red-100 dark:bg-red-950/30 dark:border-red-900/50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    <span className="text-xs font-mono font-bold text-red-700 dark:text-red-300 uppercase tracking-widest">
                        Research Failed
                    </span>
                </div>
                <div className="text-[10px] text-red-500 font-mono">
                    Check server logs for details.
                </div>
            </div>
        </div>
    )

    if (!isResearching) return null

    // Determine "Current Action"
    const processingPillars = statuses.filter(s => ['SEARCHING', 'SYNTHESIZING'].includes(s.status))
    const currentAction = processingPillars.length > 0
        ? `Researching: ${processingPillars.map(p => p.pillar_id.replace('_', ' ').toUpperCase()).join(', ')}`
        : "Initializing Research OS..."

    return (
        <div className="bg-indigo-50 border-b border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/50 transition-all duration-500">
            <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest animate-pulse">
                        {currentAction}
                    </span>
                </div>

                {/* Live Terminal Log */}
                <div className="text-[10px] font-mono text-indigo-600/70 truncate max-w-md flex items-center gap-2">
                    <span className="text-indigo-400">{">"}</span>
                    {latestLog || "Connecting to satellite..."}
                    <span className="animate-pulse">_</span>
                </div>
            </div>
        </div>
    )
}
