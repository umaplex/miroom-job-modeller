'use client'

import { fetchOrg, fetchStructuredDossier } from '@/lib/api'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TeaserCard } from '@/components/teaser-card'
import { UpgradeModal } from '@/components/upgrade-modal'
import { StructuredView } from '@/components/structured-view'
import { VitalSigns } from '@/components/vital-signs'
import { ResearchProgress } from '@/components/research-progress'

export default function OrgPage() {
    const params = useParams()
    const [org, setOrg] = useState<any>(null)
    const [pillars, setPillars] = useState<any[]>([])
    const [dossier, setDossier] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('general')
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)

    useEffect(() => {
        if (params.id) {
            // 1. Fetch Org & Basic Pillar Status
            fetchOrg(params.id as string).then(res => {
                if (res) {
                    setOrg(res.org)
                    setPillars(res.pillars || [])
                    // Default to GENERAL if available
                    if (res.pillars) {
                        const hasGeneral = res.pillars.find((p: any) => p.pillar_id === 'general')
                        setActiveTab(hasGeneral ? 'general' : res.pillars[0]?.pillar_id || 'general')
                    }
                }
            })

            // 2. Fetch Structured Dossier (Full Tree)
            fetchStructuredDossier(params.id as string).then(res => {
                if (res) setDossier(res)
            })
        }
    }, [params.id])

    // Safe accessors for header
    const displayName = org?.display_name || "Loading Entity..."
    const domain = org?.domain || "..."
    const companySize = org?.company_size?.replace(/_/g, ' ')
    const industry = org?.industry?.replace(/_/g, ' ')

    const activePillar = pillars.find(p => p.pillar_id === activeTab)
    // TEMP: Force unlock for testing per user request
    const isLocked = false // activePillar?.status === 'LOCKED'

    // Helper: Teaser Content Map (could be from DB later)
    const TEASERS: any = {
        'burning_platform': {
            question: "What is the single biggest threat to their Q4 goals?",
            risk: "Missing this means proposing a 'nice-to-have' solution instead of a cure."
        },
        'domain_lexicon': {
            question: "Do you know what 'Project Skyfire' refers to internally?",
            risk: "Using the wrong acronyms immediately signals you are an outsider."
        },
        'decision_making': {
            question: "Who is the 'Shadow Decision Maker' in Engineering?",
            risk: "You might be pitching to the wrong person for weeks."
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Header / Nav (Simplified) */}
            <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isEditMode ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                                <span className={`text-[10px] font-mono uppercase tracking-widest ${isEditMode ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {isEditMode ? 'ADMIN EDITING' : 'Live Analysis'}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <h1 className="font-bold text-foreground truncate">{displayName}</h1>
                                <div className="text-xs text-muted-foreground truncate mb-1">{domain}</div>
                                <div className="flex gap-1">
                                    {companySize && <span className="text-[9px] px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-muted">{companySize}</span>}
                                    {industry && <span className="text-[9px] px-1.5 py-0.5 rounded border border-border text-muted-foreground bg-muted truncate max-w-[80px]">{industry}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-3">
                        <button className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:bg-muted font-mono uppercase tracking-wider flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export PDF
                        </button>

                        {/* Admin Toggle */}
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            disabled={!org}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-mono uppercase tracking-wider flex items-center gap-2 ${isEditMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/50' : 'text-muted-foreground border-border hover:bg-muted'}`}
                        >
                            {isEditMode ? (
                                <>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    Exit Edit
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    Edit
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Live Research Banner - Always Visible */}
            <ResearchProgress />

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
                {!org ? (
                    // Loading Skeleton
                    <div className="col-span-full py-12 text-center text-muted-foreground font-mono animate-pulse">
                        Loading Organization Data...
                    </div>
                ) : (
                    <>
                        {/* Left: Navigation */}
                        <aside className="space-y-8">
                            {/* Foundation */}
                            <div>
                                <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">Foundation</h3>
                                <div className="space-y-1">
                                    {['general', 'econ_engine', 'org_dna'].map(id => (
                                        <button
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${activeTab === id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                                        >
                                            {id === 'general' ? 'Vital Signs' : id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Intelligence (Pillars) */}
                            <div>
                                <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">Intelligence</h3>
                                <div className="space-y-1">
                                    {['burning_platform', 'domain_lexicon', 'decision_making'].map(id => (
                                        <button
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between group ${activeTab === id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                                        >
                                            <span>{id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                            <svg className="w-3 h-3 opacity-0 group-hover:opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15l-3-3m0 0l3-3m-3 3h8" /></svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Center: Dossier Content (Expanded) */}
                        <section className="lg:col-span-3 space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6 min-h-[500px] shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-foreground font-mono uppercase tracking-tight">
                                        {activeTab === 'general' ? 'Vital Signs' : activeTab.replace('_', ' ')}
                                    </h2>
                                    <div className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded font-mono">
                                        V1.2 • AUTO-GENERATED
                                    </div>
                                </div>

                                {isLocked && TEASERS[activeTab] ? (
                                    // Locked Pillar -> Teaser
                                    <TeaserCard
                                        title={activeTab.replace('_', ' ').toUpperCase()}
                                        question={TEASERS[activeTab].question}
                                        risk={TEASERS[activeTab].risk}
                                        onUnlock={() => setIsUpgradeOpen(true)}
                                    />
                                ) : (
                                    // Unlocked -> Content
                                    <div className="space-y-6 animate-in fade-in duration-500">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-sm font-mono text-emerald-500">Analysis Complete</span>
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed">
                                            Based on the analysis of <strong>{org.display_name}</strong>, here is the {activeTab.replace('_', ' ')} breakdown...
                                        </p>

                                        {/* Render Structured Dossier if available, else Mock Data or Placeholder */}
                                        {dossier && dossier[activeTab] ? (
                                            <div className="mt-8">
                                                <StructuredView dimensions={dossier[activeTab]} isEditing={isEditMode} />
                                            </div>
                                        ) : activeTab === 'general' ? (
                                            /* Fallback for General if no dossier yet */
                                            <div className="mt-6">
                                                <VitalSigns content={pillars.find((p: any) => p.pillar_id === 'general')?.content} />
                                            </div>
                                        ) : (
                                            <div className="mt-12 text-center p-8 border border-dashed border-border rounded bg-muted/30">
                                                <p className="text-muted-foreground italic">initializing structured model...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>


                    </>
                )}
            </main>

            <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
        </div>
    )
}
