from flask_saml2.sp.idphandler import IdPHandler
from flask_saml2.utils import certificate_from_file

class JHUIdentityProvider(IdPHandler):
    def __init__(self, sp, entity_id, sso_url, slo_url, certificate):
        super().__init__(sp, entity_id=entity_id)
        self.sso_url = sso_url
        self.slo_url = slo_url
        self.certificate_path = certificate

    def get_entity_id(self):
        return self.entity_id

    def get_sso_url(self):
        return self.sso_url

    def get_slo_url(self):
        return self.slo_url

    def get_certificate(self):
        # Load the certificate from the provided path
        return certificate_from_file(self.certificate_path)
