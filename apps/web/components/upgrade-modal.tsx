'use client'

import { useEffect, useState } from 'react'

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            document.body.style.overflow = 'hidden'
        } else {
            setIsVisible(false)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className={`relative bg-background border border-border rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row transition-all duration-300 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                {/* Left Panel: Value Prop */}
                <div className="md:w-1/2 p-8 md:p-10 bg-gradient-to-br from-primary/10 to-background border-b md:border-b-0 md:border-r border-border">
                    <div className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest mb-4">
                        The Strategic Edge
                    </div>

                    <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                        Stop Guessing.<br />
                        <span className="text-primary">Start Leading.</span>
                    </h2>

                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                        You have the skills to do the job. We give you the context to win the room.
                        <br /><br />
                        The difference between a "Standard Candidate" and an "Immediate Hire" is the quality of their questions.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "The Burning Platform: Identify the #1 strategic risk.",
                            "The Power Map: Know who actually holds the veto.",
                            "Decision Vibe: Slide culture vs. Memo culture.",
                            "Domain Lexicon: Speak the insider language."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Panel: Plans */}
                <div className="md:w-1/2 p-8 md:p-10 bg-secondary/50">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <h3 className="text-lg font-bold text-foreground mb-6">Select Your Intelligence Tier</h3>

                    <div className="space-y-4">
                        {/* Option 1 */}
                        <div className="border border-indigo-500/30 bg-indigo-500/10 rounded-lg p-4 relative cursor-pointer hover:border-indigo-500 transition-colors">
                            <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                Recommended
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white">The "Pro" Search</span>
                                <span className="text-xl font-bold text-white">$49<span className="text-sm font-normal text-zinc-400">/mo</span></span>
                            </div>
                            <p className="text-xs text-zinc-400 mb-3">Best for a single deep target.</p>
                            <ul className="text-xs text-zinc-300 space-y-1 mb-4">
                                <li>• Full Intelligence for 5 Orgs</li>
                                <li>• Standard Practice Map</li>
                            </ul>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2 rounded transition-colors">
                                Unlock Full Intelligence
                            </button>
                        </div>

                        {/* Option 2 */}
                        <div className="border border-border rounded-lg p-4 cursor-pointer hover:border-muted-foreground transition-colors opacity-70 hover:opacity-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-muted-foreground">The "Executive" Suite</span>
                                <span className="text-xl font-bold text-muted-foreground">$149<span className="text-sm font-normal text-muted-foreground">/3mo</span></span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">Best for an active job hunt.</p>
                            <button className="w-full bg-transparent border border-muted-foreground hover:bg-muted text-muted-foreground text-sm font-bold py-2 rounded transition-colors">
                                Select Executive
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-zinc-500">
                            100% Tax Deductible as a Professional Development Expense.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
