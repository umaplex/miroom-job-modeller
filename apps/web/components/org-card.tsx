import Link from 'next/link'

interface OrgCardProps {
    id: string
    name: string
    domain: string
    status: 'PREP_INITIALIZED' | 'RESEARCHING' | 'COMPLETED' | 'FAILED'
    freshness: string
    pillarsCompleted: number
}

export function OrgCard({ id, name, domain, status, freshness, pillarsCompleted }: OrgCardProps) {
    const isReady = status === 'COMPLETED'

    return (
        <Link href={`/org/${id}`} className="block group">
            <div className="min-w-[280px] h-full bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                {/* Status Indicator Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${isReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />

                <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full ${isReady ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {isReady ? 'READY' : 'PREP'}
                    </span>
                </div>

                <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors truncate">
                    {name}
                </h3>
                <p className="text-zinc-500 text-xs font-mono mb-6">{domain}</p>

                <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Context</span>
                        <span className="text-sm font-bold text-zinc-300">{pillarsCompleted}/5</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Updated</span>
                        <span className="text-xs text-zinc-400">{freshness}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
