# To populate backend python3 popdb.py & to run backend python3 app.py & the frontend npm run start
import os
import requests
from app import app
from api.models import db, Exhibits, Departments

# We DON'T call db.init_app(app) here anymore 
# because it was already called inside app.py during the import.

def make_api_request(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        print(f"!!! API Error {response.status_code} on: {url}")
        return None
    except Exception as e:
        print(f"!!! Connection Error: {e}")
        return None

def populate():
    with app.app_context():
        print("Creating tables if they don't exist...")
        db.create_all() 
        
        print("\n--- Starting Database Population (The MET Museum) ---")
        
        # STEP 1: DEPARTMENTS
        print("Step 1: Syncing departments...")
        dept_url = 'https://collectionapi.metmuseum.org/public/collection/v1/departments'
        response = make_api_request(dept_url)
        
        if not response:
            print("Error: Could not reach the MET API.")
            return

        # Process first 5 departments (keeping it small for now as you requested)
        depts_list = response.get("departments", [])[:21]
        
        for d in depts_list:
            exists = Departments.query.filter_by(department_museum_id=d["departmentId"]).first()
            if not exists:
                new_dept = Departments(
                    department_museum_id=d["departmentId"],
                    name=d["displayName"]
                )
                db.session.add(new_dept)
        
        db.session.commit()
        print(f"Step 1 Complete: {len(depts_list)} departments checked.")

        # STEP 2: ARTWORKS (EXHIBITS)
        print("Step 2: Syncing artworks...")
        all_depts = Departments.query.all()
        
        for dept in all_depts:
            print(f"Fetching 40 items for: {dept.name}")
            objs_url = f'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds={dept.department_museum_id}'
            objs_res = make_api_request(objs_url)
            
            if objs_res and objs_res.get("objectIDs"):
                ids_to_fetch = objs_res["objectIDs"][:40]
                
                for art_id in ids_to_fetch:
                    art_url = f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{art_id}'
                    art_data = make_api_request(art_url)
                    
                    if art_data and art_data.get("primaryImageSmall"):
                        exists = Exhibits.query.filter_by(exhibit_museum_id=art_data["objectID"]).first()
                        if not exists:
                            new_exhibit = Exhibits(
                                exhibit_museum_id=art_data["objectID"],
                                exhibit_name=art_data["title"][:240],
                                primary_image_small=art_data["primaryImageSmall"],
                                artist_name=art_data.get("artistDisplayName", "Unknown")[:240],
                                department_museum_id=dept.department_museum_id,
                                region=art_data.get("region", "N/A"),
                                culture=art_data.get("culture", "N/A"),
                                object_date=art_data.get("objectDate", "N/A")
                            )
                            db.session.add(new_exhibit)
                            print(f"   + Added: {art_data['title'][:35]}...")

        db.session.commit()
        print("\n--- DATABASE SUCCESSFULLY POPULATED! ---")

if __name__ == "__main__":
    populate()