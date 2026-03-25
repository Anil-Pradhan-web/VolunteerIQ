import sys
import os

# Add backend dir to path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.db_models import User
import uuid

def seed_volunteers():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    dummy_volunteers = [
        {"name": "Priya Sharma", "skills": ["Medical", "First Aid"], "availability": ["Weekends"], "location": "Bhubaneswar", "email": "priya@example.com", "photo_url": "https://images.unsplash.com/photo-1669829528850-959d7b08278b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Rahul Das", "skills": ["Driving", "Logistics"], "availability": ["Full-time"], "location": "Cuttack", "email": "rahul@example.com", "photo_url": "https://images.unsplash.com/photo-1737966239656-1a72d12b20d9?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Ananya Patel", "skills": ["Teaching", "IT Support"], "availability": ["Weekdays"], "location": "Balasore", "email": "ananya@example.com", "photo_url": "https://images.unsplash.com/photo-1768560846988-144da600d79c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Vikram Singh", "skills": ["Construction", "Logistics"], "availability": ["Weekends"], "location": "Puri", "email": "vikram@example.com", "photo_url": "https://images.unsplash.com/photo-1660802157732-26e5d46ecc37?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Sneha Roy", "skills": ["Cooking", "Medical"], "availability": ["Mornings"], "location": "Bhadrak", "email": "sneha@example.com", "photo_url": "https://images.unsplash.com/photo-1652953233042-35a88a3e3388?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Arjun Nair", "skills": ["IT Support", "Teaching"], "availability": ["Evenings"], "location": "Bhubaneswar", "email": "arjun@example.com", "photo_url": "https://plus.unsplash.com/premium_photo-1691030254390-aa56b22e6a45?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Kavita Mishra", "skills": ["Medical", "Counseling"], "availability": ["Full-time"], "location": "Khordha", "email": "kavita@example.com", "photo_url": "https://images.unsplash.com/photo-1770838447151-05a876cdee3d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Rohan Gupta", "skills": ["Driving", "Construction"], "availability": ["Weekdays"], "location": "Berhampur", "email": "rohan@example.com", "photo_url": "https://images.unsplash.com/photo-1627776880991-808c5996527b?q=80&w=716&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Deepa Verma", "skills": ["Teaching", "Cooking"], "availability": ["Weekends"], "location": "Sambalpur", "email": "deepa@example.com", "photo_url": "https://plus.unsplash.com/premium_photo-1682096118912-c90b30e0f822?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Amit Kumar", "skills": ["Logistics", "IT Support"], "availability": ["Full-time"], "location": "Jajpur", "email": "amit@example.com", "photo_url": "https://images.unsplash.com/photo-1563721732800-e0f34c2567b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Tofan", "skills": ["Driving", "Logistics"], "availability": ["Weekends"], "location": "Kendrapada", "email": "tofan@example.com", "photo_url": "https://images.unsplash.com/photo-1638368349569-e49499196d9f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Kajal", "skills": ["Medical", "First Aid"], "availability": ["Weekdays"], "location": "Cuttack", "email": "kajal@example.com", "photo_url": "https://images.unsplash.com/photo-1729101143873-d80050bae219?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Abhispa", "skills": ["Teaching", "IT Support"], "availability": ["Evenings"], "location": "Rourkela", "email": "abhispa@example.com", "photo_url": "https://images.unsplash.com/photo-1721593444652-f2ab6a703710?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Shubham", "skills": ["Construction", "Logistics"], "availability": ["Full-time"], "location": "Puri", "email": "shubham@example.com", "photo_url": "https://images.unsplash.com/photo-1656060937859-41d42cf527f9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Payal", "skills": ["Cooking", "Medical"], "availability": ["Mornings"], "location": "Bhubaneswar", "email": "payal@example.com", "photo_url": "https://plus.unsplash.com/premium_photo-1682096111256-e020381ec730?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
    ]
    
    added_count = 0
    updated_count = 0
    
    for v_data in dummy_volunteers:
        # Check if volunteer already exists by email
        existing = db.query(User).filter(User.email == v_data["email"]).first()
        if not existing:
            new_user = User(
                id=str(uuid.uuid4()),
                name=v_data["name"],
                email=v_data["email"],
                role="volunteer",
                skills=v_data["skills"],
                availability=v_data["availability"],
                location=v_data["location"],
                photo_url=v_data["photo_url"]
            )
            db.add(new_user)
            added_count += 1
        else:
            existing.photo_url = v_data["photo_url"]
            existing.skills = v_data["skills"]
            existing.availability = v_data["availability"]
            existing.location = v_data["location"]
            updated_count += 1
            
    db.commit()
    db.close()
    
    print(f"Successfully seeded {added_count} new dummies and updated {updated_count} existing dummies!")

if __name__ == "__main__":
    seed_volunteers()
