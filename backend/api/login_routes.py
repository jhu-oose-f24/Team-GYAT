from flask import Blueprint, redirect, request, session, url_for
from models import db
from models.User import User
from models.login import service_provider

login_bp = Blueprint('login_bp', __name__)

# Login route to initiate SSO
@login_bp.route('/jhu/login', methods=['GET'])
def login():
    # Redirect to the service provider's login URL
    return redirect(url_for('flask_saml2_sp.login'))

# ACS (Assertion Consumer Service) handler
@login_bp.route('/jhu/login/callback', methods=['POST'])
def acs_handler():
    # The service provider handles the ACS automatically
    return service_provider.handle_acs()

# Logout route to clear session
@login_bp.route('/jhu/logout')
def logout():
    session.clear()
    return redirect(url_for('login_bp.login'))

# Metadata route for SAML configuration
@login_bp.route('/jhu/metadata', methods=['GET'])
def metadata():
    return service_provider.create_metadata_response()