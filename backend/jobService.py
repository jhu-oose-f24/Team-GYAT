
class JobService:
    #constructor
    def __init__(self):
        self.jobs = []
    # fetch job
    # Returns the jobs where the user is either a provider or requester
    def fetch_jobs(self, user_id: str) -> list:
        return [job for job in self.jobs if job.get_provider_id() == user_id or job.get_requester_id() == user_id]

    # add job
    def add_job(self, job: Job) -> None:
        self.jobs.append(job)
        db.session.add(job)
        db.session.commit()

    # accept a job
    def accept_job(self, job_id: str) -> None:
        for job in self.jobs:
            if job.job_id == job_id:
                # update job status
                job.update_job_status(True) 
                db.session.commit()
                break

    # delete a job
    def delete_job(self, job_id: str) -> None:
        job_to_delete = None
        for job in self.jobs:
            if job.job_id == job_id:
                job_to_delete = job
                break
        if job_to_delete:
            self.jobs.remove(job_to_delete)
            db.session.delete(job_to_delete)
            db.session.commit()