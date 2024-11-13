from typing import List, Dict, Tuple
import mysql.connector
from collections import defaultdict
import math
from datetime import datetime, timedelta

class JobRecommender:
    def __init__(self, db_config: Dict[str, str]):
        """
        Initialize the recommender with database configuration
        """
        self.db_config = db_config
        self.interaction_weights = {
            'view': 1.0,
            'search': 2.0,
            'apply': 3.0,
            'complete': 4.0
        }
        
    def get_db_connection(self):
        """Create and return a database connection"""
        return mysql.connector.connect(**self.db_config)

    def record_interaction(self, user_id: int, job_id: int, interaction_type: str):
        """Record a user's interaction with a job"""
        query = """
        INSERT INTO JobInteractions (user_id, job_id, interaction_type)
        VALUES (%s, %s, %s)
        """
        conn = self.get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(query, (user_id, job_id, interaction_type))
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    def get_user_tag_preferences(self, user_id: int, days: int = 30) -> Dict[str, float]:
        """Calculate user's tag preferences based on their interactions"""
        query = """
        SELECT j.tag_name, ji.interaction_type, COUNT(*) as count
        FROM JobInteractions ji
        JOIN Jobs j ON ji.job_id = j.job_id
        WHERE ji.user_id = %s 
        AND ji.created_at >= DATE_SUB(NOW(), INTERVAL %s DAY)
        GROUP BY j.tag_name, ji.interaction_type
        """
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(query, (user_id, days))
            results = cursor.fetchall()
            
            # Calculate weighted scores for each tag
            tag_scores = defaultdict(float)
            total_score = 0
            
            for tag_name, interaction_type, count in results:
                weight = self.interaction_weights.get(interaction_type, 1.0)
                score = weight * count
                tag_scores[tag_name] += score
                total_score += score
            
            # Normalize scores
            if total_score > 0:
                return {tag: score/total_score for tag, score in tag_scores.items()}
            return {}
            
        finally:
            cursor.close()
            conn.close()

    def get_job_recommendations(self, user_id: int, limit: int = 10) -> List[Dict]:
        """Get job recommendations for a user"""
        # Get user's tag preferences
        tag_preferences = self.get_user_tag_preferences(user_id)
        
        # If user has no preferences, return recent jobs
        if not tag_preferences:
            query = """
            SELECT job_id, title, description, price, tag_name
            FROM Jobs
            WHERE status = 'open'
            AND requester_id != %s
            ORDER BY job_id DESC
            LIMIT %s
            """
            params = (user_id, limit)
        else:
            # Build query with tag preferences
            tag_conditions = [f"(tag_name = %s) * {score}" for tag, score in tag_preferences.items()]
            tag_score = " + ".join(tag_conditions)
            
            query = f"""
            SELECT job_id, title, description, price, tag_name,
                   ({tag_score}) as relevance_score
            FROM Jobs
            WHERE status = 'open'
            AND requester_id != %s
            ORDER BY relevance_score DESC, job_id DESC
            LIMIT %s
            """
            params = tuple(list(tag_preferences.keys()) + [user_id, limit])
        
        conn = self.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            cursor.execute(query, params)
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

    def get_similar_jobs(self, job_id: int, limit: int = 5) -> List[Dict]:
        """Find similar jobs based on tag and price range"""
        query = """
        WITH JobDetails AS (
            SELECT tag_name, price
            FROM Jobs
            WHERE job_id = %s
        )
        SELECT j.job_id, j.title, j.description, j.price, j.tag_name,
               ABS(j.price - jd.price) / jd.price as price_diff
        FROM Jobs j
        CROSS JOIN JobDetails jd
        WHERE j.job_id != %s
        AND j.status = 'open'
        AND j.tag_name = jd.tag_name
        ORDER BY price_diff
        LIMIT %s
        """
        
        conn = self.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            cursor.execute(query, (job_id, job_id, limit))
            return cursor.fetchall()
        finally:
            cursor.close()
            conn.close()

# Example usage:
db_config = {
    'host': 'localhost',
    'user': 'mysql-user',
    'password': 'mysql-password',
    'database': 'task-market-db'
}

recommender = JobRecommender(db_config)
