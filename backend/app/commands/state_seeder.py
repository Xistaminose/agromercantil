from sqlalchemy.orm import Session
from app.models.client import Client
from app.db.session import SessionLocal

def seed_states():
    """
    Seed Brazilian states in the database if they don't exist.
    Creates a dummy inactive client for each state to make them available in dropdowns.
    """
    db = SessionLocal()
    
    try:
        existing_states = db.query(Client.state).distinct().all()
        existing_states = [state[0] for state in existing_states if state[0]]
        
        if not existing_states:
            print("Inicializando estados brasileiros no banco de dados...")
            
            brazilian_states = [
                "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
                "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
                "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
            ]
            
            for i, state in enumerate(brazilian_states):
                if state not in existing_states:
                    dummy_client = Client(
                        name=f"Cliente {state}",
                        document=f"00000000000{i:02d}",  
                        state=state,
                        is_active=False,
                        created_by_id=1 
                    )
                    db.add(dummy_client)
            
            db.commit()
            print("Estados brasileiros inicializados com sucesso!")
        else:
            print("Estados já existem no banco de dados, pulando inicialização.")
    
    except Exception as e:
        db.rollback()
        print(f"Erro ao inicializar estados: {e}")
    
    finally:
        db.close() 