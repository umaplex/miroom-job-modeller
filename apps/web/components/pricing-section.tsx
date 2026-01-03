'use client'

import { useState } from "react"
import Link from "next/link"

export function PricingSection() {
    const [seasonMonths, setSeasonMonths] = useState<2 | 3>(3)

    return (
        <section className="w-full border-t border-border bg-background transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-foreground">
                        ACQUIRE INTELLIGENCE UNITS
                    </h2>
                    <p className="text-zinc-500">
                        Select your access level. No recurring subscriptions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
                    {/* GATEWAY (FREE) */}
                    <div className="bg-card rounded-lg border border-border p-8 flex flex-col h-full">
                        <div className="mb-6 text-center border-b border-dashed border-border pb-6">
                            <h3 className="text-xl font-bold text-foreground mb-2 uppercase">The Gateway</h3>
                            <div className="text-4xl font-mono text-zinc-400 mt-4">$0</div>
                            <p className="text-zinc-500 text-sm mt-3 italic">"Passive Researchers"</p>
                        </div>

                        <div className="flex-1 space-y-4 text-sm text-zinc-400 mb-8">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-zinc-600">Research</span>
                                <span className="text-right">2 / week<br /><span className="text-xs opacity-50">Standard Pillars</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-zinc-600">Freshness</span>
                                <span className="text-right">Static<br /><span className="text-xs opacity-50">No Auto-Refresh</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-zinc-600">Practice</span>
                                <span className="text-right">1 Trial Session<br /><span className="text-xs opacity-50">Standard Scope</span></span>
                            </div>
                        </div>

                        <Link href="/login" className="w-full block text-center border border-border text-zinc-400 hover:text-foreground font-mono text-xs font-bold uppercase py-4 rounded transition-colors mt-auto">
                            Start Research
                        </Link>
                    </div>

                    {/* SPRINT ($49) */}
                    <div className="bg-card rounded-lg border border-primary p-8 flex flex-col h-full relative shadow-[0_0_15px_rgba(93,93,255,0.2)]">
                        <div className="mb-6 text-center border-b border-dashed border-border pb-6">
                            <h3 className="text-xl font-bold text-primary mb-2 uppercase">The Sprint</h3>
                            <div className="text-4xl font-mono text-foreground mt-4">$49</div>
                            <p className="text-primary/60 text-sm mt-3 italic">"I have an interview next week."</p>
                        </div>

                        <div className="flex-1 space-y-4 text-sm text-zinc-300 mb-8">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-primary">Research</span>
                                <span className="text-right">10 IUs / Month<br /><span className="text-xs opacity-50">All 5 Pillars</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-primary">Freshness</span>
                                <span className="text-right">20 Refreshes<br /><span className="text-xs opacity-50">Monthly Cap</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-primary">Practice</span>
                                <span className="text-right">30 Sessions<br /><span className="text-xs opacity-50">All Pillars</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-primary">Overages</span>
                                <span className="text-right">Upgrade to Tier 2</span>
                            </div>
                        </div>

                        <Link href="/login" className="w-full block text-center bg-card border border-primary text-primary hover:bg-primary hover:text-white font-mono text-xs font-bold uppercase py-4 rounded transition-colors mt-auto">
                            Select Sprint
                        </Link>
                    </div>

                    {/* SEASON ($129/$149) */}
                    <div className="bg-card rounded-lg border border-accent p-8 flex flex-col h-full relative shadow-xl">
                        <div className="absolute top-0 right-0 bg-accent text-background text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-widest translate-y-[-1px] translate-x-[1px]">
                            Best Value
                        </div>

                        <div className="mb-6 text-center border-b border-dashed border-border pb-6">
                            <h3 className="text-xl font-bold text-accent mb-2 uppercase text-cyber">The Season Pass</h3>

                            {/* Toggle Switch */}
                            <div className="flex justify-center my-3">
                                <div className="bg-[#121212] p-1 rounded-full flex gap-1 border border-border">
                                    <button
                                        onClick={() => setSeasonMonths(2)}
                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${seasonMonths === 2 ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        2 Months
                                    </button>
                                    <button
                                        onClick={() => setSeasonMonths(3)}
                                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full transition-all ${seasonMonths === 3 ? 'bg-accent text-background' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        3 Months
                                    </button>
                                </div>
                            </div>

                            <div className="text-4xl font-mono text-foreground mt-2">
                                ${seasonMonths === 3 ? '149' : '129'}
                            </div>
                            <p className="text-accent/60 text-sm mt-3 italic">"I am actively hunting (3-5 firms)."</p>
                        </div>

                        <div className="flex-1 space-y-4 text-sm text-zinc-300 mb-8">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-accent">Research</span>
                                <span className="text-right">30 IUs Total<br /><span className="text-xs font-bold text-accent">Full Access + Competitors</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-accent">Freshness</span>
                                <span className="text-right">Unlimited<br /><span className="text-xs opacity-50">Auto-Refresh</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-accent">Practice</span>
                                <span className="text-right">100 Sessions<br /><span className="text-xs opacity-50">All Pillars + Competitors</span></span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-accent">Overages</span>
                                <span className="text-right">$10 / 10-Pack</span>
                            </div>
                        </div>

                        <Link href="/login" className="w-full block text-center bg-accent hover:bg-white text-background font-mono text-xs font-bold uppercase py-4 rounded transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] mt-auto">
                            Select Season
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
