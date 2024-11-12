from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from config import Config
from custom_views import CustomAssertionConsumer
from flask import Blueprint

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
        print("Custom get_assertion_consumer_service_view() called")
        return CustomAssertionConsumer.as_view('acs', self)

    def create_blueprint(self):
        bp = Blueprint('jhu_saml2_sp', __name__)
        bp.route('/login/', methods=['GET'], endpoint='login')(self.login)  # Inherited from ServiceProvider
        bp.route('/logout/', methods=['GET'], endpoint='logout')(self.logout)  # Inherited from ServiceProvider
        bp.route('/acs/', methods=['POST'], endpoint='acs')(self.get_assertion_consumer_service_view())
        bp.route('/sls/', methods=['GET', 'POST'], endpoint='sls')(self.single_logout)  # Inherited
        bp.route('/metadata/', methods=['GET'], endpoint='metadata')(self.metadata)  # Inherited
        return bp

service_provider = JHUServiceProvider()