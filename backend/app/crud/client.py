from typing import Any, Dict, Optional, Union, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate

def get_by_id(db: Session, client_id: int) -> Optional[Client]:
    return db.query(Client).filter(Client.id == client_id).first()

def get_by_document(db: Session, document: str) -> Optional[Client]:
    return db.query(Client).filter(Client.document == document).first()

def get_multi(
    db: Session, *, skip: int = 0, limit: int = 100, 
    search: Optional[str] = None, 
    state: Optional[str] = None
) -> Tuple[List[Client], int]:
    query = db.query(Client)
    
    # Aplicar filtros
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Client.name.ilike(search_term),
                Client.document.ilike(search_term),
                Client.email.ilike(search_term),
                Client.city.ilike(search_term),
            )
        )
    
    if state:
        query = query.filter(Client.state == state)
    
    # Contar total
    total = query.count()
    
    # Aplicar paginação
    clients = query.offset(skip).limit(limit).all()
    
    return clients, total

def create(db: Session, *, obj_in: ClientCreate, user_id: int) -> Client:
    db_obj = Client(
        **obj_in.dict(),
        created_by_id=user_id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(
    db: Session, *, db_obj: Client, obj_in: Union[ClientUpdate, Dict[str, Any]]
) -> Client:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    
    for field in update_data:
        if hasattr(db_obj, field):
            setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, *, client_id: int) -> Optional[Client]:
    obj = db.query(Client).get(client_id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj

def get_states(db: Session) -> List[str]:
    return [state[0] for state in db.query(Client.state).distinct().all() if state[0]] 