from flask import Blueprint, redirect, session
from models.login import service_provider

login_bp = Blueprint('login_bp', __name__)

@login_bp.route('/jhu/login', methods=['GET'])
def login():
    return redirect(service_provider.login_url())

@login_bp.route('/jhu/logout')
def logout():
    session.clear()
    return redirect(service_provider.logout_url())

@login_bp.route('/jhu/metadata', methods=['GET'])
def metadata():
    return service_provider.create_metadata_response()