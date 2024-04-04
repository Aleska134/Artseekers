"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Exhibits, Departments
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

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

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    # Access the identity of the current user with get_jwt_identity
    print("private is running")
    email = get_jwt_identity()
    user=User.query.filter_by(email=email).first()
    if user:
        # favorites = Favorite.query.filter_by(user_id=user.id).all()
        response_body = user.serialize()
            # {
            # "message": f"Logged in as: {user.email} Secret view. shhhh it's a secret",
            # "email": user.email,
            

            # "favorites": list(map(lambda x: x.serialize(), favorites))
        # }

    return jsonify(response_body), 200

@api.route('/exhibits-and-departments', methods=['GET'])
def exhibits():  
    exhibits = Exhibits.query.all()
    departments = Departments.query.all()
    serialized_exhibits = [exhibit.serialize() for exhibit in exhibits]
    serialized_departments = [department.serialize() for department in departments]
    for exhibit in serialized_exhibits:
        for department in serialized_departments:
            if exhibit['department_museum_id'] == department['department_museum_id']:
                exhibit["department_name"] = department["name"]

    return jsonify({'message' : 'This is the list of all the exhibits', 'exhibits' : serialized_exhibits, 'departments' : serialized_departments} ),200

@api.route('/getUsers', methods=['GET'])
def get_all_Users():
    users = User.query.all()
    request_body = list(map(lambda x:x.serialize(), users))

    return jsonify(request_body), 200

# @api.route('/getSingleUser/<int:user_id>', methods=['GET'])
# def get_Single_User(user_id): 
#     user = User.query.filter_by(id = user_id).first()
#     request_body = user.serialize()

#     return jsonify(request_body), 200

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
    

