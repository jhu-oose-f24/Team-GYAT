def register_routes(app):
    from api.user_routes import user_bp
    from api.job_routes import job_bp
    from api.conversation_routes import conversation_bp
    from api.message_routes import message_bp
    from api.login_routes import login_bp
    from models.login import service_provider

    app.register_blueprint(user_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(conversation_bp)
    app.register_blueprint(message_bp)
    app.register_blueprint(login_bp)
    

