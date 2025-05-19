from sqlalchemy.orm import Session
from app.models.quote import Quote
from app.models.client import Client
from app.db.session import SessionLocal

def seed_products():
    db = SessionLocal()
    
    try:
        existing_products = db.query(Quote.product).distinct().all()
        existing_products = [product[0] for product in existing_products if product[0]]
        
        if not existing_products:
            print("Inicializando produtos agrícolas no banco de dados...")
            
            agricultural_products = [
                "Soja",
                "Milho",
                "Café",
                "Algodão",
                "Cana-de-açúcar",
                "Arroz",
                "Feijão",
                "Trigo",
                "Laranja",
                "Cacau",
                "Banana",
                "Uva",
                "Maçã",
                "Manga",
                "Borracha",
                "Girassol",
                "Sorgo",
                "Cevada"
            ]
            
            client = db.query(Client).filter(Client.is_active == True).first()
            client_id = client.id if client else None
            created_by_id = 1 
            
            for i, product in enumerate(agricultural_products):
                if product not in existing_products:
                    dummy_quote = Quote(
                        quote_number=f"SEED-PROD-{i:03d}",
                        product=product,
                        quantity=100.0,
                        unit_price=10.0,
                        total_price=1000.0,
                        status="Em Análise",
                        region="Centro-Oeste",
                        client_id=client_id,
                        created_by_id=created_by_id
                    )
                    db.add(dummy_quote)
            
            db.commit()
            print("Produtos agrícolas inicializados com sucesso!")
        else:
            print("Produtos já existem no banco de dados, pulando inicialização.")
    
    except Exception as e:
        db.rollback()
        print(f"Erro ao inicializar produtos: {e}")
    
    finally:
        db.close() 