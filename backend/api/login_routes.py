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
    saml_response = request.form.get('SAMLResponse')
    if not saml_response:
        logging.error("Missing SAMLResponse in the request")
        return "Bad Request: Missing SAMLResponse", 400

    relay_state = request.form.get('RelayState', url_for('home'))

    # Obtain IdPHandler from ServiceProvider
    idp_handler = sp.get_idp_handler()  # Ensure this matches your ServiceProvider's method
    
    # Decode and validate SAML response
    try:
        decoded_response = idp_handler.decode_saml_string(saml_response)
        if idp_handler.validate_response(decoded_response):
            response_parser = idp_handler.get_response_parser(decoded_response)
            user_info = response_parser.attributes  # Extract user attributes

            # Log user in or create a session with user information
            session['user'] = user_info
            logging.debug(f"User {user_info.get('first_name')} authenticated successfully")
            return redirect(relay_state)
        else:
            logging.error("Invalid SAML Response")
            return "Unauthorized", 401
    except Exception as e:
        logging.error(f"Error processing SAML response: {e}")
        return "Server Error", 500
    
@login_bp.route('/logout/')
def logout():
    # Redirect to the SAML logout using the correct endpoint
    return redirect(url_for('saml.logout'))

@login_bp.route('/metadata/')
def metadata():
    # Provide SP metadata XML using the SAML provider's metadata rendering
    return sp.render_metadata()