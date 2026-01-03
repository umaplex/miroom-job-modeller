from enum import Enum
from langchain_openai import ChatOpenAI
# from langchain_anthropic import ChatAnthropic # Uncomment when needed
# from langchain_google_genai import ChatGoogleGenerativeAI # Uncomment when needed
from .config import get_settings

settings = get_settings()

class ModelProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"

class ModelFactory:
    @staticmethod
    def get_model(provider: ModelProvider, model_name: str = "gpt-4-turbo", temperature: float = 0):
        if provider == ModelProvider.OPENAI:
            return ChatOpenAI(
                model=model_name,
                temperature=temperature,
                api_key=settings.OPENAI_API_KEY
            )
        
        elif provider == ModelProvider.ANTHROPIC:
            if not settings.ANTHROPIC_API_KEY:
                raise ValueError("Anthropic API Key not found")
            # return ChatAnthropic(...) # Placeholder for now to avoid import errors if pkg missing
            raise NotImplementedError("Anthropic provider not yet fully installed")
            
        elif provider == ModelProvider.GEMINI:
            if not settings.GEMINI_API_KEY:
                raise ValueError("Gemini API Key not found")
            # return ChatGoogleGenerativeAI(...) # Placeholder
            raise NotImplementedError("Gemini provider not yet fully installed")
            
        raise ValueError(f"Unknown provider: {provider}")

    @staticmethod
    def get_default_model():
        """Returns a safe default (OpenAI) for MVP 0"""
        return ModelFactory.get_model(ModelProvider.OPENAI, "gpt-3.5-turbo")
