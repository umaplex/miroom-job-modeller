'use client'

import { useState } from 'react'
import { SimulatedLog } from '@/components/simulated-log'
import Link from 'next/link'
import { PillarGrid } from '@/components/pillar-grid'
import { PricingSection } from '@/components/pricing-section'

type ViewState = 'IDLE' | 'SIMULATING' | 'RESULT'

export default function Home() {
  const [url, setUrl] = useState('')
  const [viewState, setViewState] = useState<ViewState>('IDLE')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setViewState('SIMULATING')
  }

  const handleReset = () => {
    setUrl('')
    setViewState('IDLE')
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10">
        <div className="font-mono font-bold tracking-widest text-sm">JOB MODELLER</div>
        <Link
          href="/login"
          className="font-mono text-xs border border-zinc-800 px-4 py-2 rounded hover:border-primary hover:text-primary transition-colors uppercase tracking-wider"
        >
          [ Login ]
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center p-6 text-center mt-6 min-h-[60vh]">

        {/* Header content - Fades out during simulation/result to reduce noise */}
        {viewState === 'IDLE' && (
          <div className="animate-in fade-in zoom-in duration-700">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
              Context Over Content.
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Generic prep is for juniors. High-growth operators use Job Modeller to decode the <span className="text-zinc-300 font-medium">economic levers</span> and <span className="text-zinc-300 font-medium">burning platforms</span> that drive senior hiring.
            </p>
          </div>
        )}

        {/* STATE MACHINE: IDLE -> SIMULATING -> RESULT */}

        {/* 1. IDLE: Input Console */}
        {viewState === 'IDLE' && (
          <form onSubmit={handleSubmit} className="w-full max-w-xl group relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 blur transition duration-500 group-hover:opacity-40"></div>
            <div className="relative flex items-center bg-card border border-border rounded-lg p-2 shadow-2xl">
              <span className="pl-4 pr-2 text-zinc-500 font-mono text-lg">{'>'}</span>
              <input
                type="text"
                required
                placeholder="domain.com (e.g. stripe.com)..."
                className="flex-1 bg-transparent border-none text-foreground placeholder:text-zinc-700 outline-none font-mono text-sm py-3"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="submit"
                className="bg-foreground text-background font-bold uppercase text-xs tracking-wider px-6 py-3 rounded hover:bg-primary hover:text-white transition-all font-mono"
              >
                Initialize
              </button>
            </div>
          </form>
        )}

        {/* 2. SIMULATING: Theatrical Logs */}
        {viewState === 'SIMULATING' && (
          <div className="w-full flex justify-center animate-in fade-in zoom-in duration-500">
            <SimulatedLog
              url={url}
              onComplete={() => setViewState('RESULT')}
            />
          </div>
        )}

        {/* 3. RESULT: Sample Dossier + Unlock */}
        {viewState === 'RESULT' && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            {/* Result Header */}
            <div className="flex justify-between items-end mb-8 border-b border-border pb-4">
              <div>
                <div className="font-mono text-xs text-primary mb-2">TARGET_ACQUIRED</div>
                <h2 className="text-3xl font-bold uppercase">{url.replace(/^https?:\/\//, '').split('/')[0]} <span className="text-zinc-600">DOSSIER</span></h2>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-mono text-zinc-500 hover:text-primary uppercase"
              >
                Search Again
              </button>
            </div>

            {/* Inline Pillars (Sample) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-500 mb-12">
              <div className="bg-card border border-border p-6 rounded-lg pointer-events-none select-none relative overflow-hidden">
                <div className="font-mono text-primary text-xs mb-2">01 ECONOMIC ENGINE</div>
                <div className="h-2 w-1/2 bg-zinc-800 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                  <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
                  <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                  <span className="font-mono text-xs border border-primary text-primary px-2 py-1 rounded">PREVIEW_ONLY</span>
                </div>
              </div>
              <div className="bg-card border border-border p-6 rounded-lg pointer-events-none select-none">
                <div className="font-mono text-primary text-xs mb-2">02 ORG DNA</div>
                <div className="h-2 w-1/3 bg-zinc-800 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                  <div className="h-2 w-2/3 bg-zinc-800 rounded"></div>
                </div>
              </div>
              <div className="bg-card border border-border p-6 rounded-lg pointer-events-none select-none">
                <div className="font-mono text-primary text-xs mb-2">03 BURNING PLATFORM</div>
                <div className="h-2 w-1/2 bg-zinc-800 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
                  <div className="h-2 w-full bg-zinc-800 rounded"></div>
                </div>
              </div>
            </div>

            {/* Main Unlock Call to Action */}
            <div className="bg-card border border-primary/30 p-8 rounded-lg max-w-xl mx-auto text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <h3 className="text-primary font-mono text-sm font-bold uppercase tracking-widest mb-2">Intelligence Locked</h3>
              <p className="text-zinc-400 text-sm mb-6">Full strategic mapping requires verified operator access.</p>

              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="w-full bg-primary text-white font-bold py-3 rounded text-sm uppercase tracking-widest hover:bg-primary/80 transition-colors"
                >
                  Unlock Dossier
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Strategic Framework / Pricing - Only show when NOT simulating for less noise? Or keep? */}
      {/* Keeping them but maybe fading them out if simulating could be nice, but simple is better. */}
      {viewState === 'IDLE' && (
        <>
          <PillarGrid />
          <PricingSection />
        </>
      )}

      {/* Footer */}
      <footer className="w-full p-8 text-center text-zinc-500 font-mono text-xs border-t border-border bg-background transition-colors duration-300">
        <p className="mb-4">SYSTEM STATUS: OPTIMAL // ENCRYPTED UPLINK ESTABLISHED</p>

        {/* Dev Theme Switcher */}
        <div className="flex justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <button
            onClick={() => document.documentElement.setAttribute('data-theme', 'slate')}
            className="w-4 h-4 rounded-full bg-[#09090b] border border-zinc-700 hover:scale-110 transition-transform"
            title="Slate Theme"
          />
          <button
            onClick={() => document.documentElement.setAttribute('data-theme', 'charcoal')}
            className="w-4 h-4 rounded-full bg-[#121417] border border-yellow-500/50 hover:scale-110 transition-transform"
            title="Charcoal/Gold Theme"
          />
        </div>
      </footer>
    </div>
  )
}
