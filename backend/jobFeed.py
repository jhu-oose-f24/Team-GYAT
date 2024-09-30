class JobFeed:
    #constructor
    def __init__(self, user: User):
        self.available_jobs = []
        self.user = user
    # display available jobs 
    # return job list
    def display_available_jobs(self) -> list:
        return self.available_jobs
    # add jobs to job list
    def add_job(self, job: Job) -> None:
        self.available_jobs.append(job)
