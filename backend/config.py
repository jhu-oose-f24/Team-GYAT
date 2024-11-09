import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'team_gyat')

    # SAML Configurations
    SAML2_IDP_METADATA_URL = "https://idp.jh.edu/idp/profile/Metadata/SAML"
    SAML2_SP_ENTITY_ID = "https://task-market-7ba3283496a7.herokuapp.com"
    SAML2_SP_ACS_URL = "https://task-market-7ba3283496a7.herokuapp.com/sso/acs/"
    SAML2_SP_SLS_URL = "https://task-market-7ba3283496a7.herokuapp.com/sso/sls/"

    # Identity Providers configuration
    SAML2_IDENTITY_PROVIDERS = [
        {
            "CLASS": "flask_saml2.sp.idphandler.MetadataAutoConfiguration",
            "OPTIONS": {
                "metadata_url": SAML2_IDP_METADATA_URL,
            },
        }
    ]
