from sqlalchemy.orm import Session
from app.models.quote import Quote
from app.models.client import Client
from app.db.session import SessionLocal

def seed_regions():
    db = SessionLocal()
    
    try:
        existing_regions = db.query(Quote.region).distinct().all()
        existing_regions = [region[0] for region in existing_regions if region[0]]
        
        if not existing_regions:
            print("Inicializando regiões brasileiras no banco de dados...")
            
            brazilian_regions = [
                "Norte", 
                "Nordeste", 
                "Centro-Oeste", 
                "Sudeste", 
                "Sul",
                "MATOPIBA", 
                "Oeste da Bahia",
                "Cerrado Mineiro",
                "Triângulo Mineiro",
                "Oeste Paulista",
                "Norte do Paraná",
                "Planalto Central",
                "Vale do São Francisco",
                "Zona da Mata",
                "Região Serrana"
            ]
            
            client = db.query(Client).filter(Client.is_active == True).first()
            client_id = client.id if client else None
            created_by_id = 1 
            
            for i, region in enumerate(brazilian_regions):
                if region not in existing_regions:
                    dummy_quote = Quote(
                        quote_number=f"SEED-REG-{i:03d}",
                        product="Soja", 
                        quantity=100.0,
                        unit_price=10.0,
                        total_price=1000.0,
                        status="Em Análise",
                        region=region,
                        client_id=client_id,
                        created_by_id=created_by_id
                    )
                    db.add(dummy_quote)
            
            db.commit()
            print("Regiões brasileiras inicializadas com sucesso!")
        else:
            print("Regiões já existem no banco de dados, pulando inicialização.")
    
    except Exception as e:
        db.rollback()
        print(f"Erro ao inicializar regiões: {e}")
    
    finally:
        db.close() 