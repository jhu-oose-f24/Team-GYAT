from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from config import Config

# Define the Service Provider class with necessary configurations
class JHUServiceProvider(ServiceProvider):
    def get_sp_entity_id(self):
        return Config.SAML2_SP_ENTITY_ID

    def get_acs_url(self):
        return Config.SAML2_SP_ACS_URL

    def get_sls_url(self):
        return Config.SAML2_SP_SLS_URL

    def get_idp_metadata_url(self):
        return Config.SAML2_IDP_METADATA_URL

    def get_sp_x509_cert(self):
        # Load the X.509 certificate from the file system
        return certificate_from_file("certs/cert.pem")  # Adjust path if necessary

    def get_sp_private_key(self):
        # Load the private key from the file system
        return private_key_from_file("certs/key.pem")  # Adjust path if necessary

service_provider = JHUServiceProvider()
