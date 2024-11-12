from flask import Blueprint, redirect, session, url_for

login_bp = Blueprint('login_bp', __name__)

@login_bp.route('/jhu/login', methods=['GET'])
def login():
    return redirect(url_for('jhu_saml2_sp.login'))

@login_bp.route('/jhu/logout')
def logout():
    session.clear()
    return redirect(url_for('jhu_saml2_sp.logout'))

@login_bp.route('/jhu/metadata', methods=['GET'])
def metadata():
    return redirect(url_for('jhu_saml2_sp.metadata'))