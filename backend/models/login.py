# login.py

from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from flask import redirect, url_for
from flask_login import login_user
from models.user import User  # Your user model
from models import db
from config import Config

class MyServiceProvider(ServiceProvider):
    def get_sp_entity_id(self):
        return Config.SAML2_SP['entity_id']

    def get_acs_url(self):
        return Config.SAML2_SP['acs_url']

    def get_sls_url(self):
        return Config.SAML2_SP['sls_url']

    def get_sp_private_key(self):
        return private_key_from_file(Config.SAML2_SP['private_key'])

    def get_sp_certificate(self):
        return certificate_from_file(Config.SAML2_SP['certificate'])

    def get_idp_configs(self):
        return Config.SAML2_IDENTITY_PROVIDERS

    def login_successful(self, user_info):
        email = user_info.nameid
        attributes = user_info.attributes
        first_name = attributes.get('FirstName', [''])[0]
        last_name = attributes.get('LastName', [''])[0]

        # Check if the user already exists
        user = User.query.filter_by(email=email).first()
        if not user:
            # Create a new user in the database
            user = User(email=email, first_name=first_name, last_name=last_name)
            db.session.add(user)
            db.session.commit()

        # Log the user in using Flask-Login
        login_user(user)

        # Redirect to the desired page after login
        return redirect(url_for('user_bp.dashboard'))

# Instantiate the Service Provider
sp = MyServiceProvider()
