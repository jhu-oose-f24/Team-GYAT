from flask import Blueprint, request, redirect, url_for, session
from models.login import sp
from flask_saml2.sp.idphandler import ResponseParser
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

    try:
        # Decode and parse the SAML response
        decoded_response = sp.decode_saml_string(saml_response)  # Assuming decode_saml_string is available
        response_parser = ResponseParser(decoded_response)       # Initialize ResponseParser with the decoded SAML response

        if response_parser.is_signed():                          # Check if the response is signed
            user_info = response_parser.attributes               # Retrieve user attributes
            session['user'] = user_info                          # Store user session
            logging.debug(f"User {user_info.get('first_name')} authenticated successfully")
            return redirect(relay_state)
        else:
            logging.error("Invalid SAML Response: Not signed")
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