from flask import Blueprint, redirect, url_for
from models.login import sp

login_bp = Blueprint('login_bp', __name__)

@login_bp.route('/login')
def login():
    # Redirect to the SAML login using the correct endpoint
    return redirect(url_for('flask_saml2_sp.login'))

@login_bp.route('/logout/')
def logout():
    # Redirect to the SAML logout using the correct endpoint
    return redirect(url_for('flask_saml2_sp.logout'))

@login_bp.route('/metadata/')
def metadata():
    # Provide SP metadata XML using the SAML provider's metadata rendering
    return sp.render_metadata()
