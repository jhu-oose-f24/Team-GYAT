from flask_saml2.sp.views import SAML2View
from flask import request, current_app

class CustomACSView(SAML2View):
    def post(self):
        """Handle the HTTP POST binding with optional RelayState."""
        try:
            relay_state = request.form.get('RelayState', '')
            saml_response = request.form.get('SAMLResponse')
            
            if not saml_response:
                current_app.logger.error("No SAMLResponse found in POST data")
                return self.error("No SAMLResponse found in POST data")
            
            handler = self.sp.parse_authn_request_response(
                saml_response,
                binding=self.POST_BINDING,
                relay_state=relay_state)
            
            return self.handle_authn_response(handler)
        
        except KeyError as e:
            current_app.logger.error(f"KeyError in SAML response: {e}")
            # Handle as appropriate (e.g., show an error page, return a specific error response)
            return self.error("Invalid SAML response")

        except Exception as e:
            current_app.logger.error(f"Unhandled exception in ACSView: {e}")
            return self.error("An error occurred during SAML authentication")
