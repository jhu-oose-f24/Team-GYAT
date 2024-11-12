from flask_saml2.sp.views import AssertionConsumer as BaseAssertionConsumer
from flask import request, current_app
from werkzeug.exceptions import BadRequest

class CustomAssertionConsumer(BaseAssertionConsumer):
    def post(self):
        current_app.logger.info("CustomAssertionConsumer.post() called")
        # Access 'RelayState' safely with a default value if missing
        relay_state = request.form.get('RelayState', '')
        if not relay_state:
            current_app.logger.warning("RelayState is missing in the SAML response")

        saml_response = request.form.get('SAMLResponse')
        if not saml_response:
            current_app.logger.error("No SAMLResponse found in POST data")
            raise BadRequest("No SAMLResponse found in POST data")

        try:
            handler = self.sp.parse_authn_request_response(
                saml_response,
                binding=self.binding,
                relay_state=relay_state)
            return self.handle_response(handler)
        except Exception as e:
            current_app.logger.exception("Error processing SAML response: %s", e)
            raise BadRequest("An error occurred during SAML authentication")