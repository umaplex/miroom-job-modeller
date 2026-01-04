'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'

export function ResearchProgress() {
    const params = useParams()
    const [statuses, setStatuses] = useState<any[]>([])
    const [isResearching, setIsResearching] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!params.id) return

        // Initial Fetch
        checkStatus()

        // Polling (MVP Simple) - Every 2 seconds checks if work is happening
        const interval = setInterval(() => {
            checkStatus()
        }, 3000)

        return () => clearInterval(interval)
    }, [params.id])

    const checkStatus = async () => {
        const { data } = await supabase
            .from('org_pillar_status')
            .select('*')
            .eq('org_id', params.id)

        if (data) {
            setStatuses(data)
            const active = data.some(s => ['SEARCHING', 'SYNTHESIZING', 'PENDING'].includes(s.status))
            setIsResearching(active)
        }
    }

    if (!isResearching) return null

    // Determine "Current Action"
    const processingPillars = statuses.filter(s => ['SEARCHING', 'SYNTHESIZING'].includes(s.status))
    const currentAction = processingPillars.length > 0
        ? `Researching: ${processingPillars.map(p => p.pillar_id.replace('_', ' ').toUpperCase()).join(', ')}`
        : "Initializing Research OS..."

    return (
        <div className="bg-indigo-50 border-b border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest animate-pulse">
                        {currentAction}
                    </span>
                </div>
                <div className="text-[10px] text-indigo-500 font-mono">
                    <span className="hidden sm:inline">Gathering intelligence from 20+ sources...</span>
                </div>
            </div>
        </div>
    )
}
