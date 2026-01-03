'use client'

import { GlobalNav } from '@/components/global-nav'
import { fetchOrg } from '@/lib/api'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useOrgRealtime } from '@/hooks/use-org-realtime'
import { LiveFeed } from '@/components/live-feed'
import Link from 'next/link'
import { TeaserCard } from '@/components/teaser-card'
import { UpgradeModal } from '@/components/upgrade-modal'

export default function OrgPage() {
    const params = useParams()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('econ_engine')
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    // Realtime Hooks
    const { logs, pillarStatuses } = useOrgRealtime(params.id as string)

    useEffect(() => {
        const load = async () => {
            if (params.id) {
                try {
                    const res = await fetchOrg(params.id as string)
                    setData(res)
                    // Default to first pillar if valid
                    if (res && res.pillars && res.pillars.length > 0) {
                        setActiveTab(res.pillars[0].pillar_id)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
            setLoading(false)
        }
        load()
    }, [params.id])

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-xs">LOADING DOSSIER...</div>
    if (!data) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground font-mono text-xs">ORGANIZATION NOT FOUND</div>

    const { org, pillars } = data

    // merge live status with initial status
    const getStatus = (pId: string) => {
        return pillarStatuses[pId] || pillars.find((p: any) => p.pillar_id === pId)?.status || 'PENDING'
    }

    const isWarRoomActive = pillars.some((p: any) => {
        const s = getStatus(p.pillar_id)
        return s === 'SEARCHING' || s === 'SYNTHESIZING' || s === 'PENDING'
    })

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <GlobalNav />

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-border bg-card/30 flex flex-col">
                    <div className="p-4 border-b border-border">
                        <Link href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                            ← Back to Command
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-border">
                                {org.display_name?.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <h1 className="font-bold text-foreground truncate">{org.display_name}</h1>
                                <div className="text-xs text-muted-foreground truncate">{org.domain}</div>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Foundation Group */}
                        <div>
                            <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">Foundation</h3>
                            <div className="space-y-1">
                                {['econ_engine', 'org_dna'].map(id => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between group ${activeTab === id ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                                    >
                                        <span>{id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                        {getStatus(id) === 'COMPLETED' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                        {(getStatus(id) === 'SEARCHING' || getStatus(id) === 'SYNTHESIZING') && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Intelligence Group */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Intelligence</h3>
                                <svg className="w-3 h-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <div className="space-y-1">
                                {['burning_platform', 'domain_lexicon', 'decision_making'].map(id => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center justify-between group ${activeTab === id ? 'bg-indigo-500/10 text-indigo-500 font-medium' : 'text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/5'}`}
                                    >
                                        <span>{id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                        {/* Lock Icon if not paid (Placeholder logic) */}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-border bg-muted/30">
                        <div className="text-xs text-muted-foreground flex justify-between mb-2">
                            <span>Credits</span>
                            <span className="text-foreground">5 / 10</span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-1/2"></div>
                        </div>
                    </div>
                </aside>

                {/* Main Stage */}
                <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 relative z-10">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-tight flex items-center gap-3">
                                {activeTab.replace('_', ' ')}
                                <span className={`text-xs px-2 py-1 rounded border ${getStatus(activeTab) === 'COMPLETED' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-amber-500/30 text-amber-400 bg-amber-500/10'}`}>
                                    {getStatus(activeTab)}
                                </span>
                            </h2>

                            {/* Render Content */}
                            {activeTab ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    {/* Check if Pillar is Intelligence (Mock Logic: burning_platform, etc are locked) */}
                                    {['burning_platform', 'domain_lexicon', 'decision_making'].includes(activeTab) ? (
                                        <TeaserCard
                                            pillarId={activeTab}
                                            orgName={org.display_name}
                                            questionHook={
                                                activeTab === 'burning_platform' ? "I found a critical strategic disagreement regarding their 2026 AI Roadmap." :
                                                    activeTab === 'decision_making' ? "Don't show slides. They are a 6-page memo culture." :
                                                        "Key lexicon shift: Stop saying 'User', start saying 'Partner'."
                                            }
                                            riskCopy="If you don't address this in your interview, you risk sounding like an outsider."
                                        />
                                    ) : (
                                        <div className="bg-card/50 border border-border rounded p-8 min-h-[400px]">
                                            {getStatus(activeTab) === 'COMPLETED' ? (
                                                <div>
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        Based on the analysis of <strong>{org.display_name}</strong>, here is the {activeTab.replace('_', ' ')} breakdown...
                                                    </p>

                                                    {/* Mock Data for Foundation */}
                                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-muted/50 rounded border border-border">
                                                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenue Model</div>
                                                            <div className="text-foreground font-bold">Consumption-based</div>
                                                        </div>
                                                        <div className="p-4 bg-muted/50 rounded border border-border">
                                                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Key Growth Lever</div>
                                                            <div className="text-foreground font-bold">Enterprise Expansion</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <p>Analysis in progress...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-zinc-500 italic">Select a pillar to view analysis.</div>
                            )}
                        </div>
                    </div>

                    {/* War Room Right Rail (Visible only during build or if toggle is on) */}
                    {isWarRoomActive && (
                        <div className="w-80 border-l border-border bg-card p-4 border-t md:border-t-0 absolute md:relative bottom-0 right-0 h-[30%] md:h-full z-20 shadow-2xl md:shadow-none">
                            <LiveFeed logs={logs} />
                        </div>
                    )}
                </main>
            </div>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                orgName={org.display_name}
            />
        </div>
    )
}
