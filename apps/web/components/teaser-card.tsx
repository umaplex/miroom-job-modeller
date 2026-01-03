'use client'

import { useState } from 'react'

interface TeaserProps {
    pillarId: string
    orgName: string
    questionHook: string
    riskCopy: string
}

export function TeaserCard({ pillarId, orgName, questionHook, riskCopy }: TeaserProps) {
    return (
        <div className="relative overflow-hidden rounded-lg border border-indigo-500/30 bg-card/50 p-8">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                    High-Confidence Signal
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4">
                    "{questionHook}"
                </h3>

                <div className="p-4 bg-muted/80 border border-border rounded-lg mb-6 backdrop-blur-sm">
                    <p className="text-muted-foreground text-sm italic">
                        {riskCopy}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {/* Mock Blurred Content */}
                    <div className="space-y-2 opacity-30 select-none blur-[2px]">
                        <div className="h-4 bg-muted-foreground/30 rounded w-3/4"></div>
                        <div className="h-4 bg-muted-foreground/30 rounded w-full"></div>
                        <div className="h-4 bg-muted-foreground/30 rounded w-5/6"></div>
                    </div>

                    <div className="mt-4">
                        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            Unlock {pillarId.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} Intel
                        </button>
                        <p className="text-center text-[10px] text-muted-foreground mt-2 font-mono">
                            Included in Executive Plan ($49/mo)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
