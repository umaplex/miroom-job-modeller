'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LogEntry {
    id: string
    message: string
    step_name: string
    created_at: string
}

export function ThinkingLog({ orgId }: { orgId: string | null }) {
    const [logs, setLogs] = useState<LogEntry[]>([])

    useEffect(() => {
        if (!orgId) return

        // 1. Fetch existing logs (Race Condition Fix)
        const fetchInitialLogs = async () => {
            const { data } = await supabase
                .from('prep_thinking_logs')
                .select('*')
                .eq('org_id', orgId)
                .order('created_at', { ascending: true })

            if (data) {
                setLogs(data as LogEntry[])
            }
        }
        fetchInitialLogs()

        // 2. Subscribe to NEW logs
        const channel = supabase
            .channel('realtime-logs')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'prep_thinking_logs',
                    filter: `org_id=eq.${orgId}`,
                },
                (payload) => {
                    setLogs((prev) => {
                        // Avoid duplicates if fetchInitialLogs caught it
                        if (prev.some(l => l.id === payload.new.id)) return prev
                        return [...prev, payload.new as LogEntry]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [orgId])

    if (!orgId) return null

    return (
        <div className="mt-8 w-full max-w-2xl bg-black border border-gray-800 rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-400">JOB MODEL INTEL ENGINE</span>
            </div>
            <div className="space-y-2">
                {logs.length === 0 && (
                    <div className="text-gray-600 animate-pulse">Waiting for neural uplink...</div>
                )}
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-4">
                        <span className="text-gray-500 min-w-[80px]">[{log.step_name}]</span>
                        <span className="typing-effect">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
