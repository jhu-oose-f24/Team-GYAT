from flask import Blueprint, request, redirect, url_for, session
from models.login import sp
import logging
login_bp = Blueprint('login_bp', __name__)
logging.basicConfig(level=logging.DEBUG)

@login_bp.route('/login/')
def login():
    logging.debug("Redirecting to SAML login")
    # Redirect to the SAML login using the correct endpoint
    return redirect(url_for('saml.login'))

@login_bp.route('/sso/acs/', methods=['POST'])
def acs():
    logging.debug("Handling SAML Response at ACS endpoint")
    # Get the SAML response from the request
    saml_response = request.form.get('SAMLResponse')
    if not saml_response:
        logging.error("Missing SAMLResponse in the request")
        return "Bad Request: Missing SAMLResponse", 400

    # Handle missing RelayState gracefully
    relay_state = request.form.get('RelayState', url_for('home'))

    # Process the SAML response using your SAML library
    authn_response = sp.parse_authn_response(saml_response, binding='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST')
    if authn_response.is_valid():
        user_info = authn_response.get_identity()
        # Log the user in, create a session, etc.
        # For example:
        session['user'] = user_info
        logging.debug(f"User {user_info.get('first_name')} authenticated successfully")
        return redirect(relay_state)
    else:
        logging.error("Invalid SAML Response")
        return "Unauthorized", 401
    
@login_bp.route('/logout/')
def logout():
    # Redirect to the SAML logout using the correct endpoint
    return redirect(url_for('saml.logout'))

@login_bp.route('/metadata/')
def metadata():
    # Provide SP metadata XML using the SAML provider's metadata rendering
    return sp.render_metadata()