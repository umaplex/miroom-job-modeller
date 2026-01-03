'use client'

import { LogEntry } from "@/hooks/use-org-realtime"
import { useEffect, useRef } from "react"

export function LiveFeed({ logs }: { logs: LogEntry[] }) {
    // We only show the last 5 logs to keep it clean, but arguably we could show more.
    // The design spec says vertical feed.

    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 h-full flex flex-col">
            <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Live Research Link
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-sm max-h-[300px]">
                {logs.length === 0 && (
                    <div className="text-zinc-600 italic text-xs">Waiting for uplink...</div>
                )}

                {logs.map((log) => (
                    <div key={log.id} className="animate-in slide-in-from-left-2 fade-in duration-300">
                        <span className="text-zinc-600 text-xs mr-2">
                            {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="text-zinc-300">
                            {/* Typewriter effect could go here, but pure css anim is safer for performance */}
                            <span className="text-indigo-400 font-bold mr-1">[{log.internal_code}]</span>
                            {log.display_text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
