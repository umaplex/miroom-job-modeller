'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null)

    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        })

        if (error) {
            setMessage({ text: error.message, type: 'error' })
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage({ text: error.message, type: 'error' })
        } else {
            setMessage({ text: 'Account created. Please check your email.', type: 'success' })
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-zinc-100 font-sans p-6 selection:bg-indigo-500/30">

            <div className="w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="font-bold tracking-tight text-xl mb-6 text-indigo-500">JOB MODELLER</div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-white">Welcome back</h1>
                    <p className="text-zinc-400 text-base">Sign in to your dashboard to continue.</p>
                </div>

                {/* Login Form */}
                <div className="bg-[#18181b] border border-zinc-800 p-10 rounded-xl shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-base"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-zinc-300">Password</label>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-base"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {message && (
                            <div className={`p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-lg text-sm hover:bg-zinc-200 transition-colors disabled:opacity-70 shadow-lg shadow-white/5"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                        <p className="text-zinc-400 text-sm">Don&apos;t have an account?</p>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="mt-2 text-indigo-400 font-medium hover:text-indigo-300 transition-colors text-sm"
                        >
                            Create an account
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-xs font-mono">
                    ← Back to website
                </Link>
            </div>
        </div>
    )
}
