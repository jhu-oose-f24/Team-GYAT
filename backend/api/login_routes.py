from flask import Blueprint, redirect, request, session, url_for
import logging
from flask_saml2.sp.idphandler import ResponseParser
from base64 import b64decode
import xml.etree.ElementTree as ET
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
    
    # Obtain the SAML response
    saml_response = request.form.get('SAMLResponse')
    if not saml_response:
        logging.error("Missing SAMLResponse in the request")
        return "Bad Request: Missing SAMLResponse", 400

    # Decode and parse the SAML response
    try:
        # Decode SAML response from Base64
        decoded_response = b64decode(saml_response)
        # Parse it with ElementTree if necessary
        response_xml = ET.fromstring(decoded_response)
        
        # Initialize the parser with the XML tree
        response_parser = ResponseParser(response_xml)

        # Check if the response is signed and retrieve user information
        if response_parser.is_signed():
            user_info = response_parser.attributes
            session['user'] = user_info
            logging.debug(f"User {user_info.get('first_name')} authenticated successfully")
            return redirect(request.form.get('RelayState', url_for('home')))
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