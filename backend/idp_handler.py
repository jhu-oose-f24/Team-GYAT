from flask_saml2.sp.idphandler import IdPHandler
from flask_saml2.utils import certificate_from_file

class JHUIdentityProvider(IdPHandler):
    def get_entity_id(self):
        return 'https://login.jh.edu/idp/shibboleth'

    def get_sso_url(self):
        return 'https://login.jh.edu/idp/profile/SAML2/Redirect/SSO'

    def get_slo_url(self):
        return 'https://login.jh.edu/cgi-bin/logoff.pl'

    def get_certificate(self):
        # Path to the IdP's certificate file
        return certificate_from_file('certs/idp_certificate.pem')