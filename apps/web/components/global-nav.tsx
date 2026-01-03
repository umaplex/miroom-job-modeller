'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ingestOrg } from '@/lib/api'
import { createClient } from '@/utils/supabase/client'

export function GlobalNav() {
    const router = useRouter()
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAddMode, setIsAddMode] = useState(false)
    const [addUrl, setAddUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAddTarget = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!addUrl.trim()) return

        setLoading(true)
        try {
            const supabase = createClient()
            const { data } = await supabase.auth.getUser()
            if (data.user) {
                const res = await ingestOrg(addUrl, data.user.id)
                router.push(`/org/${res.org_id}`)
                setIsAddMode(false)
            }
        } catch (err) {
            console.error(err)
            alert('Failed to add target')
        }
        setLoading(false)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center gap-4">
                {/* Left: Brand */}
                <div className="flex items-center shrink-0">
                    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold sm:inline-block text-primary tracking-tight">JOB MODELLER</span>
                    </Link>
                </div>

                {/* Center: Search + Explicit Action */}
                <div className="flex-1 flex justify-center max-w-[600px] mx-auto gap-2">
                    {isAddMode ? (
                        <form onSubmit={handleAddTarget} className="flex-1 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <input
                                type="text"
                                placeholder="Enter URL (e.g. stripe.com)..."
                                autoFocus
                                className="flex-1 h-9 px-4 rounded-md bg-zinc-900 border border-indigo-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                                value={addUrl}
                                onChange={(e) => setAddUrl(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                            >
                                {loading ? 'Adding...' : 'Add'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddMode(false)}
                                className="bg-transparent text-zinc-400 hover:text-white px-3 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <>
                            <div className={`relative flex-1 transition-all duration-300`}>
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    className="w-full h-9 pl-9 pr-4 rounded-md bg-zinc-900 border border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-all text-zinc-200 placeholder:text-zinc-600"
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={() => setIsAddMode(true)}
                                className="h-9 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shrink-0"
                            >
                                <span>+ Add Target</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Right: User User */}
                <div className="flex shrink-0 items-center justify-end space-x-4">
                    <form action="/auth/signout" method="post">
                        <button className="text-sm font-medium text-zinc-500 hover:text-red-400 transition-colors">
                            Sign Out
                        </button>
                    </form>
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 text-xs font-bold">
                        JD
                    </div>
                </div>
            </div>
        </header>
    )
}
