from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from config import Config
from custom_views import CustomACSView  # Import your custom ACSView

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

    def get_acs_view(self):
        # Override to return your custom ACS view
        return CustomACSView.as_view(self.acs_view_name, sp=self)