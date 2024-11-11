import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'team_gyat')

    # SAML Configurations
    SAML2_SP_ENTITY_ID = "https://task-market-7ba3283496a7.herokuapp.com"
    SAML2_SP_ACS_URL = "https://task-market-7ba3283496a7.herokuapp.com/sso/acs/"
    SAML2_SP_SLS_URL = "https://task-market-7ba3283496a7.herokuapp.com/sso/sls/"

    # Identity Providers configuration
    SAML2_IDENTITY_PROVIDERS = [
        {
            "CLASS": "idp_handler.JHUIdentityProvider",
            "OPTIONS": {},
        }
    ]
