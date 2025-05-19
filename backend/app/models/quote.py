from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    quote_number = Column(String, unique=True, index=True)
    product = Column(String, index=True)
    quantity = Column(Float)
    unit_price = Column(Float)
    total_price = Column(Float)
    status = Column(String, index=True)
    region = Column(String, index=True)
    notes = Column(Text, nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    client_id = Column(Integer, ForeignKey("clients.id"))
    client = relationship("Client", back_populates="quotes")
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_by = relationship("User", back_populates="quotes") 