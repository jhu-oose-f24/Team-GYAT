from flask_saml2.sp import ServiceProvider
from flask_saml2.utils import certificate_from_file, private_key_from_file
from flask import redirect, url_for, flash
from flask_login import login_user
from models.User import User
from models import db
from config import Config

class MyServiceProvider(ServiceProvider):

    blueprint_name = 'saml'
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

    def create_blueprint(self):
        bp = super().create_blueprint()
        bp.name = 'saml'
        return bp
    
    def login_successful(self, user_info):
        """
        Called when the SAML assertion is valid and authentication is successful.
        """
        # Extract user information from the SAML assertion
        attributes = user_info.attributes

        # OID mappings
        # 'jhedid' contains 'b2buidemail' (username)
        # 'urn:oid:2.5.4.42' contains 'givenname' (first name)
        # 'urn:oid:2.5.4.4' contains 'sn' (surname/last name)
        # 'urn:oid:0.9.2342.19200300.100.1.3' contains 'mail' (email)

        # Extract attributes
        username = attributes.get('jhedid', [None])[0]
        first_name = attributes.get('urn:oid:2.5.4.42', [None])[0]
        last_name = attributes.get('urn:oid:2.5.4.4', [None])[0]
        email = attributes.get('urn:oid:0.9.2342.19200300.100.1.3', [None])[0]

        if not username or not email:
            # Handle missing essential attributes
            flash("Error: Missing essential attributes from SSO.", "danger")
            return redirect(url_for('login_bp.login'))

        # Construct fullname
        fullname = f"{first_name} {last_name}".strip()

        # Check if the user already exists
        user = User.query.filter_by(username=username).first()
        if not user:
            # Create a new user in the database
            user = User(
                username=username,
                fullname=fullname,
                email=email,
                password=None  # No password since it's SSO
            )
            db.session.add(user)
            db.session.commit()

        # Log the user in using Flask-Login
        login_user(user)

        # Redirect to the desired page after login
        return redirect(url_for('user_bp.dashboard'))

# Instantiate the Service Provider
sp = MyServiceProvider()
