from flask import Blueprint, request, jsonify, url_for
from models import db
from models.Job import Job
from models.Tag import Tag
from utils.image_utils import save_image_from_base64
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
from models.User import User
import mimetypes
import boto3
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv
import os

# Load environment variables for AWS S3 credentials and configurations
load_dotenv()

# AWS S3 configuration for file storage
S3_KEY = os.getenv("AWS_ACCESS_KEY_ID")
S3_SECRET = os.getenv("AWS_SECRET_ACCESS_KEY")
S3_BUCKET = os.getenv("S3_BUCKET_NAME")
S3_REGION = "us-east-2" 
S3_BASE_URL = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/"

# Initialize S3 client with credentials
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_KEY,
    aws_secret_access_key=S3_SECRET,
    region_name=S3_REGION
)

# Allowed file extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Utility function to check if a file has a valid extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Utility function to get the MIME type of a file based on its extension
def get_content_type(filename):
    extension = filename.rsplit('.', 1)[1].lower() 
    if extension in ALLOWED_EXTENSIONS:
        content_type = mimetypes.types_map.get(f".{extension}", "application/octet-stream")
        return content_type
    return "application/octet-stream"  # Default fallback if extension is not allowed

# Blueprint for job-related routes
job_bp = Blueprint('job_bp', __name__)

# Route to create a new job
@job_bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.form
    file = request.files.get('image', None)

    try:
        # Extract job details from the request
        provider_id = int(data['provider_id'])
        title = data['title']
        description = data['description']
        status = data['status']
        price = float(data['price'])
        smart_contract_address = data.get('smart_contract_address', None)
        tag_name = data.get('tag_name', None)

        # Handle file upload (if provided)
        image_url = None
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            content_type = get_content_type(file.filename)
            try:
                s3_client.upload_fileobj(
                    file,
                    S3_BUCKET,
                    filename,
                    ExtraArgs={'ContentType': content_type}
                )
                image_url = f"{S3_BASE_URL}{filename}"
            except NoCredentialsError as e:
                return jsonify({"error": "AWS credentials not valid"}), 400
        else:
            image_url = f"{S3_BASE_URL}default_image.jpg"  

        # Create a new job record
        new_job = Job(
            provider_id=provider_id,
            title=title,
            description=description,
            status=status,
            price=price,
            tag_name=tag_name,
            smart_contract_address=smart_contract_address,
            image=image_url
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify({"message": "Job created successfully", "job_id": new_job.job_id}), 201
    except SQLAlchemyError as e:
        print(e)
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

# Utility function to validate job status
def is_valid_status(status):
    valid_statuses = ['open', 'accepted', 'provider_done', 'finished']
    return status in valid_statuses

# Route to get all jobs
@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    result = [{
        'job_id': job.job_id,
        'title': job.title,
        'description': job.description,
        'status': job.status,
        'price': job.price,
        'smart_contract_address': job.smart_contract_address,
        'provider_id': job.provider_id,
        'requester_id': job.requester_id,
        'image_url': job.image,
        'tag_name': job.tag_name
    } for job in jobs]
    return jsonify(result)
    
# Route to get all open jobs
@job_bp.route('/jobs/open', methods=['GET'])
def get_open_jobs():
    jobs = Job.query.filter_by(status='open').all()
    result = [{
        'job_id': job.job_id,
        'title': job.title,
        'description': job.description,
        'status': job.status,
        'price': job.price,
        'smart_contract_address': job.smart_contract_address,
        'provider_id': job.provider_id,
        'requester_id': job.requester_id,
        'image_url': job.image,
        'tag_name': job.tag_name
    } for job in jobs]
    return jsonify(result)

# Route to get a single job by its ID
@job_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    provider = User.query.get(job.provider_id)
    job_data = {
        'job_id': job.job_id,
        'title': job.title,
        'description': job.description,
        'status': job.status,
        'price': job.price,
        'smart_contract_address': job.smart_contract_address,
        "provider_fullname": provider.fullname if provider else "Unknown",
        'provider_id': job.provider_id,
        'requester_id': job.requester_id,
        'image_url': job.image,
        'tag_name': job.tag_name
    }
    return jsonify(job_data)

# Route to update the status of a job
@job_bp.route('/jobs/<int:job_id>/status', methods=['PUT'])
def update_job_status(job_id):
    data = request.form
    new_status = data['status']
    requester_id = None
    if new_status == "accepted":
        requester_id = data['requester_id']

    if not is_valid_status(new_status):
        return jsonify({'error': 'Invalid job status'}), 400

    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    job.update_job_status(new_status)
    if requester_id:
        job.set_requester_id(requester_id)
    db.session.commit()

    return jsonify({'message': 'Job status updated successfully'})

# Route to delete a job by its ID
@job_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    try:
        db.session.delete(job)
        db.session.commit()
        return jsonify({'message': 'Job deleted successfully'})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route to get all tags
@job_bp.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    result = [{'tag_id': tag.tag_id, 'tag_name': tag.tag_name} for tag in tags]
    return jsonify(result)

@job_bp.route('/jobs/<int:job_id>/rating', methods=['POST'])
def add_job_rating(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    rating = request.form.get('rating')
    valid_ratings = ["bad", "normal", "good"]
    if rating not in valid_ratings:
        return jsonify({"error": "Invalid rating value. Must be one of 'bad', 'normal', 'good'."}), 400
    job.rating = rating
    db.session.commit()

    return jsonify({"message": "Rating submitted successfully", "job_id": job_id, "rating": rating}), 200