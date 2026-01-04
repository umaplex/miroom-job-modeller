'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { GlobalNav } from '@/components/global-nav'
import { OrgCard } from '@/components/org-card'
import { fetchRecents } from '@/lib/api'

// Mock Data for "Pulse" (until we have an endpoint for it)
// Mock Data for "Pulse" (until we have an endpoint for it)
const PULSE_METRICS = [
    { label: 'Global Intelligence', value: '1,240', change: '+12' },
    { label: 'Fresh Intel (24h)', value: '14', change: '24h' },
    { label: 'You are watching', value: '0', change: '' },
]

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const [recents, setRecents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const init = async () => {
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()

            if (data.user) {
                setUser(data.user)
                try {
                    // Fetch Recents from Fast API
                    const recentOrgs = await fetchRecents(data.user.id)
                    setRecents(recentOrgs)

                    // Update "My Targets" metric locally just for show
                    if (recentOrgs) PULSE_METRICS[2].value = recentOrgs.length.toString()
                } catch (e) {
                    console.log("API not ready yet, showing empty")
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }
        init()
    }, [])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-zinc-500 font-mono text-xs">INITIALIZING COMMAND CENTER...</div>

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <GlobalNav />

            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-12">

                {/* 1. System Pulse */}
                <section>
                    <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest mb-6 px-1">System Pulse</h2>
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                        {PULSE_METRICS.map((m) => (
                            <div key={m.label} className="bg-card border border-border p-6 rounded-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
                                </div>
                                <div className="text-3xl md:text-5xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{m.value}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-muted-foreground uppercase">{m.label}</span>
                                    {m.change && <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">{m.change}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Recents Rail */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest">Recent Activity</h2>
                        {recents.length > 0 && <span className="text-[10px] text-zinc-600 font-mono">SCROLL →</span>}
                    </div>

                    {recents.length === 0 ? (
                        <div className="border border-dashed border-border rounded-lg p-12 text-center">
                            <h3 className="text-muted-foreground font-bold mb-2">No Active Intelligence</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">You haven't modeled any organizations yet. Use the search bar above to create your first dossier.</p>
                            <div className="inline-block bg-muted border border-border px-4 py-2 rounded text-xs font-mono text-muted-foreground">
                                TRY "STRIPE.COM" OR "AIRBNB"
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                            {recents.map((item) => (
                                <div key={item.org_id} className="snap-start h-full">
                                    <OrgCard
                                        id={item.org_id}
                                        name={item.organizations.display_name || item.organizations.domain}
                                        domain={item.organizations.domain}
                                        status={item.organizations.status}
                                        freshness="Just now"
                                        pillarsCompleted={item.organizations.status === 'COMPLETED' ? 5 : 1}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 3. Library (Preview) */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className="text-sm font-mono font-bold text-muted-foreground uppercase tracking-widest">My Watchlist</h2>
                        <button className="text-base text-primary hover:text-foreground transition-colors font-medium">View All</button>
                    </div>
                    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
                                <tr>
                                    <th className="px-8 py-5 font-semibold tracking-wider">Organization</th>
                                    <th className="px-8 py-5 font-semibold tracking-wider">Status</th>
                                    <th className="px-8 py-5 font-semibold tracking-wider text-right">Dossier Completion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {recents.map((item) => (
                                    <tr key={item.org_id} className="hover:bg-muted/50 transition-colors group cursor-pointer">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-0.5">{item.organizations.display_name}</div>
                                            <div className="text-sm text-muted-foreground font-mono">{item.organizations.domain}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold bg-muted text-muted-foreground px-3 py-1.5 rounded-full border border-border">{item.organizations.status}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: '20%' }}></div>
                                                </div>
                                                <span className="text-sm font-mono text-muted-foreground font-bold">20%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {recents.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-12 text-center text-muted-foreground italic text-base">
                                            Your watchlist is empty.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}
