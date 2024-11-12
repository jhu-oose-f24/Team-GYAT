from flask_saml2.sp.views import SAML2View
from flask import request, current_app

class CustomACSView(SAML2View):
    def post(self):
        """Handle the HTTP POST binding with optional RelayState."""
        # Log incoming form data for debugging
        current_app.logger.debug(f"Form data received: {request.form}")

        # Access RelayState safely with a default value if missing
        relay_state = request.form.get('RelayState', '')
        if not relay_state:
            current_app.logger.warning("RelayState is missing in the SAML response")

        saml_response = request.form.get('SAMLResponse')
        if not saml_response:
            current_app.logger.error("No SAMLResponse found in POST data")
            return self.error("No SAMLResponse found in POST data")

        try:
            handler = self.sp.parse_authn_request_response(
                saml_response,
                binding=self.POST_BINDING,
                relay_state=relay_state)
            return self.handle_authn_response(handler)

        except Exception as e:
            current_app.logger.error(f"Unhandled exception in ACSView: {e}")
            return self.error("An error occurred during SAML authentication")
