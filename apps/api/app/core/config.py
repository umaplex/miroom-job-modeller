from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "Job Modeller API"
    
    # Database
    SUPABASE_URL: str
    SUPABASE_KEY: str
    
    # LLM Providers
    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    
    # Model Configuration (Format: "provider:model_name")
    # e.g. "openai:gpt-4o-mini", "anthropic:claude-3-haiku", "gemini:gemini-pro"
    DEFAULT_QUERY_MODEL: str = "openai:gpt-4o" # Upgrade to 4o for better query generation
    DEFAULT_SYNTHESIS_MODEL: str = "openai:gpt-4o"
    
    # Testing Controls
    TEST_PILLARS_ALLOWLIST: str = "*" # Comma separated IDs, or * for all
    
    # Search
    TAVILY_API_KEY: str | None = None
    FIRECRAWL_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

@lru_cache()
def get_settings():
    return Settings()
