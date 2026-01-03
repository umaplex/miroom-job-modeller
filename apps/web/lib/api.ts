const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchRecents(userId: string) {
    try {
        const res = await fetch(`${API_URL}/orgs/recents?user_id=${userId}`)
        if (!res.ok) throw new Error('Failed to fetch recents')
        return await res.json()
    } catch (e) {
        console.error(e)
        return []
    }
}

export async function searchOrgs(query: string) {
    try {
        const res = await fetch(`${API_URL}/orgs/search?q=${query}`)
        if (!res.ok) throw new Error('Search failed')
        return await res.json()
    } catch (e) {
        return []
    }
}

export async function ingestOrg(url: string, userId: string) {
    const res = await fetch(`${API_URL}/orgs/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, user_id: userId })
    })
    if (!res.ok) throw new Error('Ingest failed')
    return await res.json()
}

export async function fetchOrg(id: string) {
    const res = await fetch(`${API_URL}/orgs/${id}`)
    if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch Org')
    }
    return await res.json()
}
