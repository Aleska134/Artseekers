"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Exhibits, Departments
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/login', methods=['POST'])
def sign_in():
    body = request.json
    if body is None:
        return jsonify({"message" : "Please provide a valid email and password!"}), 400
    email = body["email"]
    password = body["password"]
    user = User.query.filter_by(email = email).first()
    if user is None:
        return jsonify({"message" : "Email does not exist in our database"}),404
    if user.password != password:
        return jsonify({"message" : "Wrong password"}),401
    
    access_token = create_access_token(identity=email)

    response_body = {
        "message": "You successfully signed in your account","access_token": access_token
    }

    return jsonify(response_body), 200



@api.route('/sign-up', methods=['POST'])
def sign_up():
    body = request.json
    if body is None:
        return jsonify({"message" : "Please provide a valid email and password!"}), 400
    name = body["name"]
    username = body["username"]
    email = body["email"]
    password = body["password"]
    check_user = User.query.filter_by(email = email).first()
    if check_user:
        return jsonify({"message" : "This user already exist"}),409
    new_user = User(**body, is_active = True)
    db.session.add(new_user)
    db.session.commit()

    response_body = {
        "message": "Account successfully created",
    }

    return jsonify(response_body), 201

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
    

