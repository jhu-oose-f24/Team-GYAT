from flask_saml2.sp.views import AssertionConsumer
from flask import request, logging

class CustomACSView(AssertionConsumer):
    def post(self):
        """Handle the HTTP POST binding with optional RelayState."""
        relay_state = request.form.get('RelayState', '')
        saml_response = request.form.get('SAMLResponse')
        
        if not saml_response:
            logging.error('No SAMLResponse found in POST data')
            return self.error('No SAMLResponse found in POST data')
        
        handler = self.sp.parse_authn_request_response(
            saml_response,
            binding=self.POST_BINDING,
            relay_state=relay_state)
        
        return self.handle_authn_response(handler)