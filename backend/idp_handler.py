from flask_saml2.sp.idphandler import IdentityProviderHandler

class JHUIdentityProvider(IdentityProviderHandler):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
