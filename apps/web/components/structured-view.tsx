'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, FileText, Pencil, Save, X, Trash, Plus } from 'lucide-react'
import { updateObservation } from '@/lib/api'

// Types (mirroring backend)
interface Evidence {
    id: string
    quote?: string
    source_url?: string
    type: string
    weight: number
}

interface Observation {
    id: string
    structured_value?: any
    analysis_markdown?: string
    is_synthetic: boolean
    synthetic_rationale?: string
    source_type: string
    review_status: string
    evidence: Evidence[]
}

interface FieldDefinition {
    id: string
    name: string
    description?: string
    current_observation?: Observation
}

interface Dimension {
    id: string
    name: string
    fields: FieldDefinition[]
}

export function StructuredView({ dimensions, isEditing }: { dimensions: Dimension[], isEditing: boolean }) {
    const [activeDimId, setActiveDimId] = useState<string>(dimensions[0]?.id)

    // Auto-select first dimension if data changes (e.g. switching pillars)
    useEffect(() => {
        if (dimensions?.length > 0) {
            const isActiveValid = dimensions.find(d => d.id === activeDimId)
            if (!isActiveValid) {
                setActiveDimId(dimensions[0].id)
            }
        }
    }, [dimensions, activeDimId])

    if (!dimensions || dimensions.length === 0) {
        return <div className="text-muted-foreground italic p-4">No structured data available for this pillar.</div>
    }

    const activeDim = dimensions.find(d => d.id === activeDimId) || dimensions[0]

    return (
        <div className="space-y-6">
            {/* Dimension Chips - Wrapped */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
                {dimensions.map((dim) => (
                    <button
                        key={dim.id}
                        onClick={() => setActiveDimId(dim.id)}
                        className={`
                            px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all
                            ${activeDimId === dim.id
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}
                        `}
                    >
                        {dim.name}
                    </button>
                ))}
            </div>

            {/* Active Dimension Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mb-4 pl-1 hidden">
                    {activeDim.name}
                </h3>
                <div className="grid gap-3">
                    {activeDim.fields.map((field) => (
                        <ObservationCard key={field.id} field={field} isGlobalEdit={isEditing} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function ObservationCard({ field, isGlobalEdit }: { field: FieldDefinition, isGlobalEdit: boolean }) {
    const [obs, setObs] = useState<Observation | undefined>(field.current_observation)
    const [isEditing, setIsEditing] = useState(false)
    const [showEvidence, setShowEvidence] = useState(false)

    // Form State
    const [editMarkdown, setEditMarkdown] = useState('')
    const [editStatus, setEditStatus] = useState('DRAFT')
    const [editSynthetic, setEditSynthetic] = useState(false)
    const [editEvidence, setEditEvidence] = useState<Evidence[]>([])

    // Sync global edit mode or init form
    useEffect(() => {
        if (isGlobalEdit) {
            setIsEditing(true)
            if (obs) {
                setEditMarkdown(obs.analysis_markdown || '')
                setEditStatus(obs.review_status || 'DRAFT')
                setEditSynthetic(obs.is_synthetic || false)
                setEditEvidence(obs.evidence || [])
            }
        } else {
            setIsEditing(false)
        }
    }, [isGlobalEdit, obs])

    const handleSave = async () => {
        if (!obs) return

        // Optimistic Update
        const updatedObs = {
            ...obs,
            analysis_markdown: editMarkdown,
            review_status: editStatus,
            is_synthetic: editSynthetic,
            evidence: editEvidence,
            source_type: 'HUMAN_EDITOR'
        }
        setObs(updatedObs)
        setIsEditing(false)

        try {
            await updateObservation(obs.id, {
                analysis_markdown: editMarkdown,
                review_status: editStatus,
                is_synthetic: editSynthetic,
                evidence: editEvidence
            })
            // Success toast could go here
        } catch (e) {
            console.error(e)
            // Revert on fail? For MVP just log
        }
    }

    const addEvidence = () => {
        const newEv: Evidence = {
            id: crypto.randomUUID(), // Temp ID
            quote: '',
            source_url: '',
            type: 'INFERRED',
            weight: 1
        }
        setEditEvidence([...editEvidence, newEv])
        setShowEvidence(true)
    }

    const removeEvidence = (id: string) => {
        setEditEvidence(editEvidence.filter(e => e.id !== id))
    }

    const updateEvidence = (id: string, field: keyof Evidence, val: any) => {
        setEditEvidence(editEvidence.map(e => e.id === id ? { ...e, [field]: val } : e))
    }

    // Empty State
    if (!obs) {
        return (
            <div className="bg-card border border-border/50 border-dashed rounded-lg p-4 opacity-60">
                <h4 className="font-bold text-foreground mb-1">{field.name}</h4>
                <p className="text-sm text-muted-foreground">{field.description}</p>
                <div className="mt-4 text-xs bg-muted inline-block px-2 py-1 rounded text-muted-foreground">
                    Pending Analysis
                </div>
            </div>
        )
    }

    // --- READ MODE ---
    if (!isEditing) {
        return (
            <div className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-primary/20 shadow-sm relative group">
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h4 className="font-bold text-sm text-foreground mb-0.5">{field.name}</h4>
                            <p className="text-xs text-muted-foreground">{field.description}</p>
                        </div>
                        {obs.is_synthetic && (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-500 text-xs font-mono rounded border border-amber-500/20" title={obs.synthetic_rationale}>
                                <AlertTriangle className="w-3 h-3" />
                                <span>SYNTHETIC</span>
                            </div>
                        )}
                    </div>

                    {/* Markdown Content */}
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-4">
                        {obs.analysis_markdown ? (
                            <p className="whitespace-pre-wrap">{obs.analysis_markdown}</p>
                        ) : (
                            <p className="italic opacity-50">No narrative available.</p>
                        )}
                    </div>

                    {/* Footer / Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                {obs.review_status === 'VETTED' ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <div className="w-2 h-2 rounded-full bg-zinc-500" />}
                                {obs.review_status}
                            </span>
                            <span>Source: {obs.source_type}</span>
                        </div>

                        {(obs.evidence && obs.evidence.length > 0) && (
                            <button
                                onClick={() => setShowEvidence(!showEvidence)}
                                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {showEvidence ? 'Hide' : 'Show'} Evidence ({obs.evidence.length})
                                {showEvidence ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Evidence Drawer */}
                {showEvidence && obs.evidence && (
                    <div className="bg-muted/30 border-t border-border p-4 space-y-3">
                        {obs.evidence.map((ev) => (
                            <div key={ev.id} className="text-sm">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase bg-muted px-1.5 py-0.5 rounded border border-border">
                                        {ev.type.replace('_', ' ')}
                                    </span>
                                    {/* Weight dots */}
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`w-1 h-1 rounded-full ${i < (ev.weight / 2) ? 'bg-primary' : 'bg-border'}`} />
                                        ))}
                                    </div>
                                </div>
                                {ev.quote && <blockquote className="pl-3 border-l-2 border-primary/20 text-muted-foreground italic mb-1">"{ev.quote}"</blockquote>}
                                {ev.source_url && (
                                    <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> Source Link
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // --- EDIT MODE ---
    return (
        <div className="bg-background border-2 border-amber-500/20 rounded-lg overflow-hidden shadow-lg relative">
            <div className="absolute top-0 right-0 p-2">
                <div className="bg-amber-500 text-[10px] font-bold px-2 py-0.5 text-black rounded-bl">EDITING</div>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="font-bold text-lg text-foreground mb-1">{field.name}</h4>
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    </div>
                </div>

                {/* Analysis Editor */}
                <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">Analysis Narrative</label>
                    <textarea
                        className="w-full h-32 bg-card border border-border rounded p-3 text-sm focus:ring-1 ring-amber-500 outline-none"
                        value={editMarkdown}
                        onChange={(e) => setEditMarkdown(e.target.value)}
                    />
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">Review Status</label>
                        <select
                            className="w-full bg-card border border-border rounded p-2 text-sm outline-none"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="VETTED">Vetted</option>
                            <option value="DEPRECATED">Deprecated</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-mono uppercase text-muted-foreground mb-1 block">Is Synthetic?</label>
                        <div className="flex items-center gap-2 h-10">
                            <input
                                type="checkbox"
                                checked={editSynthetic}
                                onChange={(e) => setEditSynthetic(e.target.checked)}
                                className="w-4 h-4 rounded border-border bg-card text-amber-500 focus:ring-amber-500"
                            />
                            <span className="text-sm">Inferred Data</span>
                        </div>
                    </div>
                </div>

                {/* Evidence Editor */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono uppercase text-muted-foreground">Evidence ({editEvidence.length})</label>
                        <button onClick={addEvidence} type="button" className="text-xs flex items-center gap-1 text-primary hover:underline">
                            <Plus className="w-3 h-3" /> Add Source
                        </button>
                    </div>
                    <div className="space-y-3 bg-muted/20 p-3 rounded">
                        {editEvidence.map((ev, idx) => (
                            <div key={ev.id || idx} className="bg-card p-3 rounded border border-border space-y-2 relative">
                                <button onClick={() => removeEvidence(ev.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-red-500">
                                    <Trash className="w-3 h-3" />
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        className="bg-background border border-border rounded p-1 text-xs"
                                        value={ev.type}
                                        onChange={(e) => updateEvidence(ev.id, 'type', e.target.value)}
                                    >
                                        <option value="SEC_FILING">SEC Filing</option>
                                        <option value="EARNINGS_CALL">Earnings Call</option>
                                        <option value="NEWS">News</option>
                                        <option value="INFERRED">Inferred</option>
                                    </select>
                                    <input
                                        type="number"
                                        min="1" max="10"
                                        placeholder="Weight (1-10)"
                                        className="bg-background border border-border rounded p-1 text-xs"
                                        value={ev.weight}
                                        onChange={(e) => updateEvidence(ev.id, 'weight', parseInt(e.target.value))}
                                    />
                                </div>
                                <input
                                    className="w-full bg-background border border-border rounded p-1 text-xs"
                                    placeholder="Quote..."
                                    value={ev.quote || ''}
                                    onChange={(e) => updateEvidence(ev.id, 'quote', e.target.value)}
                                />
                                <input
                                    className="w-full bg-background border border-border rounded p-1 text-xs"
                                    placeholder="Source URL..."
                                    value={ev.source_url || ''}
                                    onChange={(e) => updateEvidence(ev.id, 'source_url', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                    {/* Local Cancel (Optional, for now handled by global toggle) */}
                </div>
            </div>
        </div>
    )
}
