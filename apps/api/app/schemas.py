from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

# --- Enums ---
class EvidenceType(str, Enum):
    SEC_FILING = 'SEC_FILING'
    EARNINGS_CALL = 'EARNINGS_CALL'
    FOUNDER_PODCAST = 'FOUNDER_PODCAST'
    GLASSDOOR = 'GLASSDOOR'
    NEWS = 'NEWS'
    INFERRED = 'INFERRED'

class ReviewStatus(str, Enum):
    DRAFT = 'DRAFT'
    VETTED = 'VETTED'
    DEPRECATED = 'DEPRECATED'

class SourceOrigin(str, Enum):
    AGENT = 'AGENT'
    HUMAN_EDITOR = 'HUMAN_EDITOR'
    IMPORT = 'IMPORT'

# --- Existing Models ---
class IngestRequest(BaseModel):
    url: str
    user_id: str

# --- Structured Data Models ---

class Evidence(BaseModel):
    id: UUID
    quote: Optional[str] = None
    source_url: Optional[str] = None
    type: EvidenceType
    weight: int

class Observation(BaseModel):
    id: UUID
    field_id: UUID
    structured_value: Optional[dict] = None
    analysis_markdown: Optional[str] = None
    is_synthetic: bool
    synthetic_rationale: Optional[str] = None
    source_type: SourceOrigin
    review_status: ReviewStatus
    observed_at: Optional[datetime] = None
    evidence: List[Evidence] = []

class FieldDefinition(BaseModel):
    id: UUID
    key: str
    name: str
    description: Optional[str] = None
    rubric_prompt: Optional[str] = None
    current_observation: Optional[Observation] = None

class Dimension(BaseModel):
    id: UUID
    name: str
    fields: List[FieldDefinition] = []

class StructuredPillar(BaseModel):
    pillar_id: str
    dimensions: List[Dimension] = []

class EvidenceCreate(BaseModel):
    quote: Optional[str] = None
    source_url: Optional[str] = None
    type: EvidenceType
    weight: int

class ObservationUpdate(BaseModel):
    analysis_markdown: Optional[str] = None
    is_synthetic: Optional[bool] = None
    synthetic_rationale: Optional[str] = None
    review_status: Optional[ReviewStatus] = None
    evidence: Optional[List[EvidenceCreate]] = None
