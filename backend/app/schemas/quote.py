from typing import Optional, List, Any
from datetime import datetime, date
from pydantic import BaseModel, Field

from app.schemas.client import ClientResponse

class QuoteBase(BaseModel):
    product: str
    quantity: float
    unit_price: float
    region: str
    notes: Optional[str] = None
    status: str = "pending"

class QuoteCreate(QuoteBase):
    client_id: int

class QuoteUpdate(BaseModel):
    product: Optional[str] = None
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    region: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    client_id: Optional[int] = None

class QuoteResponse(BaseModel):
    id: int
    quote_number: str
    product: str
    quantity: float
    unit_price: float
    total_price: float
    region: str
    notes: Optional[str] = None
    status: str
    client_id: Optional[int] = None
    created_by_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class QuoteWithClientResponse(QuoteResponse):
    client: Optional[ClientResponse] = None
    
    class Config:
        from_attributes = True

class QuotePagination(BaseModel):
    total: int
    items: List[QuoteResponse] 