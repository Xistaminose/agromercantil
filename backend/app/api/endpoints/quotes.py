from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import crud
from app.api import deps
from app.models.user import User
from app.schemas.quote import (
    QuoteCreate, QuoteUpdate, QuoteResponse, 
    QuoteWithClientResponse, QuotePagination
)

router = APIRouter()

@router.get("/", response_model=QuotePagination)
def read_quotes(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    product: str = None,
    region: str = None,
    client_id: int = None,
    status: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve quotes with pagination and filters.
    """
    quotes, total = crud.quote.get_multi(
        db, skip=skip, limit=limit, 
        product=product, region=region, 
        client_id=client_id, status=status,
        start_date=start_date, end_date=end_date
    )
    return {"items": quotes, "total": total}

@router.post("/", response_model=QuoteResponse)
def create_quote(
    *,
    db: Session = Depends(deps.get_db),
    quote_in: QuoteCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new quote.
    """
    client = crud.client.get_by_id(db, client_id=quote_in.client_id)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado",
        )
    quote = crud.quote.create(db, obj_in=quote_in, user_id=current_user.id)
    return quote

@router.get("/products", response_model=List[str])
def read_products(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all unique products for filtering.
    """
    return crud.quote.get_products(db)

@router.get("/regions", response_model=List[str])
def read_regions(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all unique regions for filtering.
    """
    return crud.quote.get_regions(db)

@router.get("/{quote_id}", response_model=QuoteWithClientResponse)
def read_quote(
    *,
    db: Session = Depends(deps.get_db),
    quote_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get quote by ID with client details.
    """
    quote = crud.quote.get_by_id_with_client(db, quote_id=quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotação não encontrada",
        )
    return quote

@router.put("/{quote_id}", response_model=QuoteResponse)
def update_quote(
    *,
    db: Session = Depends(deps.get_db),
    quote_id: int,
    quote_in: QuoteUpdate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update a quote.
    """
    quote = crud.quote.get_by_id(db, quote_id=quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotação não encontrada",
        )
    quote = crud.quote.update(db, db_obj=quote, obj_in=quote_in)
    return quote

@router.delete("/{quote_id}", response_model=QuoteResponse)
def delete_quote(
    *,
    db: Session = Depends(deps.get_db),
    quote_id: int,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a quote.
    """
    quote = crud.quote.get_by_id(db, quote_id=quote_id)
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotação não encontrada",
        )
    quote = crud.quote.delete(db, quote_id=quote_id)
    return quote 