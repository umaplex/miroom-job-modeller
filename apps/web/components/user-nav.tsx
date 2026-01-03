'use client'

import { useTheme } from 'next-themes'
import { useState, useRef, useEffect } from 'react'

export function UserNav() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 text-xs font-bold hover:bg-indigo-500/30 transition-colors"
            >
                JD
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-border bg-card p-2 shadow-lg animate-in fade-in zoom-in-95 duration-100 z-50">
                    <div className="px-2 py-1.5 text-sm font-semibold text-foreground border-b border-border mb-1">
                        John Doe
                        <div className="text-xs font-normal text-muted-foreground">john@example.com</div>
                    </div>

                    <div className="py-1">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Theme
                        </div>
                        {['light', 'dark', 'system'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center justify-between ${theme === t ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                            >
                                <span className="capitalize">{t}</span>
                                {theme === t && (
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-border mt-1 pt-1">
                        <form action="/auth/signout" method="post">
                            <button className="w-full text-left px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-sm transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
