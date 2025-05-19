from sqlalchemy.orm import Session
from app.models.user import User
from app.db.session import SessionLocal
from app.core.security import get_password_hash

def seed_admin_user():
    db = SessionLocal()
    
    try:
        admin_email = "admin@admin.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()
        
        if not admin_user:
            print("Criando usuário administrador padrão...")
            
            hashed_password = get_password_hash("admin123")
            admin_user = User(
                email=admin_email,
                hashed_password=hashed_password,
                full_name="Administrador",
                is_active=True,
                is_superuser=True
            )
            
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Usuário administrador criado com sucesso! ID: {admin_user.id}")
        else:
            print("Usuário administrador já existe, pulando criação.")
    
    except Exception as e:
        db.rollback()
        print(f"Erro ao criar usuário administrador: {e}")
    
    finally:
        db.close()
        
    return True 