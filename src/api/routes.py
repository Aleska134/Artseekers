"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import base64
import hashlib
import requests
from flask import Flask, request, jsonify, Blueprint
from sqlalchemy import text
from api.models import db, User, Exhibits, Departments, GuestAICall
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# CORS is configured centrally in app.py (restricted to known frontends).


@api.route('/health', methods=['GET'])
def health_check():
    """Lightweight liveness probe for uptime monitors (e.g. UptimeRobot).

    Unlike hitting '/', this actually exercises the DB with a trivial
    'SELECT 1'. That way the monitor validates backend + Neon connectivity,
    not just that the static frontend is being served. Pinging this endpoint
    periodically also helps keep Neon's autosuspending compute awake.
    """
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "ok", "database": "connected"}), 200
    except Exception as e:
        print(f"HEALTHCHECK DB ERROR: {str(e)}")
        return jsonify({"status": "degraded", "database": "unreachable"}), 503


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
        # Order exhibits by ID ascending to ensure consistent ordering
        exhibits = db.session.query(Exhibits).order_by(Exhibits.id.asc()).all()

        # Order departments by ID ascending to ensure consistent ordering in the dropdown
        departments = (
            db.session.query(Departments)
            .join(Exhibits, Exhibits.department_museum_id == Departments.department_museum_id)
            .distinct()
            .order_by(Departments.id.asc()) 
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
   
# --- Free AI analyses for visitors without an account ------------------------
# Reading a saved analysis is always free. A NEW analysis (a real Gemini call) is
# limited for guests: a few per visitor per day, plus a total for all guests, so
# nobody can drain the quota. Signed-in users are not limited here.
GUEST_AI_PER_DAY = int(os.getenv("GUEST_AI_PER_DAY", "3"))
GUEST_AI_TOTAL_PER_DAY = int(os.getenv("GUEST_AI_TOTAL_PER_DAY", "50"))


def _client_ip():
    # On Heroku the router appends the real client IP as the LAST entry of
    # X-Forwarded-For; earlier entries can be forged by the client.
    forwarded = request.headers.get("X-Forwarded-For", "")
    if forwarded:
        return forwarded.split(",")[-1].strip()
    return request.remote_addr or "unknown"


def _guest_ip_hash():
    salt = os.getenv("JWT_SECRET_KEY", "")
    return hashlib.sha256(f"{salt}:{_client_ip()}".encode()).hexdigest()


def _guest_usage(ip_hash):
    """Returns (calls by this visitor, calls by all guests) in the last 24 hours."""
    now = datetime.utcnow()
    GuestAICall.query.filter(GuestAICall.created_at < now - timedelta(days=2)).delete()
    since = now - timedelta(days=1)
    recent = GuestAICall.query.filter(GuestAICall.created_at >= since)
    return recent.filter_by(ip_hash=ip_hash).count(), recent.count()


@api.route('/ai/guest-quota', methods=['GET'])
def guest_ai_quota():
    """How many free new analyses this visitor has left today (for the counter)."""
    mine, everyone = _guest_usage(_guest_ip_hash())
    db.session.commit()
    remaining = max(GUEST_AI_PER_DAY - mine, 0)
    if everyone >= GUEST_AI_TOTAL_PER_DAY:
        remaining = 0
    return jsonify({"limit": GUEST_AI_PER_DAY, "remaining": remaining}), 200


@api.route('/ai/explain', methods=['POST'])
@jwt_required(optional=True)
def get_ai_explanation():
    print("--- Multimodal AI Request Received (Gemini Vision) ---")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "API Key missing"}), 500

    body = request.get_json(silent=True) or {}
    exhibit_museum_id = body.get("exhibit_museum_id")
    if exhibit_museum_id is None:
        return jsonify({"error": "exhibit_museum_id is required"}), 400

    # --- CACHE LOOKUP ---------------------------------------------------------
    # If we already generated an insight for this artwork, return it straight from
    # Neon instead of spending another inference call. This is the single biggest
    # lever for making the free Gemini quota last: each artwork is analyzed once,
    # then served from the DB on every subsequent view.
    exhibit = Exhibits.query.filter_by(exhibit_museum_id=exhibit_museum_id).first()
    if exhibit is None:
        return jsonify({"error": "Artwork not found"}), 404

    if exhibit.ai_insight:
        print("--- Served AI insight from cache ---")
        return jsonify({"insight": exhibit.ai_insight, "cached": True}), 200

    # --- GUEST LIMIT ----------------------------------------------------------
    is_guest = get_jwt_identity() is None
    if is_guest:
        ip_hash = _guest_ip_hash()
        mine, everyone = _guest_usage(ip_hash)
        if mine >= GUEST_AI_PER_DAY or everyone >= GUEST_AI_TOTAL_PER_DAY:
            db.session.commit()  # keep the cleanup of old rows
            return jsonify({
                "error": "Free analyses used up for today",
                "signup_required": True,
            }), 429

    # Everything sent to the model comes from OUR database, never from the
    # request: the browser could otherwise choose the image we download (SSRF),
    # put instructions in the title (prompt injection) or store a fake analysis
    # on a real artwork for every visitor to see (cache poisoning).
    artwork_name = exhibit.exhibit_name
    image_url = exhibit.primary_image_small
    artist = exhibit.artist_name
    culture = exhibit.culture
    object_date = exhibit.object_date
    region = exhibit.region

    # Build a compact "known facts" line from the fields that are actually present,
    # so we never feed the model empty/None values.
    known_facts = []
    if artist:
        known_facts.append(f"Artist: {artist}")
    if culture:
        known_facts.append(f"Culture: {culture}")
    if object_date:
        known_facts.append(f"Date: {object_date}")
    if region:
        known_facts.append(f"Region: {region}")
    facts_line = (
        f"Known catalog details — {'; '.join(known_facts)}. "
        if known_facts else ""
    )

    # The curator prompt (text part of the multimodal request).
    prompt_text = (
        f"You are a professional MET museum curator. Looking at the image, "
        f"provide a sophisticated insight about the artwork '{artwork_name}'. "
        f"{facts_line}"
        f"Weave the relevant catalog details into a natural narrative that "
        f"focuses on its visual style and historical significance. "
        f"Write exactly 2 to 3 complete sentences — brief but substantial, "
        f"never a single trivial line. Keep it concise and always finish your "
        f"final sentence — never stop mid-sentence or mid-word. "
        f"DO NOT include word counts, labels, headings, or any metadata in "
        f"your response."
    )

    try:
        # --- Fetch the artwork image and inline it as base64 ------------------
        # Gemini's developer API does not accept remote image URLs directly; it
        # expects inline image bytes. So we download the MET image and base64
        # encode it as the image part of the multimodal request.
        img_resp = requests.get(image_url, timeout=15)
        if img_resp.status_code != 200:
            print(f"IMAGE FETCH ERROR {img_resp.status_code} for {image_url}")
            return jsonify({"error": "Could not load the artwork image"}), 502
        image_b64 = base64.b64encode(img_resp.content).decode("utf-8")
        mime_type = img_resp.headers.get("Content-Type", "image/jpeg").split(";")[0]

        # --- Gemini generateContent (vision) ---------------------------------
        # gemini-3.5-flash-lite: current free-tier lite model (gemini-2.5-flash-lite
        # was retired for new users). It performs genuine visual analysis of the
        # image part and is the most generous option on the free tier.
        model = "gemini-3.5-flash-lite"
        API_URL = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model}:generateContent"
        )
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        }
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt_text},
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": image_b64,
                            }
                        },
                    ],
                }
            ],
            "generationConfig": {
                # 2-3 substantial sentences fit comfortably under ~256 tokens.
                "maxOutputTokens": 256,
                "temperature": 0.7,
            },
        }

        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)

        if response.status_code == 200:
            result = response.json()
            # Defensive parse: Gemini can return no candidates (e.g. safety block).
            candidates = result.get("candidates", [])
            if not candidates:
                print(f"GEMINI: no candidates returned: {result}")
                return jsonify({"error": "The curator could not interpret this piece"}), 502
            parts = candidates[0].get("content", {}).get("parts", [])
            ai_text = "".join(p.get("text", "") for p in parts).strip()
            if not ai_text:
                print(f"GEMINI: empty text in response: {result}")
                return jsonify({"error": "The curator could not interpret this piece"}), 502

            # --- CACHE WRITE --------------------------------------------------
            # Persist the freshly generated insight so future requests for this
            # artwork are served from the DB (no more inference cost).
            exhibit.ai_insight = ai_text
            reply = {"insight": ai_text, "cached": False}
            if is_guest:
                db.session.add(GuestAICall(ip_hash=ip_hash, created_at=datetime.utcnow()))
                reply["guest_remaining"] = max(GUEST_AI_PER_DAY - mine - 1, 0)
            db.session.commit()

            return jsonify(reply), 200
        else:
            # Log the full response so quota / auth / model issues are
            # diagnosable from the Heroku logs (`heroku logs --tail`).
            print(f"Gemini Error {response.status_code}: {response.text}")
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

