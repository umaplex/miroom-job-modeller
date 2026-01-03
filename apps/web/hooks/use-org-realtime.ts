'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export type LogEntry = {
    id: string
    internal_code: string
    display_text: string
    created_at: string
}

export type PillarStatus = {
    pillar_id: string
    status: 'PENDING' | 'SEARCHING' | 'SYNTHESIZING' | 'COMPLETED' | 'FAILED'
}

export function useOrgRealtime(orgId: string) {
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [pillarStatuses, setPillarStatuses] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!orgId) return

        const supabase = createClient()

        // Channel for Org Updates
        const channel = supabase.channel(`org-${orgId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'prep_logs',
                    filter: `org_id=eq.${orgId}`
                },
                (payload) => {
                    setLogs((prev) => [payload.new as LogEntry, ...prev])
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'org_pillar_status',
                    filter: `org_id=eq.${orgId}`
                },
                (payload) => {
                    const newStatus = payload.new as PillarStatus
                    setPillarStatuses((prev) => ({
                        ...prev,
                        [newStatus.pillar_id]: newStatus.status
                    }))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orgId])

    return { logs, pillarStatuses }
}
