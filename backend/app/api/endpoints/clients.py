from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud
from app.api import deps
from app.models.user import User
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse, ClientPagination

router = APIRouter()

@router.get("/", response_model=ClientPagination)
def read_clients(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    state: str = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve clients with pagination and filters.
    """
    clients, total = crud.client.get_multi(
        db, skip=skip, limit=limit, search=search, state=state
    )
    return {"items": clients, "total": total}

@router.post("/", response_model=ClientResponse)
def create_client(
    *,
    db: Session = Depends(deps.get_db),
    client_in: ClientCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new client.
    """
    client = crud.client.get_by_document(db, document=client_in.document)
    if client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cliente com este documento já existe",
        )
    client = crud.client.create(db, obj_in=client_in, user_id=current_user.id)
    return client

@router.get("/states", response_model=List[str])
def read_states(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all unique states for filtering.
    """
    return crud.client.get_states(db)

@router.get("/{client_id}", response_model=ClientResponse)
def read_client(
    *,
    db: Session = Depends(deps.get_db),
    client_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get client by ID.
    """
    client = crud.client.get_by_id(db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )
    return client

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    *,
    db: Session = Depends(deps.get_db),
    client_id: int,
    client_in: ClientUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a client.
    """
    client = crud.client.get_by_id(db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )
    client = crud.client.update(db, db_obj=client, obj_in=client_in)
    return client

@router.delete("/{client_id}", response_model=ClientResponse)
def delete_client(
    *,
    db: Session = Depends(deps.get_db),
    client_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a client.
    """
    client = crud.client.get_by_id(db, client_id=client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )
    client = crud.client.delete(db, client_id=client_id)
    return client 