from flask_saml2.sp.views import AssertionConsumer
from flask import request, current_app
from werkzeug.exceptions import BadRequest

class CustomAssertionConsumer(AssertionConsumer):
    def post(self):
        current_app.logger.info("CustomAssertionConsumer.post() called")
        saml_response = request.form['SAMLResponse']
        relay_state = request.form.get('RelayState', '/')
        if 'RelayState' not in request.form:
            current_app.logger.warning("RelayState is missing in the SAML response")
        return self.handle_saml_response(saml_response, relay_state)