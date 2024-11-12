import logging
from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from config import Config
from custom_views import CustomAssertionConsumer

logger = logging.getLogger(__name__)

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

    def get_assertion_consumer_service_view(self):
        logger.info("Custom get_assertion_consumer_service_view() called")
        return CustomAssertionConsumer.as_view('acs', self)

    def create_blueprint(self):
        logger.info("Custom create_blueprint() called")
        # Use the base class's blueprint
        bp = super().create_blueprint()
        # Set a unique name for the blueprint
        bp.name = 'jhu_saml2_sp'
        return bp

service_provider = JHUServiceProvider()