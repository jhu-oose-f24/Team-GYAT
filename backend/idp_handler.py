from flask_saml2.sp.idphandler import IdPHandler

class JHUIdentityProvider(IdPHandler):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
