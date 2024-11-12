import logging
from flask_saml2.sp.views import AssertionConsumer
from flask import request, current_app

logger = logging.getLogger(__name__)

class CustomAssertionConsumer(AssertionConsumer):
    def post(self):
        current_app.logger.info("CustomAssertionConsumer.post() called")
        saml_response = request.form.get('SAMLResponse')
        relay_state = request.form.get('RelayState', '/')
        if not saml_response:
            current_app.logger.error("SAMLResponse is missing in the POST data")
            return "Bad Request: SAMLResponse missing", 400
        if 'RelayState' not in request.form:
            current_app.logger.warning("RelayState is missing in the SAML response")
        return self.handle_saml_response(saml_response, relay_state)