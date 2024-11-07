from flask import Blueprint, redirect, request, session, url_for
from models import db
from models.User import User
from models.login import service_provider

login_bp = Blueprint('login_bp', __name__)

# Login route to initiate SSO
@login_bp.route('/jhu/login', methods=['GET'])
def login():
    # Directly redirect to the Flask-SAML2 login route
    return redirect('/sso/login/')

# ACS (Assertion Consumer Service) handler for processing the SAML response
@login_bp.route('/jhu/login/callback', methods=['POST'])
def acs_handler():
    user_info = service_provider.parse_saml_response(request.form['SAMLResponse'])

    username = user_info.get('username')
    email = user_info.get('email')
    first_name = user_info.get('first_name')
    last_name = user_info.get('last_name')
    fullname = f"{first_name} {last_name}"

    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username, fullname=fullname, email=email)
        db.session.add(user)
        db.session.commit()

    # Store the user's ID in the session to persist login
    session['user_id'] = user.user_id
    session['username'] = user.username

    return redirect(url_for('user_bp.get_user', user_id=user.user_id))  # Redirect to protected profile route

# Logout route to clear session
@login_bp.route('/jhu/logout')
def logout():
    session.clear()
    return redirect(url_for('login_bp.login'))

# Metadata route for SAML configuration
@login_bp.route('/jhu/metadata', methods=['GET'])
def metadata():
    response = service_provider.create_metadata_response()
    return response
