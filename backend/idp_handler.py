# idphandler.py
from flask_saml2.sp import IdentityProvider
from flask_saml2.utils import Certificate

class JHUIdentityProvider(IdentityProvider):
    def get_entity_id(self):
        return 'https://login.jh.edu/idp/shibboleth'

    def get_sso_url(self):
        return 'https://login.jh.edu/idp/profile/SAML2/Redirect/SSO'

    def get_slo_url(self):
        return 'https://login.jh.edu/cgi-bin/logoff.pl'

    def get_certificate(self):
        # Path to the IdP's certificate file
        with open('certs/idp_certificate.pem', 'r') as cert_file:
            return Certificate(cert_file.read())
