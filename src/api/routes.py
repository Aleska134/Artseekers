"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import requests
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Exhibits, Departments
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/login', methods=['POST'])
def sign_in():
    body = request.json
    if body is None:
        return jsonify({"message" : "Provide email and password"}), 400
    
    user = User.query.filter_by(email=body["email"]).first()
    
    # CS CONCEPT: Constant-time comparison
    # check_password_hash prevents timing attacks
    if user is None or not check_password_hash(user.password, body["password"]):
        return jsonify({"message" : "Invalid email or password"}), 401
    
    access_token = create_access_token(identity=user.email)
    return jsonify({"access_token": access_token}), 200



@api.route('/sign-up', methods=['POST'])
def sign_up():
    body = request.json
    if body is None:
        return jsonify({"message" : "Please provide data"}), 400
    
    # Check if user exists
    check_user = User.query.filter_by(email=body["email"]).first()
    if check_user:
        return jsonify({"message" : "User already exists"}), 409

    # CS CONCEPT: Password Hashing
    # We never store the actual password, only its salted hash.
    hashed_password = generate_password_hash(body["password"])
    
    # We create the user with the HASHED password
    new_user = User(
        name=body["name"],
        username=body["username"],
        email=body["email"],
        password=hashed_password, 
        is_active=True
    )
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account successfully created"}), 201

@api.route('/user/profile', methods=['GET']) 
@jwt_required()
def get_my_profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if user:
        # Add favorites to the serialized user data
        return jsonify(user.serialize()), 200
    return jsonify({"message": "User not found"}), 404


@api.route('/exhibits-and-departments', methods=['GET'])
def get_exhibits_and_departments():  
    try:
        exhibits = db.session.query(Exhibits).all()

        departments = (
            db.session.query(Departments)
            .join(Exhibits, Exhibits.department_museum_id == Departments.department_museum_id)
            .distinct()
            .all()
        )

        dept_map = {d.department_museum_id: d.name for d in departments}

        serialized_exhibits = []
        for exhibit in exhibits:
            exhibit_data = exhibit.serialize()
            exhibit_data["department_name"] = dept_map.get(exhibit.department_museum_id, "Unknown")
            serialized_exhibits.append(exhibit_data)

        return jsonify({
            "message": "Success",
            "exhibits": serialized_exhibits,
            "departments": [d.serialize() for d in departments]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200

@api.route('/users/<int:user_id>', methods=['GET']) 
def get_single_user(user_id): 
    user = User.query.get(user_id)
    
    if user is None:
        return jsonify({"message": "User not found"}), 404
        
    return jsonify(user.serialize()), 200

@api.route('/single/<int:exhibit_id>', methods=['GET'])
@jwt_required()
def single_exhibit(exhibit_id):
    exhibit = Exhibits.query.filter_by(id = exhibit_id).first()
    request_body = exhibit.serialize()

    return jsonify(request_body), 200


@api.route('/single_department/<int:museums_department_id>', methods=['GET'])
@jwt_required()
def single_department(museums_department_id):
    department = Departments.query.filter_by(museums_department_id = museums_department_id).first()
    request_body = department.serialize()

    return jsonify(request_body), 200

@api.route('/addFavorite/<int:exhibit_museum_id>', methods=['POST'])
@jwt_required()
def addFavorite(exhibit_museum_id):
    email = get_jwt_identity()
    user=User.query.filter_by(email=email).first()
    exhibit = Exhibits.query.filter_by(exhibit_museum_id=exhibit_museum_id).first()
    user.favorites.append(exhibit)
    db.session.merge(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(user.serialize()), 200

@api.route('/deleteFavorite/<int:exhibit_museum_id>', methods=['DELETE'])
@jwt_required()
def deleteFavorite(exhibit_museum_id):  
    email = get_jwt_identity()
    user=User.query.filter_by(email=email).first()
    user.favorites = list(filter(
      lambda x: x.exhibit_museum_id != exhibit_museum_id,
       user.favorites
    ))
    db.session.merge(user)
    db.session.commit()
    db.session.refresh(user)

    return jsonify(user.serialize()), 200
    
@api.route('/user/update', methods=['PUT'])
@jwt_required()
def update_user_profile():
    current_email = get_jwt_identity()
    user = User.query.filter_by(email=current_email).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    body = request.get_json()
    
    # Update fields if they exist in the request
    if "name" in body: user.name = body["name"]
    if "profile_image" in body: user.profile_image = body["profile_image"]
    
    if "username" in body and body["username"] != user.username:
        if User.query.filter_by(username=body["username"]).first():
            return jsonify({"message": "Username taken"}), 409
        user.username = body["username"]

    db.session.commit()
    return jsonify(user.serialize()), 200
   
@api.route('/ai/explain', methods=['POST'])
@jwt_required()
def get_ai_explanation():
    print("--- Multimodal AI Request Received (Qwen-VL) ---")
    
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not api_key:
        return jsonify({"error": "API Key missing"}), 500

    body = request.get_json()
    artwork_name = body.get("name")
    image_url = body.get("image_url") # <--- Get image URL from request body

    # Hugging Face Router endpoint (OpenAI Compatible)
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Payload for Vision-Language model (Qwen-VL) with multimodal input (text + image)
    payload = {
        "model": "Qwen/Qwen3-VL-235B-A22B-Instruct:novita",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": (
                            f"You are a professional MET museum curator. Provide a sophisticated and "
                            f"complete insight about the artwork '{artwork_name}' in 3 to 4 sentences, "
                            f"focusing on its visual style and historical significance. Ensure your "
                            f"response is fully concluded and does not exceed 500 words."
                            f"DO NOT include word counts, labels, or any metadata in your response."
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": { "url": image_url } # <--- Include image URL in the payload for multimodal analysis
                    }
                ]
            }
        ],
        "max_tokens": 500
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            ai_text = result['choices'][0]['message']['content'].strip()
            return jsonify({"insight": ai_text}), 200
        else:
            print(f"HF Router Error {response.status_code}: {response.text}")
            return jsonify({"error": "AI curator is busy observing the gallery"}), response.status_code

    except Exception as e:
        print(f"SYSTEM ERROR: {str(e)}")
        return jsonify({"error": "Connection to Vision AI failed"}), 500
    
    
@api.route('/user/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    current_email = get_jwt_identity()
    user = User.query.filter_by(email=current_email).first()
    body = request.json

    old_password = body.get("old_password")
    new_password = body.get("new_password")

    if not old_password or not new_password:
        return jsonify({"message": "Missing data"}), 400

    # 1. Verify current password
    if not check_password_hash(user.password, old_password):
        return jsonify({"message": "Current password is incorrect"}), 400

    # 2. Hash and save the new one
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

