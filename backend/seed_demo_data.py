import sys
import os
import uuid
import random
from datetime import datetime, timedelta, timezone

# Add backend dir to path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.db_models import User, Task, Assignment, Survey

def reset_db(db):
    """Clear existing data to start fresh."""
    print("Clearing existing data...")
    db.query(Assignment).delete()
    db.query(Task).delete()
    db.query(Survey).delete()
    db.query(User).filter(User.role == "volunteer").delete()
    db.commit()

def seed_demo_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    reset_db(db)
    
    ngo_id = "default-ngo"
    print(f"Seeding data for NGO: Odisha Relief Foundation ({ngo_id})...")

    # 1. 15 Volunteers with high-quality portrait images from your Unsplash choices
    volunteers_data = [
        {"name": "Priya Sharma", "skills": ["Medical", "First Aid", "Nursing"], "availability": ["Weekends", "Evenings"], "location": "Bhubaneswar", "email": "priya@example.com", "photo_url": "/avatars/profile1.jpg"},
        {"name": "Rahul Das", "skills": ["Driving", "Logistics", "Distribution"], "availability": ["Full-time"], "location": "Cuttack", "email": "rahul@example.com", "photo_url": "/avatars/profile9.jpg"},
        {"name": "Ananya Patel", "skills": ["Teaching", "Tech Literacy", "Mentorship"], "availability": ["Weekdays"], "location": "Rourkela", "email": "ananya@example.com", "photo_url": "/avatars/profile2.jpg"},
        {"name": "Vikram Singh", "skills": ["Construction", "Carpentry", "Driving"], "availability": ["Weekends"], "location": "Puri", "email": "vikram@example.com", "photo_url": "/avatars/profile10.jpg"},
        {"name": "Sneha Roy", "skills": ["Cooking", "Childcare", "Counseling"], "availability": ["Mornings"], "location": "Berhampur", "email": "sneha@example.com", "photo_url": "/avatars/profile3.jpg"},
        {"name": "Arjun Nair", "skills": ["IT Support", "Hardware Repair", "Networking"], "availability": ["Evenings", "Weekends"], "location": "Sambalpur", "email": "arjun@example.com", "photo_url": "/avatars/profile11.jpg"},
        {"name": "Kavita Mishra", "skills": ["Elderly Care", "Medical", "Counseling"], "availability": ["Full-time"], "location": "Balasore", "email": "kavita@example.com", "photo_url": "/avatars/profile4.jpg"},
        {"name": "Rohan Gupta", "skills": ["Ground Rescue", "Swimming", "First Aid"], "availability": ["Weekdays", "Mornings"], "location": "Gopalpur", "email": "rohan@example.com", "photo_url": "/avatars/profile12.jpg"},
        {"name": "Deepa Verma", "skills": ["Teaching", "Counseling", "Elderly Care"], "availability": ["Weekends"], "location": "Koraput", "email": "deepa@example.com", "photo_url": "/avatars/profile5.jpg"},
        {"name": "Amit Kumar", "skills": ["Logistics", "Warehousing", "IT Support"], "availability": ["Full-time", "Evenings"], "location": "Baripada", "email": "amit@example.com", "photo_url": "/avatars/profile13.jpg"},
        {"name": "Sita Mohanty", "skills": ["Nursing", "First Aid"], "availability": ["Weekdays"], "location": "Angul", "email": "sita@example.com", "photo_url": "/avatars/profile6.jpg"},
        {"name": "Ganesh Sahoo", "skills": ["Driving", "Heavy Machinery"], "availability": ["Full-time"], "location": "Paradip", "email": "ganesh@example.com", "photo_url": "/avatars/profile14.jpg"},
        {"name": "Laxmi Behera", "skills": ["Cooking", "Distribution"], "availability": ["Mornings"], "location": "Bhadrak", "email": "laxmi@example.com", "photo_url": "/avatars/profile7.jpg"},
        {"name": "Suresh Patnaik", "skills": ["IT Support", "Networking"], "availability": ["Evenings"], "location": "Jharsuguda", "email": "suresh@example.com", "photo_url": "/avatars/profile15.jpg"},
        {"name": "Kajal Dash", "skills": ["Construction", "Logistics"], "availability": ["Weekends"], "location": "Jajpur", "email": "kajal@example.com", "photo_url": "/avatars/profile8.jpg"},
    ]

    volunteers = []
    for i, v_data in enumerate(volunteers_data):
        user = User(
            id=str(uuid.uuid4()),
            name=v_data["name"],
            email=v_data["email"],
            role="volunteer",
            skills=v_data["skills"],
            availability=v_data["availability"],
            location=v_data["location"],
            photo_url=v_data["photo_url"]
        )
        db.add(user)
        volunteers.append(user)
    db.commit()
    print(f"✅ Created {len(volunteers)} volunteers")

    # 2. 3 Uploaded Surveys (Flood Relief, Education Gap, Health Camp)
    surveys_data = [
        {
            "file_name": "Balasore_Flood_Assessment_2024.pdf",
            "extracted_text": "Severe flooding in Balasore district. 500 families displaced. Urgent need for clean water and medical supplies. Roads are partially blocked.",
            "analysis_result": {
                "topProblems": ["Clean water shortage", "Medical aid required", "Road blockages"],
                "urgencyScores": {"Clean water shortage": "High", "Medical aid required": "High", "Road blockages": "Medium"},
                "summary": "Recent floods in Balasore have displaced many families, creating critical shortages in clean drinking water and medical support.",
                "recommendedActions": ["Dispatch water tankers immediately", "Set up mobile medical camps", "Coordinate with local logistics drivers"],
                "recommendedTasks": [],
                "totalResponses": 500
            }
        },
        {
            "file_name": "Tribal_Education_Survey.csv",
            "extracted_text": "Survey among 150 tribal households. High dropout rate due to lack of teachers and digital resources. Need weekend tutors and IT support to set up smart classes.",
            "analysis_result": {
                "topProblems": ["High student dropouts", "Lack of digital resources", "Teacher shortages"],
                "urgencyScores": {"High student dropouts": "High", "Lack of digital resources": "Medium", "Teacher shortages": "High"},
                "summary": "Tribal areas face severe education gaps due to an absence of regular teachers and digital infrastructure.",
                "recommendedActions": ["Recruit weekend tutors", "Install basic IT labs", "Organize counseling sessions for parents"],
                "recommendedTasks": [],
                "totalResponses": 150
            }
        },
        {
            "file_name": "Khordha_Health_Camp_Feedback.docx",
            "extracted_text": "Feedback from recent health camp in Khordha. Large turnout. Many elderly citizens reported needing regular medication and counseling. Dietary supplements are running low.",
            "analysis_result": {
                "topProblems": ["Need for regular medication", "Elderly counseling needed", "Shortage of dietary supplements"],
                "urgencyScores": {"Need for regular medication": "High", "Elderly counseling needed": "Medium", "Shortage of dietary supplements": "Low"},
                "summary": "Post-health camp feedback indicates a strong need for sustained medical support and counseling for the elderly population.",
                "recommendedActions": ["Schedule follow-up medical visits", "Organize continuous counseling", "Supply nutritious meals/supplements"],
                "recommendedTasks": [],
                "totalResponses": 300
            }
        }
    ]

    for s_data in surveys_data:
        survey = Survey(
            ngo_id=ngo_id,
            file_name=s_data["file_name"],
            file_path=f"/fake/path/{s_data['file_name']}",
            uploaded_by="Admin",
            extracted_text=s_data["extracted_text"],
            analysis_result=s_data["analysis_result"],
            created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 10))
        )
        db.add(survey)
    db.commit()
    print("✅ Created 3 surveys")

    # 3. 6 Tasks (2 Open, 2 Assigned, 2 Completed)
    tasks_data = [
        # OPEN
        {"title": "Emergency Medical Camp Deployment", "description": "Set up a mobile medical camp in Balasore flood-affected zones. Need first aid specialists.", "required_skills": ["Medical", "First Aid"], "location": "Balasore", "status": "open"},
        {"title": "Weekend English Tutoring", "description": "Teach basic English and Math to primary school students in tribal blocks.", "required_skills": ["Teaching"], "location": "Sundargarh", "status": "open"},
        # ASSIGNED
        {"title": "Deliver Clean Water Supplies", "description": "Drive local truck to distribute clean drinking water to temporary shelters.", "required_skills": ["Driving", "Logistics"], "location": "Balasore", "status": "assigned"},
        {"title": "Elderly Care & Counseling", "description": "Visit elderly citizens from the recent Khordha health camp for follow-up counseling.", "required_skills": ["Counseling", "Medical"], "location": "Khordha", "status": "assigned"},
        # COMPLETED
        {"title": "Set up IT Lab per School Request", "description": "Install supplied computers and routers at local smart class center.", "required_skills": ["IT Support", "Construction"], "location": "Bhubaneswar", "status": "completed"},
        {"title": "Prepare Community Meals", "description": "Cook and package meals for 200 displaced individuals.", "required_skills": ["Cooking", "Logistics"], "location": "Puri", "status": "completed"},
    ]

    for i, t_data in enumerate(tasks_data):
        task = Task(
            ngo_id=ngo_id,
            title=t_data["title"],
            description=t_data["description"],
            required_skills=t_data["required_skills"],
            location=t_data["location"],
            status=t_data["status"],
            created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 5))
        )
        db.add(task)
        db.flush() # To get the task ID
        
        # Depending on status, assign volunteers
        if task.status in ["assigned", "completed"]:
            num_assigned = random.randint(1, 2)
            # Find matching volunteers
            matched_vols = []
            for v in volunteers:
                if any(skill in v.skills for skill in task.required_skills):
                    matched_vols.append(v)
                    
            if not matched_vols:
                matched_vols = volunteers[:num_assigned] # Fallback
                
            selected_vols = random.sample(matched_vols, min(num_assigned, len(matched_vols)))
            assigned_ids = []
            for v in selected_vols:
                assignment = Assignment(
                    task_id=task.id,
                    volunteer_id=v.id,
                    status="active" if task.status == "assigned" else "completed",
                    assigned_at=datetime.now(timezone.utc) - timedelta(days=random.randint(1, 3))
                )
                db.add(assignment)
                assigned_ids.append(v.id)
            
            task.assigned_to = assigned_ids

    db.commit()
    print("✅ Created 6 tasks with realistic assignments")
    db.close()
    print("\n🎉 Demo data seeded successfully! You can now test the dashboard.")

if __name__ == "__main__":
    seed_demo_data()
