from flask import Blueprint, redirect, url_for
from login import sp

login_bp = Blueprint('login_bp', __name__)

@login_bp.route('/login/')
def login():
    # Initiates the SAML authentication process
    return redirect(url_for('saml.login'))

@login_bp.route('/logout/')
def logout():
    # Initiates the SAML logout process
    return redirect(url_for('saml.logout'))

@login_bp.route('/metadata/')
def metadata():
    # Provides the SP metadata XML
    return sp.render_metadata()
