import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# Set random seed for reproducibility
np.random.seed(42)

def clean_and_validate_job_data(input_path, output_path):
    """
    Clean and validate job listings data, then save the processed version
    
    Parameters:
    input_path (str): Path to the raw job data CSV
    output_path (str): Path to save the processed CSV
    """
    print(f"Loading data from {input_path}...")
    df = pd.read_csv(input_path)
    
    # Check for missing values
    print("\nMissing values count before cleaning:")
    print(df.isnull().sum())
    
    # Fill missing values appropriately
    # For numerical columns, fill with median
    numerical_cols = ['years_experience', 'current_salary', 'num_skills', 'last_job_duration']
    for col in numerical_cols:
        if col in df.columns:
            df[col].fillna(df[col].median(), inplace=True)
    
    # For categorical columns, fill with mode
    categorical_cols = ['education_level', 'preferred_role', 'location_preference', 'it_state']
    for col in categorical_cols:
        if col in df.columns:
            df[col].fillna(df[col].mode()[0], inplace=True)
    
    # Fill boolean columns with False
    if 'has_certifications' in df.columns:
        df['has_certifications'].fillna(False, inplace=True)
    
    # For text data, fill with empty string
    text_cols = ['technical_skills', 'previous_domains']
    for col in text_cols:
        if col in df.columns:
            df[col].fillna('', inplace=True)
    
    # Check for outliers in numerical columns
    print("\nChecking for outliers in numerical columns...")
    for col in numerical_cols:
        if col in df.columns:
            q1 = df[col].quantile(0.25)
            q3 = df[col].quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            print(f"{col}: {len(outliers)} outliers found")
            
            # Cap outliers instead of removing them
            df[col] = df[col].clip(lower=lower_bound, upper=upper_bound)
    
    # Validate and standardize categorical values
    if 'education_level' in df.columns:
        valid_education = ["High School", "Associate's", "Bachelor's", "Master's", "PhD"]
        df['education_level'] = df['education_level'].apply(
            lambda x: x if x in valid_education else "Bachelor's"
        )
    
    # Ensure years_experience is reasonable (0-40 years)
    if 'years_experience' in df.columns:
        df['years_experience'] = df['years_experience'].clip(0, 40)
    
    # Ensure salary data is reasonable
    if 'current_salary' in df.columns:
        # Ensure salary is between $20,000 and $500,000
        df['current_salary'] = df['current_salary'].clip(20000, 500000)
    
    # Validate skills - ensure the num_skills matches the actual number of skills
    if 'technical_skills' in df.columns and 'num_skills' in df.columns:
        df['actual_num_skills'] = df['technical_skills'].apply(
            lambda x: len(str(x).split(',')) if pd.notna(x) else 0
        )
        
        # If there's a mismatch, update num_skills
        mismatch_count = (df['num_skills'] != df['actual_num_skills']).sum()
        print(f"\nFound {mismatch_count} mismatches between num_skills and actual skill count")
        
        df['num_skills'] = df['actual_num_skills']
        df.drop('actual_num_skills', axis=1, inplace=True)
    
    # Print summary stats after cleaning
    print("\nSummary statistics after cleaning:")
    print(df.describe())
    
    # Check for missing values after cleaning
    print("\nMissing values count after cleaning:")
    print(df.isnull().sum())
    
    # Generate some basic visualizations to validate the data
    plt.figure(figsize=(10, 6))
    df['years_experience'].hist(bins=20)
    plt.title('Distribution of Years of Experience')
    plt.xlabel('Years')
    plt.ylabel('Count')
    plt.savefig('years_experience_distribution.png')
    
    if 'current_salary' in df.columns:
        plt.figure(figsize=(10, 6))
        df['current_salary'].hist(bins=20)
        plt.title('Distribution of Current Salary')
        plt.xlabel('Salary ($)')
        plt.ylabel('Count')
        plt.savefig('salary_distribution.png')
    
    # Save the cleaned data
    print(f"\nSaving cleaned data to {output_path}...")
    df.to_csv(output_path, index=False)
    print("Data cleaning and validation complete!")
    
    return df

