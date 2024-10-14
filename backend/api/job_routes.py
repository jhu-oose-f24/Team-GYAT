from flask import Blueprint, request, jsonify
from models import db
from models.Job import Job

job_bp = Blueprint('job_bp', __name__)

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    try:
        new_job = Job(
            title=data['title'],
            status=data['status'],
            price=data['price'],
            smart_contract_address=data.get('smart_contract_address', None),
            provider_id=data['provider_id']
        )
        db.session.add(new_job)
        db.session.commit()
        return jsonify({"message": "Job created successfully", "job_id": new_job.job_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def is_valid_status(status):
    valid_statuses = ['open', 'accepted', 'provider_done', 'requester_approved', 'finished']
    return status in valid_statuses

# get all jobs
@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = Job.query.all()
    result = [{
        'job_id': job.job_id,
        'title': job.title,
        'status': job.status,
        'price': job.price,
        'smart_contract_address': job.smart_contract_address,
        'provider_id': job.provider_id,
        'requester_id': job.requester_id
    } for job in jobs]
    return jsonify(result)
    
# get all open jobs    
@job_bp.route('/jobs/open', methods=['GET'])
def get_open_jobs():
    jobs = Job.query.filter_by(status='open').all()
    result = [{
        'job_id': job.job_id,
        'title': job.title,
        'status': job.status,
        'price': job.price,
        'smart_contract_address': job.smart_contract_address,
        'provider_id': job.provider_id,
        'requester_id': job.requester_id
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
        'status': job.status,
        'price': job.price,
        'smart_contract_address': job.smart_contract_address,
        'provider_id': job.provider_id,
        'requester_id': job.requester_id
    }
    return jsonify(job_data)

# update job status
@job_bp.route('/jobs/<int:job_id>/status', methods=['PUT'])
def update_job_status(job_id):
    data = request.get_json()
    new_status = data.get('status')

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
