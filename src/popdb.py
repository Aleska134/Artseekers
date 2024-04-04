from app import app
import json
from api.models import Exhibits, Departments, db
import urllib.request


def make_api_request(url):
    return json.loads(urllib.request.urlopen(url).read())

with app.app_context():
    # Departments
    departments_url = 'https://collectionapi.metmuseum.org/public/collection/v1/departments'
    response = make_api_request(departments_url)
    
    departments = [{
        "department_museum_id": x["departmentId"],
        "name": x["displayName"]
    } for x in response["departments"]]
    
    department_objects = [Departments(**x) for x in departments]
    db.session.add_all(department_objects)
    db.session.commit()
    

    # Exhibits
    exhibits = []
    artist =[]
    for department_id in [x["department_museum_id"] for x in departments]:
        exhibits_url = f'https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds={department_id}'
        department_response = make_api_request(exhibits_url)

        department_data = {
            "department_id": department_id,
            "objectIDs": department_response.get("objectIDs", [])
        }

        for object_id in department_data["objectIDs"][:50]: 
            object_url = f'https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}'
            object_response = make_api_request(object_url)

            if object_response.get("title") and object_response.get("primaryImageSmall") and len(object_response.get("title")) < 250:
                exhibit_data = {
                    "exhibit_museum_id": object_response["objectID"],
                    "exhibit_name": object_response["title"],
                    "primary_image_small": object_response["primaryImageSmall"],
                    "artist_name": object_response["artistDisplayName"],
                    "department_museum_id": department_id,
                    "region":object_response["region"],
                    "culture": object_response["culture"],
                    "object_date": object_response["objectDate"]
                }
                exhibits.append(exhibit_data)

    exhibit_objects = [Exhibits(**ex) for ex in exhibits]
    db.session.add_all(exhibit_objects)
    db.session.commit()