export function PillarGrid() {
    const pillars = [
        {
            id: "01",
            title: "Economic Engine",
            jd: "JD: 'Must understand SaaS business models.'",
            reality: "REALITY: They are pivoting from Seat-Based to Usage-Based pricing and failing to model churn correctly.",
        },
        {
            id: "02",
            title: "Org DNA",
            jd: "JD: 'Collaborate with Sales and Engineering.'",
            reality: "REALITY: This is a Sales-Led culture. Engineering asks permission. If you act Product-Led, you will be fired.",
        },
        {
            id: "03",
            title: "Burning Platform",
            jd: "JD: 'Help us scale to the next level.'",
            reality: "REALITY: They have 6 months of runway. The 'next level' is Series B or bankruptcy.",
        },
        {
            id: "04",
            title: "Domain Lexicon",
            jd: "JD: 'Experience in Fintech preferred.'",
            reality: "REALITY: Don't say 'Users'. Say 'Counterparties'. Don't say 'Database'. Say 'Ledger'.",
        },
        {
            id: "05",
            title: "Decision Framework",
            jd: "JD: 'Data-driven decision maker.'",
            reality: "REALITY: The CEO trusts gut instinct over data. Present data as 'supporting evidence' for his intuition.",
        },
    ]

    return (
        <section className="w-full max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-white">
                    THE STRATEGIC FRAMEWORK
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto">
                    We map every job to 5 Context Pillars. This is the difference between a "good interview" and a "strategic briefing."
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillars.map((pillar) => (
                    <div
                        key={pillar.id}
                        className="bg-card border border-border p-8 rounded-lg hover:border-primary/50 transition-colors group"
                    >
                        <h3 className="text-xl font-bold text-foreground mb-6 uppercase tracking-wide">{pillar.title}</h3>

                        <div className="space-y-4">
                            <div className="pl-4 border-l-2 border-border">
                                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Public Signal</p>
                                <p className="text-zinc-400 italic text-sm">"{pillar.jd}"</p>
                            </div>

                            <div className="pl-4 border-l-2 border-accent/50 bg-accent/5 py-2 pr-2">
                                <p className="text-xs text-accent uppercase tracking-wider mb-1 font-bold">The Truth</p>
                                <p className="text-foreground font-medium text-sm leading-relaxed">{pillar.reality}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
