from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr

class ClientBase(BaseModel):
    name: str
    document: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = True

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    name: Optional[str] = None
    document: Optional[str] = None

class ClientResponse(ClientBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by_id: int
    
    class Config:
        from_attributes = True

class ClientPagination(BaseModel):
    total: int
    items: List[ClientResponse] 