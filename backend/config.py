import os
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'team_gyat')

    # SAML Configurations
    SAML2_SP = {
        'entity_id': 'https://task-market-7ba3283496a7.herokuapp.com',
        'acs_url': 'https://task-market-7ba3283496a7.herokuapp.com/sso/acs/',
        'sls_url': 'https://task-market-7ba3283496a7.herokuapp.com/sso/sls/',
        'certificate': 'certs/sp_certificate.pem',
        'private_key': 'certs/sp_private_key.pem',
    }
    # Identity Providers configuration
    SAML2_IDENTITY_PROVIDERS = [
        {
            "CLASS": "idp_handler.JHUIdentityProvider",
            "OPTIONS": {
                "entity_id": "https://login.jh.edu/idp/shibboleth",
                "sso_url": "https://login.jh.edu/idp/profile/SAML2/Redirect/SSO",
                "slo_url": "https://login.jh.edu/cgi-bin/logoff.pl",
                'x509cert': open('certs/idp_certificate.pem').read(),

            },
        }
    ]
