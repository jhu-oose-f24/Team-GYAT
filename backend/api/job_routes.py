from flask import Blueprint, request, jsonify, url_for
from models import db
from models.Job import Job
from models.Tag import Tag
from utils.image_utils import save_image_from_base64
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
from collections import Counter
# import boto3
# from botocore.exceptions import NoCredentialsError
# from dotenv import load_dotenv
import os

# load_dotenv()

# S3_KEY = os.getenv("AWS_ACCESS_KEY_ID")
# S3_SECRET = os.getenv("AWS_SECRET_ACCESS_KEY")
# S3_BUCKET = os.getenv("S3_BUCKET_NAME")
# S3_REGION = "your-region"  # e.g., "us-east-1"
# S3_BASE_URL = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/"

# s3_client = boto3.client(
#     's3',
#     aws_access_key_id=S3_KEY,
#     aws_secret_access_key=S3_SECRET,
#     region_name=S3_REGION
# )


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
UPLOAD_FOLDER = 'static/images/'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

job_bp = Blueprint('job_bp', __name__)

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.form
    file = request.files.get('image', None)

    try:
        provider_id = int(data['provider_id'])
        title = data['title']
        description = data['description']
        status = data['status']
        price = float(data['price'])
        smart_contract_address = data.get('smart_contract_address', None)
        
        tag_name = data.get('tag_name', None)

        # Handle the file upload
        image_path = None
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            image_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(image_path)
        else:
            image_path = 'static/images/default_image.jpg'

        new_job = Job(
            provider_id=provider_id,
            title=title,
            description=description,
            status=status,
            price=price,
            tag_name=tag_name,
            smart_contract_address=smart_contract_address,
            image=image_path
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

# @job_bp.route('/jobs', methods=['POST'])
# def create_job():
#     data = request.form
#     file = request.files.get('image', None)

#     try:
#         provider_id = int(data['provider_id'])
#         title = data['title']
#         description = data['description']
#         status = data['status']
#         price = float(data['price'])
#         smart_contract_address = data.get('smart_contract_address', None)
#         tag_name = data.get('tag_name', None)

#         # Handle file upload
#         image_url = None
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             try:
#                 s3_client.upload_fileobj(
#                     file,
#                     S3_BUCKET,
#                     filename,
#                     ExtraArgs={'ACL': 'public-read'}  # Ensure file is publicly accessible
#                 )
#                 image_url = f"{S3_BASE_URL}{filename}"
#             except NoCredentialsError as e:
#                 return jsonify({"error": "AWS credentials not valid"}), 400
#         else:
#             image_url = f"{S3_BASE_URL}default_image.jpg"  # Default image URL in S3

#         # Create new job
#         new_job = Job(
#             provider_id=provider_id,
#             title=title,
#             description=description,
#             status=status,
#             price=price,
#             tag_name=tag_name,
#             smart_contract_address=smart_contract_address,
#             image=image_url
#         )
#         db.session.add(new_job)
#         db.session.commit()
#         return jsonify({"message": "Job created successfully", "job_id": new_job.job_id}), 201
#     except SQLAlchemyError as e:
#         print(e)
#         db.session.rollback()
#         return jsonify({"error": str(e)}), 400
#     except Exception as e:
#         print(e)
#         return jsonify({"error": str(e)}), 400

def is_valid_status(status):
    valid_statuses = ['open', 'accepted', 'provider_done', 'finished']
    return status in valid_statuses

# get all jobs
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
    
# get all open jobs    
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

# get single job by job id
@job_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    job_data = {
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
    }
    return jsonify(job_data)

# update job status
@job_bp.route('/jobs/<int:job_id>/status', methods=['PUT'])
def update_job_status(job_id):
    data = request.form
    new_status = data['status']

    if not is_valid_status(new_status):
        return jsonify({'error': 'Invalid job status'}), 400

    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    job.update_job_status(new_status)
    db.session.commit()

    return jsonify({'message': 'Job status updated successfully'})

# delete job by job id
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

@job_bp.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    result = [{'tag_id': tag.tag_id, 'tag_name': tag.tag_name} for tag in tags]
    return jsonify(result)

@job_bp.route('/requested_jobs/<int:user_id>', methods=['GET'])
def get_requested_job(user_id):
    # Get all jobs where requester ID is == userID. Aggregate most common
    # tag_name and use this to recommend tags/job
    jobs = Job.query.filter_by(requester_id=user_id).all()
    # Create a list of tags from all of the requested jobs
    tag_freqs = Counter([job.tag_name for job in jobs]) 
    print(jobs)
    print(tag_freqs)
    if tag_freqs:
        return tag_freqs.most_common(1)[0][0]
    else:
        return None
