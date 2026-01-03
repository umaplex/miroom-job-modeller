'use client'

import { useEffect, useState, useRef } from 'react'

interface SimulatedLogProps {
    url: string | null
    onComplete: () => void
}

const SCRIPT = [
    { step: 'DNS', text: "Resolving target domain...", delay: 400 },
    { step: 'CONN', text: "Handshake established (4ms).", delay: 800 },
    { step: 'SCAN', text: "Crawling public sitemap...", delay: 1200 },
    { step: 'FOUND', text: "Series B Funding Record detected.", delay: 1800, highlight: true },
    { step: 'FOUND', text: "Identify Key Stakeholders (CTO, VP Eng).", delay: 2400 },
    { step: 'LOCK', text: "5 Strategic Pillars identified.", delay: 3000, highlight: true },
    { step: 'READY', text: "Dossier encrypted and ready for view.", delay: 3500 },
]

export function SimulatedLog({ url, onComplete }: SimulatedLogProps) {
    const [logs, setLogs] = useState<{ step: string; text: string; highlight?: boolean }[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!url) {
            setLogs([])
            return
        }

        setLogs([])
        let timeouts: NodeJS.Timeout[] = []

        SCRIPT.forEach((entry) => {
            const t = setTimeout(() => {
                setLogs((prev) => [...prev, {
                    step: entry.step,
                    text: entry.text.replace('target domain', url.replace(/^https?:\/\//, '')),
                    highlight: entry.highlight
                }])

                if (entry.step === 'READY') {
                    setTimeout(onComplete, 500)
                }
            }, entry.delay)
            timeouts.push(t)
        })

        return () => timeouts.forEach(clearTimeout)
    }, [url, onComplete])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    if (!url) return null

    return (
        <div className="w-full max-w-2xl mt-8">
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 font-mono text-sm shadow-2xl overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 border-b border-[#27272a] pb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                    <span className="text-zinc-500 text-xs tracking-widest uppercase">Live Uplink // {url}</span>
                </div>

                {/* Scanlines Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                {/* Content */}
                <div className="space-y-2 h-48 overflow-y-auto scrollbar-hide">
                    {logs.map((log, i) => (
                        <div key={i} className={`flex gap-3 ${log.highlight ? 'text-indigo-400 font-bold' : 'text-zinc-400'}`}>
                            <span className="min-w-[50px] text-zinc-600">[{log.step}]</span>
                            <span className="tracking-tight">{log.text}</span>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    )
}
