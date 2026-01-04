from enum import Enum
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from .config import get_settings
import logging

settings = get_settings()
logger = logging.getLogger("llm_factory")

class ModelProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"

class ModelFactory:
    @staticmethod
    def get_model(provider: str, model_name: str, temperature: float = 0):
        """
        Instantiates the LangChain chat model based on provider enum or string.
        """
        # Normalize provider string
        if isinstance(provider, str):
            provider = provider.lower()

        if provider == ModelProvider.OPENAI or provider == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY not found")
            return ChatOpenAI(
                model=model_name,
                temperature=temperature,
                api_key=settings.OPENAI_API_KEY
            )
        
        elif provider == ModelProvider.ANTHROPIC or provider == "anthropic":
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("ANTHROPIC_API_KEY not found")
            return ChatAnthropic(
                model=model_name,
                temperature=temperature,
                api_key=settings.ANTHROPIC_API_KEY
            )
            
        elif provider == ModelProvider.GEMINI or provider == "gemini":
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY not found")
            # Gemini naming often requires 'models/' prefix or just 'gemini-pro'
            # LangChain handles this, but user should pass 'gemini-pro'
            return ChatGoogleGenerativeAI(
                model=model_name,
                temperature=temperature,
                google_api_key=settings.GEMINI_API_KEY,
                convert_system_message_to_human=True # Helper for Gemini quirks
            )
            
        raise ValueError(f"Unknown provider: {provider}")

    @staticmethod
    def get_configured_model(config_string: str, temperature: float = 0):
        """
        Parses a config string like "openai:gpt-4o" and returns the model.
        """
        try:
            if ":" not in config_string:
                # Default to OpenAI if no prefix
                provider = "openai"
                model_name = config_string
            else:
                provider, model_name = config_string.split(":", 1)
            
            return ModelFactory.get_model(provider, model_name, temperature)
        except Exception as e:
            logger.error(f"Failed to load model from config '{config_string}': {e}")
            # Fallback to safe default
            return ModelFactory.get_model("openai", "gpt-3.5-turbo")