# Example usage
if __name__ == "__main__":
    input_file = "raw_job_listings.csv"  # Replace with your actual input file
    output_file = "job_listings_with_states.csv"
    
    # Check if input file exists, otherwise create sample data for demonstration
    if not Path(input_file).exists():
        print(f"Input file {input_file} not found. Creating sample data for demonstration...")
        # Create sample data
        num_records = 5000
        
        # Define possible values for categorical fields
        roles = ['Software Developer', 'Frontend Developer', 'Backend Developer', 
                'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 
                'Mobile App Developer', 'UI/UX Designer']
        
        education_levels = ["High School", "Associate's", "Bachelor's", "Master's", "PhD"]
        
        location_prefs = ['Remote', 'Hybrid', 'On-site']
        
        states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
                 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
                 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
                 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
                 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
        
        skills_list = ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 
                      'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript', 'SQL', 
                      'NoSQL', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 
                      'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Ruby on Rails',
                      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 
                      'Git', 'GitHub', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 
                      'Scikit-learn', 'Data Analysis', 'Machine Learning', 'AI',
                      'HTML', 'CSS', 'SASS/SCSS', 'Bootstrap', 'Tailwind CSS',
                      'Redux', 'GraphQL', 'REST APIs', 'Microservices', 'DevOps',
                      'Linux', 'Windows', 'macOS', 'iOS', 'Android', 'Mobile Development',
                      'Agile', 'Scrum', 'Kanban', 'Project Management']
        
        domains = ['E-commerce', 'Healthcare', 'Finance', 'Education', 'Social Media',
                  'Entertainment', 'Gaming', 'Cybersecurity', 'IoT', 'Blockchain',
                  'AI/ML', 'Cloud Computing', 'Fintech', 'Edtech', 'Healthtech']
        
        # Generate sample data
        sample_data = {
            'id': list(range(1, num_records + 1)),
            'years_experience': np.random.uniform(0, 20, num_records).round(1),
            'technical_skills': [
                ', '.join(np.random.choice(skills_list, size=np.random.randint(3, 15), replace=False))
                for _ in range(num_records)
            ],
            'previous_domains': [
                ', '.join(np.random.choice(domains, size=np.random.randint(1, 4), replace=False))
                for _ in range(num_records)
            ],
            'preferred_role': np.random.choice(roles, num_records),
            'current_salary': np.random.randint(40000, 200000, num_records),
            'education_level': np.random.choice(education_levels, num_records),
            'has_certifications': np.random.choice([True, False], num_records),
            'location_preference': np.random.choice(location_prefs, num_records),
            'last_job_duration': np.random.uniform(0.5, 10, num_records).round(1),
            'it_state': np.random.choice(states, num_records)
        }
        
        # Create dataframe and add num_skills column based on technical_skills
        sample_df = pd.DataFrame(sample_data)
        sample_df['num_skills'] = sample_df['technical_skills'].apply(lambda x: len(x.split(', ')))
        
        # Add some missing values to make the cleaning meaningful
        for col in sample_df.columns:
            if col != 'id':  # Keep ID intact
                # Randomly set 2% of values to NaN
                mask = np.random.choice([True, False], size=len(sample_df), p=[0.02, 0.98])
                sample_df.loc[mask, col] = np.nan
        
        # Add some outliers
        sample_df.loc[np.random.choice(sample_df.index, 20), 'years_experience'] = np.random.uniform(40, 60, 20)
        sample_df.loc[np.random.choice(sample_df.index, 20), 'current_salary'] = np.random.randint(500000, 1000000, 20)
        
        # Save the raw data
        sample_df.to_csv(input_file, index=False)
        print(f"Sample data saved to {input_file}")
    
    # Clean and validate the data
    clean_and_validate_job_data(input_file, output_file)