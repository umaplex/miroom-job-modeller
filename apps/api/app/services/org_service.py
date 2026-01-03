from supabase import Client
from app.utils.normalization import normalize_org_identity

class OrgService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    async def ingest_org(self, raw_url: str, user_id: str):
        """
        1. Normalize URL -> Name/Domain
        2. Check if exists
        3. If new, create
        4. Add to user_added_orgs
        5. Add to user_favorites (Auto-fav)
        """
        # 1. Normalize
        norm = await normalize_org_identity(raw_url)
        
        # 2. Deduplicate
        existing = self.supabase.table("organizations").select("*").eq("domain", norm.domain).execute()
        
        org_id = None
        is_new = False
        
        if existing.data:
            org_id = existing.data[0]['id']
        else:
            # 3. Create
            new_org = {
                "domain": norm.domain,
                "display_name": norm.display_name,
                "main_url": norm.cleaned_url,
                "status": "PREP_INITIALIZED"
            }
            res = self.supabase.table("organizations").insert(new_org).execute()
            if res.data:
                org_id = res.data[0]['id']
                is_new = True
        
        if not org_id:
            raise Exception("Failed to resolve Organization ID")

        # 4. Link User (Added)
        # Note: In a real app we'd check if link exists first, but ON CONFLICT DO NOTHING is safe if configured, 
        # or we just try/catch. For MVP we'll just try insert and ignore error.
        try:
            self.supabase.table("user_added_orgs").insert({
                "user_id": user_id, 
                "org_id": org_id
            }).execute()
        except:
            pass # Already added by this user or constraint

        # 5. Auto-Fav
        await self.favorite_org(user_id, org_id)

        return {"org_id": org_id, "is_new": is_new, "domain": norm.domain}

    async def favorite_org(self, user_id: str, org_id: str):
        try:
            self.supabase.table("user_favorites").upsert({
                "user_id": user_id,
                "org_id": org_id,
                "last_visited_at": "now()"
            }).execute()
        except Exception as e:
            print(f"Fav Error: {e}")

    async def get_recents(self, user_id: str, limit: int = 5):
        # Join user_favorites with organizations
        # Supabase-py join syntax can be tricky. 
        # For MVP we might verify if we have Foreign Keys set up for auto-detection or do two queries.
        # Let's try the standard select with join syntax: select(*, organizations(*))
        
        res = self.supabase.table("user_favorites")\
            .select("*, organizations(*)")\
            .eq("user_id", user_id)\
            .order("last_visited_at", desc=True)\
            .limit(limit)\
            .execute()
            
        return res.data

    async def get_org_details(self, org_id: str):
        # Fetch Org Metadata
        org_res = self.supabase.table("organizations").select("*").eq("id", org_id).execute()
        if not org_res.data:
            return None
        
        org = org_res.data[0]
        
        # Fetch Pillar Status
        status_res = self.supabase.table("org_pillar_status").select("*").eq("org_id", org_id).execute()
        
        return {
            "org": org,
            "pillars": status_res.data
        }

    async def search_orgs(self, query: str):
        # Simple ILIKE search
        res = self.supabase.table("organizations")\
            .select("*")\
            .ilike("display_name", f"%{query}%")\
            .limit(5)\
            .execute()
        return res.data
