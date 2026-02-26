# # pipenv shell
# # To populate backend python src/popdb.py & to run backend python src/app.py & the frontend npm run start
# # Terminal -> python src/app.py

import os
import requests
import time 
from app import app
from api.models import db, Exhibits, Departments

def make_api_request(url, retries=3, delay=5):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for i in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            
            if response.status_code == 403:
                print(f"!!! 403 Forbidden. MET is rate-limiting us. Waiting {delay}s before retry {i+1}...")
                time.sleep(delay) # Wait before retrying
                continue
                
            print(f"!!! API Error {response.status_code} on: {url}")
            return None
            
        except Exception as e:
            print(f"!!! Connection Error: {e}. Retrying...")
            time.sleep(delay)
            
    return None

def populate():
    with app.app_context():
        # Optional: Uncomment the next line if you want to start from zero every time
        db.drop_all() 
        print("Creating tables if they don't exist...")
        db.create_all() 
        
        print("\n--- Starting Database Population (The MET Museum) ---")
        
        # STEP 1: DEPARTMENTS
        print("Step 1: Syncing departments...")
        dept_url = 'https://collectionapi.metmuseum.org/public/collection/v1/departments'
        response = make_api_request(dept_url)
        
        if not response:
            return

        depts_list = response.get("departments", [])
        for d in depts_list:
            exists = Departments.query.filter_by(department_museum_id=d["departmentId"]).first()
            if not exists:
                db.session.add(Departments(department_museum_id=d["departmentId"], name=d["displayName"]))
        
        db.session.commit()
        print(f"Step 1 Complete: {len(depts_list)} departments checked.")

        # STEP 2: ARTWORKS
        print("Step 2: Syncing artworks...")
        all_depts = Departments.query.all()
        
        for dept in all_depts:
            print(f"Fetching artworks for: {dept.name}")
            objs_url = f'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds={dept.department_museum_id}'
            objs_res = make_api_request(objs_url)
            
            if objs_res and objs_res.get("objectIDs"):
                # 35 exhibits per department to avoid hitting the rate limit. Adjust as needed.
                ids_to_fetch = objs_res["objectIDs"][:35]
                
                for art_id in ids_to_fetch:
                    art_data = make_api_request(f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{art_id}')
                    
                    if art_data and art_data.get("primaryImageSmall"):
                        exists = Exhibits.query.filter_by(exhibit_museum_id=art_data["objectID"]).first()
                        if not exists:
                            db.session.add(Exhibits(
                                exhibit_museum_id=art_data["objectID"],
                                exhibit_name=art_data["title"][:240],
                                primary_image_small=art_data["primaryImageSmall"],
                                artist_name=art_data.get("artistDisplayName", "Unknown")[:240],
                                department_museum_id=dept.department_museum_id,
                                region=art_data.get("region", "N/A"),
                                culture=art_data.get("culture", "N/A"),
                                object_date=art_data.get("objectDate", "N/A")
                            ))
                            print(f"   + Added: {art_data['title'][:30]}...")
                    
                    # --- Key part ---
                    # 0.3 second rest between artwork requests to avoid hitting the rate limit.
                    time.sleep(0.3)

            # Save after each department to ensure data is stored and to avoid losing progress if we get rate-limited
            db.session.commit()
            print(f"Finished {dept.name}. Small rest...")
            time.sleep(2) # Rest between departments to avoid hitting the rate limit

        print("\n--- DATABASE SUCCESSFULLY POPULATED! ---")

if __name__ == "__main__":
    populate()