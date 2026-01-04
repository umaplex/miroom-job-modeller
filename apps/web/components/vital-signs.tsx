'use client'

interface VitalSignsProps {
    content: {
        summary: string
        metrics: {
            headcount_velocity: string
            talent_density: string
            openings_distribution?: string
            leadership_stability: string
        }
    }
}

export function VitalSigns({ content }: VitalSignsProps) {
    if (!content || !content.metrics) return null

    const metrics = [
        {
            label: 'Headcount Velocity', value: content.metrics.headcount_velocity, icon: (
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" /><line x1="20" y1="8" x2="20" y2="14" /></svg>
            )
        },
        {
            label: 'Talent Density', value: content.metrics.talent_density, icon: (
                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>
            )
        },
        {
            label: 'Leadership Stability', value: content.metrics.leadership_stability, icon: (
                <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            )
        },
        {
            label: 'Openings Skew', value: content.metrics.openings_distribution || 'Engineering Heavy', icon: (
                <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
            )
        }
    ]

    return (
        <div className="space-y-6">
            <div className="bg-card/50 border border-border rounded-lg p-6">
                <h3 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4">Objective Reality</h3>
                <p className="text-lg text-foreground leading-relaxed">
                    {content.summary}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-card border border-border p-5 rounded-lg flex items-start gap-4 hover:border-primary/30 transition-colors">
                        <div className="p-2 bg-muted rounded-md shrink-0">
                            {m.icon}
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-mono">{m.label}</div>
                            <div className="text-base font-bold text-foreground">{m.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
