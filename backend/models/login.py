from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from config import Config
from flask import request, current_app

class JHUServiceProvider(ServiceProvider):
    def get_sp_entity_id(self):
        return Config.SAML2_SP_ENTITY_ID

    def get_acs_url(self):
        return Config.SAML2_SP_ACS_URL

    def get_sls_url(self):
        return Config.SAML2_SP_SLS_URL

    def get_sp_private_key(self):
        return private_key_from_file("certs/key.pem")

    def get_sp_certificate(self):
        return certificate_from_file("certs/cert.pem")

    def acs(self):
        """Custom ACS method to handle missing 'RelayState'."""
        current_app.logger.info("Custom ACS method called")
        # Access 'RelayState' safely with a default value
        relay_state = request.form.get('RelayState', '')
        if not relay_state:
            current_app.logger.warning("RelayState is missing in the SAML response")

        saml_response = request.form.get('SAMLResponse')
        if not saml_response:
            current_app.logger.error("No SAMLResponse found in POST data")
            return self.error("No SAMLResponse found in POST data")

        try:
            handler = self.parse_authn_request_response(
                saml_response,
                binding='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
                relay_state=relay_state)
            return self.handle_authn_response(handler)
        except Exception as e:
            current_app.logger.exception("Error processing SAML response: %s", e)
            return self.error("An error occurred during SAML authentication")

    
service_provider = JHUServiceProvider()