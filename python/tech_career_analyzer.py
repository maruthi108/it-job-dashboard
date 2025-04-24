import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter
import json
import re
import os

class TechCareerAnalyzer:
    """
    A class for analyzing tech career data and creating visualizations
    based on user profile information and job listings data.
    """
    
    def __init__(self, job_listings_path='job_listings_with_states.csv'):
        """
        Initialize the analyzer with job listings data.
        
        Parameters:
        -----------
        job_listings_path : str
            Path to the job listings CSV file
        """
        self.job_listings = None
        try:
            self.job_listings = pd.read_csv(job_listings_path)
            print(f"Loaded {len(self.job_listings)} job listings")
        except Exception as e:
            print(f"Error loading job listings: {e}")
        
        # Initialize dictionaries to store analysis results
        self.skill_analysis = {}
        self.location_analysis = {}
        self.salary_analysis = {}
    
    def parse_user_profile(self, user_profile):
        """
        Parse user profile data from a JSON string or dictionary.
        
        Parameters:
        -----------
        user_profile : str or dict
            User profile data as a JSON string or dictionary
            
        Returns:
        --------
        dict
            Parsed user profile data
        """
        if isinstance(user_profile, str):
            try:
                profile = json.loads(user_profile)
            except:
                print("Error parsing user profile JSON")
                return {}
        else:
            profile = user_profile
        
        # Extract skills as a list
        if 'skills' in profile:
            if isinstance(profile['skills'], str):
                profile['skills_list'] = [s.strip() for s in profile['skills'].split(',')]
            elif isinstance(profile['skills'], list):
                profile['skills_list'] = profile['skills']
        else:
            profile['skills_list'] = []
        
        return profile
    
    def extract_skills_from_resume(self, resume_text):
        """
        Extract relevant skills from resume text using keyword matching.
        
        Parameters:
        -----------
        resume_text : str
            The plain text content of a resume
            
        Returns:
        --------
        list
            List of extracted skills
        """
        # Common tech skills to look for
        common_skills = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Go', 'Swift',
            'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET',
            'HTML', 'CSS', 'SCSS', 'Sass', 'Bootstrap', 'Tailwind', 'Material UI', 'jQuery',
            'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Oracle', 'Redis', 'Firebase',
            'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'CircleCI', 'GitLab CI',
            'Git', 'GitHub', 'BitBucket', 'SVN', 'Mercurial',
            'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Trello',
            'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'R',
            'iOS', 'Android', 'React Native', 'Flutter', 'Machine Learning', 'AI'
        ]
        
        # Extract skills using regex for more accurate matching
        extracted_skills = []
        for skill in common_skills:
            # Create a regex pattern that matches the skill as a whole word
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, resume_text, re.IGNORECASE):
                extracted_skills.append(skill)
        
        return extracted_skills
    
    def analyze_job_matches(self, user_skills):
        """
        Analyze job matches based on user skills.
        
        Parameters:
        -----------
        user_skills : list
            List of user skills
            
        Returns:
        --------
        dict
            Analysis results including matching jobs and skill demand
        """
        if self.job_listings is None:
            return {"error": "No job listings data available"}
        
        if not user_skills:
            return {"error": "No user skills provided"}
        
        # Convert user skills to lowercase for case-insensitive matching
        user_skills_lower = [s.lower() for s in user_skills]
        
        # Calculate matching jobs
        matching_jobs = []
        for _, job in self.job_listings.iterrows():
            if pd.isna(job['technical_skills']):
                continue
                
            # Parse job skills
            job_skills = [s.strip().lower() for s in str(job['technical_skills']).split(',')]
            
            # Calculate skill match percentage
            matching_skills = [s for s in job_skills if s in user_skills_lower]
            match_percentage = len(matching_skills) / max(len(job_skills), 1) * 100
            
            if match_percentage > 0:
                matching_jobs.append({
                    'preferred_role': job['preferred_role'],
                    'match_percentage': match_percentage,
                    'years_experience': job['years_experience'],
                    'current_salary': job['current_salary'],
                    'location_preference': job['location_preference'],
                    'it_state': job['it_state'] if 'it_state' in job else None
                })
        
        # Sort by match percentage
        matching_jobs.sort(key=lambda x: x['match_percentage'], reverse=True)
        
        # Calculate skill demand from the job listings
        all_job_skills = []
        for _, job in self.job_listings.iterrows():
            if pd.isna(job['technical_skills']):
                continue
            skills = [s.strip().lower() for s in str(job['technical_skills']).split(',')]
            all_job_skills.extend(skills)
        
        skill_counts = Counter(all_job_skills)
        total_jobs = len(self.job_listings)
        
        skill_demand = {}
        for skill, count in skill_counts.items():
            skill_demand[skill] = (count / total_jobs) * 100
        
        # Calculate demand for user skills
        user_skill_demand = {}
        for skill in user_skills_lower:
            user_skill_demand[skill] = skill_demand.get(skill, 0)
        
        return {
            "matching_jobs": matching_jobs[:10],  # Return top 10 matches
            "skill_demand": user_skill_demand,
            "top_skills_in_demand": dict(skill_counts.most_common(10))
        }
    
    def analyze_job_market(self, preferred_role=None):
        """
        Analyze the job market based on the job listings data,
        optionally filtering by preferred role.
        
        Parameters:
        -----------
        preferred_role : str, optional
            The preferred role to filter jobs by
            
        Returns:
        --------
        dict
            Analysis results including state distribution and salary trends
        """
        if self.job_listings is None:
            return {"error": "No job listings data available"}
        
        # Filter by preferred role if provided
        jobs = self.job_listings
        if preferred_role:
            pattern = re.compile(preferred_role, re.IGNORECASE)
            jobs = jobs[jobs['preferred_role'].str.contains(pattern, na=False)]
        
        # Analyze state distribution
        state_counts = jobs['it_state'].value_counts().head(10).to_dict()
        
        # Analyze salary by experience
        salary_by_exp = jobs.groupby(pd.cut(jobs['years_experience'], bins=[0, 2, 5, 8, 100]))['current_salary'].mean().to_dict()
        salary_by_exp = {str(k): int(v) for k, v in salary_by_exp.items()}
        
        # Calculate average salary
        avg_salary = int(jobs['current_salary'].mean())
        
        # Analyze education level distribution
        education_counts = jobs['education_level'].value_counts().to_dict()
        
        # Analyze certification impact on salary
        cert_salary = jobs.groupby('has_certifications')['current_salary'].mean().to_dict()
        cert_salary = {str(k): int(v) for k, v in cert_salary.items()}
        
        return {
            "total_jobs": len(jobs),
            "state_distribution": state_counts,
            "salary_by_experience": salary_by_exp,
            "average_salary": avg_salary,
            "education_distribution": education_counts,
            "certification_impact": cert_salary
        }
    
    def create_skill_match_visualization(self, user_skills, output_path="skill_match.png"):
        """
        Create a visualization showing user skills match with job market demand.
        
        Parameters:
        -----------
        user_skills : list
            List of user skills
        output_path : str
            Path to save the visualization
            
        Returns:
        --------
        str
            Path to the saved visualization
        """
        if self.job_listings is None:
            return None
        
        # Get skill demand analysis
        analysis = self.analyze_job_matches(user_skills)
        
        # Prepare data for visualization
        user_skill_demand = analysis.get("skill_demand", {})
        skills = list(user_skill_demand.keys())
        demand_values = list(user_skill_demand.values())
        
        # Sort by demand
        sorted_idx = np.argsort(demand_values)[::-1]
        sorted_skills = [skills[i] for i in sorted_idx]
        sorted_values = [demand_values[i] for i in sorted_idx]
        
        # Take top 10 skills
        top_n = min(10, len(sorted_skills))
        
        # Create the visualization
        plt.figure(figsize=(10, 6))
        plt.barh(range(top_n), sorted_values[:top_n], color='skyblue')
        plt.yticks(range(top_n), [s.title() for s in sorted_skills[:top_n]])
        plt.xlabel('Demand Score (% of job listings)')
        plt.title('Your Skills: Market Demand Analysis')
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        return output_path
    
    def create_job_locations_visualization(self, preferred_role=None, output_path="job_locations.png"):
        """
        Create a visualization showing job distribution by state.
        
        Parameters:
        -----------
        preferred_role : str, optional
            The preferred role to filter jobs by
        output_path : str
            Path to save the visualization
            
        Returns:
        --------
        str
            Path to the saved visualization
        """
        if self.job_listings is None:
            return None
        
        # Get market analysis
        analysis = self.analyze_job_market(preferred_role)
        
        # Prepare data for visualization
        state_data = analysis.get("state_distribution", {})
        states = list(state_data.keys())
        job_counts = list(state_data.values())
        
        # Sort by count
        sorted_idx = np.argsort(job_counts)[::-1]
        sorted_states = [states[i] for i in sorted_idx]
        sorted_counts = [job_counts[i] for i in sorted_idx]
        
        # Take top 10 states
        top_n = min(10, len(sorted_states))
        
        # Create the visualization
        plt.figure(figsize=(10, 6))
        bars = plt.bar(range(top_n), sorted_counts[:top_n], color='lightgreen')
        plt.xticks(range(top_n), sorted_states[:top_n], rotation=45, ha='right')
        plt.xlabel('State')
        plt.ylabel('Number of Jobs')
        title = f'Job Opportunities by State: {preferred_role}' if preferred_role else 'Job Opportunities by State'
        plt.title(title)
        
        # Add count labels on top of bars
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                    f'{int(height)}',
                    ha='center', va='bottom', rotation=0)
        
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        return output_path
    
    def create_salary_visualization(self, user_experience=None, preferred_role=None, output_path="salary_trends.png"):
        """
        Create a visualization showing salary trends by experience.
        
        Parameters:
        -----------
        user_experience : float, optional
            User's experience in years
        preferred_role : str, optional
            The preferred role to filter jobs by
        output_path : str
            Path to save the visualization
            
        Returns:
        --------
        str
            Path to the saved visualization
        """
        if self.job_listings is None:
            return None
        
        # Get market analysis
        analysis = self.analyze_job_market(preferred_role)
        
        # Prepare data for visualization
        salary_data = analysis.get("salary_by_experience", {})
        
        # Extract experience ranges and salaries
        exp_ranges = []
        salaries = []
        
        for exp_range, salary in salary_data.items():
            exp_ranges.append(exp_range)
            salaries.append(salary)
        
        # Create the visualization
        plt.figure(figsize=(10, 6))
        plt.bar(exp_ranges, salaries, color='lightcoral')
        plt.xlabel('Years of Experience')
        plt.ylabel('Average Salary ($)')
        title = f'Salary by Experience: {preferred_role}' if preferred_role else 'Salary by Experience'
        plt.title(title)
        
        # Format y-axis as currency
        plt.gca().yaxis.set_major_formatter('${x:,.0f}')
        
        # Add user's position if provided
        if user_experience is not None:
            # Find the appropriate bin for user's experience
            user_bin = None
            for exp_range in exp_ranges:
                # Parse the range string
                range_match = re.search(r'\((\d+), (\d+)\]', exp_range)
                if range_match:
                    lower = int(range_match.group(1))
                    upper = int(range_match.group(2))
                    if lower < user_experience <= upper:
                        user_bin = exp_range
                        break
            
            if user_bin:
                bin_index = exp_ranges.index(user_bin)
                plt.scatter([bin_index], [salaries[bin_index]], s=100, c='red', zorder=5, 
                          label=f'Your Experience ({user_experience} years)')
                plt.legend()
        
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        return output_path
    
    def create_education_certification_visualization(self, preferred_role=None, output_path="education_certification.png"):
        """
        Create a visualization showing the impact of education and certifications on salary.
        
        Parameters:
        -----------
        preferred_role : str, optional
            The preferred role to filter jobs by
        output_path : str
            Path to save the visualization
            
        Returns:
        --------
        str
            Path to the saved visualization
        """
        if self.job_listings is None:
            return None
        
        # Get market analysis
        analysis = self.analyze_job_market(preferred_role)
        
        # Create a figure with two subplots
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
        
        # Plot education distribution
        edu_data = analysis.get("education_distribution", {})
        edu_labels = list(edu_data.keys())
        edu_values = list(edu_data.values())
        
        # Sort by frequency
        sorted_idx = np.argsort(edu_values)[::-1]
        sorted_edu_labels = [edu_labels[i] for i in sorted_idx]
        sorted_edu_values = [edu_values[i] for i in sorted_idx]
        
        # Take top 5 education levels
        top_n = min(5, len(sorted_edu_labels))
        
        ax1.pie(sorted_edu_values[:top_n], labels=sorted_edu_labels[:top_n], autopct='%1.1f%%', 
               startangle=90, shadow=False)
        ax1.set_title('Education Level Distribution')
        
        # Plot certification impact on salary
        cert_data = analysis.get("certification_impact", {})
        cert_labels = ['With Certifications', 'Without Certifications']
        cert_values = [cert_data.get('True', 0), cert_data.get('False', 0)]
        
        bars = ax2.bar(cert_labels, cert_values, color=['lightblue', 'lightgray'])
        ax2.set_title('Impact of Certifications on Salary')
        ax2.set_ylabel('Average Salary ($)')
        
        # Format y-axis as currency
        ax2.yaxis.set_major_formatter('${x:,.0f}')
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax2.annotate(f'${height:,.0f}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3),  # 3 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom')
        
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        return output_path
    
    def create_skill_gap_visualization(self, user_skills, preferred_role=None, output_path="skill_gap.png"):
        """
        Create a visualization showing the skill gap between user skills and market demands.
        
        Parameters:
        -----------
        user_skills : list
            List of user skills
        preferred_role : str, optional
            The preferred role to filter jobs by
        output_path : str
            Path to save the visualization
            
        Returns:
        --------
        str
            Path to the saved visualization and skill gap data
        """
        if self.job_listings is None:
            return None
        
        # Filter jobs by preferred role if provided
        jobs = self.job_listings
        if preferred_role:
            pattern = re.compile(preferred_role, re.IGNORECASE)
            jobs = jobs[jobs['preferred_role'].str.contains(pattern, na=False)]
        
        # Extract all skills from job listings
        all_skills = []
        for _, job in jobs.iterrows():
            if pd.isna(job['technical_skills']):
                continue
            skills = [s.strip().lower() for s in str(job['technical_skills']).split(',')]
            all_skills.extend(skills)
        
        # Count frequency of each skill
        skill_counts = Counter(all_skills)
        
        # Get the top skills in demand
        top_n = 15
        top_skills = dict(skill_counts.most_common(top_n))
        
        # Convert user skills to lowercase for matching
        user_skills_lower = [s.lower() for s in user_skills]
        
        # Calculate skill gap
        skill_gap = {}
        for skill, count in top_skills.items():
            # Calculate demand as percentage of jobs requiring this skill
            demand = (count / len(jobs)) * 100
            
            # Check if user has this skill
            has_skill = skill in user_skills_lower
            
            skill_gap[skill] = {
                'demand': demand,
                'has_skill': has_skill
            }
        
        # Prepare data for visualization
        skills = list(skill_gap.keys())
        demand_values = [skill_gap[s]['demand'] for s in skills]
        has_skill = [skill_gap[s]['has_skill'] for s in skills]
        
        # Sort by demand
        sorted_idx = np.argsort(demand_values)[::-1]
        sorted_skills = [skills[i] for i in sorted_idx]
        sorted_values = [demand_values[i] for i in sorted_idx]
        sorted_has_skill = [has_skill[i] for i in sorted_idx]
        
        # Create the visualization
        plt.figure(figsize=(12, 8))
        bars = plt.barh(range(len(sorted_skills)), sorted_values, 
                      color=['lightgreen' if has else 'lightcoral' for has in sorted_has_skill])
        
        plt.yticks(range(len(sorted_skills)), [s.title() for s in sorted_skills])
        plt.xlabel('Demand (% of job listings)')
        title = f'Skill Gap Analysis: {preferred_role}' if preferred_role else 'Skill Gap Analysis'
        plt.title(title)
        
        # Add legend
        plt.barh([-1], [0], color='lightgreen', label='Skills You Have')
        plt.barh([-1], [0], color='lightcoral', label='Skills to Learn')
        plt.legend(loc='lower right')
        
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        
        # Return both the visualization path and skill gap data
        return {
            "visualization_path": output_path,
            "skill_gap_data": skill_gap
        }
    
    def generate_all_visualizations(self, user_profile, resume_text=None):
        """
        Generate all visualizations based on user profile and resume data.
        
        Parameters:
        -----------
        user_profile : dict or str
            User profile data
        resume_text : str, optional
            Resume text content
            
        Returns:
        --------
        dict
            Paths to all generated visualizations and analysis data
        """
        # Parse user profile
        profile = self.parse_user_profile(user_profile)
        
        # Extract skills from profile and resume
        skills = profile.get('skills_list', [])
        if resume_text:
            resume_skills = self.extract_skills_from_resume(resume_text)
            # Combine skills from profile and resume
            skills = list(set(skills + resume_skills))
        
        # Get user experience and preferred role
        experience = profile.get('experience', None)
        preferred_role = profile.get('targetRole', None)
        
        # Create output directory if it doesn't exist
        output_dir = 'visualizations'
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate all visualizations
        visualizations = {}
        
        # Skill match visualization
        skill_match_path = os.path.join(output_dir, 'skill_match.png')
        visualizations['skill_match'] = self.create_skill_match_visualization(skills, skill_match_path)
        
        # Job locations visualization
        job_locations_path = os.path.join(output_dir, 'job_locations.png')
        visualizations['job_locations'] = self.create_job_locations_visualization(preferred_role, job_locations_path)
        
        # Salary visualization
        salary_path = os.path.join(output_dir, 'salary_trends.png')
        visualizations['salary_trends'] = self.create_salary_visualization(experience, preferred_role, salary_path)
        
        # Education and certification visualization
        edu_cert_path = os.path.join(output_dir, 'education_certification.png')
        visualizations['education_certification'] = self.create_education_certification_visualization(preferred_role, edu_cert_path)
        
        # Skill gap visualization
        skill_gap_output = self.create_skill_gap_visualization(skills, preferred_role, 
                                                            os.path.join(output_dir, 'skill_gap.png'))
        if skill_gap_output:
            visualizations['skill_gap'] = skill_gap_output['visualization_path']
            visualizations['skill_gap_data'] = skill_gap_output['skill_gap_data']
        
        # Also include analysis data
        visualizations['job_matches'] = self.analyze_job_matches(skills)
        visualizations['market_analysis'] = self.analyze_job_market(preferred_role)
        
        return visualizations


