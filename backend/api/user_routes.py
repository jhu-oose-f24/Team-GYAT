import re
from flask import Blueprint, request, jsonify, session
from models import db
from models.User import User
from functools import wraps
from flask import redirect, url_for


user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    try:
        new_user = User(username=data['username'], fullname=data['fullname'], year=data['year'], email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully", "user_id": new_user.user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

#get all users
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = [{'user_id': user.user_id, 'username': user.username, 'fullname':user.fullname, 'year':user.year, 'email': user.email} for user in users]
    return jsonify(result)


# update user profile
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    if 'username' in data:
        user.username = data['username']
    if 'fullname' in data:
        user.fullname = data['fullname']
    if 'year' in data:
        if not is_valid_year(data['year']):
            return jsonify({"error": "Invalid year format"}), 400
        user.year = data['year']
    if 'email' in data:
        if not is_valid_email(data['email']):
            return jsonify({"error": "Invalid email format"}), 400
        user.email = data['email']
    if 'password' in data:
        if len(data['password']) < 8:
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        user.password = hashed_password.decode('utf-8')
    try:
        db.session.commit()
        return jsonify({"message": "User updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

#delete user by user id
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def is_valid_email(potential_email) -> bool:
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, potential_email) is not None

def is_valid_year(year):
    # Check if the year is a 4-digit string and starts with '20'
    return bool(re.match(r'^20\d{2}$', year))
    
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login_bp.login'))
        return f(*args, **kwargs)
    return decorated_function

@user_bp.route('/users/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_data = {'user_id': user.user_id, 'username': user.username, 'fullname': user.fullname, 'year': user.year, 'email': user.email}
    return jsonify(user_data)