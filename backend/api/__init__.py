def register_routes(app):
    from api.user_routes import user_bp
    from api.job_routes import job_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(job_bp)
