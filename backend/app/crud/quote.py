from typing import Any, Dict, Optional, Union, List, Tuple
import uuid
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_, and_

from app.models.quote import Quote
from app.schemas.quote import QuoteCreate, QuoteUpdate

def get_by_id(db: Session, quote_id: int) -> Optional[Quote]:
    return db.query(Quote).filter(Quote.id == quote_id).first()

def get_by_id_with_client(db: Session, quote_id: int) -> Optional[Quote]:
    return db.query(Quote).options(joinedload(Quote.client)).filter(Quote.id == quote_id).first()

def get_by_quote_number(db: Session, quote_number: str) -> Optional[Quote]:
    return db.query(Quote).filter(Quote.quote_number == quote_number).first()

def get_multi(
    db: Session, *, skip: int = 0, limit: int = 100, 
    product: Optional[str] = None,
    region: Optional[str] = None,
    client_id: Optional[int] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> Tuple[List[Quote], int]:
    query = db.query(Quote)
    
    if product:
        query = query.filter(Quote.product == product)
    
    if region:
        query = query.filter(Quote.region == region)
    
    if client_id:
        query = query.filter(Quote.client_id == client_id)
    
    if status:
        query = query.filter(Quote.status == status)
    
    if start_date and end_date:
        query = query.filter(
            and_(
                Quote.created_at >= start_date,
                Quote.created_at <= end_date
            )
        )
    
    total = query.count()
    
    quotes = query.order_by(Quote.created_at.desc()).offset(skip).limit(limit).all()
    
    return quotes, total

def create(db: Session, *, obj_in: QuoteCreate, user_id: int) -> Quote:
    quote_number = f"Q-{uuid.uuid4().hex[:8].upper()}"
    
    total_price = obj_in.quantity * obj_in.unit_price
    
    db_obj = Quote(
        **obj_in.dict(),
        quote_number=quote_number,
        total_price=total_price,
        created_by_id=user_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(
    db: Session, *, db_obj: Quote, obj_in: Union[QuoteUpdate, Dict[str, Any]]
) -> Quote:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    
    if "quantity" in update_data or "unit_price" in update_data:
        quantity = update_data.get("quantity", db_obj.quantity)
        unit_price = update_data.get("unit_price", db_obj.unit_price)
        update_data["total_price"] = quantity * unit_price
    
    for field in update_data:
        if hasattr(db_obj, field):
            setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, *, quote_id: int) -> Optional[Quote]:
    obj = db.query(Quote).get(quote_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj

def get_products(db: Session) -> List[str]:
    return [product[0] for product in db.query(Quote.product).distinct().all() if product[0]]

def get_regions(db: Session) -> List[str]:
    return [region[0] for region in db.query(Quote.region).distinct().all() if region[0]] 