# Example usage:
if __name__ == "__main__":
    # Sample data for testing
    sample_profile = {
        "name": "John Doe",
        "email": "john@example.com",
        "skills": "JavaScript, React, Python, AWS, SQL",
        "experience": 3.5,
        "targetRole": "Full Stack Developer"
    }
    
    sample_resume = """
    JOHN DOE
    Software Developer
    
    EXPERIENCE
    
    Senior Frontend Developer
    ABC Company, 2020-Present
    - Developed responsive web applications using React and TypeScript
    - Implemented CI/CD pipelines using Jenkins
    - Collaborated with backend team on API integration
    
    Junior Developer
    XYZ Corp, 2018-2020
    - Built UI components with JavaScript and Vue.js
    - Worked with Node.js and Express for backend services
    
    SKILLS
    
    Programming Languages: JavaScript, TypeScript, Python, HTML, CSS
    Frameworks: React, Vue.js, Node.js, Express, Django
    Cloud: AWS (S3, EC2, Lambda)
    Other: Git, Docker, SQL, MongoDB
    """
    
    # Initialize the analyzer and generate visualizations
    analyzer = TechCareerAnalyzer('job_listings_with_states.csv')
    visualizations = analyzer.generate_all_visualizations(sample_profile, sample_resume)
    
    # Print paths to generated visualizations
    print("Generated visualizations:")
    for key, path in visualizations.items():
        if key != 'job_matches' and key != 'market_analysis' and key != 'skill_gap_data':
            print(f"- {key}: {path}")