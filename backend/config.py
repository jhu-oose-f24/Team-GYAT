import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'team_gyat')
    
    # SAML Configurations
    SAML2_IDP_METADATA_URL = "https://idp.jh.edu/idp/shibboleth"
    SAML2_SP_ENTITY_ID = "https://task-market-7ba3283496a7.herokuapp.com"
    SAML2_SP_ACS_URL = "https://task-market-7ba3283496a7.herokuapp.com/jhu/login/callback"
    SAML2_SP_SLS_URL = "https://task-market-7ba3283496a7.herokuapp.com/jhu/logout/callback"

    # Identity Providers configuration
    SAML2_IDENTITY_PROVIDERS = [
        {
            "CLASS": "flask_saml2.utils.IdPHandler",
            "OPTIONS": {
                "metadata_url": SAML2_IDP_METADATA_URL,
                "entity_id": "https://idp.jh.edu/idp/shibboleth",
            },
        }
    ]
