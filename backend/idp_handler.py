from flask_saml2.sp.idphandler import IdPHandler
from models.login import sp

class JHUIdentityProvider(IdPHandler):
    def __init__(self, sp, **kwargs):
        super().__init__(sp, **kwargs)
